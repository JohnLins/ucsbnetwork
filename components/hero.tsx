export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line/70">
      <div className="absolute inset-0 bg-hero-grid bg-[size:96px_96px] opacity-[0.08]" />
      <div
        className="absolute right-[-8rem] top-[-3rem] h-[34rem] w-[34rem] bg-contain bg-center bg-no-repeat opacity-[0.08] mix-blend-screen dark:opacity-[0.13]"
        style={{ backgroundImage: "url('/ucsb-seal/navy-seal.gif')" }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper" />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1.35fr_0.65fr] lg:px-10 lg:py-28">
        <div className="space-y-8">
          <p className="text-xs uppercase tracking-[0.4em] text-accent">Builders. Founders. Investors. Operators.</p>
          <div className="space-y-6">
            <h1 className="max-w-4xl font-display text-5xl leading-[0.92] text-ink sm:text-6xl lg:text-7xl">
              A quieter, sharper network for the people shaping what comes after UCSB.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Discover people across software, venture, quant, climate, healthcare, and applied research. The
              directory is intentionally selective, searchable, and built to help serious people find each other.
            </p>
          </div>
        </div>
        <div className="self-end rounded-[2rem] border border-line/80 bg-panel/85 p-6 shadow-halo backdrop-blur">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.4em] text-accent">Why this exists</p>
            <div className="space-y-3 text-sm leading-7 text-muted">
              <p>Strong alumni and student networks usually look noisy or transactional. This one should not.</p>
              <p>
                The goal is a refined index of credible people with enough context to make introductions, find domain
                overlap, and build trust quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
