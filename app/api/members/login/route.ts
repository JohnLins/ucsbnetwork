import { NextResponse } from "next/server";

import { computeMemberToken } from "@/lib/member-auth";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { verifyPassword } from "@/lib/utils/password";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json({ error: "Service not configured." }, { status: 500 });
    }

    // Look up credentials by email
    const { data: cred } = await supabase
      .from("member_credentials")
      .select("id, member_id, password_hash")
      .eq("email", email)
      .maybeSingle();

    if (!cred) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const isValid = await verifyPassword(password, cred.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const token = computeMemberToken(cred.member_id);

    if (!token) {
      return NextResponse.json({ error: "Authentication unavailable." }, { status: 500 });
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set("member_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 400 });
  }
}
