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
              This spring, we&rsquo;re running an 8-week sprint &mdash; weekly
              office hours with operators, feedback sessions, and a Demo Day
              in front of VCs and founders.
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

        {/* ── Sprint at a glance ── */}
        <section className="border-t border-line/10 px-6 py-16">
          <Reveal className="mx-auto max-w-3xl">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg border border-accent/20 px-5 py-4 text-center">
                <p className="text-lg font-semibold text-ink">8 Weeks</p>
                <p className="mt-1 text-xs text-muted">of focused building</p>
              </div>
              <div className="rounded-lg border border-accent/20 px-5 py-4 text-center">
                <p className="text-lg font-semibold text-ink">Office Hours</p>
                <p className="mt-1 text-xs text-muted">weekly with operators</p>
              </div>
              <div className="rounded-lg border border-accent/20 px-5 py-4 text-center">
                <p className="text-lg font-semibold text-ink">Feedback</p>
                <p className="mt-1 text-xs text-muted">sessions every week</p>
              </div>
              <div className="rounded-lg border border-accent/20 px-5 py-4 text-center">
                <p className="text-lg font-semibold text-ink">Demo Day</p>
                <p className="mt-1 text-xs text-muted">pitch to VCs & founders</p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ── Spring Sprint ── */}
        <section
          id="sprint"
          data-section
          className="flex min-h-[100dvh] items-center justify-center border-t border-line/10 px-6"
        >
          <div className="mx-auto w-full max-w-2xl">
            <Reveal>
              <span className="text-[10px] uppercase tracking-[0.3em] text-accent">
                Spring 2026
              </span>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Spring Sprint.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                8 weeks of building, shipping, and getting real feedback &mdash;
                culminating in a Demo Day where you pitch what you&rsquo;ve built
                to VCs, operators, and founders.
              </p>
            </Reveal>
            <div className="mt-16 space-y-0">
              <Reveal direction="left">
                <div className="py-8">
                  <EventRow num="01" title="Weekly Office Hours" desc="1-on-1 and small-group sessions with operators who've scaled products, raised rounds, and hired teams." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="02" title="Feedback Sessions" desc="Present your progress each week. Get honest, structured feedback from peers, mentors, and past founders." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="03" title="Build Together" desc="Co-work sessions, build nights, and a curated cohort of serious builders pushing each other forward." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="04" title="$250+ in AI Credits & Cursor Pro" desc="Every sprint member gets AI credits and Cursor Pro to build faster." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="05" title="Demo Day" desc="The sprint ends with a Demo Day. Pitch in front of VCs, operators, and the broader UCSB founder network." />
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
                For VCs & operators.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted">
                Demo Day is the culmination of our 8-week sprint. Join as a
                mentor during the program or attend Demo Day to see what
                UCSB&rsquo;s best builders are shipping.
              </p>
            </Reveal>
            <div className="mt-16 space-y-0">
              <Reveal direction="left">
                <div className="py-8">
                  <EventRow num="01" title="Demo Day Access" desc="See curated pitches from a vetted cohort of UCSB builders after 8 weeks of focused development." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="02" title="Office Hours & Mentorship" desc="Run office hours during the sprint. Shape what's being built and build relationships early." />
                </div>
              </Reveal>
              <Reveal direction="left">
                <div className="border-t border-line/20 py-8">
                  <EventRow num="03" title="Warm Intros & Deal Flow" desc="Direct access to founders through the member directory and network." />
                </div>
              </Reveal>
            </div>
            <Reveal>
              <p className="mt-12 text-sm text-muted">
                Want to mentor or attend Demo Day?{" "}
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
