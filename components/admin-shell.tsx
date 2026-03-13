"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

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

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-accent">{eyebrow}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">{title}</h1>
          </div>
          <nav className="flex items-center gap-3 text-sm text-muted">
            <Link href="/" className="transition hover:text-accent">
              Public site
            </Link>
            <Link href="/admin/applications?tab=students" className="transition hover:text-accent">
              Applications
            </Link>
            <Link href="/admin/members?tab=members" className="transition hover:text-accent">
              Members
            </Link>
            <Link href="/admin/members?tab=advisors" className="transition hover:text-accent">
              Advisors
            </Link>
            <button
              onClick={handleLogout}
              className="ml-2 rounded-lg border border-line/50 px-3 py-1.5 text-sm text-muted transition hover:border-accent/40 hover:text-ink"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}
