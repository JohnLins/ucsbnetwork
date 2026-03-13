import { requireMember } from "@/lib/member-auth";
import { getDirectoryMembers } from "@/lib/data/members";
import { MemberDirectoryView } from "@/components/member-directory-view";
import { MemberLogoutButtonClient } from "@/components/member-logout-button";

export default async function MemberDirectoryPage() {
  await requireMember();

  const members = await getDirectoryMembers();

  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-accent">Network</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink">Directory</h1>
          </div>
          <MemberLogoutButtonClient />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
        <MemberDirectoryView members={members} />
      </main>
    </div>
  );
}
