"use client";

import "leaflet/dist/leaflet.css";

import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import type { Restaurant } from "@/data/restaurants";
import { RestaurantCard } from "@/components/RestaurantCard";

function markerColor(isTripStop: boolean) {
  if (isTripStop) {
    return { bg: "#F97316", ring: "rgba(249,115,22,0.38)" };
  }
  return { bg: "#8B5CF6", ring: "rgba(139,92,246,0.35)" };
}

function markerIcon(active: boolean, isTripStop: boolean) {
  const c = markerColor(isTripStop);
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
  onSelect,
  tripMode,
  tripStopIds,
  onTripStatsChange,
  tripOptimizeRequestKey,
  onTripOrderOptimized,
  onTripOptimizeError
}: {
  restaurants: Restaurant[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  tripMode: boolean;
  tripStopIds: string[];
  onTripStatsChange: (stats: { distanceKm: number; durationMin: number } | null) => void;
  tripOptimizeRequestKey: number;
  onTripOrderOptimized: (ids: string[]) => void;
  onTripOptimizeError: (message: string) => void;
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
  const handledOptimizeRequestRef = useRef(0);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [singleRoute, setSingleRoute] = useState<L.LatLngExpression[]>([]);
  const [singleRouteDistanceKm, setSingleRouteDistanceKm] = useState<number | null>(null);
  const [singleRouteDurationMin, setSingleRouteDurationMin] = useState<number | null>(null);
  const [singleRouteLoading, setSingleRouteLoading] = useState(false);
  const [singleRouteError, setSingleRouteError] = useState<string | null>(null);
  const [singleRouteEnabled, setSingleRouteEnabled] = useState(false);
  const [tripRoute, setTripRoute] = useState<L.LatLngExpression[]>([]);
  const [tripRouteLoading, setTripRouteLoading] = useState(false);
  const [tripRouteError, setTripRouteError] = useState<string | null>(null);
  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === selectedId) ?? null,
    [restaurants, selectedId]
  );
  const tripStops = useMemo(
    () =>
      tripStopIds
        .map((id) => restaurants.find((restaurant) => restaurant.id === id))
        .filter((item): item is Restaurant => Boolean(item)),
    [restaurants, tripStopIds]
  );

  async function fetchRoute(
    points: Array<{ lat: number; lng: number }>,
    signal: AbortSignal
  ): Promise<{ path: L.LatLngExpression[]; distanceKm: number; durationMin: number }> {
    const coords = points.map((point) => `${point.lng},${point.lat}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Route API returned ${response.status}`);
    const payload = (await response.json()) as {
      routes?: Array<{ geometry?: { coordinates?: number[][] }; distance?: number; duration?: number }>;
    };
    const firstRoute = payload.routes?.[0];
    if (!firstRoute?.geometry?.coordinates || firstRoute.geometry.coordinates.length === 0) {
      throw new Error("No route geometry returned.");
    }
    return {
      path: firstRoute.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
      distanceKm: (firstRoute.distance ?? 0) / 1000,
      durationMin: (firstRoute.duration ?? 0) / 60
    };
  }

  async function fetchOptimizedTripOrder(
    points: Array<{ lat: number; lng: number }>,
    ids: string[],
    signal: AbortSignal
  ): Promise<string[]> {
    const coords = points.map((point) => `${point.lng},${point.lat}`).join(";");
    // Public OSRM server does not support some advanced trip params (returns NotImplemented),
    // so use a broadly supported query to keep optimization stable in production.
    const url = `https://router.project-osrm.org/trip/v1/driving/${coords}?overview=false&steps=false`;
    const response = await fetch(url, { signal });
    if (!response.ok) throw new Error(`Trip API returned ${response.status}`);
    const payload = (await response.json()) as {
      waypoints?: Array<{ waypoint_index?: number }>;
    };
    if (!payload.waypoints || payload.waypoints.length !== ids.length) {
      throw new Error("Trip API did not return a complete waypoint order.");
    }

    const ranked = payload.waypoints
      .map((waypoint, inputIndex) => ({
        id: ids[inputIndex],
        order: waypoint.waypoint_index ?? Number.MAX_SAFE_INTEGER
      }))
      .sort((a, b) => a.order - b.order)
      .map((item) => item.id);
    return ranked;
  }

  function requestUserLocation() {
    setSingleRouteError(null);
    if (!navigator.geolocation) {
      setSingleRouteError("Your browser does not support geolocation.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      () => {
        setSingleRouteError("Unable to access your location. Please allow location permission.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }

  useEffect(() => {
    if (!singleRouteEnabled || !userLocation || !selectedRestaurant) {
      setSingleRoute([]);
      setSingleRouteDistanceKm(null);
      setSingleRouteDurationMin(null);
      return;
    }
    const controller = new AbortController();
    setSingleRouteLoading(true);
    setSingleRouteError(null);
    fetchRoute(
      [userLocation, selectedRestaurant.coordinates],
      controller.signal
    )
      .then((route) => {
        setSingleRoute(route.path);
        setSingleRouteDistanceKm(route.distanceKm);
        setSingleRouteDurationMin(route.durationMin);
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name === "AbortError") return;
        setSingleRoute([]);
        setSingleRouteDistanceKm(null);
        setSingleRouteDurationMin(null);
        setSingleRouteError("Could not fetch route right now.");
      })
      .finally(() => setSingleRouteLoading(false));

    return () => controller.abort();
  }, [selectedRestaurant, singleRouteEnabled, userLocation]);

  useEffect(() => {
    if (!tripMode || tripStops.length < 2) {
      setTripRoute([]);
      setTripRouteError(null);
      onTripStatsChange(null);
      return;
    }
    const controller = new AbortController();
    setTripRouteLoading(true);
    setTripRouteError(null);
    fetchRoute(
      tripStops.map((stop) => stop.coordinates),
      controller.signal
    )
      .then((route) => {
        setTripRoute(route.path);
        onTripStatsChange({
          distanceKm: route.distanceKm,
          durationMin: route.durationMin
        });
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name === "AbortError") return;
        setTripRoute([]);
        setTripRouteError("Could not build trip route right now.");
        onTripStatsChange(null);
      })
      .finally(() => setTripRouteLoading(false));

    return () => controller.abort();
  }, [onTripStatsChange, tripMode, tripStops]);

  useEffect(() => {
    if (tripOptimizeRequestKey === 0) return;
    if (tripOptimizeRequestKey <= handledOptimizeRequestRef.current) return;
    handledOptimizeRequestRef.current = tripOptimizeRequestKey;
    if (tripStops.length < 3) {
      onTripOptimizeError("Add at least 3 stops to optimize the route order.");
      return;
    }
    const controller = new AbortController();
    fetchOptimizedTripOrder(
      tripStops.map((stop) => stop.coordinates),
      tripStops.map((stop) => stop.id),
      controller.signal
    )
      .then((orderedIds) => {
        onTripOrderOptimized(orderedIds);
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name === "AbortError") return;
        onTripOptimizeError("Could not optimize trip order right now.");
      });
    return () => controller.abort();
  }, [onTripOptimizeError, onTripOrderOptimized, tripOptimizeRequestKey, tripStops]);

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
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-border">
      <div className="absolute left-3 top-3 z-[900] w-[270px] rounded-xl border border-slate-200 bg-white/95 p-2.5 text-xs shadow-lg backdrop-blur">
        <div className="font-semibold text-slate-700">Route planner</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={requestUserLocation}
            className="rounded-md bg-indigo-50 px-2 py-1 font-medium text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100"
          >
            Use my location
          </button>
          <button
            type="button"
            disabled={!selectedRestaurant}
            onClick={() => setSingleRouteEnabled((current) => !current)}
            className="rounded-md bg-emerald-50 px-2 py-1 font-medium text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {singleRouteEnabled ? "Hide selected route" : "Show selected route"}
          </button>
        </div>
        {singleRouteLoading ? <div className="mt-1.5 text-slate-500">Loading selected route...</div> : null}
        {singleRouteDistanceKm && singleRouteDurationMin ? (
          <div className="mt-1.5 text-slate-600">
            Selected route: {singleRouteDistanceKm.toFixed(1)} km, {Math.round(singleRouteDurationMin)} min
          </div>
        ) : null}
        {singleRouteError ? <div className="mt-1.5 text-rose-600">{singleRouteError}</div> : null}
        {tripMode ? (
          <div className="mt-2 border-t border-slate-200 pt-2 text-slate-600">
            Trip mode: {tripStops.length} stop{tripStops.length === 1 ? "" : "s"}
            {tripRouteLoading ? <div className="mt-1">Building trip route...</div> : null}
            {tripRouteError ? <div className="mt-1 text-rose-600">{tripRouteError}</div> : null}
          </div>
        ) : null}
      </div>
      <MapContainer
        center={[hk.lat, hk.lng]}
        zoom={12.8}
        zoomControl={false}
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
        <ZoomControl position="topright" />

        {restaurants.map((r) => {
          const active = selectedId === r.id || hoveredId === r.id;
          const isTripStop = tripStopIds.includes(r.id);
          const icon = markerIcon(active, isTripStop);

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
                autoPanPaddingTopLeft={[40, 96]}
                autoPanPaddingBottomRight={[40, 120]}
                maxWidth={360}
                maxHeight={620}
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
        {singleRoute.length > 1 ? (
          <Polyline
            positions={singleRoute}
            pathOptions={{ color: "#10b981", weight: 5, opacity: 0.85 }}
          />
        ) : null}
        {tripRoute.length > 1 ? (
          <Polyline
            positions={tripRoute}
            pathOptions={{ color: "#F97316", weight: 5, opacity: 0.88, dashArray: "10 8" }}
          />
        ) : null}
        <FocusSelectedMarker />
      </MapContainer>
    </div>
  );
}

