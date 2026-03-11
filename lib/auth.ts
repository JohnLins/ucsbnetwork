import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac } from "crypto";

import { env, hasServiceSupabaseEnv } from "@/lib/env";

const COOKIE_NAME = "admin_session";
const HMAC_KEY = "ucsb-network-admin-v1";

/**
 * Compute the expected session token from the ADMIN_PASSWORD.
 * Deterministic — anyone with the password produces the same token.
 */
export function computeAdminToken(): string | null {
  if (!env.ADMIN_PASSWORD) return null;
  return createHmac("sha256", env.ADMIN_PASSWORD).update(HMAC_KEY).digest("hex");
}

/**
 * Verify a provided password against the ADMIN_PASSWORD env var.
 */
export function verifyAdminPassword(password: string): boolean {
  return Boolean(env.ADMIN_PASSWORD) && password === env.ADMIN_PASSWORD;
}

/**
 * Check if the current request has a valid admin session.
 */
export async function getAdminSession() {
  if (!env.ADMIN_PASSWORD) {
    return {
      isAdmin: false,
      isConfigured: false,
      email: null
    };
  }

  const expectedToken = computeAdminToken();
  if (!expectedToken) {
    return { isAdmin: false, isConfigured: false, email: null };
  }

  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);
  const isAdmin = sessionCookie?.value === expectedToken;

  return {
    isAdmin,
    isConfigured: hasServiceSupabaseEnv,
    email: isAdmin ? "hurshshah483@gmail.com" : null
  };
}

/**
 * Require admin session or redirect to login.
 */
export async function requireAdmin() {
  const session = await getAdminSession();

  if (!session.isAdmin) {
    redirect("/admin/login");
  }

  return session;
}
