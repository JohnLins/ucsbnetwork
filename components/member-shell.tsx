"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import type { MemberType } from "@/lib/types";
import { ChangePasswordForm } from "@/components/change-password-form";

const NAV_ITEMS = [
  { href: "/members/events", label: "Events" },
  { href: "/members/directory", label: "Directory" }
];

function tierLabel(memberType: MemberType): string {
  switch (memberType) {
    case "partner":
      return "Partner";
    case "member":
      return "Member";
    case "alumni_advisor":
      return "Advisor";
    case "alumni_network":
      return "Alumni";
    default:
      return "Member";
  }
}

export function MemberShell({
  memberType,
  children
}: {
  memberType: MemberType;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [accountOpen, setAccountOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/members/logout", { method: "POST" });
    router.push("/members/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* Top bar */}
      <header className="border-b border-ink/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 lg:px-10">
          <div className="flex items-center gap-8">
            <Link href="/members/events" className="flex items-baseline gap-2">
              <span className="font-display text-xl leading-none text-ink">ucsb</span>
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
              <span className="text-sm font-medium tracking-wide text-ink">network</span>
              <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.26em] text-accent">
                {tierLabel(memberType)}
              </span>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
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
              className="hidden text-xs text-muted transition hover:text-ink md:inline"
            >
              Public site
            </Link>
            <button
              type="button"
              onClick={() => setAccountOpen((v) => !v)}
              className="text-xs text-muted transition hover:text-ink"
            >
              Account
            </button>
            <button
              onClick={handleLogout}
              className="border border-ink/15 px-3 py-1.5 text-xs text-ink transition hover:bg-ink hover:text-paper"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <nav className="flex items-center gap-6 border-t border-ink/10 px-6 py-2 md:hidden">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm ${isActive ? "text-ink" : "text-muted"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      {accountOpen ? (
        <div className="border-b border-ink/10 bg-panel/40">
          <div className="mx-auto flex max-w-6xl justify-end px-6 py-6 lg:px-10">
            <ChangePasswordForm />
          </div>
        </div>
      ) : null}

      <main className="mx-auto max-w-6xl px-6 py-12 lg:px-10">{children}</main>
    </div>
  );
}
