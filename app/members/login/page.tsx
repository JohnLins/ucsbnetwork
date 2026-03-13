import { redirect } from "next/navigation";

import { getMemberSession } from "@/lib/member-auth";
import { MemberLoginForm } from "@/components/member-login-form";

export default async function MemberLoginPage() {
  const session = await getMemberSession();

  if (session.isAuthenticated) {
    redirect("/members/events");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6">
      <div className="w-full max-w-md">
        <MemberLoginForm />
      </div>
    </div>
  );
}
