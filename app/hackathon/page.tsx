import Link from "next/link";

import { HackathonSignupForm } from "@/components/marketing/hackathon-signup-form";
import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "Hackathon: ucsb.network",
  description:
    "May 23rd, 2026 \u2022 9am\u20139pm \u2022 Loma Pelona Center. A 12-hour hackathon for the cohort plus a handful of outside UCSB builders. Grand prize of $1,000 in any AI credits, plus $250 in AI credits for every participant."
};

const PRIZES = [
  {
    tag: "Grand prize",
    title: "$1,000 in any AI credits",
    desc: "The winning team picks the stack: $1,000 in credits at the AI provider of their choice."
  },
  {
    tag: "Every participant",
    title: "$250 in AI credits",
    desc: "Everyone who ships a project gets $250 in AI credits. Show up, build something, leave with resources to keep going."
  },
  {
    tag: "Outside winners",
    title: "Priority for next cohort",
    desc: "If your team wins and you\u2019re not already in the current cohort, you move to the top of the pile for the next ucsb.network intake."
  },
  {
    tag: "Partner tools",
    title: "Cursor Pro & more",
    desc: "Cursor Pro, partner AI credits, and a stack discount across our partners for hackathon participants."
  }
];

const RULES = [
  "Teams of up to four. Solo entries are welcome.",
  "Build what you want, but be specific about the user and the problem.",
  "All core code written during the 12-hour event. Boilerplate is fine.",
  "Judging on product quality, traction, and the quality of your demo.",
  "Cohort partners automatically qualify. Outside builders are picked from the signup list."
];

export default function HackathonPage() {
  return (
    <MarketingShell>
      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1.3fr_1fr] lg:px-8 lg:py-28">
          <div>
            <p className="eyebrow-accent">May 23rd, 2026 • 9am–9pm • Loma Pelona Center</p>
            <h1 className="mt-6 font-display text-display-xl tracking-tightest text-ink">
              The<br />hackathon.
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink/80">
              A 12-hour hackathon for the cohort plus a handful of outside
              UCSB builders. One day, one product, live judging. $1,000 in
              any AI credits for the winner; $250 in AI credits for every
              participant.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="#signup" className="btn-primary">
                Sign up (outside builders)
              </Link>
              <Link href="#prizes" className="btn-secondary">
                Prizes
              </Link>
            </div>
          </div>
          <aside className="lg:border-l lg:border-ink/10 lg:pl-10">
            <p className="eyebrow">The deal</p>
            <ul className="mt-6 space-y-5 text-sm leading-relaxed text-ink/80">
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-accent">01</span>
                <span>Saturday, May 23rd, 2026 — 10am to 10pm.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-accent">02</span>
                <span>Loma Pelona Center, UCSB. In person, all day.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-accent">03</span>
                <span>Live judging with operators and VCs. Winners announced that night.</span>
              </li>
              <li className="flex items-baseline gap-3">
                <span className="font-mono text-xs text-accent">04</span>
                <span>$1,000 in any AI credits to the winner; $250 to everyone who ships.</span>
              </li>
            </ul>
          </aside>
        </div>
      </section>

      {/* Prizes */}
      <section id="prizes" className="border-b border-ink/10 scroll-mt-20">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8">
          <p className="eyebrow-accent">Prizes</p>
          <h2 className="mt-4 max-w-2xl font-display text-display-md text-ink">
            AI credits for the winner, AI credits for everyone.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {PRIZES.map((p) => (
              <div key={p.title} className="bg-paper p-8">
                <p className="eyebrow-accent">{p.tag}</p>
                <h3 className="mt-4 font-display text-2xl text-ink">{p.title}</h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/75">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rules / Format */}
      <section className="border-b border-ink/10">
        <div className="mx-auto grid max-w-5xl gap-14 px-6 py-20 lg:grid-cols-[1fr_1.4fr] lg:px-8">
          <div>
            <p className="eyebrow-accent">Format</p>
            <h2 className="mt-4 font-display text-display-sm text-ink">
              Simple rules.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-ink/80">
              Build something specific, show it off, ship it after.
            </p>
          </div>
          <ul className="space-y-0">
            {RULES.map((r, i) => (
              <li
                key={r}
                className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink/10 py-5 first:border-t-0"
              >
                <span className="font-mono text-sm text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-base leading-relaxed text-ink/90">{r}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Signup */}
      <section id="signup" className="border-b border-ink/10 scroll-mt-20 bg-panel/50">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="eyebrow-accent">Outside builders</p>
              <h2 className="mt-4 font-display text-display-sm text-ink">
                Sign up.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-ink/80">
                Spots for non-cohort builders are limited and we pick by hand.
                Tell us a little about you and what you&rsquo;d build.
              </p>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                In the current cohort? You&rsquo;re already in. The hackathon
                is part of the program and will show up in your{" "}
                <Link href="/members/events" className="link-editorial">
                  member events
                </Link>
                .
              </p>
            </div>
            <div className="border border-ink/10 bg-paper p-8 lg:p-10">
              <HackathonSignupForm />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-8">
          <h2 className="font-display text-display-md text-ink">
            One day, one product, AI credits for everyone.
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-ink/80">
            May 23rd, 2026 at the Loma Pelona Center. Sign up above if
            you&rsquo;re outside the cohort and want in.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/apply" className="btn-primary">
              Apply to the cohort
            </Link>
            <Link href="/program" className="btn-secondary">
              Read the program
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
