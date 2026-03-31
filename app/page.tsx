import Image from "next/image";

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
            <p className="mt-8 text-sm text-muted/70">
              Advised by alumni at Meta, NASA, YC, ByteDance, & more
            </p>

            <div className="mt-8 flex flex-col items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted/40">
                Our Partners
              </span>
              <div className="flex items-center gap-8">
                <Image
                  src="/cursor-logo.png"
                  alt="Cursor"
                  width={100}
                  height={28}
                  className="object-contain"
                />
                <Image
                  src="/mindfort-logo.jpeg"
                  alt="Mindfort AI"
                  width={100}
                  height={28}
                  className="rounded-sm object-contain"
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Benefits highlight strip ── */}
        <section className="border-t border-line/10 px-6 py-16">
          <Reveal className="mx-auto max-w-3xl">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-accent/20 px-5 py-4 text-center">
                <p className="text-lg font-semibold text-ink">$250+</p>
                <p className="mt-1 text-xs text-muted">in AI credits</p>
              </div>
              <div className="rounded-lg border border-accent/20 px-5 py-4 text-center">
                <p className="text-lg font-semibold text-ink">Cursor Pro</p>
                <p className="mt-1 text-xs text-muted">guaranteed plans & credits</p>
              </div>
              <div className="rounded-lg border border-accent/20 px-5 py-4 text-center">
                <p className="text-lg font-semibold text-ink">Founder Dinner</p>
                <p className="mt-1 text-xs text-muted">with Mindfort AI (YC X25)</p>
              </div>
              <div className="rounded-lg border border-accent/20 px-5 py-4 text-center">
                <p className="text-lg font-semibold text-ink">Hackathon</p>
                <p className="mt-1 text-xs text-muted">$1k credits + internship interview</p>
              </div>
            </div>
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
                  <EventRow num="01" title="Member Directory & Warm Intros" desc="Know who's building what. Get connected to VCs, operators, and alumni who back UCSB talent." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="02" title="Build Nights, Pitch Nights & Hackathons" desc="Ship together weekly. Win $1,000 in credits and an internship interview at our mini hackathon." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="03" title="$250+ in AI Credits & Cursor Pro" desc="Guaranteed AI credits and Cursor Pro plans for every member." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="04" title="Founder Dinners" desc="Guaranteed invite to exclusive dinners with YC founders and VCs." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="05" title="Curated People" desc="Serious builders around you, consistently." />
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
