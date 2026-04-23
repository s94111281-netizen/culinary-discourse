export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="rounded-2xl bg-white p-6 shadow-card ring-1 ring-border">
        <div className="text-xs font-medium text-muted">About the project</div>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
          What makes this a discourse-driven food map?
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This site treats restaurants as more than points on a map. Each location is linked to the
          way it is <span className="font-semibold text-ink">talked about</span>—how authenticity,
          trendiness, and audience are constructed through language and platform conventions.
        </p>
      </div>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            What is discourse analysis?
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Discourse analysis studies how meaning is produced through language, interaction, and
            social context. For food culture, it helps us see how “authentic,” “local,” and “viral”
            are not neutral labels—but outcomes of repeated descriptions, comparisons, and visual
            framing.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">Data sources (mock)</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The current dataset is mock but modeled after realistic sources: travel blogs, local
            food forums, Instagram/Xiaohongshu-style short posts, and review platforms. In a full
            study, each restaurant would be backed by a corpus of snippets with coded themes and
            inter-annotator checks.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            How to interpret the tags
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The filter dimensions are simplified “coding” categories: authenticity and trendiness
            (high/medium/low), plus the dominant audience framing (local/tourist/mixed). Keywords
            represent recurring phrases—e.g., “hidden gem,” “tourist hotspot,” “Instagrammable.”
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 ring-1 ring-border">
          <h2 className="text-base font-semibold tracking-tight text-ink">
            Project purpose
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            The aim is to prototype an interface where qualitative research is navigable: users can
            move between spatial exploration (map) and interpretive structure (discourse filters +
            insights), making academic claims inspectable in an interactive way.
          </p>
        </div>
      </section>
    </main>
  );
}

