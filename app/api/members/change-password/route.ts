import { NextResponse } from "next/server";

import { getMemberSession } from "@/lib/member-auth";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { hashPassword, verifyPassword } from "@/lib/utils/password";

export async function POST(request: Request) {
  try {
    const session = await getMemberSession();

    if (!session.isAuthenticated || !session.memberId) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json();
    const currentPassword = typeof body.currentPassword === "string" ? body.currentPassword : "";
    const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json({ error: "Service not configured." }, { status: 500 });
    }

    // Fetch current credentials
    const { data: cred } = await supabase
      .from("member_credentials")
      .select("id, password_hash")
      .eq("member_id", session.memberId)
      .maybeSingle();

    if (!cred) {
      return NextResponse.json({ error: "Credentials not found." }, { status: 404 });
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, cred.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }

    // Hash and update
    const newHash = await hashPassword(newPassword);

    const { error: updateError } = await supabase
      .from("member_credentials")
      .update({ password_hash: newHash })
      .eq("id", cred.id);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { error: "Unable to change password." },
      { status: 500 }
    );
  }
}
