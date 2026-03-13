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
        <div className="rounded-2xl border border-line/40 bg-panel/60 p-8 text-sm leading-7 text-muted">
          Configure Supabase before managing members.
        </div>
      </AdminShell>
    );
  }

  const [allMembers, tags] = await Promise.all([getMembers(), getAdminTags()]);

  const tab = typeof params.tab === "string" ? params.tab : "partners";
  const partners = allMembers.filter((m) => m.memberType === "partner");
  const regularMembers = allMembers.filter((m) => m.memberType === "member");
  const alumni = allMembers.filter((m) => m.memberType === "alumni_advisor" || m.memberType === "alumni_network");
  const visibleMembers = tab === "alumni" ? alumni : tab === "members" ? regularMembers : partners;

  const newLabel = tab === "alumni" ? "alumni" : tab === "members" ? "member" : "partner";
  const defaultType = tab === "alumni" ? "alumni_advisor" : tab === "members" ? "member" : "partner";

  const selectedId = typeof params.id === "string" ? params.id : undefined;
  const selectedMember = visibleMembers.find((member) => member.id === selectedId);

  return (
    <AdminShell eyebrow="Admin" title="Members">
      {/* Tab bar */}
      <div className="mb-6 flex gap-2">
        <Link
          href="/admin/members?tab=partners"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "partners"
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          Partners ({partners.length})
        </Link>
        <Link
          href="/admin/members?tab=members"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "members"
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          Members ({regularMembers.length})
        </Link>
        <Link
          href="/admin/members?tab=alumni"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "alumni"
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          Alumni ({alumni.length})
        </Link>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.38fr_0.62fr]">
        <aside className="space-y-3 rounded-2xl border border-line/40 bg-panel/60 p-4">
          <Link
            href={`/admin/members?tab=${tab}`}
            className={`block rounded-[1.3rem] border px-4 py-4 transition ${
              !selectedMember ? "border-accent/50 bg-accent/10" : "border-line/70 bg-paper/70 hover:border-accent/40"
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.32em] text-accent">Create</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">
              New {newLabel}
            </h2>
          </Link>
          {visibleMembers.map((member) => (
            <Link
              key={member.id}
              href={`/admin/members?tab=${tab}&id=${member.id}`}
              className={`block rounded-[1.3rem] border px-4 py-4 transition ${
                selectedMember?.id === member.id
                  ? "border-accent/50 bg-accent/10"
                  : "border-line/70 bg-paper/70 hover:border-accent/40"
              }`}
            >
              <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
                {member.isPublished ? "Published" : "Draft"}
              </p>
              <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">{member.fullName}</h2>
              {member.headline ? <p className="mt-2 text-sm text-muted">{member.headline}</p> : null}
            </Link>
          ))}
        </aside>
        <AdminMemberEditor
          key={selectedMember?.id ?? `new-${tab}`}
          selectedMember={selectedMember}
          tags={tags}
          defaultMemberType={defaultType as import("@/lib/types").MemberType}
        />
      </div>
    </AdminShell>
  );
}
