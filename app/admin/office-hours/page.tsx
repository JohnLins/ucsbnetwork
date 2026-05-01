import { AdminShell } from "@/components/admin-shell";
import { OfficeHoursSignupsTable } from "@/components/admin-office-hours-table";
import { requireAdmin } from "@/lib/auth";
import { getOfficeHoursSignups } from "@/lib/data/office-hours";
import { hasServiceSupabaseEnv } from "@/lib/env";

export default async function AdminOfficeHoursPage() {
  const session = await requireAdmin();

  if (!hasServiceSupabaseEnv || !session.isConfigured) {
    return (
      <AdminShell eyebrow="Admin" title="Office hours signups">
        <div className="border border-ink/10 bg-paper p-8 text-sm leading-7 text-muted">
          Configure the Supabase environment variables from{" "}
          <code className="font-mono text-ink">.env.example</code> and run
          migrations before using this page.
        </div>
      </AdminShell>
    );
  }

  const signups = await getOfficeHoursSignups();

  return (
    <AdminShell eyebrow="Admin" title="Office hours signups">
      <OfficeHoursSignupsTable signups={signups} />
    </AdminShell>
  );
}
