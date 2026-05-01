"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV = [
  { href: "/admin/applications?tab=students", match: "/admin/applications", label: "Applications" },
  { href: "/admin/members?tab=members", match: "/admin/members", label: "Members" },
  { href: "/admin/events", match: "/admin/events", label: "Events" },
  { href: "/admin/hackathon", match: "/admin/hackathon", label: "Hackathon" },
  { href: "/admin/office-hours", match: "/admin/office-hours", label: "Office hours" }
];

export function AdminShell({
  title,
  eyebrow,
  children
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Top bar: wordmark + nav + logout */}
      <header className="border-b border-ink/10 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
          <div className="flex items-center gap-8">
            <Link href="/admin/applications" className="flex items-center gap-2 leading-none">
              <span className="font-display text-xl leading-none text-ink">ucsb</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-sm font-medium leading-none tracking-wide text-ink">network</span>
              <span className="ml-2 font-mono text-[10px] uppercase leading-none tracking-[0.26em] text-accent">
                Admin
              </span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {NAV.map((item) => {
                const isActive = pathname.startsWith(item.match);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative py-3 text-sm transition ${
                      isActive ? "text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                    {isActive ? (
                      <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-accent" />
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-xs text-muted transition hover:text-ink"
            >
              Public site
            </Link>
            <button
              onClick={handleLogout}
              className="border border-ink/15 px-3 py-1.5 text-xs text-ink transition hover:bg-ink hover:text-paper"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Page header */}
      <section className="border-b border-ink/10">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-6 py-10 lg:px-10">
          <div>
            <p className="eyebrow-accent">{eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink">
              {title}
            </h1>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}
