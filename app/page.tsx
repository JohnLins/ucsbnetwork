import { ApplicationForm } from "@/components/application-form";
import { KeyboardNav } from "@/components/keyboard-nav";
import { Reveal } from "@/components/motion";
import { OrbDivider } from "@/components/orb-divider";
import { ScrollExpansionHero } from "@/components/ui/scroll-expansion-hero";
import { getPublicTags } from "@/lib/data/public";

export default async function HomePage() {
  const tags = await getPublicTags();

  return (
    <div className="bg-paper text-ink">
      <KeyboardNav />

      {/* ── Scroll-expansion hero with globe ── */}
      <ScrollExpansionHero>
        {/* Everything below is revealed after globe fully expands */}

        {/* ── About ── */}
        <section
          id="about"
          data-section
          className="flex min-h-[100dvh] items-center justify-center px-6"
        >
          <Reveal className="mx-auto max-w-xl text-center">
            <OrbDivider className="mb-10" />
            <p className="text-lg leading-relaxed text-ink sm:text-xl">
              A curated network of UCSB founders, builders, and engineers.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted sm:text-xl">
              We host VC and builder events, and meet often to build, talk, and
              network.
            </p>
          </Reveal>
        </section>

        {/* ── For Builders ── */}
        <section
          id="builders"
          data-section
          className="flex min-h-[100dvh] items-center justify-center border-t border-line/10 px-6"
        >
          <div className="mx-auto w-full max-w-2xl">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                For builders.
              </h2>
            </Reveal>
            <div className="mt-16 space-y-0">
              <Reveal direction="left">
                <div className="py-8">
                  <EventRow num="01" title="Member Directory" desc="Know who's building what. Find co-founders, collaborators, and the right people fast." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="02" title="Warm Intros" desc="Get connected to VCs, operators, and alumni who back UCSB talent." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="03" title="Build Nights & Pitch Nights" desc="Ship together weekly. Share what you're working on." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="04" title="Curated People" desc="Serious builders around you, consistently." />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── For VCs & Partners ── */}
        <section
          id="network"
          data-section
          className="flex min-h-[100dvh] items-center justify-center border-t border-line/10 px-6"
        >
          <div className="mx-auto w-full max-w-2xl">
            <Reveal>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                For VCs & partners.
              </h2>
            </Reveal>
            <div className="mt-16 space-y-0">
              <Reveal direction="left">
                <div className="py-8">
                  <EventRow num="01" title="Curated Pipeline" desc="A cleaner path into vetted UCSB talent" />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="02" title="Warm Intros" desc="Direct access to founders through the member directory and network." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="03" title="Events & Deal Flow" desc="Attend pitch nights, meet builders early, and stay close to what's shipping." />
                </div>
              </Reveal>
            </div>
            <Reveal>
              <p className="mt-12 text-sm text-muted">
                Interested?{" "}
                <a href="mailto:hursh@ucsb.network" className="text-accent hover:underline">
                  hursh@ucsb.network
                </a>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Apply ── */}
        <section
          id="apply"
          data-section
          className="flex min-h-[100dvh] items-start justify-center border-t border-line/10 px-6 py-24"
        >
          <Reveal className="mx-auto w-full max-w-2xl">
            <p className="mb-6 text-sm font-medium tracking-wide text-accent">
              Applications for the first cohort close April 3.
            </p>
            <ApplicationForm tags={tags} />
          </Reveal>
        </section>

        <footer className="border-t border-line/10 px-6 py-8 text-center text-xs text-muted">
          <span className="text-ink">ucsb</span>
          <span className="mx-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
          <span className="text-muted">network</span>
        </footer>
      </ScrollExpansionHero>
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
