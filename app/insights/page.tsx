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
  const byAudience = restaurants.reduce(
    (acc, r) => {
      acc[r.discourse_tags.audience] += 1;
      return acc;
    },
    { local: 0, tourist: 0, mixed: 0 }
  );
  const max = Math.max(byAudience.local, byAudience.tourist, byAudience.mixed);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-border">
        <div className="text-xs font-medium text-muted">Insights (mock analysis)</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          Discourse patterns in Hong Kong food talk
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          These observations are written as if derived from a small corpus of blogs, platform posts,
          and review snippets. The goal is to demonstrate how discourse analysis can be made
          explorable through interface design.
        </p>
      </div>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            1) Authenticity becomes a “scene,” not a property
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Tourist discourse often ties authenticity to sensory cues—crowds, heat, speed, and
            “no-frills” environments—turning everyday spaces into performative “local scenes.” In
            local discourse, authenticity is less narrated and more assumed: it appears indirectly
            through routine, lineage, and the correctness of technique.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            2) Social media shifts evaluation from taste → imageable moments
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Aesthetic discourse highlights “first bites,” close-up textures, and camera-friendly
            lighting (e.g., sizzle shots, neon backdrops). This can raise “trendiness” even when
            authenticity is described as low—because visibility becomes the value.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            3) Local discourse indexes care through small calibrations
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Instead of superlatives, local talk often uses calibration: wrapper thickness, syrup
            density, chewiness, browning level, “wok hei.” These micro-evaluations function as a
            community vocabulary that quietly marks expertise.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            4) Mixed-audience places mediate discourse (and design for it)
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            “Mixed” spaces often stabilize multiple readings at once: they provide a narrative hook
            for visitors (iconic, must-try) while preserving enough technical or habitual cues to
            remain legible to locals. Interface-wise, these are the places where tags compete most
            strongly.
          </p>
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-border">
        <h2 className="text-base font-semibold tracking-tight text-ink">
          Quick distribution: audience discourse in the dataset
        </h2>
        <p className="mt-2 text-sm text-muted">
          A lightweight bar chart (no heavy libraries) summarizing marker color encoding.
        </p>
        <div className="mt-4 space-y-3">
          <StatBar label="Local" value={byAudience.local} max={max} color="#10B981" />
          <StatBar label="Tourist" value={byAudience.tourist} max={max} color="#F43F5E" />
          <StatBar label="Mixed" value={byAudience.mixed} max={max} color="#F59E0B" />
        </div>
      </section>
    </main>
  );
}

