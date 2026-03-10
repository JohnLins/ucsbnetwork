import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { syncMemberRecord } from "@/lib/data/mutations";
import { memberUpsertSchema } from "@/lib/schema";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const payload = memberUpsertSchema.parse(body);
    const memberId = await syncMemberRecord(payload);

    return NextResponse.json({ ok: true, memberId });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save member." },
      { status: 400 }
    );
  }
}
