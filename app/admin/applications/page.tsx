import Link from "next/link";

import { AdminApplicationReview } from "@/components/admin-application-review";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getApplications, getAdminTags } from "@/lib/data/admin";
import { hasServiceSupabaseEnv } from "@/lib/env";

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
  const selectedId = typeof params.id === "string" ? params.id : applications[0]?.id;
  const selectedApplication = applications.find((application) => application.id === selectedId) ?? applications[0];

  return (
    <AdminShell eyebrow="Admin" title="Applications">
      <div className="grid gap-8 xl:grid-cols-[0.42fr_0.58fr]">
        <aside className="space-y-3 rounded-2xl border border-line/40 bg-panel/60 p-4">
          {applications.length === 0 ? (
            <p className="p-4 text-sm text-muted">No applications yet.</p>
          ) : (
            applications.map((application) => (
              <Link
                key={application.id}
                href={`/admin/applications?id=${application.id}`}
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
              </Link>
            ))
          )}
        </aside>
        <div>
          {selectedApplication ? (
            <AdminApplicationReview application={selectedApplication} tags={tags} />
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
