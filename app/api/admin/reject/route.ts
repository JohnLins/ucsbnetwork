import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
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

    const { error } = await supabase.rpc("reject_application", {
      application_id: payload.applicationId,
      reviewer_email: session.email,
      p_review_notes: payload.reviewNotes ?? null
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to reject application." },
      { status: 400 }
    );
  }
}
