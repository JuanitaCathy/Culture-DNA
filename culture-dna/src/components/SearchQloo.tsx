// components/SearchQloo.tsx

import React, { useState } from "react";
import { searchQloo } from "../utils/qloo";

export const SearchQloo = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    setLoading(true);
    setError("");

    try {
      const data = await searchQloo(query, "urn:entity:destination", 5);
      if (data?.results?.length) {
        setResults(data.results);
      } else {
        setError("No results found.");
        setResults([]);
      }
    } catch (err: any) {
      console.error("SearchQloo Error:", err);
      setError("Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-2">Search Qloo</h2>

      <div className="flex gap-2 mb-2">
        <input
          className="border p-2 rounded w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a destination or name..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <ul className="text-sm">
        {results.map((item, i) => (
          <li key={i} className="border-b py-1">
            {item.name || item.title || JSON.stringify(item)}
          </li>
        ))}
      </ul>
    </div>
  );
};
