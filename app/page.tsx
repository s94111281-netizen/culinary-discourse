"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { restaurants } from "@/data/restaurants";
import { FilterPanel, type Filters } from "@/components/FilterPanel";
import { Map } from "@/components/Map";

const defaultFilters: Filters = {
  authenticity: "any",
  trendiness: "any",
  audience: "any"
};

export default function HomePage() {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    return restaurants.filter((r) => {
      if (filters.authenticity !== "any" && r.discourse_tags.authenticity !== filters.authenticity)
        return false;
      if (filters.trendiness !== "any" && r.discourse_tags.trendiness !== filters.trendiness)
        return false;
      if (filters.audience !== "any" && r.discourse_tags.audience !== filters.audience)
        return false;
      return true;
    });
  }, [filters]);

  useEffect(() => {
    if (selectedId && !filtered.some((r) => r.id === selectedId)) setSelectedId(null);
  }, [filtered, selectedId]);

  return (
    <main className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-5 lg:grid-cols-[360px_1fr]">
      <aside className="lg:sticky lg:top-[76px] lg:self-start">
        <div className="rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/70 via-white to-purple-50/50 p-3 shadow-lg transition-shadow hover:shadow-xl">
          <section className="space-y-4">
            <div className="rounded-2xl bg-white p-3 shadow-lg ring-1 ring-border transition-shadow hover:shadow-xl">
              <div className="text-xs font-medium text-muted">Quick jump</div>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {[
                  { href: "/", label: "Map" },
                  { href: "/insights", label: "Insights" },
                  { href: "/about", label: "About" }
                ].map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={
                        "rounded-xl px-3 py-2 text-center text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-indigo-200 " +
                        (active
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                          : "bg-indigo-50/50 text-indigo-700 ring-1 ring-indigo-100 hover:bg-indigo-100")
                      }
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

        <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-border transition-shadow hover:shadow-xl">
          <div className="text-xs font-medium text-muted">Academic project</div>
          <h1 className="mt-1 text-pretty text-xl font-semibold tracking-tight text-ink">
            A Discourse-Driven Hong Kong Food Map
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Explore restaurants as{" "}
            <span className="font-semibold text-indigo-700">discursive objects</span>: not only where
            they are, but how they’re described across tourist narratives, local routine, and social
            media aesthetics.
          </p>
        </div>

        <FilterPanel
          filters={filters}
          onChange={setFilters}
          matchCount={filtered.length}
          totalCount={restaurants.length}
          onReset={() => setFilters(defaultFilters)}
        />

        <div className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-border transition-shadow hover:shadow-xl">
          <div className="text-sm font-semibold tracking-tight text-ink">How to read this map</div>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            <li className="flex gap-2">
              <span className="mt-[2px] select-none text-muted">•</span>
              <span>
                <span className="font-semibold text-ink">Click</span> a marker to open a discourse
                card (keywords + tags + short description).
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[2px] select-none text-muted">•</span>
              <span>
                Use filters to compare how “authenticity” and “trendiness” cluster by audience.
              </span>
            </li>
            <li className="flex gap-2">
              <span className="mt-[2px] select-none text-muted">•</span>
              <span>Green/red/yellow marker colors encode the dominant audience discourse.</span>
            </li>
          </ul>
        </div>
          </section>
        </div>
      </aside>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm font-semibold tracking-tight text-ink">Map view</div>
            <div className="text-xs text-muted">
              Centered on Hong Kong · {filtered.length} markers match your filters
            </div>
          </div>
          <div className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 ring-1 ring-indigo-100">
            Tip: hover markers for emphasis
          </div>
        </div>

        {mounted ? (
          <Map restaurants={filtered} selectedId={selectedId} onSelect={setSelectedId} />
        ) : (
          <div className="h-[70vh] w-full animate-pulse rounded-2xl bg-black/[0.03] ring-1 ring-border sm:h-[78vh]" />
        )}
      </section>
    </main>
  );
}

