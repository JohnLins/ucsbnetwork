"use client";

import { useRouter } from "next/navigation";

export function MemberLogoutButtonClient() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/members/logout", { method: "POST" });
    router.push("/members/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-line/50 px-3 py-1.5 text-sm text-muted transition hover:text-ink"
    >
      Logout
    </button>
  );
}
