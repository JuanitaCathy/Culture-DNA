// utils/getTrendingContent.ts
const API_KEY = "1Ql3AjhegWKNJK_6Ruh5d9dl4-z5bnoP1s33foFmqHE";

export async function getTrendingContent() {
  try {
    // Simulate trending content since Qloo API might not have a direct trending endpoint
    // In a real implementation, you'd use Qloo's trending or popular content endpoints
    
    const trendingNow = [
      {
        name: "Dune: Part Two",
        type: "urn:entity:movie",
        trend_score: 0.95,
        entity_id: "trending_movie_1"
      },
      {
        name: "Taylor Swift",
        type: "urn:entity:person",
        trend_score: 0.92,
        entity_id: "trending_person_1"
      },
      {
        name: "Korean BBQ",
        type: "urn:entity:brand",
        trend_score: 0.88,
        entity_id: "trending_cuisine_1"
      },
      {
        name: "Tokyo",
        type: "urn:entity:place",
        trend_score: 0.85,
        entity_id: "trending_place_1"
      },
      {
        name: "Billie Eilish",
        type: "urn:entity:music",
        trend_score: 0.82,
        entity_id: "trending_music_1"
      }
    ];

    const risingStars = [
      {
        name: "Chappell Roan",
        type: "urn:entity:person",
        growth_rate: 2.5,
        entity_id: "rising_person_1"
      },
      {
        name: "Everything Everywhere All at Once",
        type: "urn:entity:movie",
        growth_rate: 1.8,
        entity_id: "rising_movie_1"
      },
      {
        name: "Oaxacan Cuisine",
        type: "urn:entity:brand",
        growth_rate: 1.6,
        entity_id: "rising_cuisine_1"
      },
      {
        name: "Lisbon",
        type: "urn:entity:place",
        growth_rate: 1.4,
        entity_id: "rising_place_1"
      },
      {
        name: "Phoebe Bridgers",
        type: "urn:entity:music",
        growth_rate: 1.2,
        entity_id: "rising_music_1"
      }
    ];

    return {
      trending_now: trendingNow,
      rising_stars: risingStars
    };
  } catch (error) {
    console.error("Failed to fetch trending content:", error);
    return {
      trending_now: [],
      rising_stars: []
    };
  }
}