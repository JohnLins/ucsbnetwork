import { NextResponse } from "next/server";

import { verifyAdminPassword, computeAdminToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password : "";

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    const token = computeAdminToken();

    if (!token) {
      return NextResponse.json({ error: "Admin not configured." }, { status: 500 });
    }

    const response = NextResponse.json({ ok: true });

    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Login failed." }, { status: 400 });
  }
}
