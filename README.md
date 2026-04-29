# Culinary Discourse: A Source-Backed Hong Kong Food Map

An interactive platform that combines:

- Map-based exploration (Hong Kong-centered)
- Source-backed OSM records (district/amenity/cuisine filters)
- A clean, modern, card-first UI inspired by Xiaohongshu / Instagram

## Tech stack

- Next.js (App Router)
- React
- Tailwind CSS
- Leaflet + React Leaflet (OpenStreetMap tiles; no token needed)

## Features

- **Interactive map** with real OSM-seeded restaurants in Hong Kong
- **Filter system**: district / amenity / cuisine
- **Visual encoding**: marker color by amenity type
- **Popup cards**: address + source metadata + cuisine tags + OSM link
- **Anonymous comments** (Supabase): per-restaurant visitor comments with basic anti-spam checks
- **Academic pages**:
  - `/tips`: how to read the map and source notes
  - `/insights`: 4 written insights + lightweight bar chart
  - `/about`: data source notes, quality caveats, and reproducibility approach

## Refresh real data

Run:

```bash
node scripts/fetch-osm-restaurants.mjs
```

This regenerates `data/restaurants.osm.json` from Overpass (when network is available).

## Project structure

```
app/
  page.tsx
  tips/page.tsx
  insights/page.tsx
  about/page.tsx
components/
  Map.tsx
  FilterPanel.tsx
  RestaurantCard.tsx
data/
  restaurants.ts
```

## Run locally

### 1) Install Node.js + npm

This project needs a normal Node.js install that includes `npm` (the Node bundled inside some editors may not ship with npm).

- Install Node LTS from the official website, then reopen your terminal.

### 2) Install deps

From the project folder:

```bash
cd culinary-discourse
npm install
```

### 3) Start dev server

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Supabase setup (anonymous restaurant comments)

1) Create a Supabase project and copy your project URL and keys.

2) Add environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
COMMENTS_IP_SALT=change-this-random-string
# Optional custom blocked words, comma-separated:
# COMMENTS_BLOCKLIST=spam,scam,fake,fraud,垃圾,骗子
```

3) Run SQL migration in Supabase SQL editor:

- `supabase/migrations/001_comments.sql`

4) Restart the app and open any restaurant card to view or post comments.

