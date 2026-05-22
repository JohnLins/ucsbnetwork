import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

import { MarketingShell } from "@/components/marketing/marketing-shell";
import { COHORT_1_STARTUPS } from "@/lib/data/cohort";

import arthurHeadshot from "../../headshotsforsite/Arthur.avif";
import hurshHeadshot from "../../headshotsforsite/Hursh.png";
import joaquinHeadshot from "../../headshotsforsite/Joaquinn.avif";
import kayHeadshot from "../../headshotsforsite/Kay.png";
import leonHeadshot from "../../headshotsforsite/Leon.avif";
import nagHeadshot from "../../headshotsforsite/Nag.avif";
import quinnHeadshot from "../../headshotsforsite/Quinn.png";
import stantonHeadshot from "../../headshotsforsite/Stanton.png";
import viktorHeadshot from "../../headshotsforsite/Viktor.png";

const CURRENT_COHORT = 1;

export const metadata = {
  title: `Portfolio: Cohort ${CURRENT_COHORT} / ucsb.network`,
  description:
    "The investor portfolio for the current ucsb.network accelerator cohort."
};

const HEADSHOTS: Record<string, StaticImageData> = {
  Arthur: arthurHeadshot,
  Hursh: hurshHeadshot,
  Joaquin: joaquinHeadshot,
  Kay: kayHeadshot,
  Leon: leonHeadshot,
  Nag: nagHeadshot,
  Quinn: quinnHeadshot,
  Stanton: stantonHeadshot,
  Viktor: viktorHeadshot
};

const DIRECTORS = [
  {
    name: "Hursh Shah",
    role: "Director",
    href: "https://www.linkedin.com/in/hursh-shah/",
    image: hurshHeadshot,
    bio: "Founder of Edviro and ucsb.network, previously co-founded SkyGlass, presented at NeurIPS 2024 GenAI4Health, and selected for OpenAI's ChatGPT Lab as 1 of 30 students.",
    proof: ["Edviro founder", "NeurIPS 2024", "OpenAI ChatGPT Lab"]
  },
  {
    name: "Leon Khoshnevis",
    role: "Director",
    href: "https://www.linkedin.com/in/leonkhoshnevis/",
    image: leonHeadshot,
    bio: "Founder of Playa House, previously co-founded SBVenture and Correkt AI, a multimodal AI search engine with 40K users, and led neuro research his first year at UCSB.",
    proof: ["Playa House founder", "40K users", "Neuro research"]
  }
];

const PORTFOLIO_METRICS = [
  { value: "06", label: "Startups in Cohort 1" },
  { value: "08", label: "Weeks to Demo Day" },
  { value: "VC", label: "Investor-facing showcase" }
];

function splitFounders(founders: string) {
  return founders.split(/\s*&\s*|\s*,\s*/).filter(Boolean);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function BatchPage() {
  return (
    <MarketingShell>
      <section className="relative isolate overflow-hidden border-b border-ink/10 bg-navy text-paper">
        <div className="absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 -z-10 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-paper/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
              Cohort {CURRENT_COHORT} &middot; Investor portfolio
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-display-xl tracking-tightest">
              UCSB founders with unfair velocity.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-paper/80">
              A first look at the builders in the ucsb.network accelerator:
              technical founders across bio ML, AI infrastructure, real estate,
              legal, hardware, and sales tech.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link href="/demo-day" className="btn-primary">
                Request Demo Day access
              </Link>
              <a
                href="mailto:hursh@ucsb.network?subject=ucsb.network%20portfolio"
                className="border border-paper/70 px-5 py-3 text-sm font-medium text-paper transition hover:bg-paper hover:text-navy"
              >
                Reach the directors
              </a>
            </div>
          </div>

          <aside className="relative">
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {["Hursh", "Leon", "Kay", "Stanton", "Arthur", "Joaquin", "Quinn", "Nag", "Viktor"].map(
                (name, i) => (
                  <div
                    key={name}
                    className={`relative overflow-hidden border border-paper/15 bg-paper/10 ${
                      i % 2 === 0 ? "aspect-[4/5]" : "mt-8 aspect-[4/5]"
                    }`}
                  >
                    <Image
                      src={HEADSHOTS[name]}
                      alt={`${name} headshot`}
                      fill
                      sizes="(min-width: 1024px) 10vw, 28vw"
                      className="object-cover grayscale transition duration-500 hover:grayscale-0"
                      priority={i < 3}
                    />
                  </div>
                )
              )}
            </div>
            <div className="mt-6 border border-paper/15 bg-paper/10 p-5 backdrop-blur">
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-accent">
                Spring 2026
              </p>
              <p className="mt-3 text-sm leading-relaxed text-paper/75">
                Curated for investors and operators looking for the next UCSB
                companies before Demo Day.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-14 lg:px-8">
          <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 md:grid-cols-3">
            {PORTFOLIO_METRICS.map((metric) => (
              <div key={metric.label} className="bg-paper p-6 sm:p-8">
                <p className="font-display text-5xl leading-none text-ink">{metric.value}</p>
                <p className="mt-3 text-sm leading-snug text-muted">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow-accent">The portfolio</p>
              <h2 className="mt-4 max-w-3xl font-display text-display-md text-ink">
                Six companies, one concentrated founder network.
              </h2>
            </div>
            <Link href="/demo-day" className="link-editorial text-sm">
              Demo Day details &rarr;
            </Link>
          </div>

          <div className="mt-14 space-y-8">
            {COHORT_1_STARTUPS.map((s, i) => (
              <PortfolioCompany key={s.company} startup={s} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-ink/10 bg-panel/55">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-8 lg:py-24">
          <p className="eyebrow-accent">Directors</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
            <h2 className="font-display text-display-md text-ink">
              Built by founders who know the room.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-ink/75">
              Hursh and Leon run the founder-facing side of ucsb.network:
              sourcing builders, pressure-testing companies, and helping the
              cohort turn work into investor conversations.
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {DIRECTORS.map((director) => (
              <DirectorCard key={director.name} director={director} />
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_0.8fr] lg:px-8 lg:py-24">
          <div>
            <p className="eyebrow-accent">For investors</p>
            <h2 className="mt-4 max-w-3xl font-display text-display-md text-ink">
              Meet the cohort before the market does.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink/80">
              Demo Day is the formal showcase. Reach out for the portfolio,
              warm intros, or to mentor a team before they pitch.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4 border border-ink/10 bg-panel/50 p-6 sm:p-8">
            <Link href="/demo-day" className="btn-primary text-center">
              Request Demo Day access
            </Link>
            <a href="mailto:hursh@ucsb.network" className="btn-secondary text-center">
              Invest &amp; mentor
            </a>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}

function PortfolioCompany({
  startup,
  index
}: {
  startup: (typeof COHORT_1_STARTUPS)[number];
  index: number;
}) {
  const founderNames = splitFounders(startup.founders);

  return (
    <article className="overflow-hidden border border-ink/10 bg-paper shadow-subtle">
      <div className="grid lg:grid-cols-[0.9fr_1.25fr]">
        <div className="border-b border-ink/10 bg-panel/60 p-6 lg:border-b-0 lg:border-r lg:p-8">
          <div className="flex items-baseline justify-between gap-6">
            <p className="eyebrow-accent">{startup.category}</p>
            <span className="font-mono text-[11px] tabular-nums text-muted">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <h3 className="mt-4 font-display text-display-sm text-ink">
            {startup.company}
          </h3>
          <p className="mt-3 text-sm text-muted">{startup.founders}</p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {founderNames.map((name) => (
              <FounderPortrait key={name} name={name} />
            ))}
          </div>

          {startup.website ? (
            <a
              href={startup.website}
              target="_blank"
              rel="noreferrer"
              className="link-editorial mt-8 inline-block text-sm"
            >
              Visit company &rarr;
            </a>
          ) : null}
        </div>

        <div className="p-6 sm:p-8">
          <h4 className="font-display text-2xl leading-snug text-ink">
            {startup.building}
          </h4>
          {startup.mission ? (
            <p className="mt-4 max-w-3xl break-words text-base leading-relaxed text-ink/75">
              {startup.mission}
            </p>
          ) : null}

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {startup.accomplishments.length > 0 ? (
              startup.accomplishments.map((founder) => (
                <div
                  key={founder.name ?? startup.company}
                  className="min-w-0 border border-line bg-panel/45 p-5"
                >
                  {founder.name ? (
                    <p className="eyebrow text-ink">{founder.name}</p>
                  ) : null}
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink/80">
                    {founder.items.map((item) => (
                      <li
                        key={item}
                        className="grid min-w-0 grid-cols-[0.75rem_minmax(0,1fr)] gap-3"
                      >
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
      </div>
    </article>
  );
}

function FounderPortrait({ name }: { name: string }) {
  const image = HEADSHOTS[name];

  return (
    <div className="min-w-0">
      <div className="relative aspect-[4/5] overflow-hidden border border-ink/10 bg-paper">
        {image ? (
          <Image
            src={image}
            alt={`${name} headshot`}
            fill
            sizes="(min-width: 1024px) 12vw, 45vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy text-paper">
            <span className="font-display text-4xl">{initials(name)}</span>
          </div>
        )}
      </div>
      <p className="mt-2 truncate text-sm font-medium text-ink">{name}</p>
    </div>
  );
}

function DirectorCard({
  director
}: {
  director: (typeof DIRECTORS)[number];
}) {
  return (
    <article className="grid overflow-hidden border border-ink/10 bg-paper shadow-subtle sm:grid-cols-[0.85fr_1fr]">
      <div className="relative min-h-[320px] border-b border-ink/10 sm:border-b-0 sm:border-r">
        <Image
          src={director.image}
          alt={`${director.name} headshot`}
          fill
          sizes="(min-width: 1024px) 25vw, 90vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <p className="eyebrow-accent">{director.role}</p>
          <h3 className="mt-4 font-display text-display-sm text-ink">
            {director.name}
          </h3>
          <p className="mt-5 text-base leading-relaxed text-ink/80">
            {director.bio}
          </p>
        </div>
        <div className="mt-8">
          <div className="flex flex-wrap gap-2">
            {director.proof.map((item) => (
              <span
                key={item}
                className="border border-ink/10 bg-panel px-3 py-1.5 text-xs text-ink/75"
              >
                {item}
              </span>
            ))}
          </div>
          <a
            href={director.href}
            target="_blank"
            rel="noreferrer"
            className="link-editorial mt-6 inline-block text-sm"
          >
            View LinkedIn &rarr;
          </a>
        </div>
      </div>
    </article>
  );
}
