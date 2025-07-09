// components/SearchQloo.tsx
import React, { useState } from "react";
import { searchQloo } from "../utils/qloo";

interface Props {
  onSelect: (item: any) => void;
  placeholder?: string;
  type?: string;
}

export const SearchQloo = ({ onSelect, placeholder = "Search...", type = "urn:entity:person" }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const data = await searchQloo(query, type, 8);
      if (data?.results?.length) {
        setResults(data.results);
      } else {
        setError("No results found.");
      }
    } catch (err: any) {
      console.error("SearchQloo Error:", err);
      setError("Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <div className="flex gap-2 mb-2">
        <input
          className="border p-2 rounded w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
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

      <ul className="text-sm space-y-1">
        {results.map((item, i) => (
          <li
            key={i}
            className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => onSelect(item)}
          >
            {item.name || item.title || "Unnamed"} ({item.type})
          </li>
        ))}
      </ul>
    </div>
  );
};
