export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-border">
        <div className="text-xs font-medium text-muted">About the project</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          What makes this a source-backed food map?
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This site uses real OpenStreetMap-derived records instead of mock narrative labels. Each
          location points to a source URL for verification.
        </p>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 shadow-card ring-1 ring-border">
        <div className="text-xs font-medium text-muted">Academic project</div>
        <h2 className="mt-1 text-pretty text-2xl font-semibold tracking-tight text-ink">
          A Data-Driven Hong Kong Food Map
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Explore real restaurant points from OpenStreetMap. Each marker links to verifiable source
          records and is filterable by district, amenity type, and cuisine tags.
        </p>
      </div>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            Data source strategy
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The dataset is sourced from OpenStreetMap-compatible fields (name, location, amenity,
            cuisine, district-related address tags) and can be refreshed through Overpass API.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">Data quality limits</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Open data quality varies by neighborhood and contributor activity. Missing cuisine or
            opening hours are kept as null values rather than inferred.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            How to interpret filters
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Filters combine verifiable source fields (district, amenity, cuisine) with a lightweight
            discourse coding layer (source lens and frame label) to support comparative interpretation.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            Project purpose
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The aim is a reproducible map workflow: collect open restaurant records, clean them into a
            stable schema, and explore patterns without opaque labeling.
          </p>
        </div>
      </section>

    </main>
  );
}

