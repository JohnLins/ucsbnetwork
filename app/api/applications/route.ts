import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { sendApplicationEmail } from "@/lib/email/applications";
import { createApplicationRecord } from "@/lib/data/mutations";
import { applicationSchema } from "@/lib/schema";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { hashSensitiveValue, isLikelyBotSubmission } from "@/lib/utils/security";

// April 3, 2026 11:59 PM PST = April 4, 2026 07:59:00 UTC
const APPLICATION_DEADLINE = new Date("2026-04-04T07:59:00Z");

export async function POST(request: Request) {
  try {
    if (new Date() >= APPLICATION_DEADLINE) {
      return NextResponse.json(
        { error: "Applications for the first cohort have closed." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const payload = applicationSchema.parse(body);

    if (isLikelyBotSubmission(payload.formStartedAt, payload.honeypot)) {
      return NextResponse.json({ error: "Submission blocked." }, { status: 400 });
    }

    const headerStore = await headers();
    const forwardedFor = headerStore.get("x-forwarded-for") ?? "local";
    const ipAddress = forwardedFor.split(",")[0]?.trim() || "local";
    const ipHash = hashSensitiveValue(ipAddress);
    const emailHash = hashSensitiveValue(payload.email.toLowerCase());

    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase service role is not configured." },
        { status: 500 }
      );
    }

    const rateLimitWindow = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const { data: recentSubmissions } = await supabase
      .from("submission_audit")
      .select("id")
      .gte("submitted_at", rateLimitWindow)
      .or(`email_hash.eq.${emailHash},ip_hash.eq.${ipHash}`);

    if ((recentSubmissions ?? []).length >= 3) {
      return NextResponse.json(
        { error: "Too many submissions from this address. Please try again later." },
        { status: 429 }
      );
    }

    const applicationId = await createApplicationRecord(payload);

    await supabase.from("submission_audit").insert({
      email_hash: emailHash,
      ip_hash: ipHash
    });

    await sendApplicationEmail(applicationId, payload);

    return NextResponse.json({ ok: true, applicationId });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unable to submit application.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
