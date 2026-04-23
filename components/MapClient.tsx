"use client";

import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import { useMemo, useState } from "react";
import type { Restaurant } from "@/data/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";

type Audience = Restaurant["discourse_tags"]["audience"];

function audienceColor(audience: Audience) {
  switch (audience) {
    case "local":
      return { bg: "#10B981", ring: "rgba(16,185,129,0.35)" }; // emerald
    case "tourist":
      return { bg: "#F43F5E", ring: "rgba(244,63,94,0.35)" }; // rose
    case "mixed":
      return { bg: "#F59E0B", ring: "rgba(245,158,11,0.35)" }; // amber
  }
}

function markerIcon(audience: Audience, active: boolean) {
  const c = audienceColor(audience);
  const size = active ? 18 : 14;

  return L.divIcon({
    className: "cd-marker",
    html: `<span style="
      display:inline-block;
      width:${size}px;height:${size}px;
      border-radius:9999px;
      background:${c.bg};
      box-shadow:0 10px 24px rgba(17,24,39,0.18);
      outline: 5px solid ${active ? c.ring : "rgba(0,0,0,0.0)"};
      transition: transform 120ms ease, outline-color 120ms ease;
      transform: translate3d(0,0,0) scale(${active ? 1.08 : 1.0});
    "></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)]
  });
}

export default function MapClient({
  restaurants,
  selectedId,
  onSelect
}: {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const hk = useMemo(() => ({ lat: 22.3193, lng: 114.1694 }), []);
  // Hong Kong bounds (approx). Used to keep the map strictly within HK.
  const hkBounds = useMemo(
    () =>
      L.latLngBounds(
        // Southwest corner
        [22.135, 113.84],
        // Northeast corner
        [22.57, 114.45]
      ),
    []
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="h-[70vh] w-full overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-border sm:h-[78vh]">
      <MapContainer
        center={[hk.lat, hk.lng]}
        zoom={12.8}
        scrollWheelZoom
        className="h-full w-full"
        maxBounds={hkBounds}
        maxBoundsViscosity={1.0}
        minZoom={12}
        maxZoom={17}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          noWrap
        />

        {restaurants.map((r) => {
          const active = selectedId === r.id || hoveredId === r.id;
          const icon = markerIcon(r.discourse_tags.audience, active);

          return (
            <Marker
              key={r.id}
              position={[r.coordinates.lat, r.coordinates.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelect(r.id),
                mouseover: () => setHoveredId(r.id),
                mouseout: () => setHoveredId((cur) => (cur === r.id ? null : cur))
              }}
            >
              <Popup
                closeButton={false}
                autoPan
                maxWidth={360}
                className="cd-popup"
                eventHandlers={{
                  remove: () => onSelect(null)
                }}
              >
                <RestaurantCard restaurant={r} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

