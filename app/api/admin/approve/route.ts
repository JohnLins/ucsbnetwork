import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { sendMemberWelcomeEmail } from "@/lib/email/member-welcome";
import { adminReviewSchema } from "@/lib/schema";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import { generatePassword, hashPassword } from "@/lib/utils/password";

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

    // Fetch the application to get the applicant's email
    const { data: application } = await supabase
      .from("applications")
      .select("email, full_name")
      .eq("id", payload.applicationId)
      .single();

    if (!application) {
      return NextResponse.json({ error: "Application not found." }, { status: 404 });
    }

    // Run the approve RPC
    const { data: newMemberId, error } = await supabase.rpc("approve_application", {
      application_id: payload.applicationId,
      reviewer_email: session.email,
      member_payload: {
        ...payload.memberDraft,
        reviewNotes: payload.reviewNotes ?? ""
      }
    });

    if (error) {
      throw error;
    }

    // Generate member credentials
    const plainPassword = generatePassword(16);
    const passwordHash = await hashPassword(plainPassword);

    const { error: credError } = await supabase.from("member_credentials").insert({
      member_id: newMemberId,
      email: application.email.toLowerCase(),
      password_hash: passwordHash
    });

    if (credError) {
      console.error("Failed to create member credentials:", credError);
      // Don't fail the whole approval — member was already created
    }

    // Email the member their login credentials
    try {
      await sendMemberWelcomeEmail(
        application.email,
        application.full_name,
        plainPassword
      );
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to approve application." },
      { status: 400 }
    );
  }
}
