import { writeFile } from "node:fs/promises";

const OVERPASS_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.openstreetmap.fr/api/interpreter"
];
const OUTPUT_PATH = new URL("../data/restaurants.osm.json", import.meta.url);

const query = `
[out:json][timeout:45];
(
  node["amenity"~"restaurant|cafe|fast_food|food_court"](22.18,113.84,22.55,114.45);
  way["amenity"~"restaurant|cafe|fast_food|food_court"](22.18,113.84,22.55,114.45);
);
out center 500;
`;

function pickDistrict(tags) {
  return (
    tags["addr:district"] ||
    tags["addr:subdistrict"] ||
    tags["addr:suburb"] ||
    tags["addr:city_district"] ||
    tags["addr:city"] ||
    "Unknown"
  );
}

function splitCuisine(value) {
  if (!value) return [];
  return value
    .split(";")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function mapElement(element) {
  const tags = element.tags ?? {};
  const lat = element.lat ?? element.center?.lat;
  const lng = element.lon ?? element.center?.lon;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  const name = tags.name?.trim();
  if (!name) return null;

  const type = element.type;
  const osmId = element.id;
  const amenity = tags.amenity ?? "restaurant";
  const cuisine = splitCuisine(tags.cuisine);
  const district = pickDistrict(tags);
  const street = tags["addr:street"] ?? "";
  const houseNumber = tags["addr:housenumber"] ?? "";
  const address = [houseNumber, street].filter(Boolean).join(" ").trim() || tags["addr:full"] || "N/A";

  return {
    id: `${type}-${osmId}`,
    name,
    district,
    coordinates: { lat, lng },
    amenity,
    cuisine,
    address,
    opening_hours: tags.opening_hours ?? null,
    website: tags.website ?? tags["contact:website"] ?? null,
    phone: tags.phone ?? tags["contact:phone"] ?? null,
    source: {
      provider: "OpenStreetMap",
      osm_type: type,
      osm_id: osmId,
      osm_url: `https://www.openstreetmap.org/${type}/${osmId}`
    }
  };
}

function dedupeByNameAndLocation(items) {
  const seen = new Set();
  const output = [];
  for (const item of items) {
    const key = `${item.name.toLowerCase()}::${item.coordinates.lat.toFixed(5)}::${item.coordinates.lng.toFixed(5)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    output.push(item);
  }
  return output;
}

function score(item) {
  let points = 0;
  if (item.cuisine.length > 0) points += 2;
  if (item.address !== "N/A") points += 1;
  if (item.opening_hours) points += 1;
  if (item.website) points += 1;
  return points;
}

async function main() {
  const body = new URLSearchParams({ data: query.trim() });
  let response = null;
  let lastError = null;
  for (const endpoint of OVERPASS_URLS) {
    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
      });
      if (response.ok) break;
      lastError = new Error(`Overpass request failed: ${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
  }

  if (!response || !response.ok) {
    throw lastError ?? new Error("Overpass request failed on all endpoints.");
  }

  const payload = await response.json();
  const elements = Array.isArray(payload.elements) ? payload.elements : [];
  const mapped = elements.map(mapElement).filter(Boolean);
  const clean = dedupeByNameAndLocation(mapped)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 160);

  const output = {
    metadata: {
      provider: "OpenStreetMap / Overpass API",
      fetched_at: new Date().toISOString(),
      query_bbox: [22.18, 113.84, 22.55, 114.45],
      total_raw: elements.length,
      total_clean: clean.length
    },
    restaurants: clean
  };

  await writeFile(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Saved ${clean.length} records to ${OUTPUT_PATH.pathname}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
