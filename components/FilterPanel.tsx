"use client";

import clsx from "clsx";
import type { Audience, DiscourseLevel } from "@/data/restaurants";

export type Filters = {
  authenticity: DiscourseLevel | "any";
  trendiness: DiscourseLevel | "any";
  audience: Audience | "any";
};

const levels: Array<{ value: Filters["authenticity"]; label: string }> = [
  { value: "any", label: "Any" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" }
];

const audiences: Array<{ value: Filters["audience"]; label: string }> = [
  { value: "any", label: "Any" },
  { value: "local", label: "Local" },
  { value: "tourist", label: "Tourist" },
  { value: "mixed", label: "Mixed" }
];

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
      <div className="grid grid-cols-4 gap-2 rounded-2xl border border-indigo-100 bg-gradient-to-r from-white via-indigo-50/50 to-purple-50/40 p-2 shadow-sm">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(opt.value)}
              className={clsx(
                "rounded-xl px-2.5 py-2 text-xs font-semibold transition focus:outline-none focus:ring-4 focus:ring-indigo-200/70",
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

export function FilterPanel({
  filters,
  onChange,
  matchCount,
  totalCount,
  onReset
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  matchCount: number;
  totalCount: number;
  onReset: () => void;
}) {
  const isFiltered =
    filters.authenticity !== "any" ||
    filters.trendiness !== "any" ||
    filters.audience !== "any";

  return (
    <div className="rounded-2xl bg-card p-4 shadow-lg ring-1 ring-border transition-shadow hover:shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold tracking-tight text-ink">
            Discourse Filters
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
            <span className="text-indigo-700/80">Showing</span>
            <span className="font-bold text-indigo-800">{matchCount}</span>
            <span className="text-indigo-700/80">of</span>
            <span className="font-bold text-indigo-800">{totalCount}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onReset}
          className={clsx(
            "rounded-full px-3 py-1.5 text-xs font-medium transition",
            isFiltered
              ? "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100"
              : "bg-black/5 text-muted opacity-60"
          )}
          disabled={!isFiltered}
        >
          Reset
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3">
        <Segmented
          label="Authenticity"
          value={filters.authenticity}
          onChange={(v) => onChange({ ...filters, authenticity: v as Filters["authenticity"] })}
          options={levels}
        />
        <Segmented
          label="Trendiness"
          value={filters.trendiness}
          onChange={(v) => onChange({ ...filters, trendiness: v as Filters["trendiness"] })}
          options={levels}
        />
        <Segmented
          label="Audience"
          value={filters.audience}
          onChange={(v) => onChange({ ...filters, audience: v as Filters["audience"] })}
          options={audiences}
        />
      </div>

      <div className="mt-4 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-white to-purple-50/60 p-3 text-xs leading-relaxed text-muted">
        <div className="font-medium text-ink">Marker encoding</div>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2">
            <span
              aria-label="Local"
              title="Local"
              className="h-3.5 w-3.5 rounded-full bg-emerald-500 shadow-[0_6px_14px_rgba(16,185,129,0.25)] ring-2 ring-white"
            />
            <span className="text-xs font-semibold text-ink">Local</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <span
              aria-label="Tourist"
              title="Tourist"
              className="h-3.5 w-3.5 rounded-full bg-rose-500 shadow-[0_6px_14px_rgba(244,63,94,0.25)] ring-2 ring-white"
            />
            <span className="text-xs font-semibold text-ink">Tourist</span>
          </div>
          <div className="inline-flex items-center gap-2">
            <span
              aria-label="Mixed"
              title="Mixed"
              className="h-3.5 w-3.5 rounded-full bg-amber-500 shadow-[0_6px_14px_rgba(245,158,11,0.25)] ring-2 ring-white"
            />
            <span className="text-xs font-semibold text-ink">Mixed</span>
          </div>
        </div>
      </div>
    </div>
  );
}

