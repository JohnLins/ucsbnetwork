import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { officeHoursSignupSchema } from "@/lib/schema";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { hashSensitiveValue, isLikelyBotSubmission } from "@/lib/utils/security";

function normalizePhoneDigits(value: string) {
  return value.replace(/\D/g, "");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = officeHoursSignupSchema.parse(body);

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
    const digits = normalizePhoneDigits(payload.phone);
    const phoneHash = hashSensitiveValue(digits.length > 0 ? digits : payload.phone.trim());

    const windowStart = new Date(Date.now() - 1000 * 60 * 60).toISOString();
    const { data: recent } = await supabase
      .from("office_hours_signups")
      .select("id")
      .gte("created_at", windowStart)
      .or(`phone_hash.eq.${phoneHash},ip_hash.eq.${ipHash}`);

    if ((recent ?? []).length >= 3) {
      return NextResponse.json(
        { error: "Too many submissions from this address. Try again later." },
        { status: 429 }
      );
    }

    const { data: existing } = await supabase
      .from("office_hours_signups")
      .select("id")
      .eq("phone_hash", phoneHash)
      .limit(1);

    if ((existing ?? []).length > 0) {
      return NextResponse.json({ ok: true });
    }

    const { error } = await supabase.from("office_hours_signups").insert({
      names: payload.names,
      phone: payload.phone.trim(),
      relevant_links: payload.relevantLinks?.trim() || null,
      project: payload.project,
      ip_hash: ipHash,
      phone_hash: phoneHash
    });

    if (error) {
      console.error("office hours signup insert failed", error);
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
