import Link from "next/link";

import { AdminMemberEditor } from "@/components/admin-member-editor";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getAdminTags, getMembers } from "@/lib/data/admin";
import { hasServiceSupabaseEnv } from "@/lib/env";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminMembersPage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  const params = searchParams ? await searchParams : {};

  if (!hasServiceSupabaseEnv || !session.isConfigured) {
    return (
      <AdminShell eyebrow="Admin" title="Members">
        <div className="rounded-[2rem] border border-line/80 bg-panel/80 p-8 text-sm leading-7 text-muted shadow-halo">
          Configure Supabase before managing members.
        </div>
      </AdminShell>
    );
  }

  const [members, tags] = await Promise.all([getMembers(), getAdminTags()]);
  const selectedId = typeof params.id === "string" ? params.id : undefined;
  const selectedMember = members.find((member) => member.id === selectedId);

  return (
    <AdminShell eyebrow="Admin" title="Members">
      <div className="grid gap-8 xl:grid-cols-[0.38fr_0.62fr]">
        <aside className="space-y-3 rounded-[2rem] border border-line/80 bg-panel/80 p-4 shadow-halo">
          <Link
            href="/admin/members"
            className={`block rounded-[1.3rem] border px-4 py-4 transition ${
              !selectedMember ? "border-accent/50 bg-accent/10" : "border-line/70 bg-paper/70 hover:border-accent/40"
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.32em] text-accent">Create</p>
            <h2 className="mt-2 font-display text-2xl text-ink">New member</h2>
          </Link>
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/admin/members?id=${member.id}`}
              className={`block rounded-[1.3rem] border px-4 py-4 transition ${
                selectedMember?.id === member.id
                  ? "border-accent/50 bg-accent/10"
                  : "border-line/70 bg-paper/70 hover:border-accent/40"
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
                {member.isPublished ? "Published" : "Draft"}
              </p>
              <h2 className="mt-2 font-display text-2xl text-ink">{member.fullName}</h2>
              {member.headline ? <p className="mt-2 text-sm text-muted">{member.headline}</p> : null}
            </Link>
          ))}
        </aside>
        <AdminMemberEditor selectedMember={selectedMember} tags={tags} />
      </div>
    </AdminShell>
  );
}
