import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin-login-form";

export default async function AdminLoginPage() {
  const session = await getAdminSession();

  if (session.isAdmin) {
    redirect("/admin/applications");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6">
      <div className="w-full max-w-md">
        <AdminLoginForm />
      </div>
    </div>
  );
}
