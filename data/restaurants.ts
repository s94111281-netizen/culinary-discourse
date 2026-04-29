import seed from "@/data/restaurants.osm.json";

export type Restaurant = {
  id: string;
  name: string;
  name_en?: string;
  district: string;
  coordinates: { lat: number; lng: number };
  amenity: string;
  cuisine: string[];
  discourse_source: Array<"tourist" | "local_discourse" | "social_media" | "prestige_cultural">;
  discourse_frame: Array<"authenticity" | "everyday_value" | "trend_hype">;
  coding_evidence: string[];
  address: string;
  opening_hours: string | null;
  website: string | null;
  phone: string | null;
  photo_url?: string | null;
  source: {
    provider: string;
    osm_type: string;
    osm_id: number;
    osm_url: string;
  };
};

function extractChineseName(name: string) {
  const chineseParts = name.match(/[\u3400-\u9FFF]+/g);
  return chineseParts ? chineseParts.join("") : "";
}

export function formatRestaurantName({
  name,
  name_en
}: Pick<Restaurant, "name" | "name_en">) {
  const zhName = name.trim();
  const enName = (name_en ?? "").trim();
  if (!enName) return zhName;

  const normalizedZh = extractChineseName(zhName) || zhName;
  if (!normalizedZh || normalizedZh === enName) return enName;

  return `${enName} (${normalizedZh})`;
}

export type DatasetMetadata = {
  provider: string;
  fetched_at: string;
  notes?: string;
};

const fallbackRestaurants: Restaurant[] = [
  {
    id: "fallback-lin-heung",
    name: "Lin Heung Tea House",
    district: "Central and Western District",
    coordinates: { lat: 22.2847, lng: 114.1526 },
    amenity: "restaurant",
    cuisine: ["dim_sum", "cantonese"],
    discourse_source: ["tourist"],
    discourse_frame: ["authenticity"],
    coding_evidence: [
      "Heritage dim sum venue often highlighted in travel narratives.",
      "Long-standing tea house framing emphasizes culinary authenticity."
    ],
    address: "160-164 Wellington Street, Central",
    opening_hours: null,
    website: null,
    phone: null,
    source: {
      provider: "OpenStreetMap",
      osm_type: "search",
      osm_id: 0,
      osm_url: "https://nominatim.openstreetmap.org/ui/search.html?q=Lin+Heung+Tea+House+Hong+Kong"
    }
  },
  {
    id: "fallback-kam-wah",
    name: "Kam Wah Cafe",
    district: "Yau Tsim Mong District",
    coordinates: { lat: 22.3249, lng: 114.1675 },
    amenity: "cafe",
    cuisine: ["cha_chaan_teng", "hong_kong"],
    discourse_source: ["local_discourse"],
    discourse_frame: ["everyday_value"],
    coding_evidence: [
      "Cha chaan teng format is commonly discussed as daily local dining.",
      "Affordable bakery-cafe positioning signals everyday value discourse."
    ],
    address: "47 Bute Street, Mong Kok",
    opening_hours: null,
    website: null,
    phone: null,
    source: {
      provider: "OpenStreetMap",
      osm_type: "search",
      osm_id: 0,
      osm_url: "https://nominatim.openstreetmap.org/ui/search.html?q=Kam+Wah+Cafe+Mong+Kok"
    }
  },
  {
    id: "fallback-tim-ho-wan",
    name: "Tim Ho Wan",
    district: "Sham Shui Po District",
    coordinates: { lat: 22.3313, lng: 114.1603 },
    amenity: "restaurant",
    cuisine: ["dim_sum", "cantonese"],
    discourse_source: ["social_media"],
    discourse_frame: ["trend_hype"],
    coding_evidence: [
      "Frequently circulated in social ranking and check-in content.",
      "Queue and popularity narratives align with trend-driven framing."
    ],
    address: "9-11 Fuk Wing Street, Sham Shui Po",
    opening_hours: null,
    website: null,
    phone: null,
    source: {
      provider: "OpenStreetMap",
      osm_type: "search",
      osm_id: 0,
      osm_url: "https://nominatim.openstreetmap.org/ui/search.html?q=Tim+Ho+Wan+Sham+Shui+Po"
    }
  }
];

const discourseById: Record<
  string,
  Pick<Restaurant, "discourse_source" | "discourse_frame" | "coding_evidence">
> = {
  "seed-lin-heung": {
    discourse_source: ["tourist"],
    discourse_frame: ["authenticity"],
    coding_evidence: [
      "Classic Cantonese teahouse identity appears in heritage-oriented writeups.",
      "Commonly framed as an old Hong Kong food experience."
    ]
  },
  "seed-yat-lok": {
    discourse_source: ["social_media"],
    discourse_frame: ["trend_hype"],
    coding_evidence: [
      "Roast goose lists and social recommendations repeatedly boost visibility.",
      "Popularity narrative emphasizes must-try status."
    ]
  },
  "seed-maks": {
    discourse_source: ["local_discourse"],
    discourse_frame: ["everyday_value"],
    coding_evidence: [
      "Wonton noodle discourse often centers on routine local eating.",
      "Portion-price practicality appears in local food discussions."
    ]
  },
  "seed-tai-cheong": {
    discourse_source: ["tourist"],
    discourse_frame: ["authenticity"],
    coding_evidence: [
      "Egg tart heritage narrative links venue to iconic local taste memory.",
      "Travel guides frequently frame it as a traditional stop."
    ]
  },
  "seed-kam-wah": {
    discourse_source: ["local_discourse"],
    discourse_frame: ["everyday_value"],
    coding_evidence: [
      "Tea cafe setting is tied to everyday neighborhood consumption.",
      "Menu and price-point discourse foreground daily affordability."
    ]
  },
  "seed-one-dim-sum": {
    discourse_source: ["social_media"],
    discourse_frame: ["trend_hype"],
    coding_evidence: [
      "High frequency in online recommendation loops and queue narratives.",
      "Ranked-list exposure drives trend framing."
    ]
  },
  "seed-peninsula": {
    discourse_source: ["tourist"],
    discourse_frame: ["trend_hype"],
    coding_evidence: [
      "Luxury afternoon tea appears in destination-oriented travel narratives.",
      "Prestige and photo-oriented sharing emphasize hype framing."
    ]
  },
  "seed-tim-ho-wan": {
    discourse_source: ["social_media"],
    discourse_frame: ["trend_hype"],
    coding_evidence: [
      "Brand visibility amplified through social discussion and reposts.",
      "Queue and fame language indicates trend-led attention."
    ]
  }
};

function buildFallbackPhotoUrl(item: Pick<Restaurant, "id" | "name" | "amenity">) {
  const query = encodeURIComponent(`${item.name} hong kong ${item.amenity.replaceAll("_", " ")}`);
  // Use real-world photo feed as a fallback so every card has a non-illustrated image.
  return `https://loremflickr.com/960/640/${query}?lock=${encodeURIComponent(item.id)}`;
}

const seedRestaurants = ((seed.restaurants ?? []) as Array<
  Omit<Restaurant, "discourse_source" | "discourse_frame" | "coding_evidence"> & {
    discourse_source?: Restaurant["discourse_source"];
    discourse_frame?: Restaurant["discourse_frame"];
    coding_evidence?: string[];
  }
>).map((item) => {
  const discourse =
    (item.discourse_source && item.discourse_frame
      ? {
          discourse_source: item.discourse_source,
          discourse_frame: item.discourse_frame,
          coding_evidence:
            item.coding_evidence && item.coding_evidence.length > 0
              ? item.coding_evidence
              : ["Discourse labels imported from source dataset."]
        }
      : discourseById[item.id]) ??
    (item.amenity === "cafe"
      ? {
          discourse_source: ["local_discourse"],
          discourse_frame: ["everyday_value"] as const,
          coding_evidence: [
            "Cafe format is treated as everyday neighborhood dining in this coding scheme."
          ]
        }
      : {
          discourse_source: ["tourist"],
          discourse_frame: ["authenticity"] as const,
          coding_evidence: [
            "Restaurant record defaults to authenticity frame when no manual note exists."
          ]
        });
  return {
    ...item,
    ...discourse,
    photo_url: item.photo_url ?? buildFallbackPhotoUrl(item)
  };
});
const fallbackRestaurantsWithPhotos = fallbackRestaurants.map((item) => ({
  ...item,
  photo_url: item.photo_url ?? buildFallbackPhotoUrl(item)
}));
export const restaurants: Restaurant[] =
  seedRestaurants.length > 0 ? seedRestaurants : fallbackRestaurantsWithPhotos;
export const datasetMetadata: DatasetMetadata = {
  provider: seed.metadata?.provider ?? "OpenStreetMap",
  fetched_at: seed.metadata?.fetched_at ?? new Date(0).toISOString(),
  notes: seed.metadata?.notes
};

