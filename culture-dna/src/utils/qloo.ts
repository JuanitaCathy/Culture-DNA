// utils/qloo.ts

const API_KEY = "1Ql3AjhegWKNJK_6Ruh5d9dl4-z5bnoP1s33foFmqHE"; // ⬅️ Replace this with your actual API key

export async function searchQloo(query: string, type?: string, limit: number = 3) {
  const url = new URL("https://hackathon.api.qloo.com/search");

  url.searchParams.append("q", query);
  if (type) url.searchParams.append("filter.type", type);
  url.searchParams.append("limit", limit.toString());

  const res = await fetch(url.toString(), {
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!res.ok) {
    throw new Error(`Search failed: ${res.status}`);
  }

  const json = await res.json();
  return json;
}
