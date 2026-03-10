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
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-accent">People</p>
          <p className="mt-3 text-sm text-muted">
            {members.length} {members.length === 1 ? "person" : "people"} visible
          </p>
        </div>
        {usingFallbackData ? (
          <p className="max-w-sm text-right text-xs leading-6 text-muted">
            Preview data is showing because Supabase environment variables are not configured yet.
          </p>
        ) : null}
      </div>

      {members.length > 0 ? (
        <div className="space-y-4">
          {members.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="rounded-[2rem] border border-dashed border-line/80 bg-panel/50 px-6 py-12 text-center">
          <p className="font-display text-3xl text-ink">No people match the current filters.</p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted">
            Reset the filters or submit an application to start shaping the network with builders, founders, investors,
            and operators tied to UCSB.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="#apply"
              className="rounded-full border border-accent/45 bg-accent/10 px-5 py-3 text-xs uppercase tracking-[0.28em] text-ink transition hover:bg-accent/20"
            >
              Apply to join
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
