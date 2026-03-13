import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { deleteEvent, getEventRsvps } from "@/lib/data/events";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();

  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const rsvps = await getEventRsvps(id);
    return NextResponse.json({ rsvps });
  } catch (error) {
    console.error("Admin event rsvps error:", error);
    return NextResponse.json({ error: "Failed to fetch RSVPs." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getAdminSession();

  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteEvent(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Admin event delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete event." },
      { status: 400 }
    );
  }
}
