import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2 leading-none">
              <span className="font-display text-2xl leading-none text-ink">ucsb</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-base font-medium leading-none tracking-wide text-ink">network</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              An 8-week accelerator for UCSB founders. A dedicated mentor,
              weekly office hours, a hackathon, and Demo Day in front of VCs.
            </p>
          </div>

          <FooterCol
            heading="Program"
            links={[
              { href: "/program", label: "What you get" },
              { href: "/batch", label: "Current batch" },
              { href: "/demo-day", label: "Demo Day" },
              { href: "/office-hours", label: "Office hours" },
              { href: "/hackathon", label: "Hackathon" }
            ]}
          />
          <FooterCol
            heading="Apply"
            links={[
              { href: "/apply", label: "Cohort application" },
              { href: "/hackathon#signup", label: "Hackathon signup" },
              { href: "/faq", label: "FAQ" }
            ]}
          />
          <FooterCol
            heading="For members"
            links={[
              { href: "/members/login", label: "Member login" },
              { href: "/members/events", label: "Events" },
              { href: "/members/directory", label: "Directory" }
            ]}
          />
        </div>

        <hr className="hr-hairline mt-14" />

        <div className="mt-6 flex flex-col items-start justify-between gap-4 text-xs text-muted md:flex-row md:items-center">
          <p>
            &copy; {new Date().getFullYear()} ucsb.network &middot; Built in Santa Barbara
          </p>
          <div className="flex items-center gap-5">
            <a href="mailto:hursh@ucsb.network" className="transition hover:text-ink">
              hursh@ucsb.network
            </a>
            <Link href="/admin/login" className="transition hover:text-ink">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  heading,
  links
}: {
  heading: string;
  links: Array<{ href: string; label: string }>;
}) {
  return (
    <div>
      <p className="eyebrow mb-4">{heading}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-ink/80 transition hover:text-accent"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
