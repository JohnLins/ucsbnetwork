import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createHmac } from "crypto";

import { env } from "@/lib/env";
import type { MemberType } from "@/lib/types";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

const COOKIE_NAME = "member_session";
const HMAC_KEY = "ucsb-network-member-v1";

/**
 * Compute a session token for a specific member.
 * Token format: memberId.hmac
 */
export function computeMemberToken(memberId: string): string | null {
  if (!env.ADMIN_PASSWORD) return null;
  const hmac = createHmac("sha256", env.ADMIN_PASSWORD)
    .update(`${HMAC_KEY}:${memberId}`)
    .digest("hex");
  return `${memberId}.${hmac}`;
}

/**
 * Verify a member session token and extract the member ID.
 */
function verifyMemberToken(token: string): string | null {
  if (!env.ADMIN_PASSWORD) return null;

  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return null;

  const memberId = token.slice(0, dotIndex);
  const expectedToken = computeMemberToken(memberId);

  if (!expectedToken || token !== expectedToken) return null;
  return memberId;
}

/**
 * Get the current member session from the cookie.
 */
export async function getMemberSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(COOKIE_NAME);

  if (!sessionCookie?.value) {
    return { memberId: null, isAuthenticated: false };
  }

  const memberId = verifyMemberToken(sessionCookie.value);
  return {
    memberId,
    isAuthenticated: Boolean(memberId)
  };
}

/**
 * Require a valid member session or redirect to login.
 */
export async function requireMember() {
  const session = await getMemberSession();

  if (!session.isAuthenticated || !session.memberId) {
    redirect("/members/login");
  }

  return session;
}

/**
 * Get the member_type for a given member ID.
 */
export async function getMemberType(memberId: string): Promise<MemberType> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return "member";

  const { data } = await supabase
    .from("members")
    .select("member_type")
    .eq("id", memberId)
    .single();

  if (!data) return "member";

  const mt = String(data.member_type);
  if (["partner", "member", "alumni_advisor", "alumni_network"].includes(mt)) {
    return mt as MemberType;
  }
  return "member";
}
