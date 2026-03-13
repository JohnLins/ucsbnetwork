"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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

  async function handleLogout() {
    await fetch("/api/members/logout", { method: "POST" });
    router.push("/members/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.38em] text-accent">
                ucsb.network
              </p>
              <p className="mt-1 text-[11px] text-muted">{tierLabel(memberType)}</p>
            </div>
            <nav className="flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                      isActive
                        ? "bg-accent/15 text-accent"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <ChangePasswordForm />
            <button
              onClick={handleLogout}
              className="rounded-lg border border-line/50 px-3 py-1.5 text-sm text-muted transition hover:border-accent/40 hover:text-ink"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">{children}</main>
    </div>
  );
}
