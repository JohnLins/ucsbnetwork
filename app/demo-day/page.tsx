import Link from "next/link";

import { MarketingShell } from "@/components/marketing/marketing-shell";
import { getAllEvents } from "@/lib/data/events";
import type { EventRecord } from "@/lib/types";

export const metadata = {
  title: "Demo Day: ucsb.network",
  description:
    "Demo Day is the culmination of the ucsb.network accelerator. See the next one."
};

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  };
}

function partitionDemoDays(events: EventRecord[]) {
  const now = new Date().getTime();
  const upcoming = events.find((e) => new Date(e.eventDate).getTime() >= now);
  const past = events.filter((e) => new Date(e.eventDate).getTime() < now);
  return { upcoming, past };
}

export default async function DemoDayPage() {
  const events = await getAllEvents();
  const demoDays = events.filter((e) => /demo\s*day/i.test(e.title));
  const { upcoming: upcomingDemoDay, past: pastDemoDays } = partitionDemoDays(demoDays);

  return (
    <MarketingShell>
      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1.3fr_1fr] lg:px-8 lg:py-28">
          <div>
            <p className="eyebrow-accent">End of program showcase</p>
            <h1 className="mt-6 font-display text-display-xl tracking-tightest text-ink">
              Demo Day.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/80">
              Eight weeks of focused building end with a single night: Demo
              Day. The cohort pitches what they built to VCs, operators, and
              the broader UCSB founder network. Short talks, live Q&amp;A,
              warm intros.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="#next" className="btn-primary">
                See the next Demo Day
              </Link>
              <a href="mailto:hursh@ucsb.network" className="btn-secondary">
                Request an invite
              </a>
            </div>
          </div>

          <aside className="lg:border-l lg:border-ink/10 lg:pl-10">
            <p className="eyebrow">For investors</p>
            <h2 className="mt-4 font-display text-2xl leading-snug text-ink">
              First look at UCSB&rsquo;s best founders.
            </h2>
            <ul className="mt-6 space-y-4 text-sm leading-relaxed text-ink/80">
              <li>
                <span className="text-accent">&rarr;</span> Pre-seed and seed
                investors in the room.
              </li>
              <li>
                <span className="text-accent">&rarr;</span> Direct Q&amp;A with
                founders after each pitch.
              </li>
              <li>
                <span className="text-accent">&rarr;</span> Access to the full
                member directory afterwards.
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Upcoming Demo Day */}
      <section id="next" className="border-b border-ink/10 scroll-mt-20">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <p className="eyebrow-accent">Next Demo Day</p>
          {upcomingDemoDay ? (
            <UpcomingDemoDayBlock event={upcomingDemoDay} />
          ) : (
            <div className="mt-6 border border-ink/10 p-8 sm:p-10 lg:p-12">
              <h2 className="font-display text-display-sm text-ink">
                To be announced.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/80">
                We announce Demo Day once the cohort kicks off. Email{" "}
                <a
                  href="mailto:hursh@ucsb.network"
                  className="link-editorial"
                >
                  hursh@ucsb.network
                </a>{" "}
                if you&rsquo;d like an invite when the date is set.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Demo Days */}
      {pastDemoDays.length > 0 ? (
        <section className="border-b border-ink/10">
          <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
            <p className="eyebrow-accent">Past Demo Days</p>
            <div className="mt-10 space-y-0">
              {pastDemoDays.map((event) => {
                const { date } = formatDateTime(event.eventDate);
                return (
                  <div
                    key={event.id}
                    className="grid gap-2 border-t border-ink/10 py-6 first:border-t-0 sm:grid-cols-[10rem_1fr] sm:gap-8"
                  >
                    <p className="font-mono text-xs uppercase tracking-wide text-muted">
                      {date}
                    </p>
                    <div>
                      <h3 className="font-display text-xl text-ink">{event.title}</h3>
                      {event.description ? (
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/75">
                          {event.description}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-8">
          <h2 className="font-display text-display-md text-ink">
            Founders, apply. Investors, email.
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/apply" className="btn-primary">
              Apply to the cohort
            </Link>
            <a href="mailto:hursh@ucsb.network" className="btn-secondary">
              Reach the team
            </a>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function UpcomingDemoDayBlock({ event }: { event: EventRecord }) {
  const { date, time } = formatDateTime(event.eventDate);
  return (
    <div className="mt-6 grid gap-10 border border-ink/10 p-6 sm:p-10 lg:grid-cols-[1fr_1fr]">
      <div>
        <h2 className="font-display text-display-sm text-ink">{event.title}</h2>
        {event.description ? (
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink/80">
            {event.description}
          </p>
        ) : null}
        <div className="mt-8 space-y-3 text-sm">
          <div className="flex items-baseline gap-3">
            <span className="w-20 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              Date
            </span>
            <span className="text-ink">{date}</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="w-20 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              Time
            </span>
            <span className="text-ink">{time}</span>
          </div>
          {event.location ? (
            <div className="flex items-baseline gap-3">
              <span className="w-20 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                Where
              </span>
              <span className="text-ink">{event.location}</span>
            </div>
          ) : null}
        </div>
      </div>
      <aside className="lg:border-l lg:border-ink/10 lg:pl-10">
        <p className="eyebrow">Request an invite</p>
        <p className="mt-4 text-sm leading-relaxed text-ink/80">
          Demo Day is invite-only. If you invest or operate and want to be in
          the room, tell us a bit about yourself.
        </p>
        <a
          href={`mailto:hursh@ucsb.network?subject=Demo%20Day%20invite%3A%20${encodeURIComponent(event.title)}`}
          className="btn-primary mt-6 w-full text-sm"
        >
          Request an invite
        </a>
      </aside>
    </div>
  );
}
