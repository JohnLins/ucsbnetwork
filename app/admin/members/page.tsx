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
        <div className="border border-ink/10 bg-paper p-8 text-sm leading-7 text-muted">
          Configure Supabase before managing members.
        </div>
      </AdminShell>
    );
  }

  const [allMembers, tags] = await Promise.all([getMembers(), getAdminTags()]);

  const tab = typeof params.tab === "string" ? params.tab : "partners";
  const partners = allMembers.filter((m) => m.memberType === "partner");
  const regularMembers = allMembers.filter((m) => m.memberType === "member");
  const alumni = allMembers.filter(
    (m) => m.memberType === "alumni_advisor" || m.memberType === "alumni_network"
  );
  const visibleMembers = tab === "alumni" ? alumni : tab === "members" ? regularMembers : partners;

  const newLabel = tab === "alumni" ? "alumni" : tab === "members" ? "member" : "partner";
  const defaultType = tab === "alumni" ? "alumni_advisor" : tab === "members" ? "member" : "partner";

  const selectedId = typeof params.id === "string" ? params.id : undefined;
  const selectedMember = visibleMembers.find((member) => member.id === selectedId);

  return (
    <AdminShell eyebrow="Admin" title="Members">
      <div className="mb-8 flex items-end gap-8 border-b border-ink/10">
        {[
          { key: "partners", label: "Partners", count: partners.length },
          { key: "members", label: "Members", count: regularMembers.length },
          { key: "alumni", label: "Alumni", count: alumni.length }
        ].map((t) => {
          const isActive = tab === t.key;
          return (
            <Link
              key={t.key}
              href={`/admin/members?tab=${t.key}`}
              className={`relative pb-3 text-sm transition ${
                isActive ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}{" "}
              <span className="font-mono text-xs text-muted/80">({t.count})</span>
              {isActive ? (
                <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-accent" />
              ) : null}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.38fr_0.62fr]">
        <aside className="divide-y divide-ink/10 border border-ink/10 bg-paper">
          <Link
            href={`/admin/members?tab=${tab}`}
            className={`block px-5 py-4 transition ${
              !selectedMember ? "bg-accent/5" : "hover:bg-panel/60"
            }`}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              Create
            </p>
            <h2 className="mt-2 font-display text-xl leading-tight text-ink">
              New {newLabel}
            </h2>
          </Link>
          {visibleMembers.map((member) => {
            const isSelected = selectedMember?.id === member.id;
            return (
              <Link
                key={member.id}
                href={`/admin/members?tab=${tab}&id=${member.id}`}
                className={`block px-5 py-4 transition ${
                  isSelected ? "bg-accent/5" : "hover:bg-panel/60"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    {member.isPublished ? "Published" : "Draft"}
                  </p>
                  {member.cohort != null ? (
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      Cohort {member.cohort}
                    </p>
                  ) : null}
                </div>
                <h2 className="mt-2 font-display text-xl leading-tight text-ink">
                  {member.fullName}
                </h2>
                {member.headline ? (
                  <p className="mt-1 text-sm text-muted">{member.headline}</p>
                ) : null}
              </Link>
            );
          })}
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
