import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-30 w-full border-b border-line/10 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <Link href="/" className="flex items-center gap-1.5 text-sm font-medium tracking-tight">
          <span className="text-ink">ucsb</span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-muted">network</span>
        </Link>
        <nav className="flex items-center gap-5">
          <a href="#about" className="hidden text-xs text-muted transition hover:text-accent md:inline-flex">
            About
          </a>
          <a href="#events" className="hidden text-xs text-muted transition hover:text-accent md:inline-flex">
            Events
          </a>
          <a href="#network" className="hidden text-xs text-muted transition hover:text-accent md:inline-flex">
            Network
          </a>
          <a href="#apply" className="text-xs text-muted transition hover:text-accent">
            Apply
          </a>
        </nav>
      </div>
    </header>
  );
}
