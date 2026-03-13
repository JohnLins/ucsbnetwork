import type {
  EventRecord,
  EventRsvp,
  EventVisibility,
  EventWithRsvp,
  MemberType,
  RsvpMode,
  RsvpStatus
} from "@/lib/types";
import { getSupabaseServiceClient } from "@/lib/supabase/service";

// ── Helpers ──

const VALID_VISIBILITIES = new Set<EventVisibility>(["all", "partners_only", "advisors_only", "partners_and_advisors"]);
const VALID_RSVP_MODES = new Set<RsvpMode>(["open", "invite_only", "closed"]);
const VALID_MEMBER_TYPES = new Set<MemberType>(["partner", "member", "alumni_advisor", "alumni_network"]);

function castVisibility(v: unknown): EventVisibility {
  const s = String(v);
  return VALID_VISIBILITIES.has(s as EventVisibility) ? (s as EventVisibility) : "all";
}

function castRsvpMode(v: unknown): RsvpMode {
  const s = String(v);
  return VALID_RSVP_MODES.has(s as RsvpMode) ? (s as RsvpMode) : "open";
}

function castMemberTypes(v: unknown): MemberType[] {
  if (!Array.isArray(v)) return [];
  return v.filter((t) => VALID_MEMBER_TYPES.has(t as MemberType)) as MemberType[];
}

function mapEvent(row: Record<string, unknown>): EventRecord {
  return {
    id: String(row.id),
    title: String(row.title),
    description: String(row.description ?? ""),
    location: String(row.location ?? ""),
    eventDate: String(row.event_date),
    endDate: row.end_date ? String(row.end_date) : null,
    imageUrl: row.image_url ? String(row.image_url) : null,
    externalUrl: row.external_url ? String(row.external_url) : null,
    sponsor: row.sponsor ? String(row.sponsor) : null,
    maxCapacity: row.max_capacity != null ? Number(row.max_capacity) : null,
    visibility: castVisibility(row.visibility),
    rsvpMode: castRsvpMode(row.rsvp_mode),
    rsvpOpenTo: castMemberTypes(row.rsvp_open_to),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

// ── Visibility filter ──

/**
 * Returns true if the given member type can see the event.
 */
export function canSeeEvent(visibility: EventVisibility, memberType: MemberType): boolean {
  switch (visibility) {
    case "all":
      return true;
    case "partners_only":
      return memberType === "partner";
    case "advisors_only":
      return memberType === "alumni_advisor";
    case "partners_and_advisors":
      return memberType === "partner" || memberType === "alumni_advisor";
    default:
      return false;
  }
}

/**
 * Returns true if the member type can RSVP to this event.
 * alumni_network can only RSVP if explicitly invited (handled separately).
 */
export function canRsvpToEvent(
  event: EventRecord,
  memberType: MemberType,
  isInvited: boolean
): boolean {
  if (event.rsvpMode === "closed") return false;

  // alumni_network can only RSVP when explicitly invited
  if (memberType === "alumni_network") return isInvited;

  if (event.rsvpMode === "invite_only") return isInvited;

  // rsvp_mode === "open"
  return event.rsvpOpenTo.includes(memberType);
}

// ── Queries ──

/**
 * Get all events (for admin).
 */
export async function getAllEvents(): Promise<EventRecord[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  return ((data ?? []) as Array<Record<string, unknown>>).map(mapEvent);
}

/**
 * Get events visible to a specific member type, with RSVP info.
 */
export async function getMemberEvents(
  memberId: string,
  memberType: MemberType
): Promise<EventWithRsvp[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const [{ data: events }, { data: rsvps }, { data: myRsvps }] = await Promise.all([
    supabase.from("events").select("*").order("event_date", { ascending: true }),
    supabase.from("event_rsvps").select("event_id, status").eq("status", "going"),
    supabase.from("event_rsvps").select("event_id, status, invited").eq("member_id", memberId)
  ]);

  const allEvents = ((events ?? []) as Array<Record<string, unknown>>).map(mapEvent);

  // Build RSVP count map
  const rsvpCountMap = new Map<string, number>();
  for (const r of rsvps ?? []) {
    rsvpCountMap.set(r.event_id, (rsvpCountMap.get(r.event_id) ?? 0) + 1);
  }

  // Build my RSVP map
  const myRsvpMap = new Map<string, { status: RsvpStatus; invited: boolean }>();
  for (const r of myRsvps ?? []) {
    myRsvpMap.set(r.event_id, {
      status: r.status as RsvpStatus,
      invited: Boolean(r.invited)
    });
  }

  return allEvents
    .filter((event) => canSeeEvent(event.visibility, memberType))
    .map((event) => {
      const myRsvp = myRsvpMap.get(event.id);
      const isInvited = myRsvp?.invited ?? false;

      return {
        ...event,
        rsvpCount: rsvpCountMap.get(event.id) ?? 0,
        currentUserRsvp: myRsvp?.status ?? null,
        canRsvp: canRsvpToEvent(event, memberType, isInvited)
      };
    });
}

/**
 * Get a single event by ID.
 */
export async function getEventById(eventId: string): Promise<EventRecord | null> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return null;

  const { data } = await supabase.from("events").select("*").eq("id", eventId).single();
  if (!data) return null;

  return mapEvent(data as Record<string, unknown>);
}

/**
 * Get all RSVPs for an event (admin use).
 */
export async function getEventRsvps(eventId: string): Promise<EventRsvp[]> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("event_rsvps")
    .select("id, event_id, member_id, status, invited, created_at, members!inner(full_name, member_type)")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true });

  return ((data ?? []) as Array<Record<string, unknown>>).map((row) => {
    const member = row.members as Record<string, unknown> | null;
    return {
      id: String(row.id),
      eventId: String(row.event_id),
      memberId: String(row.member_id),
      memberName: member ? String(member.full_name) : "Unknown",
      memberType: (member ? String(member.member_type) : "member") as MemberType,
      status: String(row.status) as RsvpStatus,
      invited: Boolean(row.invited),
      createdAt: String(row.created_at)
    };
  });
}

/**
 * Upsert (create or update) an event.
 */
export async function upsertEvent(input: {
  id?: string;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  endDate?: string;
  imageUrl?: string;
  externalUrl?: string;
  sponsor?: string;
  maxCapacity?: number | null;
  visibility: string;
  rsvpMode: string;
  rsvpOpenTo: string[];
}): Promise<string> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) throw new Error("Supabase not configured");

  const payload = {
    title: input.title,
    description: input.description,
    location: input.location,
    event_date: input.eventDate,
    end_date: input.endDate || null,
    image_url: input.imageUrl || null,
    external_url: input.externalUrl || null,
    sponsor: input.sponsor || null,
    max_capacity: input.maxCapacity ?? null,
    visibility: input.visibility,
    rsvp_mode: input.rsvpMode,
    rsvp_open_to: input.rsvpOpenTo,
    updated_at: new Date().toISOString()
  };

  if (input.id) {
    const { error } = await supabase.from("events").update(payload).eq("id", input.id);
    if (error) throw error;
    return input.id;
  } else {
    const { data, error } = await supabase
      .from("events")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw error;
    return data.id;
  }
}

/**
 * Delete an event by ID.
 */
export async function deleteEvent(eventId: string): Promise<void> {
  const supabase = getSupabaseServiceClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("events").delete().eq("id", eventId);
  if (error) throw error;
}
