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

const restaurantIntroductionsById: Record<string, string> = {
  "openrice-新肥泉海鲜大排档":
    "A local dai pai dong serving classic Cantonese seafood with strong wok hei, offering affordable and generous portions in a casual cooked food centre.",
  "openrice-得闲饮茶":
    "A popular spot for creative and high-quality Cantonese dim sum at reasonable prices, beloved by locals for its fresh and delicate handmade items.",
  "openrice-富豪酒家":
    "A Michelin-starred Cantonese restaurant with over 25 years of history, famous for exquisite dim sum, premium abalone dishes, and elegant fine dining experience.",
  "openrice-孖宝车仔面":
    "A budget-friendly cart noodle shop with a wide selection of toppings, best enjoyed with signature satay and homemade sauces.",
  "openrice-痴胶鸡":
    "A cosy local eatery specialising in nourishing fish maw and chicken soup rice noodles, served hot with a small stove to keep warm.",
  "openrice-刘森记面家":
    "A time-honored noodle shop with over 70 years of history, serving traditional bamboo-pressed noodles topped with generous shrimp roe.",
  "openrice-三不馆":
    "A retro Hong Kong-style hot pot restaurant featuring vintage decor and fresh local ingredients, popular for its Instagrammable nostalgic ambiance.",
  "openrice-九记牛腩":
    "A legendary 90-year-old eatery renowned for clear broth beef brisket noodles and rich curry brisket noodles, often with long queues.",
  "openrice-甘记烧鹅":
    "A Michelin-starred BBQ restaurant famous for crispy, juicy roast goose with golden skin, paired with noodles or rice.",
  "openrice-金华冰室":
    "A classic Hong Kong cha chaan teng known for speedy service, signature pineapple bun, egg tarts, and nostalgic local snacks.",
  "openrice-永顺沙爹牛肉专门店":
    "A long-established local shop serving rich and fragrant satay beef noodles, a favourite comfort food among Hong Kong people.",
  "openrice-一品鸡煲火锅":
    "A hot pot restaurant famous for spicy and flavourful chicken hot pot with rich sauce, perfect for pairing with handmade cuttlefish balls.",
  "openrice-红茶":
    "An iconic local cha chaan teng offering generous portions of classic Hong Kong dishes, including pineapple bun, milk tea, and stir-fried noodles.",
  "openrice-六福菜馆":
    "A Michelin-starred Sai Kung seafood restaurant, well-known for fresh seafood and signature pre-order chili crispy skin chicken.",
  "openrice-忆食尚":
    "A quality clay pot rice restaurant with homemade preserved meats, featuring crispy rice crust and rich, authentic flavours.",
  "openrice-聚来车仔":
    "A friendly cart noodle shop with diverse ingredients and unique homemade sauces, also popular for tasty egg waffle and French toast.",
  "openrice-新同乐":
    "A prestigious Michelin-starred Cantonese restaurant with 56 years of heritage, specialising in contemporary premium dried seafood dishes.",
  "openrice-大班楼":
    "A high-end traditional Cantonese restaurant named among Asia's Best 50, using local fresh ingredients to preserve authentic classic flavours.",
  "openrice-都爹利会馆":
    "A Michelin-starred fine dining venue in a 1920s-style Lingnan mansion, focusing on refined traditional Cantonese flavours and forgotten cooking techniques.",
  "openrice-一乐烧鹅":
    "A Michelin-starred local BBQ shop famous for crispy, fatty roast goose with tender meat, served with noodles or congee.",
  "openrice-彭庆记食家":
    "A Michelin-starred eatery celebrated for flavourful Cantonese stir-fries and homestyle dishes with premium ingredients.",
  "openrice-兴记猪什专门店":
    "A popular spot for pork offal lovers, offering generous and flavourful pork offal noodles with spicy pepper soup.",
  "openrice-大滚友":
    "A Chinese-style hot pot restaurant featuring nourishing papaya fish soup base, fresh beef, handmade fish balls, and clean, comfortable environment.",
  "openrice-陳儀興玫瑰餐廳":
    "A hot pot restaurant offering various chicken pot flavours including coconut chicken and Chongqing spicy chicken, with classic Chinese decor.",
  "openrice-船涡-boat-boat-steam":
    "A private steam hot pot restaurant with curtained seats, focusing on fresh seafood and guided cooking timers for a pleasant dining experience.",
  "openrice-鋿晶馆":
    "A popular local dim sum restaurant offering handmade, freshly steamed dim sum with high quality and affordable prices, loved by nearby office workers.",
  "openrice-妈咪鸡蛋仔":
    "A classic Hong Kong street snack shop serving freshly baked, crispy egg waffles with rich egg flavour and various tasty fillings.",
  "openrice-龙凤店":
    "A neighbourhood snack shop famous for special egg sandwiches with parma ham and crab meat, as well as bottled milk tea.",
  "openrice-大澳饼店":
    "A traditional local bakery known for freshly fried egg puffs with crispy outside and soft inside, a popular Tai O snack.",
  "openrice-申子居酒屋":
    "A cosy Japanese izakaya with wooden decor, offering fresh sashimi, skewers, oyster pot, and creative dishes in a private atmosphere.",
  "openrice-yadllie-plate":
    "A Korean-style restaurant famous for imported Korean fried chicken with special homemade sauces, popular for honey cheese flavour.",
  "openrice-tamarind":
    "A Thai street-style restaurant popular for Thai boat noodles, Northern Thai curry chicken, and volcanic ribs, with authentic flavours.",
  "openrice-grissini":
    "An elegant Italian restaurant in Grand Hyatt Hong Kong with harbour views, specialising in authentic Italian dishes and signature grissini breadsticks.",
  "openrice-odelice":
    "A romantic Parisian bistro-themed chain offering home-style French dishes with Asian fusion elements, ideal for casual fine dining.",
  "openrice-鱼事者":
    "An innovative eatery specialising in creative fish-based noodles and snacks, featuring fresh fish broth and handmade fish noodles.",
  "openrice-nonsense":
    "A cosy fusion cafe and bar with creative dishes, signature burnt cheesecake, coffee, and cocktails, suitable for casual gatherings."
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
    coding_evidence: [restaurantIntroductionsById[item.id] ?? discourse.coding_evidence[0]],
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

