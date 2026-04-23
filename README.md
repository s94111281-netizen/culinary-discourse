# Culinary Discourse: A Discourse-Driven Hong Kong Food Map

An academic-style interactive platform that combines:

- Map-based exploration (Hong Kong-centered)
- Discourse analysis encodings (audience-colored markers + coded tags)
- A clean, modern, card-first UI inspired by Xiaohongshu / Instagram

## Tech stack

- Next.js (App Router)
- React
- Tailwind CSS
- Leaflet + React Leaflet (OpenStreetMap tiles; no token needed)

## Features

- **Interactive map** with 20 realistic mock restaurants across Central, Mong Kok, Tsim Sha Tsui, Sham Shui Po
- **Discourse filter system**: authenticity / trendiness / audience → map updates instantly
- **Visual encoding**:
  - Local = green markers
  - Tourist = red markers
  - Mixed = yellow markers
- **Popup cards**: image + dish + short discourse description + badges + keywords
- **Academic pages**:
  - `/insights`: 4 written insights + lightweight bar chart
  - `/about`: discourse analysis explanation + (mock) data sources + interpretation notes

## Project structure

```
app/
  page.tsx
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

