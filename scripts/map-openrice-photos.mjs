import { readFile, writeFile } from "node:fs/promises";

const DATA_PATH = new URL("../data/restaurants.osm.json", import.meta.url);
const MANIFEST_PATH = new URL("../data/openrice-photo-manifest.json", import.meta.url);
const REPORT_PATH = new URL("../data/openrice-photo-mapping-report.json", import.meta.url);

function normalizeName(input) {
  return String(input ?? "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseTitleName(titleText) {
  return String(titleText ?? "").replace(/^\s*(\d+\s+)+/, "").trim();
}

function extractChineseOnly(input) {
  const hits = String(input ?? "").match(/[\u4e00-\u9fa5]+/g);
  return hits ? hits.join(" ") : "";
}

async function main() {
  const [manifestRaw, dataRaw] = await Promise.all([readFile(MANIFEST_PATH, "utf8"), readFile(DATA_PATH, "utf8")]);
  const manifest = JSON.parse(manifestRaw);
  const data = JSON.parse(dataRaw);
  const restaurants = Array.isArray(data.restaurants) ? data.restaurants : [];
  const matchedRestaurants = Array.isArray(manifest.restaurants) ? manifest.restaurants : [];
  const failures = [];

  const byName = new Map();
  for (const item of matchedRestaurants) {
    const parsedTitle = parseTitleName(item.titleText);
    const payload = { selectedPhotoUrl: item.selectedPhotoUrl, page: item.page, index: item.index, titleText: item.titleText };
    const normalizedTitle = normalizeName(parsedTitle);
    if (normalizedTitle) byName.set(normalizedTitle, payload);
    const chineseOnly = normalizeName(extractChineseOnly(parsedTitle));
    if (chineseOnly && !byName.has(chineseOnly)) byName.set(chineseOnly, payload);
  }

  let mapped = 0;
  for (let i = 0; i < restaurants.length; i += 1) {
    const normalizedName = normalizeName(restaurants[i].name);
    const normalizedChineseName = normalizeName(extractChineseOnly(restaurants[i].name));
    const mappedItem = byName.get(normalizedName) ?? byName.get(normalizedChineseName) ?? null;
    const selected = mappedItem?.selectedPhotoUrl ?? null;
    if (!selected) {
      failures.push({
        restaurant: restaurants[i].name,
        page: mappedItem?.page ?? null,
        manifest_index: mappedItem?.index ?? null,
        reason: "No title-anchored image selected for this restaurant name"
      });
      delete restaurants[i].photo_url;
      continue;
    }
    restaurants[i].photo_url = selected;
    mapped += 1;
  }

  data.metadata = {
    ...(data.metadata ?? {}),
    fetched_at: new Date().toISOString(),
    notes: `Strict page mapping assigned ${mapped}/${restaurants.length} photos from title-anchored PDF selection.`
  };

  const report = {
    mapped,
    total: restaurants.length,
    matchedFromManifest: byName.size,
    failed: failures.length,
    failures
  };
  await writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(`Mapped photos: ${mapped}/${restaurants.length}; failures=${failures.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
