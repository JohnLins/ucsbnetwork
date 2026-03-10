import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="fixed top-0 z-30 w-full border-b border-line/10 bg-paper/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
        <Link href="/" className="text-sm font-medium tracking-tight text-ink">
          ucsb.network
        </Link>
        <nav className="flex items-center gap-5">
          <a href="#about" className="hidden text-xs text-muted transition hover:text-ink md:inline-flex">
            About
          </a>
          <a href="#events" className="hidden text-xs text-muted transition hover:text-ink md:inline-flex">
            Events
          </a>
          <a href="#network" className="hidden text-xs text-muted transition hover:text-ink md:inline-flex">
            Network
          </a>
          <a href="#apply" className="text-xs text-muted transition hover:text-ink">
            Apply
          </a>
        </nav>
      </div>
    </header>
  );
}
