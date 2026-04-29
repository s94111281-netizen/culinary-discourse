import { readFile, writeFile } from "node:fs/promises";

const OUTPUT_PATH = new URL("../data/restaurants.osm.json", import.meta.url);
const REVIEW_SNIPPETS_PATH = new URL("../data/openrice-review-snippets.json", import.meta.url);
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const districtCenters = {
  "Central and Western District": { lat: 22.283, lng: 114.155, spread: 0.018 },
  "Wan Chai District": { lat: 22.277, lng: 114.176, spread: 0.016 },
  "Yau Tsim Mong District": { lat: 22.319, lng: 114.169, spread: 0.02 },
  "Yuen Long District": { lat: 22.444, lng: 114.022, spread: 0.03 },
  "Sham Shui Po District": { lat: 22.332, lng: 114.16, spread: 0.016 },
  "Sai Kung District": { lat: 22.383, lng: 114.272, spread: 0.03 },
  "Tsuen Wan District": { lat: 22.371, lng: 114.113, spread: 0.02 },
  "Kowloon City District": { lat: 22.314, lng: 114.188, spread: 0.02 },
  "Eastern District": { lat: 22.287, lng: 114.216, spread: 0.018 },
  "Islands District": { lat: 22.251, lng: 113.865, spread: 0.03 },
  "Wong Tai Sin District": { lat: 22.342, lng: 114.195, spread: 0.016 },
  Unknown: { lat: 22.3193, lng: 114.1694, spread: 0.02 }
};

const entries = [
  {
    name: "新肥泉海鲜大排档",
    address: "2/F, Kwun Chung Municipal Services Building, 17 Bowring Street, Jordan, Hong Kong",
    tags: ["Guangdong", "Hong Kong Style", "Seafood", "Cooked Food Center"],
    description: ""
  },
  {
    name: "香香宫煮 Tasty Hotpot Palace",
    address: "1/F, Golden Glory Mansion, 16 Carnarvon Road, Tsim Sha Tsui, Hong Kong",
    tags: ["Hong Kong Style", "Hot Pot"],
    description: "Chinese court themed hot pot restaurant with photo-friendly setting and diverse ingredients."
  },
  {
    name: "得闲饮茶",
    address: "G/F, Kit Man House, 13 Kuk Ting Street, Yuen Long, Hong Kong",
    tags: ["Guangdong", "Hong Kong Style", "Dim Sum", "Tea Restaurant"],
    description: ""
  },
  {
    name: "富豪酒家",
    address: "Shop 402, 4/F, FoodLoft, Mira Place 1, 132 Nathan Road, Tsim Sha Tsui, Hong Kong",
    tags: ["Guangdong", "Fine Dried Seafood", "Stir-Fry", "Dim Sum Restaurant"],
    description: ""
  },
  {
    name: "孖宝车仔面",
    address: "Shop A15, G/F, Kwai Chung Plaza, 7-11 Kwai Foo Road, Kwai Fong, Hong Kong",
    tags: ["Hong Kong Style", "Food Stall Noodles"],
    description: "Low-price cart noodles with many ingredient choices."
  },
  {
    name: "痴胶鸡",
    address: "G/F, 254 Hennessy Road, Wan Chai, Hong Kong",
    tags: ["Hong Kong Style", "Noodles/Rice Noodles"],
    description: ""
  },
  {
    name: "刘森记面家",
    address: "G/F, 80 Fuk Wing Street, Sham Shui Po, Hong Kong",
    tags: ["Hong Kong Style", "Noodles/Rice Noodles"],
    description: "One of Sham Shui Po best noodles spots."
  },
  {
    name: "三不馆",
    address: "7/F, SL GINZA, 68 Electric Road, Tin Hau, Hong Kong",
    tags: ["Guangdong", "Hong Kong Style", "Hot Pot", "Stir-Fry"],
    description: "Vintage and IG-able local-style hot pot with imported sashimi."
  },
  {
    name: "九记牛腩",
    address: "G/F, 21 Gough Street, Central, Hong Kong",
    tags: ["Guangdong", "Noodles/Rice Noodles", "Nostalgic"],
    description: "Over 90 years of history, famous beef brisket noodles with long queues."
  },
  {
    name: "甘记烧鹅",
    address: "G/F, Po Wah Commercial Center, 226 Hennessy Road, Wan Chai, Hong Kong",
    tags: ["Guangdong", "Chinese BBQ", "Stir-Fry"],
    description: "Specializes in roast goose and Chinese BBQ meats."
  },
  {
    name: "金华冰室",
    address: "G/F, 47 Bute Street, Prince Edward, Hong Kong",
    tags: ["Hong Kong Style", "Tea Restaurant", "Nostalgic"],
    description: "Known for pineapple bun and egg tarts."
  },
  {
    name: "永顺沙爹牛肉专门店",
    address: "Shop F, G/F, Koon Wong Mansion, 2 On Ning Road, Yuen Long, Hong Kong",
    tags: ["Hong Kong Style", "Noodles/Rice Noodles", "Tea Restaurant"],
    description: ""
  },
  {
    name: "一品鸡煲火锅",
    address: "G/F, 73 Chung On Street, Tsuen Wan, Hong Kong",
    tags: ["Hong Kong Style", "Hot Pot", "Chicken Hot Pot", "Stir-Fry"],
    description: "Known for spicy chicken pot and handmade cuttlefish ball."
  },
  {
    name: "红茶",
    address: "G/F, 186 Tung Choi Street, Prince Edward, Hong Kong",
    tags: ["Hong Kong Style", "Tea Restaurant"],
    description: ""
  },
  {
    name: "六福菜馆",
    address: "G/F, 49 See Cheung Street, Sai Kung, Hong Kong",
    tags: ["Guangdong", "Seafood", "Seafood Restaurant"],
    description: "Iconic Sai Kung seafood venue."
  },
  {
    name: "忆食尚",
    address: "G/F, 22-24 Man Wun Street, Jordan, Hong Kong",
    tags: ["Guangdong", "Hong Kong Style"],
    description: "Restaurant with in-house preserved meat production."
  },
  {
    name: "聚来车仔",
    address: "G/F, 172 Ki Lung Street, Sham Shui Po, Hong Kong",
    tags: ["Hong Kong Style", "Food Stall Noodles"],
    description: "Cart noodles with diverse ingredients."
  },
  {
    name: "新同乐",
    address: "Shop 401, 4/F, FoodLoft, Mira Place 1, 132 Nathan Road, Tsim Sha Tsui, Hong Kong",
    tags: ["Guangdong", "Fine Dried Seafood", "Stir-Fry", "Salt & Sugar Reduction Restaurant"],
    description: "Contemporary Guangdong cuisine with signature dry-aged beef ribs."
  },
  {
    name: "大班楼",
    address: "3/F, The Wellington, 198 Wellington Street, Central, Hong Kong",
    tags: ["Guangdong", "Stir-Fry"],
    description: "Traditional flavors, named one of Asia's Best 50 Restaurants."
  },
  {
    name: "都爹利会馆",
    address: "3/F, 1 Duddell Street, Central, Hong Kong",
    tags: ["Guangdong", "Stir-Fry"],
    description: "MICHELIN-starred Cantonese journey in historic Central."
  },
  {
    name: "一乐烧鹅",
    address: "G/F, 34-38 Stanley Street, Central, Hong Kong",
    tags: ["Hong Kong Style", "Chinese BBQ", "Tea Restaurant"],
    description: "Famous for roast goose."
  },
  {
    name: "彭庆记食家",
    address: "G/F, 25 Yik Yam Street, Happy Valley, Hong Kong",
    tags: ["Guangdong", "Noodles/Rice Noodles", "Tea Restaurant", "Salt & Sugar Reduction Restaurant"],
    description: "Renowned stir-fry dishes with strong flavors."
  },
  {
    name: "兴记猪什专门店",
    address: "Shop 30, G/F, Manhattan Plaza, 23 Sai Ching Street, Yuen Long, Hong Kong",
    tags: ["Hong Kong Style"],
    description: ""
  },
  {
    name: "大滚友",
    address: "Shop G4-G5, G/F, Ho Shun Lee Building Block 1, 9 Fung Yau Street South, Yuen Long, Hong Kong",
    tags: ["Hong Kong Style", "Hot Pot"],
    description: "Classic decor with maw and chicken soup base."
  },
  {
    name: "陳儀興玫瑰餐廳",
    address: "G/F, Victorious Factory Building, 33A-37A Tseuk Luk Street, San Po Kong, Hong Kong",
    tags: ["Guangdong", "Hong Kong Style", "Hot Pot"],
    description: "Offers multiple chicken pot styles."
  },
  {
    name: "船涡 Boat Boat Steam",
    address: "3/F, Way On Commercial Building, 500 Jaffe Road, Causeway Bay, Hong Kong",
    tags: ["Hong Kong Style", "Hot Pot", "Seafood", "Steam Hotpot"],
    description: "Specialized steam hot pot with seafood."
  },
  {
    name: "鋿晶馆",
    address: "G/F, 726 Nathan Road, Mong Kok, Hong Kong",
    tags: ["Guangdong", "Hong Kong Style", "Soup", "Dim Sum", "Dim Sum Restaurant"],
    description: ""
  },
  {
    name: "妈咪鸡蛋仔",
    address: "Shop 1A15, G/F, Whampoa Estate, 99 Dock Street, Hung Hom, Hong Kong",
    tags: ["Hong Kong Style", "Snack Shop & Deli"],
    description: ""
  },
  {
    name: "龙凤店",
    address: "Shop 3B, G/F, Kam Wing Mansion, 66 Shui Che Kwun Street, Yuen Long, Hong Kong",
    tags: ["Hong Kong Style", "Sandwich", "Snack Shop & Deli"],
    description: "Popular neighborhood snack shop."
  },
  {
    name: "大澳饼店",
    address: "G/F, 66 Kat Hing Street, Tai O, Hong Kong",
    tags: ["Hong Kong Style", "Bakery"],
    description: ""
  },
  {
    name: "申子居酒屋",
    address: "Shop 1, G/F, Ngai Hing Mansion, 74-76 Hak Po Street, Mong Kok, Hong Kong",
    tags: ["Japanese", "Wine", "Sushi/Sashimi", "Skewer", "Izakaya"],
    description: "Comfortable Japanese wooden decor with oyster pot."
  },
  {
    name: "Yadllie Plate",
    address: "11/F, CTMA Centre, 1N Sai Yeung Choi Street South, Mong Kok, Hong Kong",
    tags: ["Korean", "Korean Fried Chicken"],
    description: "Known for Korean fried chicken."
  },
  {
    name: "Tamarind",
    address: "Shop K&L, G/F, Witty Commercial Building, 1 Tung Choi Street, Mong Kok, Hong Kong",
    tags: ["Thai"],
    description: ""
  },
  {
    name: "Paradise Classic",
    address: "Shop UG09, UG/F, Olympian City 2, 18 Hoi Ting Road, Tai Kok Tsui, Hong Kong",
    tags: ["Singaporean", "Seafood"],
    description: "Singaporean cuisine mixed with Malaysian, Thai and Indonesian styles."
  },
  {
    name: "Grissini",
    address: "2/F, Grand Hyatt Hong Kong, 1 Harbour Road, Wan Chai, Hong Kong",
    tags: ["Italian", "Fine Dining", "Hotel Restaurant"],
    description: "Contemporary Italian cuisine with harbor views."
  },
  {
    name: "Odelice!",
    address: "Shop L407, 4/F, The ONE, 100 Nathan Road, Tsim Sha Tsui, Hong Kong",
    tags: ["French", "Western", "Party Food"],
    description: "Parisian bistro theme with home-style French dishes."
  },
  {
    name: "鱼事者",
    address: "Shop 14, G/F, Victor Court, 14-18 Wang On Road, Fortress Hill, Hong Kong",
    tags: ["International", "Food Stall Noodles", "Noodles/Rice Noodles"],
    description: "Innovative fish-based light meals."
  },
  {
    name: "Nonsense",
    address: "Shop 4, G/F, Sanford Mansion, 143-155 Pak Tai Street, To Kwa Wan, Hong Kong",
    tags: ["International", "Yoshoku"],
    description: "Bar restaurant with multinational ingredients and innovative recipes."
  }
];

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function normalizeTag(tag) {
  return tag
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\//g, " ")
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_\u4e00-\u9fa5]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

const cuisineCategoryDefinitions = {
  cantonese_cuisine: {
    aliases: ["富豪酒家", "六福菜馆", "新同乐", "大班楼", "都爹利会馆", "彭庆记食家"]
  },
  hong_kong_bbq_roast_goose: {
    aliases: ["甘记烧鹅", "一乐烧鹅"]
  },
  hong_kong_seafood_cooked_food_stall: {
    aliases: ["新肥泉海鲜大排档"]
  },
  hong_kong_noodles_cart_noodles: {
    aliases: ["孖宝车仔面", "痴胶鸡", "刘森记面家", "九记牛腩", "永顺沙爹牛肉专门店", "聚来车仔", "兴记猪什专门店", "鱼事者"]
  },
  hong_kong_cha_chaan_teng_ice_cafe: {
    aliases: ["金华冰室", "红茶", "红茶冰室"]
  },
  hong_kong_dim_sum_tea_restaurant: {
    aliases: ["得闲饮茶", "鋿晶馆"]
  },
  hong_kong_clay_pot_rice: {
    aliases: ["忆食尚"]
  },
  hot_pot: {
    aliases: ["三不馆", "一品鸡煲火锅", "大滚友", "陳儀興玫瑰餐廳", "陈仪兴玫瑰餐厅", "船涡 Boat Boat Steam", "船涡"]
  },
  hong_kong_snacks_bakery: {
    aliases: ["妈咪鸡蛋仔", "龙凤店", "大澳饼店"]
  },
  international_cuisine: {
    aliases: ["申子居酒屋", "Yadllie Plate", "Tamarind", "Grissini", "Odelice!", "Nonsense"]
  }
};

const internationalCuisineSubtypeByName = new Map([
  [normalizeName("申子居酒屋"), "japanese"],
  [normalizeName("Yadllie Plate"), "korean"],
  [normalizeName("Tamarind"), "thai"],
  [normalizeName("Grissini"), "italian"],
  [normalizeName("Odelice!"), "french"],
  [normalizeName("Nonsense"), "international_fusion"]
]);

function inferAmenity(tags) {
  const joined = tags.join(" ").toLowerCase();
  if (joined.includes("cafe") || joined.includes("tea restaurant")) return "cafe";
  if (joined.includes("snack") || joined.includes("food stall")) return "fast_food";
  return "restaurant";
}

function inferDistrict(address) {
  const rules = [
    ["central", "Central and Western District"],
    ["wan chai", "Wan Chai District"],
    ["tsim sha tsui", "Yau Tsim Mong District"],
    ["mong kok", "Yau Tsim Mong District"],
    ["jordan", "Yau Tsim Mong District"],
    ["prince edward", "Yau Tsim Mong District"],
    ["yuen long", "Yuen Long District"],
    ["sham shui po", "Sham Shui Po District"],
    ["sai kung", "Sai Kung District"],
    ["tsuen wan", "Tsuen Wan District"],
    ["hung hom", "Kowloon City District"],
    ["to kwa wan", "Kowloon City District"],
    ["fortress hill", "Eastern District"],
    ["tin hau", "Eastern District"],
    ["causeway bay", "Wan Chai District"],
    ["tai o", "Islands District"],
    ["tai kok tsui", "Yau Tsim Mong District"],
    ["san po kong", "Wong Tai Sin District"]
  ];
  const lower = address.toLowerCase();
  for (const [needle, district] of rules) {
    if (lower.includes(needle)) return district;
  }
  return "Unknown";
}

const deletedRestaurantNames = new Set(["香香宫煮 Tasty Hotpot Palace", "Paradise Classic"]);

const discourseTable = [
  { aliases: ["富豪酒家"], sources: ["prestige_cultural"], frames: ["authenticity"] },
  { aliases: ["六福菜馆"], sources: ["prestige_cultural"], frames: ["authenticity"] },
  { aliases: ["新同乐"], sources: ["prestige_cultural"], frames: ["authenticity"] },
  { aliases: ["大班楼"], sources: ["prestige_cultural"], frames: ["authenticity"] },
  { aliases: ["都爹利会馆"], sources: ["prestige_cultural"], frames: ["authenticity"] },
  { aliases: ["彭庆记食家"], sources: ["prestige_cultural"], frames: ["authenticity"] },
  { aliases: ["甘记烧鹅"], sources: ["social_media", "prestige_cultural"], frames: ["authenticity", "trend_hype"] },
  { aliases: ["一乐烧鹅"], sources: ["social_media", "prestige_cultural"], frames: ["authenticity", "trend_hype"] },
  { aliases: ["新肥泉海鲜大排档"], sources: ["local_discourse"], frames: ["everyday_value", "authenticity"] },
  { aliases: ["孖宝车仔面"], sources: ["local_discourse"], frames: ["everyday_value"] },
  { aliases: ["痴胶鸡"], sources: ["tourist", "social_media"], frames: ["trend_hype"] },
  { aliases: ["刘森记面家"], sources: ["local_discourse"], frames: ["authenticity", "everyday_value"] },
  { aliases: ["九记牛腩"], sources: ["local_discourse"], frames: ["authenticity", "everyday_value"] },
  { aliases: ["永顺沙爹牛肉专门店"], sources: ["local_discourse"], frames: ["everyday_value"] },
  { aliases: ["聚来车仔"], sources: ["local_discourse"], frames: ["everyday_value"] },
  { aliases: ["兴记猪什专门店"], sources: ["local_discourse"], frames: ["everyday_value"] },
  { aliases: ["鱼事者"], sources: ["social_media", "prestige_cultural"], frames: ["trend_hype", "authenticity"] },
  { aliases: ["金华冰室"], sources: ["local_discourse"], frames: ["everyday_value", "authenticity"] },
  { aliases: ["红茶", "红茶冰室"], sources: ["local_discourse"], frames: ["everyday_value"] },
  { aliases: ["得闲饮茶"], sources: ["social_media", "tourist"], frames: ["trend_hype"] },
  { aliases: ["鋿晶馆"], sources: ["social_media", "tourist"], frames: ["trend_hype"] },
  { aliases: ["忆食尚"], sources: ["social_media"], frames: ["trend_hype", "everyday_value"] },
  { aliases: ["三不馆"], sources: ["tourist"], frames: ["trend_hype"] },
  { aliases: ["一品鸡煲火锅"], sources: ["local_discourse", "tourist"], frames: ["everyday_value", "trend_hype"] },
  { aliases: ["大滚友"], sources: ["tourist"], frames: ["trend_hype"] },
  { aliases: ["陳儀興玫瑰餐廳", "陈仪兴玫瑰餐厅"], sources: ["tourist"], frames: ["trend_hype"] },
  { aliases: ["船涡 Boat Boat Steam", "船涡"], sources: ["tourist"], frames: ["trend_hype"] },
  { aliases: ["妈咪鸡蛋仔"], sources: ["local_discourse", "tourist"], frames: ["everyday_value", "trend_hype"] },
  { aliases: ["龙凤店"], sources: ["local_discourse"], frames: ["everyday_value"] },
  { aliases: ["大澳饼店"], sources: ["local_discourse"], frames: ["authenticity", "everyday_value"] },
  { aliases: ["申子居酒屋"], sources: ["tourist"], frames: ["trend_hype"] },
  { aliases: ["Yadllie Plate"], sources: ["tourist"], frames: ["trend_hype"] },
  { aliases: ["Tamarind"], sources: ["tourist"], frames: ["trend_hype"] },
  { aliases: ["Grissini"], sources: ["tourist"], frames: ["trend_hype"] },
  { aliases: ["Odelice!"], sources: ["tourist"], frames: ["trend_hype"] },
  { aliases: ["Nonsense"], sources: ["tourist"], frames: ["trend_hype"] }
];
const englishNameTable = [
  { aliases: ["富豪酒家"], name_en: "Fu Ho Restaurant" },
  { aliases: ["六福菜馆"], name_en: "Luk Fook Cuisine" },
  { aliases: ["新同乐"], name_en: "Sun Tung Lok" },
  { aliases: ["大班楼"], name_en: "The Chairman" },
  { aliases: ["都爹利会馆"], name_en: "Duddell's" },
  { aliases: ["彭庆记食家"], name_en: "Pang's Kitchen" },
  { aliases: ["甘记烧鹅"], name_en: "Kam's Roast Goose" },
  { aliases: ["一乐烧鹅"], name_en: "Yat Lok Restaurant" },
  { aliases: ["新肥泉海鲜大排档"], name_en: "Sun Fei Chuen Seafood" },
  { aliases: ["孖宝车仔面"], name_en: "Double Treasure Cart Noodles" },
  { aliases: ["痴胶鸡"], name_en: "Crazy Chicken" },
  { aliases: ["刘森记面家"], name_en: "Lau Sum Kee Noodle Shop" },
  { aliases: ["九记牛腩"], name_en: "Kau Kee Restaurant" },
  { aliases: ["永顺沙爹牛肉专门店"], name_en: "Wing Shun Satay Beef Specialists" },
  { aliases: ["聚来车仔"], name_en: "Kui Lai Cart Noodles" },
  { aliases: ["兴记猪什专门店"], name_en: "Hing Kei Pork Offal Specialists" },
  { aliases: ["鱼事者"], name_en: "Fish Maker" },
  { aliases: ["金华冰室"], name_en: "Kam Wah Cafe" },
  { aliases: ["红茶", "红茶冰室"], name_en: "Red Tea Cafe" },
  { aliases: ["得闲饮茶"], name_en: "Let's Yum Cha" },
  { aliases: ["鋿晶馆"], name_en: "Crystal Kitchen" },
  { aliases: ["忆食尚"], name_en: "Yummy Food" },
  { aliases: ["三不馆"], name_en: "Three Not Restaurant" },
  { aliases: ["一品鸡煲火锅"], name_en: "First Class Chicken Hot Pot" },
  { aliases: ["大滚友"], name_en: "Big Rolling Friend" },
  { aliases: ["陳儀興玫瑰餐廳", "陈仪兴玫瑰餐厅"], name_en: "Chan Yee Hing Rose Restaurant" },
  { aliases: ["船涡 Boat Boat Steam", "船涡"], name_en: "Boat Boat Steam" },
  { aliases: ["妈咪鸡蛋仔"], name_en: "Mommy Egg Waffle" },
  { aliases: ["龙凤店"], name_en: "Dragon Phoenix Shop" },
  { aliases: ["大澳饼店"], name_en: "Tai O Bakery" },
  { aliases: ["申子居酒屋"], name_en: "Shin Ko Izakaya" },
  { aliases: ["Yadllie Plate"], name_en: "Yadllie Plate" },
  { aliases: ["Tamarind"], name_en: "Tamarind" },
  { aliases: ["Grissini"], name_en: "Grissini" },
  { aliases: ["Odelice!"], name_en: "Odelice!" },
  { aliases: ["Nonsense"], name_en: "Nonsense" }
];

function normalizeName(input) {
  return String(input ?? "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const discourseByNormalizedAlias = new Map(
  discourseTable.flatMap((item) =>
    item.aliases.map((alias) => [normalizeName(alias), { sources: item.sources, frames: item.frames }])
  )
);
const cuisineCategoryByNormalizedAlias = new Map(
  Object.entries(cuisineCategoryDefinitions).flatMap(([category, info]) =>
    info.aliases.map((alias) => [normalizeName(alias), category])
  )
);
const englishNameByNormalizedAlias = new Map(
  englishNameTable.flatMap((item) => item.aliases.map((alias) => [normalizeName(alias), item.name_en]))
);

function inferDiscourseFromMapping(name, reviewText) {
  const definition = discourseByNormalizedAlias.get(normalizeName(name)) ?? {
    sources: ["tourist"],
    frames: ["trend_hype"]
  };
  const snippet = String(reviewText ?? "").trim();
  const snippetEvidence = snippet
    ? `PDF review snippet: ${snippet.slice(0, 140)}${snippet.length > 140 ? "..." : ""}`
    : "PDF review snippet was empty for this record.";
  return {
    discourse_source: definition.sources,
    discourse_frame: definition.frames,
    coding_evidence: [
      `Table-based mapping applied. Sources: ${definition.sources.join(" + ")}; Frames: ${definition.frames.join(" + ")}.`,
      snippetEvidence
    ]
  };
}

function inferCuisineFromMapping(name, tags) {
  const normalized = normalizeName(name);
  const category = cuisineCategoryByNormalizedAlias.get(normalized);
  if (!category) {
    return Array.from(new Set(tags.map(normalizeTag).filter(Boolean))).slice(0, 6);
  }
  if (category !== "international_cuisine") return [category];
  const subtype = internationalCuisineSubtypeByName.get(normalized);
  return subtype ? [category, subtype] : [category];
}

async function geocode(name, address) {
  const query = `${name}, ${address}`;
  const url = `${NOMINATIM_URL}?format=jsonv2&limit=1&accept-language=en&q=${encodeURIComponent(query)}`;
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "culinary-discourse-openrice-import/1.0 (local-script)" },
      signal: AbortSignal.timeout(1800)
    });
    if (!response.ok) return null;
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const hit = data[0];
    return {
      lat: Number(hit.lat),
      lng: Number(hit.lon),
      osm_type: hit.osm_type,
      osm_id: Number(hit.osm_id),
      display_name: hit.display_name
    };
  } catch {
    return null;
  }
}

function hashString(input) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h << 5) - h + input.charCodeAt(i);
  return Math.abs(h);
}

function fallbackCoordinates(name, district) {
  const center = districtCenters[district] ?? districtCenters.Unknown;
  const seed = hashString(`${name}::${district}`);
  const x = ((seed % 1000) / 1000 - 0.5) * center.spread;
  const y = (((Math.floor(seed / 1000) % 1000) / 1000) - 0.5) * center.spread;
  return { lat: Number((center.lat + y).toFixed(6)), lng: Number((center.lng + x).toFixed(6)) };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const snippetsRaw = await readFile(REVIEW_SNIPPETS_PATH, "utf8");
  const snippets = JSON.parse(snippetsRaw);
  const reviewsByName = new Map(
    (Array.isArray(snippets.restaurants) ? snippets.restaurants : []).map((item) => [
      normalizeName(String(item.titleText ?? "").replace(/^\d+\s*/, "")),
      String(item.review_text ?? "")
    ])
  );

  const restaurants = [];
  const failures = [];
  let geocodeEnabled = true;
  let consecutiveGeocodeMisses = 0;

  const activeEntries = entries.filter((entry) => !deletedRestaurantNames.has(entry.name));
  for (let i = 0; i < activeEntries.length; i += 1) {
    const entry = activeEntries[i];
    try {
      const geo = geocodeEnabled ? await geocode(entry.name, entry.address) : null;
      if (!geo) {
        consecutiveGeocodeMisses += 1;
        if (consecutiveGeocodeMisses >= 4) geocodeEnabled = false;
      } else {
        consecutiveGeocodeMisses = 0;
      }
      const district = inferDistrict(entry.address);
      const coordinates = geo
        ? { lat: geo.lat, lng: geo.lng }
        : fallbackCoordinates(entry.name, district);
      if (!geo) failures.push({ name: entry.name, reason: "No geocoding match, used district fallback" });

      const cuisine = inferCuisineFromMapping(entry.name, entry.tags);
      const amenity = inferAmenity(entry.tags);
      const reviewText = reviewsByName.get(normalizeName(entry.name)) ?? "";
      const discourse = inferDiscourseFromMapping(entry.name, reviewText);

      restaurants.push({
        id: `openrice-${slugify(entry.name) || String(i + 1)}`,
        name: entry.name,
        name_en: englishNameByNormalizedAlias.get(normalizeName(entry.name)) ?? undefined,
        district,
        coordinates,
        amenity,
        cuisine,
        discourse_source: discourse.discourse_source,
        discourse_frame: discourse.discourse_frame,
        coding_evidence: discourse.coding_evidence,
        address: entry.address,
        opening_hours: null,
        website: null,
        phone: null,
        source: {
          provider: "OpenRice + OpenStreetMap Nominatim",
          osm_type: geo?.osm_type ?? "fallback",
          osm_id: geo?.osm_id ?? 0,
          osm_url:
            geo?.osm_type && geo?.osm_id
              ? `https://www.openstreetmap.org/${geo.osm_type}/${geo.osm_id}`
              : `https://nominatim.openstreetmap.org/ui/search.html?q=${encodeURIComponent(entry.name)}`
        }
      });

      console.log(`[${i + 1}/${activeEntries.length}] ${geo ? "OK" : "FALLBACK"} ${entry.name}`);
    } catch (error) {
      failures.push({ name: entry.name, reason: String(error), hard_fail: true });
      console.log(`[${i + 1}/${activeEntries.length}] FAIL ${entry.name}`);
    }

    // Respect Nominatim usage policy when network geocoding is active.
    await sleep(geocodeEnabled ? 1100 : 30);
  }

  const output = {
    metadata: {
      provider: "OpenRice (user-provided PDF) + OpenStreetMap Nominatim geocoding",
      fetched_at: new Date().toISOString(),
      notes: "Replaced seed data with OpenRice list and discourse labels coded from extracted PDF review text.",
      total_input: activeEntries.length,
      total_clean: restaurants.length,
      failed_geocoding: failures.length,
      review_snippet_source: "data/openrice-review-snippets.json",
      removed_restaurants: Array.from(deletedRestaurantNames)
    },
    restaurants
  };

  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  if (failures.length > 0) {
    const failPath = new URL("../data/openrice.geocode.failures.json", import.meta.url);
    await writeFile(failPath, `${JSON.stringify(failures, null, 2)}\n`, "utf8");
  }

  console.log(`Saved ${restaurants.length} restaurants to ${OUTPUT_PATH.pathname}`);
  if (failures.length > 0) console.log(`Geocode failures: ${failures.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
