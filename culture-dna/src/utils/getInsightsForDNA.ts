// utils/getInsightsForDNA.ts
const API_KEY = "1Ql3AjhegWKNJK_6Ruh5d9dl4-z5bnoP1s33foFmqHE";

/**
 * Fetch related entities based on user DNA (list of entity_ids).
 * @param entityIds - array of Qloo entity IDs
 * @param type - optional: filter by type (e.g., 'urn:entity:movie')
 * @param maxResults - optional: limit number of results
 */
export async function getInsightsForDNA(
  entityIds: string[],
  type: string = "urn:entity:person",
  maxResults: number = 10
) {
  const url = new URL("https://hackathon.api.qloo.com/v2/insights");

  // Optional: filter result type (e.g., movies, persons, etc.)
  url.searchParams.append("filter.type", type);

  // Optional: include affinity scores
  url.searchParams.append("include.affinity_score", "true");
  
  // Include image URLs if available
  url.searchParams.append("include.image_url", "true");
  
  // Include additional metadata
  url.searchParams.append("include.metadata", "true");

  // De-duplicate and attach interests
  const uniqueIds = Array.from(new Set(entityIds));
  uniqueIds.forEach((id) => {
    url.searchParams.append("signal.interests.entities", id);
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("❌ Insights API Error:", error);
    throw new Error(`Insights fetch failed: ${res.status}`);
  }

  const data = await res.json();
  console.log("🧠 Insight results:", data);

  const entities = data?.results?.entities || [];

  // Normalize and sort by affinity score (if available)
  const normalized = entities
    .map((item: any) => ({
      entity_id: item.entity_id,
      name: item.name || "Unnamed",
      type: item.type,
      affinity_score: item.affinity_score ?? null,
      image_url: item.image_url || null,
      spotify_id: item.spotify_id || null,
      preview_url: item.preview_url || null,
      metadata: item.metadata || {}
    }))
    .sort((a: { affinity_score: any; }, b: { affinity_score: any; }) => (b.affinity_score ?? 0) - (a.affinity_score ?? 0)) // highest score first
    .slice(0, maxResults); // limit to max results

  return normalized;
}
