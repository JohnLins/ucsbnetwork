import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();

  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: "Member ID is required." }, { status: 400 });
  }

  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 500 });
  }

  try {
    // Delete credentials first (may not exist if member was created without credentials)
    await supabase.from("member_credentials").delete().eq("member_id", id);

    // Delete the member — cascading FKs will remove member_links and member_tags
    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete member error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete member." },
      { status: 500 }
    );
  }
}
