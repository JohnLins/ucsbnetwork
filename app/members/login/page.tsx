import { redirect } from "next/navigation";

import { getMemberSession } from "@/lib/member-auth";
import { MemberLoginForm } from "@/components/member-login-form";

export default async function MemberLoginPage() {
  const session = await getMemberSession();

  if (session.isAuthenticated) {
    redirect("/members/events");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 py-16">
      <div className="w-full max-w-md">
        <MemberLoginForm />
      </div>
    </div>
  );
}
