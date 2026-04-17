import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { sendRejectionEmail } from "@/lib/email/rejection";
import { adminReviewSchema } from "@/lib/schema";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session.isAdmin || !session.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = adminReviewSchema.parse(body);
    const supabase = getSupabaseServiceClient();

    if (!supabase) {
      return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
    }

    const { data: application, error: fetchError } = await supabase
      .from("applications")
      .select("email, full_name")
      .eq("id", payload.applicationId)
      .single();

    if (fetchError || !application) {
      return NextResponse.json(
        { error: "Could not find the application to reject." },
        { status: 404 }
      );
    }

    const { error } = await supabase.rpc("reject_application", {
      application_id: payload.applicationId,
      reviewer_email: session.email,
      p_review_notes: payload.reviewNotes ?? null
    });

    if (error) {
      throw error;
    }

    const warnings: string[] = [];
    try {
      await sendRejectionEmail({
        applicantEmail: application.email,
        applicantName: application.full_name,
        variant: payload.rejectionVariant ?? "standard",
        personalNote: payload.applicantNote
      });
    } catch (emailError) {
      console.error("Rejection email failed", emailError);
      warnings.push(
        emailError instanceof Error
          ? `Email failed: ${emailError.message}`
          : "Email failed"
      );
    }

    return NextResponse.json({ ok: true, warnings });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to reject application." },
      { status: 400 }
    );
  }
}
