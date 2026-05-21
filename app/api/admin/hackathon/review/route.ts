import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { getAdminSession } from "@/lib/auth";
import {
  sendHackathonAcceptanceEmail,
  sendHackathonRejectionEmail
} from "@/lib/email/hackathon-review";
import { hackathonAdminReviewSchema } from "@/lib/schema";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session.isAdmin || !session.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = hackathonAdminReviewSchema.parse(body);
    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured." },
        { status: 500 }
      );
    }

    const { data: signup, error: fetchError } = await supabase
      .from("hackathon_signups")
      .select("id, name, email, team_status, teammates, status")
      .eq("id", payload.signupId)
      .single();

    if (fetchError || !signup) {
      return NextResponse.json(
        { error: "Could not find the hackathon signup." },
        { status: 404 }
      );
    }

    const nextStatus = payload.decision === "accept" ? "accepted" : "rejected";

    const { error: updateError } = await supabase
      .from("hackathon_signups")
      .update({
        status: nextStatus,
        reviewed_at: new Date().toISOString(),
        reviewed_by_admin_email: session.email,
        review_notes: payload.reviewNotes ?? null
      })
      .eq("id", payload.signupId);

    if (updateError) {
      throw updateError;
    }

    const warnings: string[] = [];
    try {
      if (payload.decision === "accept") {
        await sendHackathonAcceptanceEmail({
          applicantEmail: String(signup.email),
          applicantName: String(signup.name),
          teamStatus:
            signup.team_status === "team" ? "team" : "solo",
          teammates: signup.teammates ? String(signup.teammates) : null,
          personalNote: payload.personalNote
        });
      } else {
        await sendHackathonRejectionEmail({
          applicantEmail: String(signup.email),
          applicantName: String(signup.name),
          personalNote: payload.personalNote
        });
      }
    } catch (emailError) {
      console.error("Hackathon review email failed", emailError);
      warnings.push(
        emailError instanceof Error
          ? `Email failed: ${emailError.message}`
          : "Email failed"
      );
    }

    return NextResponse.json({ ok: true, status: nextStatus, warnings });
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

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unable to review signup."
      },
      { status: 400 }
    );
  }
}
