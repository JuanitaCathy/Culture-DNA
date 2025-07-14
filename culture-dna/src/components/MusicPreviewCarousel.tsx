import React, { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  title: string;
  items: Array<{
    name: string;
    affinity_score?: number;
    entity_id: string;
    spotify_id?: string;
    preview_url?: string;
  }>;
};

export default function MusicPreviewCarousel({ title, items }: Props) {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [audioElements, setAudioElements] = useState<{[key: string]: HTMLAudioElement}>({});

  const handlePlayPause = (entityId: string, previewUrl?: string) => {
    if (!previewUrl) return;

    if (currentlyPlaying === entityId) {
      // Pause current
      audioElements[entityId]?.pause();
      setCurrentlyPlaying(null);
    } else {
      // Stop any currently playing
      if (currentlyPlaying && audioElements[currentlyPlaying]) {
        audioElements[currentlyPlaying].pause();
      }

      // Play new one
      if (!audioElements[entityId]) {
        const audio = new Audio(previewUrl);
        audio.volume = 0.7;
        audio.onended = () => setCurrentlyPlaying(null);
        setAudioElements(prev => ({ ...prev, [entityId]: audio }));
        audio.play();
      } else {
        audioElements[entityId].play();
      }
      setCurrentlyPlaying(entityId);
    }
  };

  const getSpotifyEmbedUrl = (spotifyId: string) => {
    return `https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-12"
    >
      <div className="border border-pink-500/30 rounded-lg bg-pink-900/20 backdrop-blur-sm p-6 cyber-panel">
        <h3 className="text-3xl font-bold mb-6 text-pink-400 neon-glow text-center">
          {title}
        </h3>
        
        <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-gray-800">
          {items.slice(0, 8).map((item, index) => (
            <motion.div
              key={`${item.entity_id}-${index}`}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="flex-shrink-0 w-80 bg-black/70 border border-gray-700 rounded-lg overflow-hidden hover:border-pink-500/50 transition-all duration-300 cursor-pointer group card-hover"
            >
              {/* Album Art Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-pink-900 to-purple-900 flex items-center justify-center">
                <div className="text-6xl">🎵</div>
                
                {/* Play/Pause Button */}
                <button
                  onClick={() => handlePlayPause(item.entity_id, item.preview_url)}
                  className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  disabled={!item.preview_url}
                >
                  <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-400 transition-colors">
                    {currentlyPlaying === item.entity_id ? (
                      <div className="text-white text-2xl">⏸️</div>
                    ) : (
                      <div className="text-white text-2xl ml-1">▶️</div>
                    )}
                  </div>
                </button>

                {/* Playing Animation */}
                {currentlyPlaying === item.entity_id && (
                  <div className="absolute bottom-2 left-2 flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-pink-400 rounded-full"
                        animate={{
                          height: [4, 20, 4],
                        }}
                        transition={{
                          duration: 0.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                )}
                
                {/* Affinity Score */}
                {item.affinity_score !== null && item.affinity_score !== undefined && (
                  <div className="absolute top-2 right-2 bg-black/80 rounded-full px-2 py-1">
                    <span className="text-xs font-bold text-pink-400">
                      {(item.affinity_score * 100).toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4">
                <h4 className="text-white font-semibold text-lg mb-2 truncate group-hover:text-pink-400 transition-colors">
                  {item.name}
                </h4>
                
                <p className="text-gray-400 text-sm mb-3">
                  Neural sonic match for your taste profile
                </p>
                
                {/* Affinity Bar */}
                {item.affinity_score !== null && item.affinity_score !== undefined && (
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-400">SONIC AFFINITY</span>
                      <span className="text-xs font-bold text-pink-400">
                        {(item.affinity_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.affinity_score * 100}%` }}
                        transition={{ delay: index * 0.1 + 0.5, duration: 1 }}
                        className="bg-gradient-to-r from-pink-600 to-purple-600 h-1.5 rounded-full"
                      />
                    </div>
                  </div>
                )}

                {/* Spotify Embed (if available) */}
                {item.spotify_id && (
                  <div className="mt-3">
                    <iframe
                      src={getSpotifyEmbedUrl(item.spotify_id)}
                      width="100%"
                      height="80"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="rounded"
                    />
                  </div>
                )}
                
                {/* Status Indicators */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex space-x-2">
                    {item.preview_url && (
                      <div className="px-2 py-1 bg-green-900/30 border border-green-500/30 rounded text-xs text-green-400">
                        PREVIEW
                      </div>
                    )}
                    {item.spotify_id && (
                      <div className="px-2 py-1 bg-green-900/30 border border-green-500/30 rounded text-xs text-green-400">
                        SPOTIFY
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    MUSIC
                  </div>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br from-pink-600 to-purple-600 pointer-events-none" />
            </motion.div>
          ))}
        </div>
        
        {items.length > 8 && (
          <div className="text-center mt-6">
            <button className="text-pink-400 hover:text-white text-sm transition-colors btn-cyber">
              DISCOVER MORE SONIC MATCHES ({items.length - 8} remaining) →
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}