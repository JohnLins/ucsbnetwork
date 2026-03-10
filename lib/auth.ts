import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { hasPublicSupabaseEnv, hasServiceSupabaseEnv } from "@/lib/env";

export async function getAdminSession() {
  if (!hasPublicSupabaseEnv || !hasServiceSupabaseEnv) {
    return {
      user: null,
      email: null,
      isAdmin: false,
      isConfigured: false
    };
  }

  const supabase = await getSupabaseServerClient();
  const service = getSupabaseServiceClient();

  if (!supabase || !service) {
    return {
      user: null,
      email: null,
      isAdmin: false,
      isConfigured: false
    };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const email = user?.email?.toLowerCase() ?? null;

  if (!email) {
    return {
      user: null,
      email: null,
      isAdmin: false,
      isConfigured: true
    };
  }

  const { data } = await service
    .from("admin_users")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  return {
    user,
    email,
    isAdmin: Boolean(data),
    isConfigured: true
  };
}

export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session.isConfigured) {
    return session;
  }

  if (!session.user || !session.isAdmin) {
    redirect("/admin/login");
  }

  return session;
}
