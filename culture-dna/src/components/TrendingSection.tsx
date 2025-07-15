import React from "react";
import { motion } from "framer-motion";

type Props = {
  content: {
    trending_now: Array<{
      name: string;
      type: string;
      trend_score: number;
      entity_id: string;
    }>;
    rising_stars: Array<{
      name: string;
      type: string;
      growth_rate: number;
      entity_id: string;
    }>;
  };
};

export default function TrendingSection({ content }: Props) {
  const getTrendIcon = (type: string) => {
    if (type.includes("music")) return "🎵";
    if (type.includes("movie")) return "🎬";
    if (type.includes("person")) return "👤";
    if (type.includes("place")) return "🌍";
    if (type.includes("brand")) return "🏢";
    return "⭐";
  };

  const getTrendColor = (score: number) => {
    if (score >= 0.8) return "from-red-500 to-pink-500";
    if (score >= 0.6) return "from-orange-500 to-red-500";
    if (score >= 0.4) return "from-yellow-500 to-orange-500";
    return "from-green-500 to-yellow-500";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="synthwave-card rounded-2xl p-8 neon-border">
        <div className="text-center mb-8">
          <h3 className="text-4xl font-['Orbitron'] font-bold mb-4 text-pink-400 synthwave-glow">
            🔥 CULTURAL TREND MATRIX
          </h3>
          <div className="text-pink-400/80 text-lg">Real-time cultural zeitgeist analysis</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trending Now */}
          <div>
            <h4 className="text-2xl font-['Orbitron'] font-bold text-pink-400 mb-6 text-center synthwave-glow">
              🚀 TRENDING NOW
            </h4>
            <div className="space-y-4">
              {content.trending_now?.slice(0, 5).map((item, index) => (
                <motion.div
                  key={item.entity_id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="synthwave-card rounded-xl p-4 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getTrendIcon(item.type)}</div>
                    <div className="flex-1">
                      <h5 className="text-white font-semibold group-hover:text-pink-400 transition-colors">
                        {item.name}
                      </h5>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-pink-400/60">TREND SCORE:</span>
                        <span className="text-xs font-bold text-pink-400">
                          {(item.trend_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="synthwave-progress rounded-full h-1 mt-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.trend_score * 100}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                          className="synthwave-progress-fill h-1 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Rising Stars */}
          <div>
            <h4 className="text-2xl font-['Orbitron'] font-bold text-yellow-400 mb-6 text-center synthwave-glow">
              ⭐ RISING STARS
            </h4>
            <div className="space-y-4">
              {content.rising_stars?.slice(0, 5).map((item, index) => (
                <motion.div
                  key={item.entity_id}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="synthwave-card rounded-xl p-4 transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{getTrendIcon(item.type)}</div>
                    <div className="flex-1">
                      <h5 className="text-white font-semibold group-hover:text-yellow-400 transition-colors">
                        {item.name}
                      </h5>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-pink-400/60">GROWTH RATE:</span>
                        <span className="text-xs font-bold text-yellow-400">
                          +{(item.growth_rate * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="synthwave-progress rounded-full h-1 mt-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(item.growth_rate * 100, 100)}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                          className="synthwave-progress-fill h-1 rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}