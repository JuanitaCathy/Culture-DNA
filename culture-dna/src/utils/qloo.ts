// utils/qloo.ts
const API_KEY = "1Ql3AjhegWKNJK_6Ruh5d9dl4-z5bnoP1s33foFmqHE";

export async function searchQloo(query: string, type: string = "urn:entity:person", limit: number = 5) {
  const url = new URL("https://hackathon.api.qloo.com/search");

  url.searchParams.append("q", query);
  url.searchParams.append("filter.type", type);
  url.searchParams.append("limit", limit.toString());

  const res = await fetch(url.toString(), {
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!res.ok) {
    console.error("Failed URL:", url.toString());
    throw new Error(`Search failed: ${res.status}`);
  }

  const data = await res.json();

  const results = (data?.results || []).map((item: any) => ({
    ...item,
    entity_id: item.entity_id || item.id,
  }));

  return { results };
}
