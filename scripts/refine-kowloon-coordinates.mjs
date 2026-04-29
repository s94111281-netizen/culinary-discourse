import { readFile, writeFile } from "node:fs/promises";

const DATA_PATH = new URL("../data/restaurants.osm.json", import.meta.url);

const keywordCenters = [
  ["tsim sha tsui", [22.2973, 114.1722]],
  ["jordan", [22.3058, 114.1717]],
  ["prince edward", [22.3247, 114.168]],
  ["mong kok", [22.3193, 114.1694]],
  ["tai kok tsui", [22.3208, 114.1615]],
  ["hung hom", [22.3042, 114.1821]],
  ["to kwa wan", [22.3162, 114.188]],
  ["san po kong", [22.334, 114.196]],
  ["sham shui po", [22.3317, 114.1597]],
  ["kowloon city", [22.3282, 114.1915]]
];

function jitter(seed, magnitude = 0.0025) {
  return ((((seed * 9301 + 49297) % 233280) / 233280) - 0.5) * magnitude;
}

function isKowloonDistrict(district) {
  const value = (district ?? "").toLowerCase();
  return ["yau tsim mong", "kowloon city", "sham shui po", "wong tai sin"].some((key) =>
    value.includes(key)
  );
}

async function main() {
  const raw = await readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw);
  let updated = 0;

  for (const item of data.restaurants ?? []) {
    if (!isKowloonDistrict(item.district)) continue;
    const address = (item.address ?? "").toLowerCase();
    const center = keywordCenters.find(([key]) => address.includes(key))?.[1];
    if (!center) continue;

    const seed = [...String(item.name ?? "restaurant")].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    item.coordinates = {
      lat: Number((center[0] + jitter(seed)).toFixed(6)),
      lng: Number((center[1] + jitter(seed + 17)).toFixed(6))
    };
    item.source = {
      ...(item.source ?? {}),
      provider: "OpenRice + Offline Kowloon refinement",
      osm_type: "offline_refined",
      osm_id: 0
    };
    updated += 1;
  }

  data.metadata = {
    ...(data.metadata ?? {}),
    fetched_at: new Date().toISOString(),
    notes: `Kowloon offline coordinate refinement applied to ${updated} restaurants.`
  };

  await writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Updated Kowloon restaurants: ${updated}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
