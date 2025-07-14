import React, { useState } from "react";
import { searchQloo } from "./utils/qloo";
import { getInsightsForDNA } from "./utils/getInsightsForDNA";
import DNAStrandVisualizer from "./components/DNAStrandVisualizer";
import ContentCarousel from "./components/ContentCarousel";
import DNAExporter from "./components/DNAExporter";
import { motion } from "framer-motion";

export default function App() {
  const [favActor, setFavActor] = useState("");
  const [favMusic, setFavMusic] = useState("");
  const [favCuisine, setFavCuisine] = useState("");
  const [favCity, setFavCity] = useState("");
  const [userDNA, setUserDNA] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [allInsights, setAllInsights] = useState<{[key: string]: any[]}>({});
  const [loading, setLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const handleGenerateDNA = async () => {
    setLoading(true);
    try {
      const inputs = [
        { label: "actor", query: favActor, type: "urn:entity:person" },
        { label: "music", query: favMusic, type: "urn:entity:person" },
        { label: "cuisine", query: favCuisine, type: "urn:entity:brand" },
        { label: "city", query: favCity, type: "urn:entity:place" },
      ];

      const entityIds: string[] = [];
      const foundResults: any[] = [];

      for (const input of inputs) {
        if (!input.query) continue;
        const res = await searchQloo(input.query, input.type);
        if (res.results.length > 0) {
          const top = res.results[0];
          entityIds.push(top.entity_id);
          foundResults.push(top);
        }
      }

      setUserDNA(entityIds);
      setResults(foundResults);
      
      // Fetch insights for all types
      const insightTypes = ["urn:entity:person", "urn:entity:movie", "urn:entity:music", "urn:entity:brand", "urn:entity:place"];
      const insights: {[key: string]: any[]} = {};
      
      for (const type of insightTypes) {
        try {
          const typeInsights = await getInsightsForDNA(entityIds, type, 8);
          insights[type] = typeInsights;
        } catch (err) {
          console.warn(`Failed to fetch insights for ${type}:`, err);
          insights[type] = [];
        }
      }
      
      setAllInsights(insights);
    } catch (err) {
      console.error("❌ DNA generation failed:", err);
      alert("DNA generation failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  function getColorForType(type: string) {
    if (type.includes("music")) return "#ff0080";
    if (type.includes("movie")) return "#00ff80";
    if (type.includes("place")) return "#0080ff";
    if (type.includes("brand")) return "#ff8000";
    if (type.includes("person")) return "#8000ff";
    return "#ffffff";
  }

  const getAllNodes = () => {
    const nodes: any[] = [];
    Object.entries(allInsights).forEach(([type, insights]) => {
      insights.forEach(item => {
        nodes.push({
          ...item,
          color: getColorForType(type),
          category: type.split(':').pop()
        });
      });
    });
    return nodes;
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-x-hidden">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-cyan-900/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,128,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,128,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            🧬 CULTURAL DNA
          </h1>
          <div className="text-xl text-cyan-400 mb-2">NEURAL TASTE ANALYZER v2.0</div>
          <div className="text-sm text-gray-500">Scanning cultural preferences... Generating personality matrix...</div>
        </motion.div>

        {/* Input Interface */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="bg-gray-900/80 border border-cyan-500/30 rounded-lg p-8 backdrop-blur-sm">
            <div className="text-center mb-6">
              <div className="text-cyan-400 text-lg mb-2">INITIALIZE CULTURAL SCAN</div>
              <div className="text-gray-400 text-sm">Enter your preferences to generate your unique cultural DNA sequence</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-2">
                <label className="text-pink-400 text-sm">🎭 FAVORITE ACTOR</label>
                <input
                  value={favActor}
                  onChange={(e) => setFavActor(e.target.value)}
                  className="w-full bg-black border border-pink-500/50 rounded px-4 py-3 text-white focus:border-pink-500 focus:outline-none transition-colors"
                  placeholder="Enter actor name..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-purple-400 text-sm">🎵 FAVORITE MUSICIAN</label>
                <input
                  value={favMusic}
                  onChange={(e) => setFavMusic(e.target.value)}
                  className="w-full bg-black border border-purple-500/50 rounded px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Enter musician name..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-orange-400 text-sm">🍽 FAVORITE CUISINE</label>
                <input
                  value={favCuisine}
                  onChange={(e) => setFavCuisine(e.target.value)}
                  className="w-full bg-black border border-orange-500/50 rounded px-4 py-3 text-white focus:border-orange-500 focus:outline-none transition-colors"
                  placeholder="Enter cuisine type..."
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-cyan-400 text-sm">🌆 FAVORITE CITY</label>
                <input
                  value={favCity}
                  onChange={(e) => setFavCity(e.target.value)}
                  className="w-full bg-black border border-cyan-500/50 rounded px-4 py-3 text-white focus:border-cyan-500 focus:outline-none transition-colors"
                  placeholder="Enter city name..."
                />
              </div>
            </div>

            <div className="text-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerateDNA}
                disabled={loading}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg shadow-pink-500/25 disabled:opacity-50"
              >
                {loading ? "🔬 ANALYZING..." : "🔬 GENERATE DNA SEQUENCE"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* DNA Visualization */}
        {userDNA.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                🧬 YOUR CULTURAL DNA HELIX
              </h2>
              <div className="text-gray-400">Interactive 3D visualization of your cultural preferences</div>
            </div>
            
            <div className="bg-gray-900/50 border border-green-500/30 rounded-lg p-4 backdrop-blur-sm">
              <DNAStrandVisualizer
                nodes={getAllNodes()}
                onNodeClick={setSelectedNode}
              />
            </div>
          </motion.div>
        )}

        {/* Content Carousels */}
        {Object.keys(allInsights).length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {Object.entries(allInsights).map(([type, insights]) => {
              if (insights.length === 0) return null;
              
              const category = type.split(':').pop() || 'content';
              const categoryConfig = {
                person: { icon: '👤', title: 'CULTURAL INFLUENCERS', color: 'purple' },
                movie: { icon: '🎬', title: 'RECOMMENDED FILMS', color: 'green' },
                music: { icon: '🎵', title: 'SONIC RECOMMENDATIONS', color: 'pink' },
                brand: { icon: '🏢', title: 'BRAND AFFINITY', color: 'orange' },
                place: { icon: '🌍', title: 'DESTINATION MATRIX', color: 'cyan' }
              };
              
              const config = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig.person;
              
              return (
                <ContentCarousel
                  key={type}
                  title={`${config.icon} ${config.title}`}
                  items={insights}
                  color={config.color}
                  category={category}
                />
              );
            })}
          </motion.div>
        )}

        {/* DNA Export */}
        {userDNA.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <DNAExporter 
              dnaData={{
                inputs: { favActor, favMusic, favCuisine, favCity },
                results,
                insights: allInsights
              }}
            />
          </motion.div>
        )}

        {/* Node Detail Modal */}
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="bg-gray-900 border border-cyan-500 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2" style={{ color: selectedNode.color }}>
                  {selectedNode.name}
                </h3>
                <div className="text-gray-400 mb-4">{selectedNode.category?.toUpperCase()}</div>
                {selectedNode.affinity_score && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-400 mb-1">AFFINITY SCORE</div>
                    <div className="text-xl font-bold text-cyan-400">
                      {(selectedNode.affinity_score * 100).toFixed(1)}%
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setSelectedNode(null)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded transition-colors"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}