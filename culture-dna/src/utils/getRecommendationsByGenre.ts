const API_KEY = "1Ql3AjhegWKNJK_6Ruh5d9dl4-z5bnoP1s33foFmqHE";

export async function getRecommendationsByGenre(tag: string = "comedy") {
  const url = new URL("https://hackathon.api.qloo.com/v2/insights");
  url.searchParams.append("filter.type", "urn:entity:movie");
  url.searchParams.append("filter.tags", `urn:tag:genre:media:${tag.toLowerCase()}`);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-api-key": API_KEY,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    console.error("❌ Genre Insight Error:", error);
    throw new Error(`Failed: ${res.status}`);
  }

  const data = await res.json();
  console.log("👀 Insight API raw response:", data);

const related = data?.results?.entities || [];

const normalized = related.map((item: any) => ({
  entity_id: item.entity_id,
  name: item.name || "Untitled Movie",
}));

return normalized;
}
