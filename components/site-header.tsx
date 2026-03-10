import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line/40 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <Link href="/" className="text-sm font-medium tracking-tight text-ink">
          ucsb.network
        </Link>
        <nav className="flex items-center gap-5">
          <a href="#directory" className="hidden text-xs text-muted transition hover:text-ink md:inline-flex">
            Directory
          </a>
          <a href="#apply" className="hidden text-xs text-muted transition hover:text-ink md:inline-flex">
            Apply
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
