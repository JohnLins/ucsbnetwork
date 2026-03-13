import { NextResponse } from "next/server";

import { getMemberSession, getMemberType } from "@/lib/member-auth";
import { getEventById, canSeeEvent, canRsvpToEvent } from "@/lib/data/events";
import { getSupabaseServiceClient } from "@/lib/supabase/service";
import type { RsvpStatus } from "@/lib/types";

const VALID_STATUSES = new Set<RsvpStatus>(["going", "maybe", "not_going"]);

export async function POST(request: Request) {
  const session = await getMemberSession();

  if (!session.isAuthenticated || !session.memberId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { eventId, status } = body as { eventId?: string; status?: RsvpStatus | null };

    if (!eventId || typeof eventId !== "string") {
      return NextResponse.json({ error: "Event ID is required." }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();
    if (!supabase) {
      return NextResponse.json({ error: "Service not configured." }, { status: 500 });
    }

    // Get event
    const event = await getEventById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found." }, { status: 404 });
    }

    // Get member type
    const memberType = await getMemberType(session.memberId);

    // Check visibility
    if (!canSeeEvent(event.visibility, memberType)) {
      return NextResponse.json({ error: "You don't have access to this event." }, { status: 403 });
    }

    // Check if member has an invite
    const { data: existingRsvp } = await supabase
      .from("event_rsvps")
      .select("id, invited")
      .eq("event_id", eventId)
      .eq("member_id", session.memberId)
      .single();

    const isInvited = existingRsvp?.invited ?? false;

    // Check RSVP permission
    if (!canRsvpToEvent(event, memberType, isInvited)) {
      return NextResponse.json({ error: "You cannot RSVP to this event." }, { status: 403 });
    }

    // Handle null status = cancel RSVP
    if (status === null || status === undefined) {
      if (existingRsvp) {
        if (existingRsvp.invited) {
          // Keep the row but set status to not_going (preserve invite)
          await supabase
            .from("event_rsvps")
            .update({ status: "not_going" })
            .eq("id", existingRsvp.id);
        } else {
          await supabase.from("event_rsvps").delete().eq("id", existingRsvp.id);
        }
      }
      return NextResponse.json({ ok: true, status: null });
    }

    if (!VALID_STATUSES.has(status)) {
      return NextResponse.json({ error: "Invalid RSVP status." }, { status: 400 });
    }

    // Check capacity for "going" status
    if (status === "going" && event.maxCapacity) {
      const { count } = await supabase
        .from("event_rsvps")
        .select("id", { count: "exact", head: true })
        .eq("event_id", eventId)
        .eq("status", "going");

      const currentCount = count ?? 0;
      const wasGoing = existingRsvp && (await supabase
        .from("event_rsvps")
        .select("status")
        .eq("id", existingRsvp.id)
        .single()
      ).data?.status === "going";

      if (!wasGoing && currentCount >= event.maxCapacity) {
        return NextResponse.json({ error: "Event is at capacity." }, { status: 400 });
      }
    }

    // Upsert RSVP
    if (existingRsvp) {
      await supabase
        .from("event_rsvps")
        .update({ status })
        .eq("id", existingRsvp.id);
    } else {
      await supabase.from("event_rsvps").insert({
        event_id: eventId,
        member_id: session.memberId,
        status,
        invited: false
      });
    }

    return NextResponse.json({ ok: true, status });
  } catch (error) {
    console.error("RSVP API error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
