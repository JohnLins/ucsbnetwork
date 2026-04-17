import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin-login-form";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session.isAdmin) {
    redirect("/admin/applications");
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <div className="mx-auto flex w-full max-w-5xl">
        <section className="hidden flex-1 flex-col justify-between border-r border-ink/10 bg-navy text-paper p-12 lg:flex">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            ucsb.network admin
          </p>
          <div>
            <h2 className="font-display text-4xl leading-tight text-paper">
              Review applications. Manage the batch.
            </h2>
            <p className="mt-4 text-sm text-paper/70">
              The admin console lives here: applications, members, events, and
              hackathon signups in one place.
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-paper/50">
            Restricted access
          </p>
        </section>
        <section className="flex flex-1 items-start justify-center px-6 py-16 lg:px-12 lg:py-20">
          <div className="w-full max-w-md">
            <AdminLoginForm />
          </div>
        </section>
      </div>
    </div>
  );
}
