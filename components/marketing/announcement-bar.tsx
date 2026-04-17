import Link from "next/link";

type AnnouncementBarProps = {
  label: string;
  href: string;
  ctaLabel?: string;
};

export function AnnouncementBar({
  label,
  href,
  ctaLabel = "Read more"
}: AnnouncementBarProps) {
  return (
    <div className="border-b border-ink/10 bg-navy text-paper">
      <Link
        href={href}
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-6 py-2.5 text-center text-[13px] leading-tight transition hover:opacity-90 lg:px-8"
      >
        <span className="hidden font-mono text-[10px] uppercase tracking-[0.28em] text-accent sm:inline">
          Now
        </span>
        <span>{label}</span>
        <span className="hidden font-mono text-xs text-accent/90 sm:inline">
          {ctaLabel}
          <span aria-hidden className="ml-1">&rarr;</span>
        </span>
      </Link>
    </div>
  );
}
