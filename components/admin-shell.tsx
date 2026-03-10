import Link from "next/link";

export function AdminShell({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-accent">{eyebrow}</p>
            <h1 className="mt-2 font-display text-4xl text-ink">{title}</h1>
          </div>
          <nav className="flex items-center gap-3 text-sm text-muted">
            <Link href="/" className="transition hover:text-ink">
              Public site
            </Link>
            <Link href="/admin/applications" className="transition hover:text-ink">
              Applications
            </Link>
            <Link href="/admin/members" className="transition hover:text-ink">
              Members
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}
