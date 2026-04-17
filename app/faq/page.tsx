import Link from "next/link";

import { MarketingShell } from "@/components/marketing/marketing-shell";

export const metadata = {
  title: "FAQ: ucsb.network",
  description:
    "Frequently asked questions about the ucsb.network accelerator, hackathon, and Demo Day."
};

type FaqGroup = {
  heading: string;
  items: Array<{ q: string; a: string }>;
};

const GROUPS: FaqGroup[] = [
  {
    heading: "The program",
    items: [
      {
        q: "How long is the program?",
        a: "Eight weeks. We run it in person in Santa Barbara. It overlaps with the academic term so you can participate while studying."
      },
      {
        q: "How many startups are in each cohort?",
        a: "Lean on purpose. Six startups in the first cohort, each matched with a dedicated mentor. Future cohorts stay small."
      },
      {
        q: "Does the program take equity?",
        a: "No. We do not take equity. Our goal is to back UCSB founders with mentorship, community, and an audience on Demo Day."
      },
      {
        q: "What does the commitment look like week to week?",
        a: "Expect a weekly 1:1 with your mentor, a peer check-in, occasional evening events, and the hackathon weekend mid-program. The rest is building."
      }
    ]
  },
  {
    heading: "Eligibility",
    items: [
      {
        q: "Do I have to be a current UCSB student?",
        a: "We prioritize current UCSB students, recent alumni, faculty, and researchers. If you have a clear UCSB connection and are building something real, apply."
      },
      {
        q: "Do I need a co-founder?",
        a: "No. Solo founders and small teams are both welcome."
      },
      {
        q: "Do I need an incorporated company?",
        a: "No. We care about what you are building and whether you can ship. Legal structure is not a prerequisite."
      }
    ]
  },
  {
    heading: "Hackathon",
    items: [
      {
        q: "Who can enter the hackathon?",
        a: "Every cohort partner automatically qualifies. We also open a small number of spots to outside UCSB builders through the hackathon signup on the hackathon page."
      },
      {
        q: "What do winners get?",
        a: "$1,000 in credits across our partner stack. Every participant who ships also gets $250 in credits."
      },
      {
        q: "How do I sign up if I am not in the cohort?",
        a: "Fill out the short form on the hackathon page. Spots are limited and we reach out personally."
      }
    ]
  },
  {
    heading: "Demo Day",
    items: [
      {
        q: "Who attends Demo Day?",
        a: "Pre-seed and seed VCs, UCSB alumni operators, and partners of the program. It is invite-only."
      },
      {
        q: "Can I attend as an investor?",
        a: "Yes. Email hursh@ucsb.network and tell us a bit about your fund. We make every effort to include serious pre-seed and seed investors."
      }
    ]
  }
];

export default function FaqPage() {
  return (
    <MarketingShell>
      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-5xl px-6 py-20 lg:px-8 lg:py-28">
          <p className="eyebrow-accent">Frequently asked</p>
          <h1 className="mt-6 font-display text-display-lg tracking-tightest text-ink">
            Questions, answered.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/80">
            If you have something that isn&rsquo;t here, email{" "}
            <a
              href="mailto:hursh@ucsb.network"
              className="link-editorial"
            >
              hursh@ucsb.network
            </a>
            . We answer personally.
          </p>
        </div>
      </section>

      {GROUPS.map((group) => (
        <section key={group.heading} className="border-b border-ink/10">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-16 lg:grid-cols-[12rem_1fr] lg:px-8">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-accent">
              {group.heading}
            </p>
            <div>
              {group.items.map((item, i) => (
                <div
                  key={item.q}
                  className="border-t border-ink/10 py-8 first:border-t-0"
                >
                  <p className="font-mono text-xs text-muted">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-xl leading-snug text-ink">
                    {item.q}
                  </h3>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink/80">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section>
        <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-8">
          <h2 className="font-display text-display-md text-ink">
            Still have questions?
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-ink/80">
            We read every email. Tell us what you&rsquo;re working on and
            what you want to know.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:hursh@ucsb.network" className="btn-primary">
              Email the team
            </a>
            <Link href="/apply" className="btn-secondary">
              Apply now
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
