export type DiscourseLevel = "high" | "medium" | "low";
export type Audience = "local" | "tourist" | "mixed";

export type Restaurant = {
  id: string;
  name: string;
  district: "Central" | "Mong Kok" | "Tsim Sha Tsui" | "Sham Shui Po";
  coordinates: { lat: number; lng: number };
  dish: string;
  description: string;
  image: string;
  discourse_tags: {
    authenticity: DiscourseLevel;
    trendiness: DiscourseLevel;
    audience: Audience;
  };
  keywords: string[];
};

// Mock dataset designed to feel like discourse data:
// - tourists tend to highlight "must-try", convenience, photo ops
// - locals emphasize routine, value, craft, lineage
// - social media / mixed discourse amplifies aesthetics and virality
export const restaurants: Restaurant[] = [
  {
    id: "central-1",
    name: "Lin Heung Tea House (蓮香樓)",
    district: "Central",
    coordinates: { lat: 22.2847, lng: 114.1526 },
    dish: "Dim sum (pushcart service)",
    description:
      "Often framed as a time capsule: pushcarts, shared tables, and fast rhythms. Tourists narrate the ‘old Hong Kong’ scene; locals debate classics and timing.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lin_Heung_Tea_House_(20190302113618).jpg",
    discourse_tags: { authenticity: "high", trendiness: "medium", audience: "mixed" },
    keywords: ["legacy shop", "pushcarts", "crowded", "old Hong Kong"]
  },
  {
    id: "central-2",
    name: "Yat Lok Roast Goose (一樂燒鵝)",
    district: "Central",
    coordinates: { lat: 22.2831, lng: 114.1548 },
    dish: "Roast goose (叉燒/燒鵝飯)",
    description:
      "A benchmark shop in food discourse: tourists label it ‘iconic’; locals compare crisp skin, fat rendering, and consistency across visits.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/HK_%E4%B8%AD%E7%92%B0_Central_%E5%A3%AB%E4%B8%B9%E5%88%A9%E8%A1%97_Stanley_Street_shop_%E4%B8%80%E6%A8%82%E7%87%92%E9%B5%9D_Yat_Lok_Restaurant_June_2019_IX2_01.jpg",
    discourse_tags: { authenticity: "high", trendiness: "medium", audience: "mixed" },
    keywords: ["iconic", "crispy skin", "queue", "benchmark"]
  },
  {
    id: "central-3",
    name: "Mak's Noodle (Mak An Kee) — Central",
    district: "Central",
    coordinates: { lat: 22.2837, lng: 114.1568 },
    dish: "Wonton noodles (雲吞麵)",
    description:
      "Tourists repeat ‘must-try wonton noodles’; local discourse gets technical—shrimp bite, noodle springiness, and broth clarity.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/%E9%BA%A5%E5%A5%80%E8%A8%98_(2017)_-_599.jpg",
    discourse_tags: { authenticity: "high", trendiness: "medium", audience: "mixed" },
    keywords: ["must-try", "craft", "springy noodles", "queue"]
  },
  {
    id: "central-4",
    name: "Tai Cheong Bakery (Central)",
    district: "Central",
    coordinates: { lat: 22.2832, lng: 114.1541 },
    dish: "Egg tarts (蛋撻)",
    description:
      "Snack discourse centers on flakiness and warmth. Tourists treat it as a souvenir ritual; locals calibrate by crust layers and custard wobble.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tai_Cheong_Bakery_(Hong_Kong).jpg",
    discourse_tags: { authenticity: "medium", trendiness: "high", audience: "tourist" },
    keywords: ["classic", "takeaway", "flaky", "must-buy"]
  },

  {
    id: "mk-1",
    name: "Kam Wah Café & Bakery (金華冰廳)",
    district: "Mong Kok",
    coordinates: { lat: 22.3249, lng: 114.1675 },
    dish: "Pineapple bun with butter (菠蘿油)",
    description:
      "A cha chaan teng staple framed through everyday desire: warm bun + cold butter. Social media zooms on the butter melt; locals talk value and speed.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/%E6%97%BA%E8%A7%92%E5%BC%BC%E8%A1%97_43-49_%E8%99%9F_43-49_Bute_Street_%E9%87%91%E8%8F%AF%E5%86%B0%E5%BB%B3_Kam_Wah_Cafe_%E9%80%9A%E8%8F%9C%E8%A1%97_Tung_Choi_Street%2C_2018.jpg",
    discourse_tags: { authenticity: "high", trendiness: "high", audience: "mixed" },
    keywords: ["iconic", "butter melt", "cha chaan teng", "queue"]
  },
  {
    id: "mk-2",
    name: "One Dim Sum (一點心) — Prince Edward",
    district: "Mong Kok",
    coordinates: { lat: 22.3255, lng: 114.1686 },
    dish: "Shrimp dumplings / siu mai (點心)",
    description:
      "Tourist discourse highlights ‘Michelin-level on a budget’; local talk focuses on queue management, portion-to-price, and consistency across rush hours.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/One_Dim_Sum%2C_Michelin-Star_Fast_Food_Dim_Sum_in_Hong_Kong_SML.20120818.IP3_(7809374102).jpg",
    discourse_tags: { authenticity: "high", trendiness: "high", audience: "mixed" },
    keywords: ["cheap eats", "value", "queue", "dim sum"]
  },
  {
    id: "mk-3",
    name: "Semua Semua (蘇媽馬來西亞茶餐室) — Mong Kok",
    district: "Mong Kok",
    coordinates: { lat: 22.3193, lng: 114.1682 },
    dish: "Malaysia-style kopitiam dishes",
    description:
      "A neighborhood ‘kopitiam’ discourse: signage, comfort, and cross-border taste memories. Social posts frame it as a colorful find; locals read it as reliable and filling.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/HK_MK_%E6%97%BA%E8%A7%92_Mong_Kok_%E4%B8%8A%E6%B5%B7%E8%A1%97_618_Shanghai_Street_%E8%98%87%E5%AA%BD_%E8%98%87%E5%AA%BD%E9%A6%AC%E4%BE%86%E8%A5%BF%E4%BA%9E%E8%8C%B6%E9%A4%90%E5%AE%A4_Kedai_Kopi_Semua_Semua_restaurant_December_2022_Px3_02.jpg",
    discourse_tags: { authenticity: "medium", trendiness: "medium", audience: "mixed" },
    keywords: ["neighborhood", "kopitiam", "comfort", "hidden gem"]
  },
  {
    id: "mk-4",
    name: "Tsim Chai Kee Noodle (沾仔記) — Mong Kok",
    district: "Mong Kok",
    coordinates: { lat: 22.3177, lng: 114.1706 },
    dish: "Noodle bowls (wonton / beef brisket)",
    description:
      "A ‘fast noodle’ discourse: efficiency and choice. Tourists narrate it as a local staple; locals compare broth intensity and portion-value tradeoffs.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/HK_%E4%B8%AD%E7%92%B0_Central_%E5%A8%81%E9%9D%88%E9%A0%93%E8%A1%97_98_Wellington_Street_Jade_Centre_shop_Cochrane_Street_October_2021_SS2_04.jpg",
    discourse_tags: { authenticity: "high", trendiness: "medium", audience: "local" },
    keywords: ["no-frills", "quick lunch", "value", "routine dining"]
  },
  {
    id: "mk-5",
    name: "Tao Heung (稻香) — Mong Kok",
    district: "Mong Kok",
    coordinates: { lat: 22.3158, lng: 114.1711 },
    dish: "Yum cha (dim sum brunch)",
    description:
      "A ‘family yum cha’ discourse: big tables, tea refills, and weekend routines. Tourists read it as cultural immersion; locals emphasize convenience and familiarity.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/HK_MK_%E6%97%BA%E8%A7%92_Mong_Kok_%E5%BD%8C%E6%95%A6%E9%81%93_610_Nathan_Road_%E8%8D%B7%E6%9D%8E%E6%B4%BB%E5%95%86%E6%A5%AD%E4%B8%AD%E5%BF%83_Hollywood_Plaza_mall_%E7%A8%BB%E9%A6%99%E8%8C%B6%E5%B1%85_Tao_Heung_Tea_House_May_2022_Px3_01.jpg",
    discourse_tags: { authenticity: "medium", trendiness: "medium", audience: "local" },
    keywords: ["family", "weekend", "routine dining", "yum cha"]
  },

  {
    id: "tst-1",
    name: "The Peninsula Lobby (Afternoon Tea)",
    district: "Tsim Sha Tsui",
    coordinates: { lat: 22.2953, lng: 114.1718 },
    dish: "Afternoon tea set",
    description:
      "A highly performative tourist discourse: architecture, status, and photo etiquette. Value is narrated through ‘experience’ more than taste.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Afternoon_Tea_in_the_Peninsula%2C_Hong_Kong.jpg",
    discourse_tags: { authenticity: "low", trendiness: "high", audience: "tourist" },
    keywords: ["tourist hotspot", "heritage", "dress up", "reservations"]
  },
  {
    id: "tst-2",
    name: "Home Sister Family Hotpot (家嫂雞煲火鍋) — Tsim Sha Tsui",
    district: "Tsim Sha Tsui",
    coordinates: { lat: 22.2984, lng: 114.1734 },
    dish: "Chicken hotpot (雞煲火鍋)",
    description:
      "A hotpot discourse built on communal heat: steam, dipping rituals, and ‘late-night groups.’ Social media loves the bubbling pot; locals frame it as dependable gathering food.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/HK_TST_%E6%A0%BC%E8%98%AD%E4%B8%AD%E5%BF%83_Grand_Centre_%E5%AE%B6%E5%AB%82_%E9%9B%9E%E7%85%B2%E7%81%AB%E9%8D%8B_Home_Sister_Family_Hotpot_Restaurant_%E9%A3%B2%E5%93%81_drink_%E7%AB%B9%E8%94%97%E6%B0%B4_March_2023_Px3_01.jpg",
    discourse_tags: { authenticity: "medium", trendiness: "high", audience: "mixed" },
    keywords: ["late-night", "communal", "sizzle", "crowded"]
  },
  {
    id: "tst-3",
    name: "Tien Heung Lau Restaurant (天香樓) — Tsim Sha Tsui",
    district: "Tsim Sha Tsui",
    coordinates: { lat: 22.3041, lng: 114.1708 },
    dish: "Cantonese restaurant dining",
    description:
      "A neighborhood Cantonese discourse: classic dishes, signage recognition, and regulars. Tourists read it as ‘local dining’; locals read it as practical and familiar.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/HK_TST_%E5%B0%96%E6%B2%99%E5%92%80_Tsim_Sha_Tsui_%E6%9F%AF%E5%A3%AB%E7%94%B8%E8%B7%AF_Austin_Avenue_in_September_2022_Px3_18.jpg",
    discourse_tags: { authenticity: "medium", trendiness: "medium", audience: "mixed" },
    keywords: ["local dining", "classic", "practical", "regulars"]
  },
  {
    id: "tst-4",
    name: "A1 Bakery (Tsim Sha Tsui)",
    district: "Tsim Sha Tsui",
    coordinates: { lat: 22.2972, lng: 114.1721 },
    dish: "Milk bread / buns (bakery takeaway)",
    description:
      "A convenience discourse: quick grab-and-go in dense pedestrian flows. Locals frame it as practical; tourists treat it as a ‘Japanese-style HK snack’ stop.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/HK_YTMD_%E5%B0%96%E6%B2%99%E5%92%80_TST_East_%E5%B0%96%E6%9D%B1%E7%AB%99_MTR_Station_concourse_shop_A-1_Bakery_May_2022_Px3_01.jpg",
    discourse_tags: { authenticity: "low", trendiness: "medium", audience: "mixed" },
    keywords: ["takeaway", "near transit", "convenient", "snack"]
  },
  {
    id: "tst-5",
    name: "Temple Street Night Market Snack Stalls (Jordan/TST edge)",
    district: "Tsim Sha Tsui",
    coordinates: { lat: 22.3051, lng: 114.1700 },
    dish: "Skewers & street snacks",
    description:
      "A night-economy discourse: neon, spice, bargaining, and crowd density. Tourists post ‘HK after dark’; locals read it as seasonal, noisy, and practical.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Temple_Street_Night_Market%2C_Kowloon%2C_Hong_Kong_3.jpg",
    discourse_tags: { authenticity: "medium", trendiness: "high", audience: "mixed" },
    keywords: ["night market", "after dark", "street snack", "crowded"]
  },

  {
    id: "ssp-1",
    name: "Tim Ho Wan (添好運) — Sham Shui Po (original area)",
    district: "Sham Shui Po",
    coordinates: { lat: 22.3313, lng: 114.1603 },
    dish: "BBQ pork buns (叉燒包) & dim sum",
    description:
      "A ‘Michelin at street prices’ discourse that travels globally. Tourists chase the famous buns; locals debate whether hype changes taste and queues.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tim_Ho_Wan_restaurant_at_Sham_Shui_Po_(20190126130901).jpg",
    discourse_tags: { authenticity: "high", trendiness: "high", audience: "mixed" },
    keywords: ["tourist hotspot", "cheap eats", "queue", "famous buns"]
  },
  {
    id: "ssp-2",
    name: "Pho Bo Vietnamese Restaurant (越萊) — Sham Shui Po",
    district: "Sham Shui Po",
    coordinates: { lat: 22.3296, lng: 114.1639 },
    dish: "Pho & Vietnamese noodles",
    description:
      "A cross-neighborhood discourse of comfort: fragrant broth, herbs, and value. Tourists frame it as ‘unexpected HK diversity’; locals frame it as everyday lunch stability.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/HK_SSP_%E6%B7%B1%E6%B0%B4%E5%9F%97_Sham_Shui_Po_%E7%A6%8F%E6%A6%AE%E8%A1%97_124_Fuk_Wing_Street_%E8%B6%8A%E8%90%8A_Pho_BO_Vietnamese_Restaurant_near_%E6%AC%BD%E5%B7%9E%E8%A1%97_Yen_Chow_Street_June_2022_Px3_01.jpg",
    discourse_tags: { authenticity: "medium", trendiness: "medium", audience: "local" },
    keywords: ["value", "comfort", "no-frills", "routine dining"]
  },
  {
    id: "ssp-3",
    name: "Kwan Kee Claypot Rice (坤記煲仔飯)",
    district: "Sham Shui Po",
    coordinates: { lat: 22.3320, lng: 114.1637 },
    dish: "Claypot rice (煲仔飯)",
    description:
      "A ‘wok hei + crispy rice’ discourse: timing, scrape sound, and topping choices. Social media loves the sizzle; locals care about texture and smoke.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/HK_SYP_%E8%A5%BF%E7%87%9F%E7%9B%A4_Sai_Ying_Pun_%E6%A1%82%E9%A6%99%E8%A1%97_Kwai_Heung_Street_shop_%E5%9D%A4%E8%A8%98_%E9%A4%90%E5%BB%B3_restaurant_June_2020_SS2_01.jpg",
    discourse_tags: { authenticity: "high", trendiness: "high", audience: "mixed" },
    keywords: ["wok hei", "sizzle", "queue", "crispy rice"]
  },
  {
    id: "ssp-4",
    name: "Man Kee Cart Noodle (文記車仔麵)",
    district: "Sham Shui Po",
    coordinates: { lat: 22.3306, lng: 114.1616 },
    dish: "Cart noodles (車仔麵)",
    description:
      "A choose-your-own discourse: toppings list as local shorthand. Tourists frame it as ‘build your bowl’; locals talk broth strength, add-ons, and value.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Man_Kee_Cart_Noodle_(20190304170055).jpg",
    discourse_tags: { authenticity: "high", trendiness: "medium", audience: "mixed" },
    keywords: ["customizable", "cheap eats", "no-frills", "street staple"]
  },
  {
    id: "ssp-5",
    name: "Kwan Kee Store (坤記糕品專家)",
    district: "Sham Shui Po",
    coordinates: { lat: 22.3307, lng: 114.1623 },
    dish: "Traditional pastries & desserts",
    description:
      "A heritage-snack discourse: old-school sweets framed through nostalgia and texture. Tourists call it a ‘hidden gem’; locals treat it as a reliable after-meal ritual.",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Hong_Kong_Traditional_Pastries_and_Desserts_from_Kwan_Kee_Store%2C_Sum_Shui_Po.jpg",
    discourse_tags: { authenticity: "high", trendiness: "medium", audience: "mixed" },
    keywords: ["hidden gem", "nostalgia", "traditional", "after meal"]
  }
];

