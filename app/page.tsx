"use client";

import { useEffect, useMemo, useState } from "react";
import { formatRestaurantName, restaurants } from "@/data/restaurants";
import { FilterPanel, type Filters } from "@/components/FilterPanel";
import { Map as FoodMap } from "@/components/Map";

const defaultFilters: Filters = {
  district: "any",
  cuisine: "any",
  discourseSource: [],
  discourseFrame: []
};

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeDistrict, setActiveDistrict] = useState<string | null>(null);
  const [tripMode, setTripMode] = useState(false);
  const [tripStopIds, setTripStopIds] = useState<string[]>([]);
  const [tripStats, setTripStats] = useState<{ distanceKm: number; durationMin: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      if (filters.district !== "any" && r.district !== filters.district) return false;
      if (filters.cuisine !== "any" && !r.cuisine.includes(filters.cuisine)) return false;
      if (filters.discourseSource.length > 0 && !filters.discourseSource.some((source) => r.discourse_source.includes(source))) return false;
      if (filters.discourseFrame.length > 0 && !filters.discourseFrame.some((frame) => r.discourse_frame.includes(frame))) return false;
      return true;
    });
  }, [filters]);

  useEffect(() => {
    if (selectedId && !filtered.some((r) => r.id === selectedId)) setSelectedId(null);
  }, [filtered, selectedId]);

  const districts = useMemo(
    () =>
      Array.from(new Set(restaurants.map((item) => item.district)))
        .filter((district) => district.toLowerCase() !== "unknown")
        .sort(),
    []
  );

  const areaRestaurants = useMemo(() => {
    if (activeDistrict) return filtered.filter((item) => item.district === activeDistrict);
    return filtered;
  }, [activeDistrict, filtered]);
  const selectedRestaurant = useMemo(
    () => restaurants.find((restaurant) => restaurant.id === selectedId) ?? null,
    [selectedId]
  );
  const tripStops = useMemo(
    () => tripStopIds.map((id) => restaurants.find((restaurant) => restaurant.id === id)).filter(Boolean),
    [tripStopIds]
  );

  function addSelectedToTrip() {
    if (!selectedRestaurant) return;
    setTripStopIds((current) =>
      current.includes(selectedRestaurant.id) ? current : [...current, selectedRestaurant.id]
    );
  }

  function moveTripStop(index: number, direction: -1 | 1) {
    setTripStopIds((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }

  return (
    <main className="mx-auto grid max-w-[1300px] grid-cols-[380px_minmax(0,1fr)] gap-4 overflow-x-auto px-4 pb-0 pt-2">
      <aside className="sticky top-[56px] h-[calc(100vh-64px)] overflow-y-auto pr-1">
        <div className="space-y-4 rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/70 via-white to-purple-50/50 p-3 shadow-lg transition-shadow hover:shadow-xl">
          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/60 via-white to-purple-50/40 p-4 shadow-lg ring-1 ring-indigo-100/60 transition-shadow hover:shadow-xl">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-sm font-medium tracking-tight text-ink">Area Navigator</div>
                <p className="mt-1 text-xs text-muted">Browse filtered records by district.</p>
              </div>
              <span className="rounded-full bg-indigo-100/80 px-2.5 py-1 text-[11px] font-medium text-indigo-700">
                {areaRestaurants.length}
              </span>
            </div>

            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-[11px] font-medium tracking-wide text-indigo-700/80">District</span>
                {activeDistrict ? (
                  <button
                    type="button"
                    onClick={() => setActiveDistrict(null)}
                    className="rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-indigo-600 ring-1 ring-indigo-200 transition hover:bg-indigo-50"
                  >
                    Clear
                  </button>
                ) : null}
              </div>
              <select
                value={activeDistrict ?? ""}
                onChange={(event) => {
                  setActiveDistrict(event.target.value === "" ? null : event.target.value);
                }}
                className="w-full rounded-xl border border-indigo-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
              >
                <option value="">All districts</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 text-xs font-medium text-indigo-700/90">
              {activeDistrict ? `Restaurants in ${activeDistrict}` : "Restaurants in all districts"}
            </div>
            <div className="relative mt-2">
              <div className="max-h-40 space-y-2 overflow-y-auto pr-1">
                {areaRestaurants.length > 0 ? (
                  areaRestaurants.map((restaurant) => (
                    <button
                      key={`area-restaurant-${restaurant.id}`}
                      type="button"
                      onClick={() => setSelectedId(restaurant.id)}
                      className={
                        "block w-full rounded-xl border-l-4 border px-3 py-2 text-left transition " +
                        (selectedId === restaurant.id
                          ? "border-l-indigo-500 border-indigo-200 bg-white text-indigo-700 shadow-sm"
                          : "border-l-transparent border-slate-200 bg-white/95 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/70")
                      }
                    >
                      <div className="text-xs font-medium">{formatRestaurantName(restaurant)}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">
                        {restaurant.amenity.replaceAll("_", " ")} · {restaurant.district}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-indigo-200 bg-white/70 p-3 text-xs text-slate-500">
                    <div>No restaurant data in this area yet.</div>
                    <button
                      type="button"
                      onClick={() => {
                        setFilters(defaultFilters);
                        setActiveDistrict(null);
                        setSelectedId(null);
                      }}
                      className="mt-2 inline-flex rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-700 ring-1 ring-indigo-100 transition hover:bg-indigo-100"
                    >
                      Reset filters
                    </button>
                  </div>
                )}
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 rounded-b-xl bg-gradient-to-t from-white to-transparent" />
            </div>
          </div>

          <FilterPanel
            filters={filters}
            onChange={setFilters}
            matchCount={filtered.length}
            totalCount={restaurants.length}
            onReset={() => setFilters(defaultFilters)}
            restaurants={restaurants}
          />
          <div className="rounded-2xl border border-indigo-100 bg-white/90 p-4 shadow-lg ring-1 ring-indigo-100/60">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-medium tracking-tight text-ink">Trip Builder</div>
                <p className="mt-1 text-xs text-muted">Create a multi-stop route across selected restaurants.</p>
              </div>
              <button
                type="button"
                onClick={() => setTripMode((current) => !current)}
                className={
                  "rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition " +
                  (tripMode
                    ? "bg-indigo-600 text-white ring-indigo-500 hover:bg-indigo-500"
                    : "bg-indigo-50 text-indigo-700 ring-indigo-200 hover:bg-indigo-100")
                }
              >
                {tripMode ? "Trip mode on" : "Enable trip mode"}
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={addSelectedToTrip}
                disabled={!selectedRestaurant}
                className="rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Add selected stop
              </button>
              <button
                type="button"
                onClick={() => {
                  setTripStopIds([]);
                  setTripStats(null);
                }}
                className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200"
              >
                Clear stops
              </button>
            </div>
            <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
              {tripStops.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  No stops yet. Select a restaurant and click Add selected stop.
                </div>
              ) : (
                tripStops.map((restaurant, index) => (
                  <div
                    key={`trip-stop-${restaurant!.id}`}
                    className="rounded-lg border border-slate-200 bg-white px-2.5 py-2"
                  >
                    <div className="text-xs font-semibold text-slate-700">
                      {index + 1}. {formatRestaurantName(restaurant!)}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => moveTripStop(index, -1)}
                        disabled={index === 0}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTripStop(index, 1)}
                        disabled={index === tripStops.length - 1}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() => setTripStopIds((current) => current.filter((id) => id !== restaurant!.id))}
                        className="rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-medium text-rose-700 ring-1 ring-rose-100 hover:bg-rose-100"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            {tripStats ? (
              <div className="mt-3 rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
                Estimated trip: {tripStats.distanceKm.toFixed(1)} km, {Math.round(tripStats.durationMin)} min
              </div>
            ) : null}
          </div>

        </div>
      </aside>

      <section className="sticky top-[56px] h-[calc(100vh-64px)] min-w-[520px] space-y-3">
        {mounted ? (
          <FoodMap
            restaurants={filtered}
            selectedId={selectedId}
            onSelect={setSelectedId}
            tripMode={tripMode}
            tripStopIds={tripStopIds}
            onTripStatsChange={setTripStats}
          />
        ) : (
          <div className="h-full w-full animate-pulse rounded-2xl bg-black/[0.03] ring-1 ring-border" />
        )}
      </section>
    </main>
  );
}

