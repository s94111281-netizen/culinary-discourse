"use client";

import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import type { Restaurant } from "@/data/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";

function markerColor() {
  return { bg: "#8B5CF6", ring: "rgba(139,92,246,0.35)" };
}

function markerIcon(active: boolean) {
  const c = markerColor();
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
      // Keep the map focused on HK but leave enough room for popup auto-pan near edges.
      L.latLngBounds(
        // Southwest corner
        [22.105, 113.79],
        // Northeast corner
        [22.61, 114.5]
      ),
    []
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const markerRefs = useRef<Record<string, L.Marker>>(Object.create(null));

  function FocusSelectedMarker() {
    const map = useMap();

    useEffect(() => {
      if (!selectedId) return;
      const marker = markerRefs.current[selectedId];
      if (!marker) return;
      map.flyTo(marker.getLatLng(), Math.max(map.getZoom(), 14), {
        duration: 0.5
      });
      marker.openPopup();
    }, [map, selectedId, restaurants]);

    return null;
  }

  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-border">
      <MapContainer
        center={[hk.lat, hk.lng]}
        zoom={12.8}
        scrollWheelZoom
        className="h-full w-full"
        maxBounds={hkBounds}
        maxBoundsViscosity={0.85}
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
          const icon = markerIcon(active);

          return (
            <Marker
              key={r.id}
              position={[r.coordinates.lat, r.coordinates.lng]}
              icon={icon}
              ref={(node) => {
                if (node) markerRefs.current[r.id] = node;
                else delete markerRefs.current[r.id];
              }}
              eventHandlers={{
                click: () => onSelect(r.id),
                mouseover: () => setHoveredId(r.id),
                mouseout: () => setHoveredId((cur) => (cur === r.id ? null : cur))
              }}
            >
              <Popup
                closeButton={false}
                autoPan
                keepInView
                autoPanPadding={[32, 32]}
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
        <FocusSelectedMarker />
      </MapContainer>
    </div>
  );
}

