import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { sendApplicationEmail } from "@/lib/email/applications";
import { createApplicationRecord } from "@/lib/data/mutations";
import { applicationSchema } from "@/lib/schema";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { hashSensitiveValue, isLikelyBotSubmission } from "@/lib/utils/security";

/** Map Zod field paths to human-readable labels */
const FIELD_LABELS: Record<string, string> = {
  fullName: "Name",
  email: "Email",
  phone: "Phone",
  ucsbAffiliationType: "UCSB status",
  ucsbAffiliationDetail: "Major",
  graduationYear: "Year",
  currentTitle: "What you do",
  companyOrOrg: "Company",
  location: "Location",
  websiteUrl: "Personal website",
  bio: "What are you building",
  roles: "Roles",
  domains: "Domains",
  keywords: "Keywords",
  linkedinUrl: "LinkedIn",
  xUrl: "X",
  githubUrl: "GitHub",
  whyJoin: "Opinion question",
  referredBy: "Who referred you",
};

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

    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of error.issues) {
        const fieldKey = issue.path[0]?.toString() ?? "_form";
        if (fieldErrors[fieldKey]) continue; // keep first error per field

        const label = FIELD_LABELS[fieldKey] ?? fieldKey;
        let msg = issue.message;

        // Make generic Zod messages more human-readable
        if (msg === "Required") {
          msg = "Required";
        } else if ("minimum" in issue) {
          const min = (issue as unknown as Record<string, unknown>).minimum;
          msg = `Must be at least ${min} characters`;
        } else if ("maximum" in issue) {
          const max = (issue as unknown as Record<string, unknown>).maximum;
          msg = `Must be ${max} characters or fewer`;
        }

        fieldErrors[fieldKey] = `${label}: ${msg}`;
      }

      const messages = Object.values(fieldErrors);

      return NextResponse.json(
        {
          error: messages.length === 1
            ? messages[0]
            : `Please fix the following:\n${messages.map((m) => `• ${m}`).join("\n")}`,
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const message = error instanceof Error ? error.message : "Unable to submit application.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
