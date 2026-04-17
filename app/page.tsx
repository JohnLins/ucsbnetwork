import Image from "next/image";
import Link from "next/link";

import { MarketingShell } from "@/components/marketing/marketing-shell";
import { COHORT_1_STARTUPS } from "@/lib/data/cohort";

const CURRENT_COHORT = 1;

export default async function HomePage() {

  return (
    <MarketingShell
      announcement={{
        label: "Spring 2026 Cohort is shipping. Demo Day coming soon.",
        href: "/demo-day",
        ctaLabel: "See what\u2019s coming"
      }}
    >
      {/* ── Hero ── */}
      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1.2fr_1fr] lg:px-8 lg:py-28">
          <div>
            <p className="eyebrow-accent">Santa Barbara &middot; Est. 2026</p>
            <h1 className="mt-6 font-display text-display-xl tracking-tightest text-ink">
              The UCSB<br />accelerator.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/80">
              An 8-week program for UCSB founders. Each startup is matched with
              a dedicated mentor for weekly office hours, and the program ends
              with a Demo Day in front of VCs and operators.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/apply" className="btn-primary">
                Apply to the next cohort
              </Link>
              <Link href="/program" className="btn-secondary">
                Read the program
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted">
              Advised by alumni at Meta, NASA, YC, ByteDance, and more.
            </p>
          </div>

          <aside className="relative lg:border-l lg:border-ink/10 lg:pl-10">
            <p className="eyebrow">Cohort 1 &middot; Spring 2026</p>
            <div className="mt-8 grid grid-cols-3 gap-y-8 gap-x-6">
              <Stat num="8" label="Weeks of focused building" />
              <Stat num="6" label="Startups in the cohort" />
              <Stat num="1" label="Demo Day to VCs" />
            </div>
            <hr className="hr-hairline mt-10" />
            <p className="mt-6 text-sm text-muted">
              Partnered with{" "}
              <span className="text-ink">Cursor</span> and{" "}
              <span className="text-ink">Mindfort AI</span>. Credits, tooling,
              and introductions throughout the program.
            </p>
          </aside>
        </div>
      </section>

      {/* ── What we do ── */}
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="eyebrow-accent">What we do</p>
          <h2 className="mt-4 max-w-3xl font-display text-display-md text-ink">
            Eight weeks to go from idea to Demo Day.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80">
            A focused, in-person program in Santa Barbara built around a
            dedicated mentor for every startup, weekly office hours, and a Demo
            Day that puts you in the room with the right people.
          </p>

          <div className="mt-16">
            <ProgramRow
              n="01"
              title="Dedicated mentor, weekly office hours"
              desc="Every startup is matched with one mentor for the full program: YC founders, exited operators, and alumni. You meet 1:1 every week."
            />
            <ProgramRow
              n="02"
              title="Mid-program hackathon"
              desc="A weekend hackathon for the cohort and a handful of outside UCSB builders. Credits for winners and for every participant."
              link={{ href: "/hackathon", label: "Hackathon details" }}
            />
            <ProgramRow
              n="03"
              title="Build credits and tools"
              desc="Cursor Pro, AI credits, and infra from our partners so you can spend the time shipping."
            />
            <ProgramRow
              n="04"
              title="Demo Day"
              desc="The program ends with a Demo Day. Pitch what you built to VCs, operators, and the broader UCSB founder network."
              link={{ href: "/demo-day", label: "About Demo Day" }}
            />
          </div>

          <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-ink/10 pt-8">
            <span className="eyebrow">Partnered with</span>
            <PartnerInline src="/mindfort-logo.jpeg" alt="Mindfort AI" />
            <PartnerInline src="/cursor-logo.png" alt="Cursor" />
          </div>
        </div>
      </section>

      {/* ── Batch preview ── */}
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <div>
              <p className="eyebrow-accent">Cohort {CURRENT_COHORT}</p>
              <h2 className="mt-4 font-display text-display-sm text-ink">
                What the cohort is building.
              </h2>
            </div>
            <Link href="/batch" className="link-editorial text-sm">
              See the full batch &rarr;
            </Link>
          </div>

          <div className="mt-12 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {COHORT_1_STARTUPS.map((s) => (
              <div key={s.category} className="bg-paper p-6">
                <p className="eyebrow-accent">{s.category}</p>
                <p className="mt-4 font-display text-xl leading-snug text-ink">
                  {s.building}
                </p>
                <p className="mt-3 text-sm text-muted">{s.founders}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For VCs & operators ── */}
      <section className="border-b border-ink/10 bg-navy text-paper">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-24">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            For VCs &amp; operators
          </p>
          <h2 className="mt-4 max-w-3xl font-display text-display-sm">
            First look at UCSB&rsquo;s best founders.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/80">
            Demo Day is the culmination of eight weeks of focused work. If you
            invest in pre-seed and seed, or want to meet the UCSB builders
            shipping right now, we want you there.
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            <PartnerBlock
              title="Demo Day access"
              desc="Curated pitches from a vetted cohort. See the teams and the traction before anyone else."
            />
            <PartnerBlock
              title="Mentor a team"
              desc="Take on a startup for the program. Weekly office hours, early relationships, direct access."
            />
            <PartnerBlock
              title="Warm intros"
              desc="Direct access to founders through the member directory and our network."
            />
          </div>

          <div className="mt-12 flex items-center gap-4">
            <a
              href="mailto:hursh@ucsb.network"
              className="btn-primary text-sm"
            >
              Get in touch
            </a>
            <Link
              href="/demo-day"
              className="text-sm text-paper underline decoration-accent underline-offset-4 transition hover:text-accent"
            >
              Demo Day details
            </Link>
          </div>
        </div>
      </section>

      {/* ── Apply CTA ── */}
      <section>
        <div className="mx-auto max-w-4xl px-6 py-24 text-center lg:px-8">
          <p className="eyebrow-accent">Apply</p>
          <h2 className="mt-4 font-display text-display-md text-ink">
            Cohort 2 applications open soon.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/80">
            If you&rsquo;re a UCSB founder or builder with something to show,
            tell us what you&rsquo;re working on.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/apply" className="btn-primary">
              Apply now
            </Link>
            <Link href="/faq" className="btn-secondary">
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <p className="font-display text-4xl leading-none text-ink">{num}</p>
      <p className="mt-2 text-sm leading-snug text-muted">{label}</p>
    </div>
  );
}

function ProgramRow({
  n,
  title,
  desc,
  link
}: {
  n: string;
  title: string;
  desc: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="grid grid-cols-[3rem_1fr] gap-6 border-t border-ink/10 py-8 first:border-t-0 md:grid-cols-[4rem_1fr] md:gap-10">
      <span className="font-mono text-sm tabular-nums text-accent">{n}</span>
      <div>
        <h3 className="font-display text-2xl text-ink">{title}</h3>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/80">
          {desc}
        </p>
        {link ? (
          <Link
            href={link.href}
            className="link-editorial mt-4 inline-block text-sm"
          >
            {link.label} &rarr;
          </Link>
        ) : null}
      </div>
    </div>
  );
}

function PartnerInline({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={110}
      height={28}
      className="h-7 w-auto object-contain opacity-80"
    />
  );
}

function PartnerBlock({ title, desc }: { title: string; desc: string }) {
  return (
    <div>
      <h3 className="font-display text-xl text-paper">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-paper/75">{desc}</p>
    </div>
  );
}
