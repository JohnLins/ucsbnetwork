import Link from "next/link";

import type { MemberCard as Member } from "@/lib/types";
import { MemberCard } from "@/components/member-card";

export function MemberDirectory({
  members,
  usingFallbackData
}: {
  members: Member[];
  usingFallbackData: boolean;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <p className="text-sm text-muted">
          {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        {usingFallbackData ? (
          <p className="text-right text-xs text-muted">
            Preview data — Supabase not configured.
          </p>
        ) : null}
      </div>

      {members.length > 0 ? (
        <div className="space-y-3">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-line/40 px-6 py-16 text-center">
          <p className="text-lg font-medium text-ink">No results.</p>
          <div className="mt-4">
            <Link
              href="#apply"
              className="text-sm text-accent transition hover:opacity-80"
            >
              Apply to join
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
