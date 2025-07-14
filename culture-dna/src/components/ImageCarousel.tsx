import React from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  items: Array<{
    name: string;
    affinity_score?: number;
    entity_id: string;
    type?: string;
    image_url?: string;
  }>;
  color: string;
  category: string;
};

const colorMap = {
  purple: {
    border: 'border-purple-500/30',
    bg: 'bg-purple-900/20',
    text: 'text-purple-400',
    gradient: 'from-purple-600 to-purple-800'
  },
  green: {
    border: 'border-green-500/30',
    bg: 'bg-green-900/20',
    text: 'text-green-400',
    gradient: 'from-green-600 to-green-800'
  },
  orange: {
    border: 'border-orange-500/30',
    bg: 'bg-orange-900/20',
    text: 'text-orange-400',
    gradient: 'from-orange-600 to-orange-800'
  },
  cyan: {
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-900/20',
    text: 'text-cyan-400',
    gradient: 'from-cyan-600 to-cyan-800'
  }
};

export default function ImageCarousel({ title, items, color, category }: Props) {
  const colors = colorMap[color as keyof typeof colorMap] || colorMap.purple;

  const getPlaceholderImage = (category: string, name: string) => {
    const encodedName = encodeURIComponent(name);
    switch (category) {
      case 'person':
        return `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop`;
      case 'movie':
        return `https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop`;
      case 'brand':
        return `https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop`;
      case 'place':
        return `https://images.pexels.com/photos/2034335/pexels-photo-2034335.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop`;
      default:
        return `https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop`;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className={`border ${colors.border} rounded-lg ${colors.bg} backdrop-blur-sm p-6 cyber-panel`}>
        <h3 className={`text-3xl font-bold mb-6 ${colors.text} neon-glow text-center`}>
          {title}
        </h3>
        
        <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-cyan-500 scrollbar-track-gray-800">
          {items.slice(0, 10).map((item, index) => (
            <motion.div
              key={`${item.entity_id}-${index}`}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="flex-shrink-0 w-64 bg-black/70 border border-gray-700 rounded-lg overflow-hidden hover:border-gray-500 transition-all duration-300 cursor-pointer group card-hover"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image_url || getPlaceholderImage(category, item.name)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = getPlaceholderImage(category, item.name);
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* Affinity Score Overlay */}
                {item.affinity_score !== null && item.affinity_score !== undefined && (
                  <div className="absolute top-2 right-2 bg-black/80 rounded-full px-2 py-1">
                    <span className={`text-xs font-bold ${colors.text}`}>
                      {(item.affinity_score * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h4 className="text-white font-semibold text-lg mb-2 truncate group-hover:text-cyan-400 transition-colors">
                  {item.name}
                </h4>
                
                {/* Affinity Bar */}
                {item.affinity_score !== null && item.affinity_score !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">NEURAL MATCH</span>
                      <span className={`text-xs font-bold ${colors.text}`}>
                        {(item.affinity_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.affinity_score * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                        className={`bg-gradient-to-r ${colors.gradient} h-1.5 rounded-full`}
                      />
                    </div>
                  </div>
                )}
                
                {/* Category Badge */}
                <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
                  {category.toUpperCase()}
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${colors.gradient} pointer-events-none`} />
            </motion.div>
          ))}
        </div>
        
        {items.length > 10 && (
          <div className="text-center mt-6">
            <button className={`${colors.text} hover:text-white text-sm transition-colors btn-cyber`}>
              LOAD MORE NEURAL CONNECTIONS ({items.length - 10} remaining) →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}