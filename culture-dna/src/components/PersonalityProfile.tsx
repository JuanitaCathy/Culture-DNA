import React from "react";
import { motion } from "framer-motion";

type Props = {
  profile: {
    traits: Array<{
      name: string;
      score: number;
      description: string;
    }>;
    summary: string;
    cultural_archetype: string;
  };
};

export default function PersonalityProfile({ profile }: Props) {
  const getTraitColor = (score: number) => {
    if (score >= 0.8) return "text-green-400 border-green-500";
    if (score >= 0.6) return "text-yellow-400 border-yellow-500";
    if (score >= 0.4) return "text-orange-400 border-orange-500";
    return "text-red-400 border-red-500";
  };

  const getArchetypeIcon = (archetype: string) => {
    const archetypes: {[key: string]: string} = {
      "trendsetter": "🚀",
      "curator": "🎨",
      "explorer": "🌍",
      "connoisseur": "🍷",
      "maverick": "⚡",
      "traditionalist": "🏛️",
      "innovator": "💡",
      "connector": "🌐"
    };
    return archetypes[archetype.toLowerCase()] || "🧬";
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
            🧠 NEURAL PERSONALITY MATRIX
          </h3>
          <div className="text-pink-400/80 text-lg">AI-generated cultural personality analysis</div>
        </div>

        {/* Cultural Archetype */}
        <div className="text-center mb-8">
          <div className="inline-block synthwave-card rounded-xl p-6 neon-border">
            <div className="text-6xl mb-2">{getArchetypeIcon(profile.cultural_archetype)}</div>
            <h4 className="text-2xl font-['Orbitron'] font-bold text-pink-400 mb-2 synthwave-glow">
              {profile.cultural_archetype.toUpperCase()}
            </h4>
            <p className="text-pink-300/80 max-w-md">
              {profile.summary}
            </p>
          </div>
        </div>

        {/* Personality Traits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.traits.map((trait, index) => (
            <motion.div
              key={trait.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="synthwave-card rounded-xl p-4 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-white font-semibold">{trait.name}</h5>
                <span className={`text-sm font-bold ${getTraitColor(trait.score).split(' ')[0]}`}>
                  {(trait.score * 100).toFixed(0)}%
                </span>
              </div>
              
              <div className="mb-3">
                <div className="synthwave-progress rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${trait.score * 100}%` }}
                    transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                    className="synthwave-progress-fill h-2 rounded-full"
                  />
                </div>
              </div>
              
              <p className="text-pink-400/70 text-sm">
                {trait.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}