import { datasetMetadata } from "@/data/restaurants";

export default function TipsPage() {
  const providerText = datasetMetadata.provider.replace(/\s*\(user-provided PDF\)\s*/gi, " ").replace(/\s{2,}/g, " ").trim();
  const lastUpdatedText = new Date(datasetMetadata.fetched_at)
    .toISOString()
    .replace("T", " ")
    .replace("Z", " UTC");

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-border">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">Tips</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          How to read this map and interpret the source-backed fields.
        </p>
      </div>

      <section className="mt-6 rounded-2xl bg-white p-6 ring-1 ring-border">
        <div className="text-sm font-semibold tracking-tight text-ink">How to read this map</div>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="flex gap-2">
            <span className="mt-[2px] select-none text-muted">•</span>
            <span>
              <span className="font-semibold text-ink">Click</span> a marker to open a source-backed card
              (district, amenity, cuisine, and OSM URL).
            </span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[2px] select-none text-muted">•</span>
            <span>Use filters to compare neighborhoods and cuisine patterns from real fields.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-[2px] select-none text-muted">•</span>
            <span>Source: {providerText}</span>
          </li>
        </ul>
        <div className="mt-3 text-xs text-muted">Last updated: {lastUpdatedText}</div>
      </section>
    </main>
  );
}
