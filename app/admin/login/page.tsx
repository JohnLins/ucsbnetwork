import { AdminLoginForm } from "@/components/admin-login-form";

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-paper px-6">
      <div className="w-full max-w-2xl">
        <AdminLoginForm />
      </div>
    </div>
  );
}
