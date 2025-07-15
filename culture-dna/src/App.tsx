import React, { useState } from "react";
import { searchQloo } from "./utils/qloo";
import { getInsightsForDNA } from "./utils/getInsightsForDNA";
import { getTrendingContent } from "./utils/getTrendingContent";
import { getPersonalityInsights } from "./utils/getPersonalityInsights";
import DNAStrandVisualizer from "./components/DNAStrandVisualizer";
import ImageCarousel from "./components/ImageCarousel";
import MusicPreviewCarousel from "./components/MusicPreviewCarousel";
import PersonalityProfile from "./components/PersonalityProfile";
import TrendingSection from "./components/TrendingSection";
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
  const [personalityProfile, setPersonalityProfile] = useState<any>(null);
  const [trendingContent, setTrendingContent] = useState<any>({});
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
      
      const insightTypes = ["urn:entity:person", "urn:entity:movie", "urn:entity:brand", "urn:entity:place"];
      const insights: {[key: string]: any[]} = {};
      
      for (const type of insightTypes) {
        try {
          const typeInsights = await getInsightsForDNA(entityIds, type, 10);
          insights[type] = typeInsights;
        } catch (err) {
          console.warn(`Failed to fetch insights for ${type}:`, err);
          insights[type] = [];
        }
      }
      
      setAllInsights(insights);

      // Get personality insights
      try {
        const personality = await getPersonalityInsights(entityIds);
        setPersonalityProfile(personality);
      } catch (err) {
        console.warn("Failed to fetch personality insights:", err);
      }

      // Get trending content
      try {
        const trending = await getTrendingContent();
        setTrendingContent(trending);
      } catch (err) {
        console.warn("Failed to fetch trending content:", err);
      }

    } catch (err) {
      console.error("❌ DNA generation failed:", err);
      alert("DNA generation failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  function getColorForType(type: string) {
    if (type.includes("movie")) return "#ff6b9d";
    if (type.includes("place")) return "#c44569";
    if (type.includes("brand")) return "#ff9ff3";
    if (type.includes("person")) return "#f8b500";
    return "#ff6b9d";
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
    <div className="min-h-screen text-white font-['Rajdhani'] overflow-x-hidden relative">
      {/* Synthwave Background Effects */}
      <div className="retro-grid"></div>
      <div className="synthwave-horizon"></div>
      <div className="retro-wave"></div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl font-['Orbitron'] font-black mb-4 gradient-text synthwave-glow">
            🧬 CULTURAL DNA
          </h1>
          <div className="text-2xl text-pink-300 mb-2 font-semibold">SYNTHWAVE TASTE ANALYZER</div>
          <div className="text-lg text-pink-400/80">Decode your pop culture genome in retro-futuristic style</div>
        </motion.div>

        {/* Input Interface */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl mx-auto mb-16"
        >
          <div className="synthwave-card rounded-2xl p-8 neon-border">
            <div className="text-center mb-8">
              <div className="text-pink-300 text-2xl mb-3 font-bold synthwave-glow">INITIALIZE CULTURAL SCAN</div>
              <div className="text-pink-400/80 text-lg">Enter your preferences to generate your unique cultural DNA sequence</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-3">
                <label className="text-pink-300 text-lg font-semibold synthwave-glow">🎭 FAVORITE ACTOR</label>
                <input
                  value={favActor}
                  onChange={(e) => setFavActor(e.target.value)}
                  className="w-full synthwave-input rounded-lg px-6 py-4 text-lg font-medium"
                  placeholder="Enter actor name..."
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-pink-300 text-lg font-semibold synthwave-glow">🎵 FAVORITE MUSICIAN</label>
                <input
                  value={favMusic}
                  onChange={(e) => setFavMusic(e.target.value)}
                  className="w-full synthwave-input rounded-lg px-6 py-4 text-lg font-medium"
                  placeholder="Enter musician name..."
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-pink-300 text-lg font-semibold synthwave-glow">🍽 FAVORITE CUISINE</label>
                <input
                  value={favCuisine}
                  onChange={(e) => setFavCuisine(e.target.value)}
                  className="w-full synthwave-input rounded-lg px-6 py-4 text-lg font-medium"
                  placeholder="Enter cuisine type..."
                />
              </div>
              
              <div className="space-y-3">
                <label className="text-pink-300 text-lg font-semibold synthwave-glow">🌆 FAVORITE CITY</label>
                <input
                  value={favCity}
                  onChange={(e) => setFavCity(e.target.value)}
                  className="w-full synthwave-input rounded-lg px-6 py-4 text-lg font-medium"
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
                className="synthwave-btn text-white px-12 py-5 rounded-xl font-bold text-xl transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center space-x-3">
                    <div className="synthwave-spinner w-6 h-6"></div>
                    <span>ANALYZING CULTURAL PATTERNS...</span>
                  </div>
                ) : (
                  "🔬 GENERATE DNA SEQUENCE"
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Results Section */}
        {userDNA.length > 0 && (
          <div className="space-y-12">
            {/* DNA Visualization with Export */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="synthwave-card rounded-2xl p-8 neon-border">
                {/* Export Controls at Top */}
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-4xl font-['Orbitron'] font-bold gradient-text synthwave-glow">
                      🧬 CULTURAL DNA HELIX
                    </h2>
                    <div className="text-pink-400/80 text-lg">Interactive 3D visualization of your cultural genome</div>
                  </div>
                  
                  <DNAExporter 
                    dnaData={{
                      inputs: { favActor, favMusic, favCuisine, favCity },
                      results,
                      insights: allInsights,
                      personality: personalityProfile
                    }}
                  />
                </div>
                
                {/* Larger DNA Visualization */}
                <div className="h-[500px] rounded-xl overflow-hidden neon-border">
                  <DNAStrandVisualizer
                    nodes={getAllNodes()}
                    onNodeClick={setSelectedNode}
                    horizontal={true}
                  />
                </div>
              </div>
            </motion.div>

            {/* Side by Side Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Personality Profile */}
              <div>
                {personalityProfile && (
                  <PersonalityProfile profile={personalityProfile} />
                )}
              </div>

              {/* Right Column - Trending Content */}
              <div>
                {Object.keys(trendingContent).length > 0 && (
                  <TrendingSection content={trendingContent} />
                )}
              </div>
            </div>

            {/* Content Carousels */}
            {Object.entries(allInsights).map(([type, insights]) => {
              if (insights.length === 0) return null;
              
              const category = type.split(':').pop() || 'content';
              const categoryConfig = {
                person: { icon: '👤', title: 'CULTURAL INFLUENCERS', color: 'pink' },
                movie: { icon: '🎬', title: 'CINEMATIC RECOMMENDATIONS', color: 'purple' },
                brand: { icon: '🏢', title: 'BRAND AFFINITY MATRIX', color: 'orange' },
                place: { icon: '🌍', title: 'DESTINATION GENOME', color: 'cyan' }
              };
              
              const config = categoryConfig[category as keyof typeof categoryConfig];
              if (!config) return null;
              
              return (
                <ImageCarousel
                  key={type}
                  title={`${config.icon} ${config.title}`}
                  items={insights}
                  color={config.color}
                  category={category}
                />
              );
            })}
          </div>
        )}

        {/* Node Detail Modal */}
        {selectedNode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div 
              initial={{ scale: 0.8, rotateY: -90 }}
              animate={{ scale: 1, rotateY: 0 }}
              className="synthwave-modal rounded-2xl p-8 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <h3 className="text-3xl font-['Orbitron'] font-bold mb-3 synthwave-glow" style={{ color: selectedNode.color }}>
                  {selectedNode.name}
                </h3>
                <div className="text-pink-400/80 mb-6 text-lg uppercase tracking-wider">
                  {selectedNode.category}
                </div>
                
                {selectedNode.affinity_score && (
                  <div className="mb-6">
                    <div className="text-sm text-pink-400/60 mb-2 uppercase tracking-wider">CULTURAL AFFINITY</div>
                    <div className="text-3xl font-bold text-pink-300 synthwave-glow mb-3">
                      {(selectedNode.affinity_score * 100).toFixed(1)}%
                    </div>
                    <div className="synthwave-progress rounded-full h-3">
                      <div 
                        className="synthwave-progress-fill h-full rounded-full transition-all duration-1000"
                        style={{ width: `${selectedNode.affinity_score * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => setSelectedNode(null)}
                  className="synthwave-btn text-white px-8 py-3 rounded-lg font-semibold transition-all"
                >
                  CLOSE NEURAL LINK
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}