import { readFile, writeFile } from "node:fs/promises";

const DATA_PATH = new URL("../data/restaurants.osm.json", import.meta.url);
const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function geocode(query) {
  const url = `${NOMINATIM_URL}?format=jsonv2&limit=1&accept-language=en&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, {
    headers: { "User-Agent": "culinary-discourse-openrice-refresh/1.0 (local-script)" },
    signal: AbortSignal.timeout(2200)
  });
  if (!response.ok) return null;
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  const hit = data[0];
  return {
    lat: Number(hit.lat),
    lng: Number(hit.lon),
    osm_type: hit.osm_type,
    osm_id: Number(hit.osm_id)
  };
}

async function main() {
  const raw = await readFile(DATA_PATH, "utf8");
  const data = JSON.parse(raw);
  const restaurants = Array.isArray(data.restaurants) ? data.restaurants : [];

  let updated = 0;
  let attempted = 0;

  for (const restaurant of restaurants) {
    if (restaurant?.source?.osm_type !== "fallback") continue;
    attempted += 1;
    const query = `${restaurant.name}, ${restaurant.address}, Hong Kong`;
    try {
      const geo = await geocode(query);
      if (!geo) {
        console.log(`MISS ${restaurant.name}`);
      } else {
        restaurant.coordinates = { lat: geo.lat, lng: geo.lng };
        restaurant.source = {
          provider: "OpenRice + OpenStreetMap Nominatim",
          osm_type: geo.osm_type,
          osm_id: geo.osm_id,
          osm_url: `https://www.openstreetmap.org/${geo.osm_type}/${geo.osm_id}`
        };
        updated += 1;
        console.log(`OK ${restaurant.name}`);
      }
    } catch {
      console.log(`FAIL ${restaurant.name}`);
    }
    await sleep(1100);
  }

  data.metadata = {
    ...(data.metadata ?? {}),
    fetched_at: new Date().toISOString(),
    notes: `OpenRice dataset refresh attempted geocoding for ${attempted} fallback entries; updated ${updated}.`,
    geocode_refresh_attempted: attempted,
    geocode_refresh_updated: updated
  };

  await writeFile(DATA_PATH, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  console.log(`Done. attempted=${attempted}, updated=${updated}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
