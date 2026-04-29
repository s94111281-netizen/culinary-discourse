import { restaurants } from "@/data/restaurants";

function StatBar({
  label,
  value,
  max,
  color
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted">
        <span className="font-medium text-ink">{label}</span>
        <span>
          {value} ({pct}%)
        </span>
      </div>
      <div className="h-2 rounded-full bg-black/5">
        <div
          className="h-2 rounded-full"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function InsightsPage() {
  const sourceLabelMap: Record<string, string> = {
    local_discourse: "Local Discourse",
    tourist: "Tourist",
    social_media: "Social Media",
    prestige_cultural: "Prestige & Cultural Discourse"
  };
  const sourceColorMap: Record<string, string> = {
    local_discourse: "#0EA5E9",
    tourist: "#F59E0B",
    social_media: "#A855F7",
    prestige_cultural: "#2563EB"
  };
  const frameLabelMap: Record<string, string> = {
    authenticity: "Authenticity",
    everyday_value: "Everyday Value",
    trend_hype: "Trend Hype"
  };
  const frameColorMap: Record<string, string> = {
    authenticity: "#0EA5E9",
    everyday_value: "#10B981",
    trend_hype: "#A855F7"
  };
  const discourseBySource = restaurants.reduce<Record<string, number>>((acc, r) => {
    for (const source of r.discourse_source) acc[source] = (acc[source] ?? 0) + 1;
    return acc;
  }, {});
  const sourceEntries = Object.entries(discourseBySource).sort((a, b) => b[1] - a[1]);
  const sourceMax = sourceEntries.length > 0 ? sourceEntries[0][1] : 0;
  const discourseByFrame = restaurants.reduce<Record<string, number>>((acc, r) => {
    for (const frame of r.discourse_frame) acc[frame] = (acc[frame] ?? 0) + 1;
    return acc;
  }, {});
  const frameEntries = Object.entries(discourseByFrame).sort((a, b) => b[1] - a[1]);
  const frameMax = frameEntries.length > 0 ? frameEntries[0][1] : 0;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-border">
        <div className="text-xs font-medium text-muted">Insights (real-field analysis)</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          Discourse Summary
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          A compact overview of discourse source and frame distributions from your curated coding table.
        </p>
      </div>

      <section className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-border">
        <h2 className="text-base font-semibold tracking-tight text-ink">
          Discourse Source Distribution
        </h2>
        <p className="mt-2 text-sm text-muted">
          Counts each selected source label across all mapped restaurants.
        </p>
        <div className="mt-4 space-y-3">
          {sourceEntries.map(([name, value]) => (
            <StatBar
              key={name}
              label={sourceLabelMap[name] ?? name}
              value={value}
              max={sourceMax}
              color={sourceColorMap[name] ?? "#6366F1"}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-border">
        <h2 className="text-base font-semibold tracking-tight text-ink">
          Discourse Frame Distribution
        </h2>
        <p className="mt-2 text-sm text-muted">
          Counts each selected frame label across all mapped restaurants.
        </p>
        <div className="mt-4 space-y-3">
          {frameEntries.map(([name, value]) => (
            <StatBar
              key={name}
              label={frameLabelMap[name] ?? name}
              value={value}
              max={frameMax}
              color={frameColorMap[name] ?? "#6366F1"}
            />
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-border">
        <h2 className="text-base font-semibold tracking-tight text-ink">Method Note</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Labels come from a manually defined discourse coding table. Because records can carry multiple
          labels, totals represent tag occurrences rather than mutually exclusive restaurant counts.
        </p>
      </section>
    </main>
  );
}

