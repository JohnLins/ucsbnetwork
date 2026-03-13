import { NextResponse } from "next/server";

import { getAdminSession } from "@/lib/auth";
import { upsertEvent } from "@/lib/data/events";

export async function POST(request: Request) {
  const session = await getAdminSession();

  if (!session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const {
      id,
      title,
      description,
      location,
      eventDate,
      endDate,
      imageUrl,
      externalUrl,
      sponsor,
      maxCapacity,
      visibility,
      rsvpMode,
      rsvpOpenTo
    } = body as Record<string, unknown>;

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    if (!eventDate || typeof eventDate !== "string") {
      return NextResponse.json({ error: "Event date is required." }, { status: 400 });
    }

    const eventId = await upsertEvent({
      id: typeof id === "string" ? id : undefined,
      title: String(title),
      description: typeof description === "string" ? description : "",
      location: typeof location === "string" ? location : "",
      eventDate: String(eventDate),
      endDate: typeof endDate === "string" && endDate ? endDate : undefined,
      imageUrl: typeof imageUrl === "string" && imageUrl ? imageUrl : undefined,
      externalUrl: typeof externalUrl === "string" && externalUrl ? externalUrl : undefined,
      sponsor: typeof sponsor === "string" && sponsor ? sponsor : undefined,
      maxCapacity: typeof maxCapacity === "number" ? maxCapacity : null,
      visibility: typeof visibility === "string" ? visibility : "all",
      rsvpMode: typeof rsvpMode === "string" ? rsvpMode : "open",
      rsvpOpenTo: Array.isArray(rsvpOpenTo) ? rsvpOpenTo.filter((t: unknown) => typeof t === "string") : []
    });

    return NextResponse.json({ ok: true, eventId });
  } catch (error) {
    console.error("Admin events API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save event." },
      { status: 400 }
    );
  }
}
