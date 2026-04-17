import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { hackathonSignupSchema } from "@/lib/schema";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { hashSensitiveValue, isLikelyBotSubmission } from "@/lib/utils/security";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = hackathonSignupSchema.parse(body);

    if (isLikelyBotSubmission(payload.formStartedAt, payload.honeypot)) {
      return NextResponse.json({ error: "Submission blocked." }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase service role is not configured." },
        { status: 500 }
      );
    }

    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for") ?? "local";
    const ipAddress = forwardedFor.split(",")[0]?.trim() || "local";
    const ipHash = hashSensitiveValue(ipAddress);
    const emailHash = hashSensitiveValue(payload.email.toLowerCase());

    // Rate limit: at most 3 submissions per hour per email or ip
    const windowStart = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const { data: recentSignups } = await supabase
      .from("hackathon_signups")
      .select("id")
      .gte("created_at", windowStart)
      .or(`email_hash.eq.${emailHash},ip_hash.eq.${ipHash}`);

    if ((recentSignups ?? []).length >= 3) {
      return NextResponse.json(
        { error: "Too many submissions from this address. Try again later." },
        { status: 429 }
      );
    }

    // Duplicate check: same email already on file
    const { data: existing } = await supabase
      .from("hackathon_signups")
      .select("id")
      .eq("email", payload.email.toLowerCase())
      .limit(1);

    if ((existing ?? []).length > 0) {
      // Silently accept to avoid revealing duplicates to bots; UI shows success.
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabase.from("hackathon_signups").insert({
      name: payload.name,
      email: payload.email.toLowerCase(),
      school: payload.school ?? null,
      pitch: payload.pitch,
      link: payload.link ?? null,
      ip_hash: ipHash,
      email_hash: emailHash
    });

    if (error) {
      console.error("hackathon signup insert failed", error);
      return NextResponse.json(
        { error: "Unable to save signup. Try again in a minute." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);

    if (error instanceof ZodError) {
      const first = error.issues[0];
      const field = first?.path[0]?.toString() ?? "form";
      const message = first?.message ?? "Invalid submission.";
      return NextResponse.json(
        { error: `${field}: ${message}` },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unable to submit.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
