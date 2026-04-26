import Link from "next/link";

import { MarketingShell } from "@/components/marketing/marketing-shell";
import { COHORT_1_STARTUPS } from "@/lib/data/cohort";

const CURRENT_COHORT = 1;

export const metadata = {
  title: `Batch: Cohort ${CURRENT_COHORT} / ucsb.network`,
  description:
    "The startups and founder accomplishments in the current ucsb.network accelerator cohort."
};

export default function BatchPage() {
  const accomplishmentCount = COHORT_1_STARTUPS.reduce(
    (total, startup) =>
      total +
      startup.accomplishments.reduce((sum, founder) => sum + founder.items.length, 0),
    0
  );

  return (
    <MarketingShell>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <p className="eyebrow-accent">Cohort {CURRENT_COHORT} &middot; Spring 2026</p>
          <h1 className="mt-6 max-w-4xl font-display text-display-lg tracking-tightest text-ink">
            Cohort 1 portfolio.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/80">
            Six startups in the first cohort, each led by builders with proof of
            speed, technical depth, and competitive edge before Demo Day.
          </p>
          <div className="mt-12 grid max-w-3xl grid-cols-3 gap-8 max-sm:grid-cols-1">
            <Stat num={String(COHORT_1_STARTUPS.length)} label="Startups" />
            <Stat num={String(accomplishmentCount)} label="Founder proof points" />
            <Stat num="8" label="Weeks of building" />
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="border-y border-ink/10">
            {COHORT_1_STARTUPS.map((s, i) => (
              <article
                key={s.company}
                className="grid w-full min-w-0 gap-8 overflow-hidden border-b border-ink/10 py-10 last:border-b-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)] lg:gap-14"
              >
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-6">
                    <p className="eyebrow-accent">{s.category}</p>
                    <span className="font-mono text-[11px] tabular-nums text-muted">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-display-sm text-ink">
                    {s.company}
                  </h2>
                  <p className="mt-3 text-sm text-muted">{s.founders}</p>
                  {s.website ? (
                    <a
                      href={s.website}
                      target="_blank"
                      rel="noreferrer"
                      className="link-editorial mt-5 inline-block text-sm"
                    >
                      Visit company &rarr;
                    </a>
                  ) : null}
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-2xl leading-snug text-ink">
                    {s.building}
                  </h3>
                  {s.mission ? (
                    <p className="mt-4 max-w-3xl break-words text-base leading-relaxed text-ink/75">
                      {s.mission}
                    </p>
                  ) : null}

                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {s.accomplishments.length > 0 ? (
                      s.accomplishments.map((founder) => (
                        <div
                          key={founder.name ?? s.company}
                          className="min-w-0 border border-line bg-panel/55 p-5"
                        >
                          {founder.name ? (
                            <p className="eyebrow text-ink">{founder.name}</p>
                          ) : null}
                          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80">
                            {founder.items.map((item) => (
                              <li key={item} className="grid min-w-0 grid-cols-[0.75rem_minmax(0,1fr)] gap-3">
                                <span className="mt-[0.6em] h-1.5 w-1.5 bg-accent" />
                                <span className="min-w-0 break-words">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    ) : (
                      <div className="border border-dashed border-line bg-panel/35 p-5 md:col-span-2">
                        <p className="eyebrow">Accomplishments</p>
                        <p className="mt-4 text-sm leading-relaxed text-muted">
                          Founder accomplishments are being finalized for this profile.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
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
