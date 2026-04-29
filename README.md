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

