import Link from "next/link";

import { AdminApplicationReview } from "@/components/admin-application-review";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getApplications, getAdminTags } from "@/lib/data/admin";
import { hasServiceSupabaseEnv } from "@/lib/env";

const NON_STUDENT_TYPES = new Set([
  "Alumni",
  "Faculty",
  "Researcher",
  "Staff",
  "Community collaborator"
]);

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminApplicationsPage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  const params = searchParams ? await searchParams : {};

  if (!hasServiceSupabaseEnv || !session.isConfigured) {
    return (
      <AdminShell eyebrow="Admin" title="Applications">
        <SetupState />
      </AdminShell>
    );
  }

  const [applications, tags] = await Promise.all([getApplications(), getAdminTags()]);

  const tab = typeof params.tab === "string" ? params.tab : "students";
  const studentApps = applications.filter((a) => !NON_STUDENT_TYPES.has(a.ucsbAffiliationType));
  const advisorApps = applications.filter((a) => NON_STUDENT_TYPES.has(a.ucsbAffiliationType));
  const visibleApps = tab === "advisors" ? advisorApps : studentApps;

  const selectedId = typeof params.id === "string" ? params.id : visibleApps[0]?.id;
  const selectedApplication = visibleApps.find((application) => application.id === selectedId) ?? visibleApps[0];

  return (
    <AdminShell eyebrow="Admin" title="Applications">
      {/* Tab bar */}
      <div className="mb-6 flex gap-2">
        <Link
          href="/admin/applications?tab=students"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "students"
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          Students ({studentApps.length})
        </Link>
        <Link
          href="/admin/applications?tab=advisors"
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "advisors"
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          Alumni &amp; Advisors ({advisorApps.length})
        </Link>
      </div>

      <div className="grid gap-8 xl:grid-cols-[0.42fr_0.58fr]">
        <aside className="space-y-3 rounded-2xl border border-line/40 bg-panel/60 p-4">
          {visibleApps.length === 0 ? (
            <p className="p-4 text-sm text-muted">No applications in this category yet.</p>
          ) : (
            visibleApps.map((application) => (
              <Link
                key={application.id}
                href={`/admin/applications?tab=${tab}&id=${application.id}`}
                className={`block rounded-[1.3rem] border px-4 py-4 transition ${
                  selectedApplication?.id === application.id
                    ? "border-accent/50 bg-accent/10"
                    : "border-line/70 bg-paper/70 hover:border-accent/40"
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.32em] text-accent">{application.status}</p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">{application.fullName}</h2>
                <p className="mt-2 text-sm text-muted">
                  {application.currentTitle}
                  {application.companyOrOrg ? ` at ${application.companyOrOrg}` : ""}
                </p>
                <p className="mt-1 text-xs text-muted/70">{application.ucsbAffiliationType}</p>
              </Link>
            ))
          )}
        </aside>
        <div>
          {selectedApplication ? (
            <AdminApplicationReview key={selectedApplication.id} application={selectedApplication} tags={tags} />
          ) : (
            <div className="rounded-2xl border border-line/40 bg-panel/60 p-6 text-sm text-muted">
              Select an application to review.
            </div>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function SetupState() {
  return (
    <div className="rounded-2xl border border-line/40 bg-panel/60 p-8 text-sm leading-7 text-muted">
      Configure the Supabase environment variables from <code>.env.example</code>, run the SQL migrations, and seed
      the admin user before using the admin dashboard.
    </div>
  );
}
