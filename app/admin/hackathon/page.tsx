import { AdminShell } from "@/components/admin-shell";
import { HackathonSignupsTable } from "@/components/admin-hackathon-table";
import { requireAdmin } from "@/lib/auth";
import { getHackathonSignups } from "@/lib/data/hackathon";
import { hasServiceSupabaseEnv } from "@/lib/env";

export default async function AdminHackathonPage() {
  const session = await requireAdmin();

  if (!hasServiceSupabaseEnv || !session.isConfigured) {
    return (
      <AdminShell eyebrow="Admin" title="Hackathon signups">
        <div className="border border-ink/10 bg-paper p-8 text-sm leading-7 text-muted">
          Configure the Supabase environment variables from{" "}
          <code className="font-mono text-ink">.env.example</code> and run
          migrations before using this page.
        </div>
      </AdminShell>
    );
  }

  const signups = await getHackathonSignups();

  return (
    <AdminShell eyebrow="Admin" title="Hackathon signups">
      <HackathonSignupsTable signups={signups} />
    </AdminShell>
  );
}
