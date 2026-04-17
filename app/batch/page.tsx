import Link from "next/link";

import { MarketingShell } from "@/components/marketing/marketing-shell";
import { COHORT_1_STARTUPS } from "@/lib/data/cohort";

const CURRENT_COHORT = 1;

export const metadata = {
  title: `Batch: Cohort ${CURRENT_COHORT} / ucsb.network`,
  description:
    "The startups building in the current ucsb.network accelerator cohort."
};

export default function BatchPage() {
  return (
    <MarketingShell>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <p className="eyebrow-accent">Cohort {CURRENT_COHORT} &middot; Spring 2026</p>
          <h1 className="mt-6 max-w-4xl font-display text-display-lg tracking-tightest text-ink">
            The current batch.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/80">
            Six startups in the first cohort, each matched with a dedicated
            mentor for weekly office hours. Companies are in build mode; they
            pitch at Demo Day.
          </p>
          <div className="mt-12 grid max-w-3xl grid-cols-3 gap-8">
            <Stat num={String(COHORT_1_STARTUPS.length)} label="Startups" />
            <Stat num="8" label="Weeks of building" />
            <Stat num="1" label="Demo Day" />
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {COHORT_1_STARTUPS.map((s, i) => (
              <article key={s.category} className="flex flex-col gap-4 bg-paper p-8">
                <div className="flex items-baseline justify-between">
                  <p className="eyebrow-accent">{s.category}</p>
                  <span className="font-mono text-[11px] tabular-nums text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-display text-2xl leading-snug text-ink">
                  {s.building}
                </h3>
                <p className="mt-auto pt-4 text-sm text-muted">{s.founders}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-8">
          <h2 className="font-display text-display-md text-ink">
            Want to see them pitch?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-ink/80">
            Demo Day is the end-of-program showcase. RSVP for the next one.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/demo-day" className="btn-primary">
              Demo Day details
            </Link>
            <a href="mailto:hursh@ucsb.network" className="btn-secondary">
              Invest &amp; mentor
            </a>
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
