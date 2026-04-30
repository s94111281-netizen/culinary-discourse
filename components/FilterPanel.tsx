"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import type { Restaurant } from "@/data/restaurants";

export type Filters = {
  district: string | "any";
  cuisine: string | "any";
  discourseSource: Restaurant["discourse_source"][number][];
  discourseFrame: Restaurant["discourse_frame"][number][];
};

function Segmented({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="space-y-1.5">
      <div className="text-xs font-semibold tracking-wide text-indigo-700/90">
        {label.toUpperCase()}
      </div>
      <div className="grid grid-cols-2 gap-2 rounded-2xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/50 to-purple-50/40 p-2 shadow-sm md:grid-cols-3">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={clsx(
                "min-w-0 whitespace-normal break-normal rounded-xl px-2.5 py-2 text-center text-xs font-semibold leading-tight transition focus:outline-none focus:ring-4 focus:ring-indigo-200/70",
                active
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                  : "bg-white/70 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-50"
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function formatCuisineLabel(value: string) {
  const custom: Record<string, string> = {
    cantonese_cuisine: "Cantonese",
    hong_kong_bbq_roast_goose: "HK BBQ / Roast Goose",
    hong_kong_seafood_cooked_food_stall: "HK Seafood Stall",
    hong_kong_noodles_cart_noodles: "HK Noodles",
    hong_kong_cha_chaan_teng_ice_cafe: "HK Cha Chaan Teng",
    hong_kong_dim_sum_tea_restaurant: "HK Dim Sum / Tea",
    hong_kong_clay_pot_rice: "HK Clay Pot Rice",
    hong_kong_snacks_bakery: "HK Snacks / Bakery",
    international_cuisine: "International",
    international_fusion: "Fusion",
    fine_dining: "Fine Dining",
    traditional: "Traditional",
    hot_pot: "Hot Pot"
  };
  return custom[value] ?? value.replaceAll("_", " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

const cuisineCategoryOrder = [
  "cantonese_cuisine",
  "hong_kong_bbq_roast_goose",
  "hong_kong_seafood_cooked_food_stall",
  "hong_kong_noodles_cart_noodles",
  "hong_kong_cha_chaan_teng_ice_cafe",
  "hong_kong_dim_sum_tea_restaurant",
  "hong_kong_clay_pot_rice",
  "hot_pot",
  "hong_kong_snacks_bakery",
  "international_cuisine"
];

export function FilterPanel({
  filters,
  onChange,
  matchCount,
  totalCount,
  onReset,
  restaurants
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  matchCount: number;
  totalCount: number;
  onReset: () => void;
  restaurants: Restaurant[];
}) {
  const [showAllCuisineCategories, setShowAllCuisineCategories] = useState(false);
  const toggleMultiValue = <T extends string>(values: T[], value: T) =>
    values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

  const cuisineCategorySet = useMemo(() => {
    return new Set(restaurants.flatMap((item) => item.cuisine).filter((value) => cuisineCategoryOrder.includes(value)));
  }, [restaurants]);
  const cuisineCategories = useMemo(() => {
    return cuisineCategoryOrder.filter((value) => cuisineCategorySet.has(value));
  }, [cuisineCategorySet]);
  const cuisineToCategory = useMemo(() => {
    const map = new Map<string, string>();
    for (const restaurant of restaurants) {
      const category = restaurant.cuisine.find((value) => cuisineCategorySet.has(value));
      if (!category) continue;
      for (const tag of restaurant.cuisine) {
        if (!map.has(tag)) map.set(tag, category);
      }
    }
    return map;
  }, [restaurants, cuisineCategorySet]);
  const selectedCuisineCategory = useMemo(() => {
    if (filters.cuisine === "any") return "any";
    if (cuisineCategorySet.has(filters.cuisine)) return filters.cuisine;
    return cuisineToCategory.get(filters.cuisine) ?? "any";
  }, [filters.cuisine, cuisineCategorySet, cuisineToCategory]);
  const cuisineSubtypeOptions = useMemo(() => {
    if (selectedCuisineCategory === "any") return [];
    const subtypeSet = new Set<string>();
    for (const restaurant of restaurants) {
      if (!restaurant.cuisine.includes(selectedCuisineCategory)) continue;
      for (const tag of restaurant.cuisine) {
        if (tag !== selectedCuisineCategory) subtypeSet.add(tag);
      }
    }
    return Array.from(subtypeSet).sort();
  }, [restaurants, selectedCuisineCategory]);
  const visibleCuisineCategories = showAllCuisineCategories ? cuisineCategories : cuisineCategories.slice(0, 7);
  const discourseSourceOptions: Array<{ value: string; label: string }> = [
    { value: "any", label: "Any" },
    { value: "local_discourse", label: "Local" },
    { value: "tourist", label: "Tourist" },
    { value: "social_media", label: "Social Media" },
    { value: "prestige_cultural", label: "Prestige & Cultural" }
  ];
  const discourseSourceExplainers: Array<{ value: string; title: string; description: string }> = [
    { value: "any", title: "Any", description: "Mixed or no single dominant discourse." },
    {
      value: "tourist",
      title: "Tourist",
      description: "Experience-oriented, photo-worthy, themed environment."
    },
    {
      value: "local_discourse",
      title: "Local",
      description: "Neighborhood-focused, affordable, daily local taste."
    },
    {
      value: "social_media",
      title: "Social Media",
      description: "Visually appealing, viral, trendy food style."
    },
    {
      value: "prestige_cultural",
      title: "Prestige",
      description: "Michelin-rated, craft, heritage, fine dining."
    }
  ];
  const discourseFrameOptions: Array<{ value: string; label: string }> = [
    { value: "any", label: "Any" },
    { value: "authenticity", label: "Authenticity" },
    { value: "everyday_value", label: "Everyday value" },
    { value: "trend_hype", label: "Trend hype" }
  ];
  const discourseFrameExplainers: Array<{ value: string; title: string; description: string }> = [
    { value: "any", title: "Any", description: "Mixed or no single dominant discourse." },
    {
      value: "authenticity",
      title: "Authenticity",
      description: "Traditional, genuine, heritage Hong Kong food."
    },
    {
      value: "everyday_value",
      title: "Everyday value",
      description: "Casual, affordable, practical daily dining."
    },
    {
      value: "trend_hype",
      title: "Trend hype",
      description: "Popular, Instagrammable, creative, fashionable."
    }
  ];
  const visibleSourceExplainers = discourseSourceExplainers.filter((item) => filters.discourseSource.includes(item.value as Restaurant["discourse_source"][number]));
  const visibleFrameExplainers = discourseFrameExplainers.filter((item) => filters.discourseFrame.includes(item.value as Restaurant["discourse_frame"][number]));

  const isFiltered =
    filters.cuisine !== "any" || filters.discourseSource.length > 0 || filters.discourseFrame.length > 0;

  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-100/70 p-4 shadow-lg ring-1 ring-emerald-200/70 transition-shadow hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold tracking-tight text-ink">
            Discourse Filters
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
            <span className="text-emerald-700/80">Showing</span>
            <span className="font-bold text-emerald-800">{matchCount}</span>
            <span className="text-emerald-700/80">of</span>
            <span className="font-bold text-emerald-800">{totalCount}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className={clsx(
            "rounded-full px-3 py-1.5 text-xs font-medium transition",
            isFiltered
              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100"
              : "bg-black/5 text-muted opacity-60"
          )}
          disabled={!isFiltered}
        >
          Reset
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <div className="space-y-1.5">
          <div className="text-xs font-semibold tracking-wide text-indigo-700/90">CUISINE CATEGORY</div>
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/50 to-purple-50/40 p-2 shadow-sm md:grid-cols-3">
            <button
              type="button"
              onClick={() => onChange({ ...filters, cuisine: "any" })}
              className={clsx(
                "min-w-0 whitespace-normal break-normal rounded-xl px-2.5 py-2 text-center text-xs font-semibold leading-tight transition focus:outline-none focus:ring-4 focus:ring-indigo-200/70",
                selectedCuisineCategory === "any"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                  : "bg-white/70 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-50"
              )}
            >
              Any
            </button>
            {visibleCuisineCategories.map((category) => {
              const active = selectedCuisineCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onChange({ ...filters, cuisine: category as Filters["cuisine"] })}
                  className={clsx(
                    "min-w-0 whitespace-normal break-normal rounded-xl px-2.5 py-2 text-center text-xs font-semibold leading-tight transition focus:outline-none focus:ring-4 focus:ring-indigo-200/70",
                    active
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                      : "bg-white/70 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-50"
                  )}
                >
                  {formatCuisineLabel(category)}
                </button>
              );
            })}
          </div>
          {cuisineCategories.length > 7 ? (
            <button
              type="button"
              onClick={() => setShowAllCuisineCategories((prev) => !prev)}
              className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              {showAllCuisineCategories ? "Show less categories" : `Show ${cuisineCategories.length - 7} more categories`}
            </button>
          ) : null}
        </div>
        {selectedCuisineCategory !== "any" ? (
          <div className="space-y-1.5">
            <div className="text-xs font-semibold tracking-wide text-indigo-700/90">CUISINE SUBTYPE</div>
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/40 to-purple-50/30 p-2 shadow-sm md:grid-cols-3">
              <button
                type="button"
                onClick={() => onChange({ ...filters, cuisine: selectedCuisineCategory as Filters["cuisine"] })}
                className={clsx(
                  "min-w-0 whitespace-normal break-normal rounded-xl px-2.5 py-2 text-center text-xs font-semibold leading-tight transition focus:outline-none focus:ring-4 focus:ring-indigo-200/70",
                  filters.cuisine === selectedCuisineCategory
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                    : "bg-white/70 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-50"
                )}
              >
                Any subtype
              </button>
              {cuisineSubtypeOptions.map((subtype) => (
                <button
                  key={subtype}
                  type="button"
                  onClick={() => onChange({ ...filters, cuisine: subtype as Filters["cuisine"] })}
                  className={clsx(
                    "min-w-0 whitespace-normal break-normal rounded-xl px-2.5 py-2 text-center text-xs font-semibold leading-tight transition focus:outline-none focus:ring-4 focus:ring-indigo-200/70",
                    filters.cuisine === subtype
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                      : "bg-white/70 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-50"
                  )}
                >
                  {formatCuisineLabel(subtype)}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="space-y-1.5">
          <div className="text-xs font-semibold tracking-wide text-indigo-700/90">DISCOURSE SOURCE</div>
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/50 to-purple-50/40 p-2 shadow-sm md:grid-cols-3">
            <button
              type="button"
              onClick={() => onChange({ ...filters, discourseSource: [] })}
              className={clsx(
                "min-w-0 whitespace-normal break-normal rounded-xl px-2.5 py-2 text-center text-xs font-semibold leading-tight transition focus:outline-none focus:ring-4 focus:ring-indigo-200/70",
                filters.discourseSource.length === 0
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                  : "bg-white/70 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-50"
              )}
            >
              Any
            </button>
            {discourseSourceOptions
              .filter((item) => item.value !== "any")
              .map((opt) => {
                const value = opt.value as Restaurant["discourse_source"][number];
                const active = filters.discourseSource.includes(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...filters, discourseSource: toggleMultiValue(filters.discourseSource, value) })}
                    className={clsx(
                      "min-w-0 whitespace-normal break-normal rounded-xl px-2.5 py-2 text-center text-xs font-semibold leading-tight transition focus:outline-none focus:ring-4 focus:ring-indigo-200/70",
                      active
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                        : "bg-white/70 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-50"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
          </div>
        </div>
        <div className="space-y-2">
          {visibleSourceExplainers.length > 0 ? (
            visibleSourceExplainers.map((item) => (
              <div key={item.title} className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2">
                <div className="text-xs font-semibold text-ink">{item.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-muted">{item.description}</p>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-indigo-100 bg-white/70 px-3 py-2 text-xs text-muted">
              Select a source to view explanation.
            </div>
          )}
        </div>
        <div className="space-y-1.5">
          <div className="text-xs font-semibold tracking-wide text-indigo-700/90">DISCOURSE FRAME</div>
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/40 to-purple-50/30 p-2 shadow-sm md:grid-cols-3">
            <button
              type="button"
              onClick={() => onChange({ ...filters, discourseFrame: [] })}
              className={clsx(
                "min-w-0 whitespace-normal break-normal rounded-xl px-2.5 py-2 text-center text-xs font-semibold leading-tight transition focus:outline-none focus:ring-4 focus:ring-indigo-200/70",
                filters.discourseFrame.length === 0
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                  : "bg-white/70 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-50"
              )}
            >
              Any
            </button>
            {discourseFrameOptions
              .filter((item) => item.value !== "any")
              .map((opt) => {
                const value = opt.value as Restaurant["discourse_frame"][number];
                const active = filters.discourseFrame.includes(value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange({ ...filters, discourseFrame: toggleMultiValue(filters.discourseFrame, value) })}
                    className={clsx(
                      "min-w-0 whitespace-normal break-normal rounded-xl px-2.5 py-2 text-center text-xs font-semibold leading-tight transition focus:outline-none focus:ring-4 focus:ring-indigo-200/70",
                      active
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                        : "bg-white/70 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-50"
                    )}
                  >
                    {opt.label}
                  </button>
                );
              })}
          </div>
        </div>
        <div className="space-y-2">
          {visibleFrameExplainers.length > 0 ? (
            visibleFrameExplainers.map((item) => (
              <div key={item.title} className="rounded-lg border border-indigo-100 bg-white/80 px-3 py-2">
                <div className="text-xs font-semibold text-ink">{item.title}</div>
                <p className="mt-2 text-xs leading-relaxed text-muted">{item.description}</p>
              </div>
            ))
          ) : (
            <div className="rounded-lg border border-dashed border-indigo-100 bg-white/70 px-3 py-2 text-xs text-muted">
              Select a frame to view explanation.
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/60 p-3 text-xs leading-relaxed text-muted">
        <div className="font-medium text-ink">Data notes</div>
        <div className="mt-2">
          Filters combine OSM fields with discourse coding; a restaurant may carry multiple source/frame labels.
        </div>
      </div>
    </div>
  );
}

