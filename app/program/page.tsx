import Link from "next/link";

import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "Program: ucsb.network",
  description:
    "Eight weeks of focused building: a dedicated mentor, weekly office hours, a hackathon, and a Demo Day in front of VCs."
};

const TIMELINE = [
  {
    weeks: "Week 1",
    title: "Kickoff & mentor match",
    desc: "The cohort meets in person. Every startup is paired with one dedicated mentor for the full program: YC founders, exited operators, and alumni who have built and shipped."
  },
  {
    weeks: "Weeks 1\u20138",
    title: "Weekly 1:1 office hours",
    desc: "You meet with your mentor every week for the full eight weeks. Structured progress reviews, direct feedback, and intros when you need them."
  },
  {
    weeks: "Week 4",
    title: "Hackathon weekend",
    desc: "A mid-program weekend for the cohort plus a handful of outside UCSB builders. $1,000 in credits for the winner; $250 in credits for everyone who ships."
  },
  {
    weeks: "Weeks 5\u20137",
    title: "Build, measure, iterate",
    desc: "Double down on what is working. Target users, measure what matters, and shape the story you will tell on Demo Day."
  },
  {
    weeks: "Week 8",
    title: "Demo Day",
    desc: "Pitch to VCs, operators, and the UCSB founder network. Warm intros that actually go somewhere."
  }
];

const BENEFITS = [
  {
    title: "Dedicated mentor",
    desc: "One mentor matched to your startup for the full program. Weekly 1:1 office hours, every week."
  },
  {
    title: "Mentor network",
    desc: "Operators, founders, and VCs from Meta, NASA, YC, ByteDance, and more."
  },
  {
    title: "Build credits",
    desc: "Cursor Pro, AI credits, and tooling discounts across the program."
  },
  {
    title: "Hackathon credits",
    desc: "$1,000 in credits for the winner; $250 in credits for everyone who participates."
  },
  {
    title: "Demo Day audience",
    desc: "Pre-seed and seed investors, UCSB operators, and the broader network."
  },
  {
    title: "Continued access",
    desc: "Alumni keep access to the member directory, events, and intros after the program."
  }
];

const CRITERIA = [
  "You are current UCSB (undergrad, grad, faculty, or recent alum).",
  "You are actively building: code shipped, users talking, something to show.",
  "You can commit to weekly sessions and in-person events in Santa Barbara for eight weeks.",
  "You will show up for your cohort. We pick builders who help other builders."
];

export default function ProgramPage() {
  return (
    <MarketingShell>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="eyebrow-accent">The program</p>
          <h1 className="mt-6 max-w-3xl font-display text-display-lg tracking-tightest text-ink">
            Eight weeks. One mentor each. One Demo Day.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink/80">
            A focused, in-person program in Santa Barbara. At the end of eight
            weeks you have something real, and the right people are in the
            room to take it further.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <p className="eyebrow-accent">Timeline</p>
          <h2 className="mt-4 font-display text-display-md text-ink">
            How the eight weeks flow.
          </h2>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80">
            The backbone is the weekly 1:1 with your mentor. Around that sits
            a mid-program hackathon and a Demo Day at week eight.
          </p>
          <div className="mt-14">
            {TIMELINE.map((item, i) => (
              <div
                key={item.weeks}
                className="grid grid-cols-1 gap-2 border-t border-ink/10 py-8 first:border-t-0 md:grid-cols-[10rem_1fr] md:gap-10"
              >
                <p className="font-mono text-xs uppercase tracking-[0.22em] text-accent">
                  {String(i + 1).padStart(2, "0")} &middot; {item.weeks}
                </p>
                <div>
                  <h3 className="font-display text-2xl text-ink">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/80">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <p className="eyebrow-accent">What you get</p>
          <h2 className="mt-4 max-w-2xl font-display text-display-md text-ink">
            Everything you need to ship.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="bg-paper p-8">
                <p className="eyebrow-accent">Included</p>
                <h3 className="mt-4 font-display text-xl text-ink">{b.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/75">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we pick */}
      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-5xl gap-14 px-6 py-20 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <div>
            <p className="eyebrow-accent">Selection</p>
            <h2 className="mt-4 font-display text-display-sm text-ink">
              Who we pick.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink/80">
              We are lean on purpose. Six startups in the first cohort, each
              with a dedicated mentor. We pick builders.
            </p>
          </div>
          <ul className="space-y-0">
            {CRITERIA.map((c, i) => (
              <li
                key={c}
                className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-ink/10 py-5 first:border-t-0"
              >
                <span className="font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-ink/90">{c}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-8">
          <h2 className="font-display text-display-md text-ink">
            Ready to apply?
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ink/80">
            Applications for the next cohort open soon. If you&rsquo;re
            building something real, we want to hear from you.
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
