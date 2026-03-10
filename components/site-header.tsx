import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-display text-2xl tracking-[0.12em] text-ink">
            ucsb.network
          </Link>
          <span className="hidden rounded-full border border-line/80 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-muted md:inline-flex">
            Curated UCSB network
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <a href="#directory" className="hidden text-sm text-muted transition hover:text-ink md:inline-flex">
            Directory
          </a>
          <a href="#apply" className="hidden text-sm text-muted transition hover:text-ink md:inline-flex">
            Apply
          </a>
          <a
            href="/admin/applications"
            className="hidden rounded-full border border-line/70 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-muted transition hover:border-accent/50 hover:text-ink md:inline-flex"
          >
            Admin
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
