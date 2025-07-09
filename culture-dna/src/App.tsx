import React, { useState } from "react";
import { searchQloo } from "./utils/qloo";
import { getRecommendationsByGenre } from "./utils/getRecommendationsByGenre";

export default function App() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("urn:entity:person");
  const [genre, setGenre] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const { results } = await searchQloo(query, type);
      setResults(results);
    } catch (err) {
      console.error("❌ Search error:", err);
      alert("Search failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenreFetch = async () => {
    if (!genre) return;
    setLoading(true);
    try {
      const genreResults = await getRecommendationsByGenre(genre);
      setResults(genreResults);
    } catch (err) {
      console.error("❌ Genre fetch error:", err);
      alert("Genre fetch failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>🎥 Qloo Explorer</h1>

      {/* 🔍 Search section */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search (e.g. Spiderman, Kanye...)"
          style={{ padding: "0.5rem", width: "300px" }}
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ marginLeft: "0.5rem", padding: "0.5rem" }}
        >
          <option value="urn:entity:person">Person</option>
          <option value="urn:entity:movie">Movie</option>
          <option value="urn:entity:brand">Brand</option>
          <option value="urn:entity:place">Place</option>
        </select>
        <button onClick={handleSearch} style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}>
          🔍 Search
        </button>
      </div>

      {/* 🎬 Genre recommendation section */}
      <div style={{ margin: "2rem 0" }}>
        <h2>🎬 Get Movie Recommendations by Genre</h2>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          style={{ padding: "0.5rem" }}
        >
          <option value="">-- Select a genre --</option>
          <option value="comedy">Comedy</option>
          <option value="drama">Drama</option>
          <option value="action">Action</option>
          <option value="romance">Romance</option>
          <option value="horror">Horror</option>
        </select>
        <button
          onClick={handleGenreFetch}
          style={{ marginLeft: "0.5rem", padding: "0.5rem 1rem" }}
        >
          🎞 Recommend
        </button>
      </div>

      {/* 📦 Results */}
      <div>
        <h3>🔽 Results</h3>
        {loading && <p>Loading...</p>}
        {!loading && Array.isArray(results) && results.length === 0 && <p>No results yet.</p>}
        {!loading &&
          Array.isArray(results) &&
          results.map((item) => (
            <div key={item.entity_id || item.id} style={{ marginBottom: "1rem" }}>
              <strong>{item.name}</strong> <br />
              <small>{item.entity_id || item.id}</small>
            </div>
          ))}
      </div>
    </div>
  );
}
