import React from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  items: Array<{
    name: string;
    affinity_score?: number;
    entity_id: string;
    type?: string;
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
  pink: {
    border: 'border-pink-500/30',
    bg: 'bg-pink-900/20',
    text: 'text-pink-400',
    gradient: 'from-pink-600 to-pink-800'
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

export default function ContentCarousel({ title, items, color, category }: Props) {
  const colors = colorMap[color as keyof typeof colorMap] || colorMap.purple;

  const getItemIcon = (category: string) => {
    switch (category) {
      case 'person': return '👤';
      case 'movie': return '🎬';
      case 'music': return '🎵';
      case 'brand': return '🏢';
      case 'place': return '🌍';
      default: return '⭐';
    }
  };

  const getItemDescription = (item: any, category: string) => {
    switch (category) {
      case 'person':
        return 'Cultural influencer in your taste profile';
      case 'movie':
        return 'Recommended based on your preferences';
      case 'music':
        return 'Sonic match for your cultural DNA';
      case 'brand':
        return 'Brand aligned with your aesthetic';
      case 'place':
        return 'Destination matching your vibe';
      default:
        return 'Culturally relevant to your profile';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className={`border ${colors.border} rounded-lg ${colors.bg} backdrop-blur-sm p-6`}>
        <h3 className={`text-2xl font-bold mb-6 ${colors.text}`}>
          {title}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.slice(0, 8).map((item, index) => (
            <motion.div
              key={`${item.entity_id}-${index}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-black/50 border border-gray-700 rounded-lg p-4 hover:border-gray-500 transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getItemIcon(category)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm mb-1 truncate group-hover:text-cyan-400 transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                    {getItemDescription(item, category)}
                  </p>
                  
                  {item.affinity_score !== null && item.affinity_score !== undefined && (
                    <div className="flex items-center space-x-2">
                      <div className="text-xs text-gray-500">MATCH:</div>
                      <div className={`text-xs font-bold ${colors.text}`}>
                        {(item.affinity_score * 100).toFixed(0)}%
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-full h-1">
                        <div 
                          className={`bg-gradient-to-r ${colors.gradient} h-1 rounded-full transition-all duration-500`}
                          style={{ width: `${item.affinity_score * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
            </motion.div>
          ))}
        </div>
        
        {items.length > 8 && (
          <div className="text-center mt-6">
            <button className={`${colors.text} hover:text-white text-sm transition-colors`}>
              VIEW ALL {items.length} RESULTS →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}