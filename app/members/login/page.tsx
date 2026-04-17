import { redirect } from "next/navigation";

import { getMemberSession } from "@/lib/member-auth";
import { MemberLoginForm } from "@/components/member-login-form";

export default async function MemberLoginPage() {
  const session = await getMemberSession();

  if (session.isAuthenticated) {
    redirect("/members/events");
  }

  return (
    <div className="flex min-h-screen bg-paper">
      <div className="mx-auto flex w-full max-w-5xl">
        <section className="hidden flex-1 flex-col justify-between border-r border-ink/10 bg-navy text-paper p-12 lg:flex">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
            ucsb.network portal
          </p>
          <div>
            <h2 className="font-display text-4xl leading-tight text-paper">
              &ldquo;The fastest way to find the right person in UCSB&rsquo;s
              founder network.&rdquo;
            </h2>
            <p className="mt-4 text-sm text-paper/70">
              The portal is where cohort partners, members, and advisors keep
              up with events, directory, and updates.
            </p>
          </div>
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-paper/50">
            Signing in? Use the credentials sent to your email.
          </p>
        </section>
        <section className="flex flex-1 items-start justify-center px-6 py-16 lg:px-12 lg:py-20">
          <div className="w-full max-w-md">
            <MemberLoginForm />
          </div>
        </section>
      </div>
    </div>
  );
}
