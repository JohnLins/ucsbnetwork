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
      <div className="mb-8 flex items-end gap-8 border-b border-ink/10">
        {[
          { key: "students", label: "Students", count: studentApps.length },
          { key: "advisors", label: "Alumni & Advisors", count: advisorApps.length }
        ].map((t) => {
          const isActive = tab === t.key;
          return (
            <Link
              key={t.key}
              href={`/admin/applications?tab=${t.key}`}
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

      <div className="grid gap-8 xl:grid-cols-[0.42fr_0.58fr]">
        <aside className="divide-y divide-ink/10 border border-ink/10 bg-paper">
          {visibleApps.length === 0 ? (
            <p className="p-5 text-sm text-muted">
              No applications in this category yet.
            </p>
          ) : (
            visibleApps.map((application) => {
              const isSelected = selectedApplication?.id === application.id;
              return (
                <Link
                  key={application.id}
                  href={`/admin/applications?tab=${tab}&id=${application.id}`}
                  className={`block px-5 py-4 transition ${
                    isSelected
                      ? "bg-accent/5"
                      : "hover:bg-panel/60"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                      {application.status}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                      {application.ucsbAffiliationType}
                    </p>
                  </div>
                  <h2 className="mt-2 font-display text-xl leading-tight text-ink">
                    {application.fullName}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {application.currentTitle}
                    {application.companyOrOrg ? ` at ${application.companyOrOrg}` : ""}
                  </p>
                </Link>
              );
            })
          )}
        </aside>
        <div>
          {selectedApplication ? (
            <AdminApplicationReview
              key={selectedApplication.id}
              application={selectedApplication}
              tags={tags}
            />
          ) : (
            <div className="border border-ink/10 bg-paper p-8 text-sm text-muted">
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
    <div className="border border-ink/10 bg-paper p-8 text-sm leading-7 text-muted">
      Configure the Supabase environment variables from{" "}
      <code className="font-mono text-ink">.env.example</code>, run the SQL migrations, and seed
      the admin user before using the admin dashboard.
    </div>
  );
}
