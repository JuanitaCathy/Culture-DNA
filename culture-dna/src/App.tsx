import React, { useState } from "react";
import { searchQloo } from "./utils/qloo";
import { getInsightsForDNA } from "./utils/getInsightsForDNA";
import DNAStrandVisualizer from "./components/DNAStrandVisualizer";
import MusicCarousel from "./components/MusicCarousel";

export default function App() {
  const [favActor, setFavActor] = useState("");
  const [favMusic, setFavMusic] = useState("");
  const [favCuisine, setFavCuisine] = useState("");
  const [favCity, setFavCity] = useState("");
  const [userDNA, setUserDNA] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [insightResults, setInsightResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [insightType, setInsightType] = useState("urn:entity:person");

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
        } else {
          console.warn(`No result for ${input.label}`);
        }
      }

      setUserDNA(entityIds);
      setResults(foundResults);
      setInsightResults([]);
      console.log("🧬 DNA Entity IDs:", entityIds);
    } catch (err) {
      console.error("❌ DNA generation failed:", err);
      alert("DNA generation failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  function getColorForType(type: string) {
  if (type.includes("music")) return "#1DB954";
  if (type.includes("movie")) return "#e50914";
  if (type.includes("place")) return "#3366cc";
  if (type.includes("brand")) return "#ff9900";
  if (type.includes("person")) return "#6f42c1";
  return "#888";
}


  const handleFetchInsights = async () => {
    if (userDNA.length === 0) return;
    setLoading(true);
    try {
      const insights = await getInsightsForDNA(userDNA, insightType, 10); // max 10 results
      setInsightResults(insights);
    } catch (err) {
      console.error("❌ Insight fetch failed:", err);
      alert("Insight fetch failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🧬 Cultural DNA Generator</h1>
      <p>Enter your favorites to generate your cultural profile:</p>

      <div style={{ marginBottom: "1rem" }}>
        <input
          placeholder="🎭 Favorite Actor"
          value={favActor}
          onChange={(e) => setFavActor(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.5rem", width: "250px" }}
        />
        <input
          placeholder="🎵 Favorite Musician/Artist"
          value={favMusic}
          onChange={(e) => setFavMusic(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.5rem", width: "250px" }}
        />
        <input
          placeholder="🍽 Favorite Cuisine"
          value={favCuisine}
          onChange={(e) => setFavCuisine(e.target.value)}
          style={{ marginRight: "0.5rem", padding: "0.5rem", width: "200px" }}
        />
        <input
          placeholder="🌆 Favorite City"
          value={favCity}
          onChange={(e) => setFavCity(e.target.value)}
          style={{ padding: "0.5rem", width: "200px" }}
        />
      </div>

      <button
        onClick={handleGenerateDNA}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          background: "#444",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        🔬 Generate DNA
      </button>

      <div style={{ marginTop: "2rem" }}>
        <h3>🧠 Your Cultural DNA</h3>
        {loading && <p>Loading...</p>}
        {!loading && userDNA.length === 0 && <p>Fill out and click Generate!</p>}
        {!loading &&
          userDNA.length > 0 &&
          results.map((item, index) => (
            <div key={`${item.entity_id}-${index}`} style={{ marginBottom: "1rem" }}>
              <strong>{item.name}</strong> <br />
              <small>{item.entity_id}</small>
            </div>
          ))}
      </div>

      {/* 🔍 Choose insight type */}
      {userDNA.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <label style={{ marginRight: "1rem" }}>
            Insight Type:{" "}
            <select
              value={insightType}
              onChange={(e) => setInsightType(e.target.value)}
              style={{ padding: "0.5rem" }}
            >
              <option value="urn:entity:person">Person</option>
              <option value="urn:entity:movie">Movie</option>
              <option value="urn:entity:music">Music</option>
              <option value="urn:entity:brand">Brand</option>
              <option value="urn:entity:place">Place</option>
            </select>
          </label>
          <button
            onClick={handleFetchInsights}
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              background: "#0a7",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            🔮 Get Cultural Insights
          </button>
        </div>
      )}

      {/* 🔗 Display insight results */}
      {insightResults.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h3>🔗 Related Entities</h3>
          {insightResults.map((item, index) => (
            <div key={`${item.entity_id}-${index}`} style={{ marginBottom: "1rem" }}>
              <strong>{item.name}</strong> <br />
              <small>{item.type}</small>
              {item.affinity_score !== null && (
                <>
                  {" "}
                  | Affinity Score:{" "}
                  <span style={{ fontWeight: "bold" }}>{item.affinity_score.toFixed(2)}</span>
                </>
              )}
              <br />
              <code>{item.entity_id}</code>
            </div>
          ))}
        </div>
      )}
          {/* 🧬 DNA Helix Visualization */}
    <div style={{ marginTop: "3rem" }}>
      <h3>🧬 DNA Helix Visualization</h3>
      <DNAStrandVisualizer
        nodes={insightResults.map((item) => ({
          name: item.name,
          color: getColorForType(item.type),
        }))}
      />
    </div>

    {/* 🎧 Music Carousel */}
    {insightResults.some((item) => item.type.includes("music")) && (
      <div style={{ marginTop: "3rem" }}>
        <h3>🎧 Recommended Music</h3>
        <MusicCarousel items={insightResults.filter((i) => i.type.includes("music"))} />
      </div>
    )}

    </div>
  );
}
