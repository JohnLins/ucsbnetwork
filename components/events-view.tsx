"use client";

import { useState } from "react";
import Image from "next/image";

import type { EventWithRsvp, MemberType, RsvpStatus } from "@/lib/types";

const VISIBILITY_LABELS: Record<string, string> = {
  all: "All Members",
  partners_only: "Partners Only",
  advisors_only: "Advisors Only",
  partners_and_advisors: "Partners & Advisors"
};

const TYPE_LABELS: Record<MemberType, string> = {
  partner: "Partners",
  member: "Members",
  alumni_advisor: "Advisors",
  alumni_network: "Alumni Network"
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

export function EventsView({
  events,
  memberType
}: {
  events: EventWithRsvp[];
  memberType: MemberType;
}) {
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.eventDate) >= now);
  const past = events.filter((e) => new Date(e.eventDate) < now);

  return (
    <div className="space-y-10">
      {upcoming.length === 0 && past.length === 0 ? (
        <p className="text-sm text-muted">No events yet. Stay tuned.</p>
      ) : null}

      {upcoming.length > 0 && (
        <section>
          <h2 className="mb-6 text-xs font-medium uppercase tracking-[0.32em] text-accent">
            Upcoming Events
          </h2>
          <div className="space-y-6">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} memberType={memberType} />
            ))}
          </div>
        </section>
      )}

      {past.length > 0 && (
        <PastEventsSection events={past} memberType={memberType} />
      )}
    </div>
  );
}

function PastEventsSection({
  events,
  memberType
}: {
  events: EventWithRsvp[];
  memberType: MemberType;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="mb-4 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.32em] text-muted transition hover:text-ink"
      >
        Past Events ({events.length})
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition ${expanded ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="space-y-6 opacity-70">
          {events.map((event) => (
            <EventCard key={event.id} event={event} memberType={memberType} isPast />
          ))}
        </div>
      )}
    </section>
  );
}

function EventCard({
  event,
  memberType,
  isPast = false
}: {
  event: EventWithRsvp;
  memberType: MemberType;
  isPast?: boolean;
}) {
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus | null>(event.currentUserRsvp);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(event.rsvpCount);

  async function handleRsvp(status: RsvpStatus) {
    if (isSubmitting) return;

    // Toggle off if clicking same status
    const newStatus = rsvpStatus === status ? null : status;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/events/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event.id,
          status: newStatus
        })
      });

      if (response.ok) {
        // Adjust count
        const wasGoing = rsvpStatus === "going";
        const isGoing = newStatus === "going";
        if (wasGoing && !isGoing) setRsvpCount((c) => c - 1);
        if (!wasGoing && isGoing) setRsvpCount((c) => c + 1);

        setRsvpStatus(newStatus);
      }
    } catch {
      // silent fail
    } finally {
      setIsSubmitting(false);
    }
  }

  const invitedTags = event.rsvpOpenTo.map((t) => TYPE_LABELS[t]).filter(Boolean);

  return (
    <div className="overflow-hidden rounded-2xl border border-line/40 bg-panel/60 transition hover:border-accent/20">
      {/* Banner image */}
      {event.imageUrl && (
        <div className="relative h-48 w-full bg-ink/10">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-ink">{event.title}</h3>
            {event.sponsor && (
              <p className="mt-1 text-sm text-accent">
                Sponsored by {event.sponsor}
              </p>
            )}
          </div>
          {!isPast && event.canRsvp && (
            <div className="flex gap-2">
              {(["going", "maybe"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleRsvp(status)}
                  disabled={isSubmitting}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
                    rsvpStatus === status
                      ? "border-accent/50 bg-accent/15 text-accent"
                      : "border-line/60 text-muted hover:border-accent/30 hover:text-ink"
                  }`}
                >
                  {status === "going" ? "Going" : "Maybe"}
                </button>
              ))}
              {rsvpStatus && (
                <button
                  type="button"
                  onClick={() => handleRsvp(rsvpStatus)}
                  disabled={isSubmitting}
                  className="rounded-lg border border-line/60 px-3 py-2 text-sm text-muted transition hover:text-red-400"
                  title="Cancel RSVP"
                >
                  ✕
                </button>
              )}
            </div>
          )}
          {!isPast && !event.canRsvp && (
            <span className="rounded-lg border border-line/40 px-3 py-2 text-xs text-muted">
              {memberType === "alumni_network"
                ? "Invite only"
                : event.rsvpMode === "closed"
                ? "RSVP closed"
                : "Application only"}
            </span>
          )}
        </div>

        {/* Date & location */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {formatDate(event.eventDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {formatTime(event.eventDate)}
          </span>
          {event.location && (
            <span className="flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {event.location}
            </span>
          )}
        </div>

        {/* Description */}
        {event.description && (
          <p className="mt-4 text-sm leading-relaxed text-muted/80">{event.description}</p>
        )}

        {/* Footer: tags + RSVP count */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-line/20 pt-4">
          {/* Visibility tag */}
          <span className="rounded-md border border-accent/20 bg-accent/5 px-2 py-0.5 text-[11px] text-accent">
            {VISIBILITY_LABELS[event.visibility] ?? "All Members"}
          </span>

          {/* Invited type tags */}
          {invitedTags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-line/30 px-2 py-0.5 text-[11px] text-muted"
            >
              {tag}
            </span>
          ))}

          <span className="ml-auto text-xs text-muted">
            {rsvpCount} going
            {event.maxCapacity ? ` / ${event.maxCapacity} spots` : ""}
          </span>

          {event.externalUrl && (
            <a
              href={event.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline"
            >
              More info →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
