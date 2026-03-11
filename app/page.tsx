import { ApplicationForm } from "@/components/application-form";
import { KeyboardNav } from "@/components/keyboard-nav";
import { FadeIn, Reveal, TypingText } from "@/components/motion";
import { OrbDivider } from "@/components/orb-divider";
import { Globe } from "@/components/ui/globe";
import { SiteHeader } from "@/components/site-header";
import { getPublicTags } from "@/lib/data/public";

export default async function HomePage() {
  const tags = await getPublicTags();

  return (
    <div className="bg-paper text-ink">
      <KeyboardNav />
      <SiteHeader />

      {/* ── Hero ── */}
      <section
        data-section
        className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#050a14]"
      >
        {/* Globe behind text */}
        <Globe className="top-1/2 -translate-y-1/2 opacity-70 max-w-[800px]" />

        {/* Radial overlay for depth */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_30%,#050a14_80%)]" />

        <div className="relative z-10 px-6 text-center">
          <h1 className="text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl">
            <TypingText text="ucsb.network" speed={85} />
          </h1>
          <FadeIn delay={1600}>
            <p className="mt-5 text-base tracking-wide text-white/50 sm:text-lg">
              founders. builders. the cracked.
            </p>
          </FadeIn>
        </div>
        <FadeIn delay={2200} className="absolute bottom-10 z-10 flex w-full justify-center">
          <a
            href="#about"
            className="animate-float-down text-accent/50 transition hover:text-accent/80"
            aria-label="Scroll down"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </FadeIn>
      </section>

      {/* ── About ── */}
      <section
        id="about"
        data-section
        className="flex min-h-[100dvh] items-center justify-center px-6"
      >
        <Reveal className="mx-auto max-w-xl text-center">
          <OrbDivider className="mb-10" />
          <p className="text-lg leading-relaxed text-ink sm:text-xl">
            A curated group of founders, builders, and engineers affiliated with
            UCSB.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted sm:text-xl">
            We host VC and builder events, and meet often to build, talk, and
            network.
          </p>
        </Reveal>
      </section>

      {/* ── Events ── */}
      <section
        id="events"
        data-section
        className="flex min-h-[100dvh] items-center justify-center border-t border-line/10 px-6"
      >
        <div className="mx-auto w-full max-w-2xl">
          <Reveal>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              What happens.
            </h2>
          </Reveal>
          <div className="mt-16 space-y-0">
            <Reveal direction="left">
              <div className="py-8">
                <EventRow num="01" title="Build Nights" desc="Ship together, every week." />
              </div>
            </Reveal>
            <Reveal direction="left">
              <div className="border-t border-line/20 py-8">
                <EventRow num="02" title="Pitch Nights" desc="Share what you're working on." />
              </div>
            </Reveal>
            <Reveal direction="left">
              <div className="border-t border-line/20 py-8">
                <EventRow num="03" title="Competitions" desc="Win Cursor & Codex credits." />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── VC & Alumni ── */}
      <section
        id="network"
        data-section
        className="flex min-h-[100dvh] items-center justify-center border-t border-line/10 px-6"
      >
        <Reveal className="mx-auto w-full max-w-lg text-center">
          <OrbDivider className="mb-10" />
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Beyond campus.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            VCs, alumni, and operators who back our builders.
          </p>
          <div className="mt-14">
            <span className="inline-flex rounded-lg border border-accent/30 px-5 py-2.5 text-xs tracking-wide text-accent/70">
              Coming soon
            </span>
          </div>
        </Reveal>
      </section>

      {/* ── Apply ── */}
      <section
        id="apply"
        data-section
        className="flex min-h-[100dvh] items-start justify-center border-t border-line/10 px-6 py-24"
      >
        <Reveal className="mx-auto w-full max-w-2xl">
          <ApplicationForm tags={tags} />
        </Reveal>
      </section>

      <footer className="border-t border-line/10 px-6 py-8 text-center text-xs text-muted">
        <span className="text-ink">ucsb</span>
        <span className="mx-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
        <span className="text-muted">network</span>
      </footer>
    </div>
  );
}

/* ---------- helper components ---------- */

function EventRow({
  num,
  title,
  desc
}: {
  num: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-baseline gap-6">
      <span className="font-mono text-xs text-accent/60">{num}</span>
      <div>
        <h3 className="text-lg font-medium text-ink">{title}</h3>
        <p className="mt-1.5 text-sm text-muted">{desc}</p>
      </div>
    </div>
  );
}
