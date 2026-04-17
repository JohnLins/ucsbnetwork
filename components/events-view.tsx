"use client";

import { useState } from "react";
import Image from "next/image";

import type { EventWithRsvp, MemberType, RsvpStatus } from "@/lib/types";

const VISIBILITY_LABELS: Record<string, string> = {
  all: "All members",
  partners_only: "Partners only",
  advisors_only: "Advisors only",
  partners_and_advisors: "Partners & advisors"
};

const TYPE_LABELS: Record<MemberType, string> = {
  partner: "Partners",
  member: "Members",
  alumni_advisor: "Advisors",
  alumni_network: "Alumni network"
};

function formatShortDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: d.toLocaleDateString("en-US", { day: "numeric" }),
    full: d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    })
  };
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
    <div>
      <div>
        <p className="eyebrow-accent">Your events</p>
        <h1 className="mt-3 font-display text-4xl text-ink">
          What&rsquo;s on the calendar.
        </h1>
      </div>

      {upcoming.length === 0 && past.length === 0 ? (
        <div className="mt-14 border border-dashed border-ink/15 p-12 text-center">
          <p className="eyebrow">No events yet</p>
          <p className="mx-auto mt-4 max-w-md text-sm text-muted">
            We&rsquo;ll post cohort sessions, the hackathon, Demo Day, and
            other gatherings here as they are scheduled.
          </p>
        </div>
      ) : null}

      {upcoming.length > 0 ? (
        <section className="mt-12">
          <p className="eyebrow mb-6">Upcoming</p>
          <div>
            {upcoming.map((event, i) => (
              <EventRow
                key={event.id}
                event={event}
                memberType={memberType}
                index={i}
              />
            ))}
          </div>
        </section>
      ) : null}

      {past.length > 0 ? (
        <PastEventsSection events={past} memberType={memberType} />
      ) : null}
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
    <section className="mt-16 border-t border-ink/10 pt-10">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-muted transition hover:text-ink"
      >
        Past events ({events.length})
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
      {expanded ? (
        <div className="mt-6 opacity-75">
          {events.map((event, i) => (
            <EventRow
              key={event.id}
              event={event}
              memberType={memberType}
              index={i}
              isPast
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

function EventRow({
  event,
  memberType,
  index,
  isPast = false
}: {
  event: EventWithRsvp;
  memberType: MemberType;
  index: number;
  isPast?: boolean;
}) {
  const [rsvpStatus, setRsvpStatus] = useState<RsvpStatus | null>(event.currentUserRsvp);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvpCount, setRsvpCount] = useState(event.rsvpCount);

  async function handleRsvp(status: RsvpStatus) {
    if (isSubmitting) return;

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
  const date = formatShortDate(event.eventDate);

  return (
    <article className="grid gap-6 border-t border-ink/10 py-8 first:border-t-0 md:grid-cols-[7rem_1fr] md:gap-10">
      {/* Date column */}
      <div className="flex flex-col">
        <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-accent">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-4xl leading-none text-ink">
            {date.day}
          </span>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
            {date.month}
          </span>
        </div>
        <span className="mt-1 font-mono text-[11px] text-muted">{date.time}</span>
      </div>

      {/* Content column */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-display text-2xl leading-tight text-ink">
              {event.title}
            </h3>
            {event.sponsor ? (
              <p className="mt-1 text-sm text-accent">Sponsored by {event.sponsor}</p>
            ) : null}
            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
              <span>{date.full}</span>
              {event.location ? <span>· {event.location}</span> : null}
            </div>
          </div>

          {!isPast && event.canRsvp ? (
            <div className="flex items-center gap-2">
              {(["going", "maybe"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleRsvp(status)}
                  disabled={isSubmitting}
                  className={`border px-3 py-1.5 text-sm transition disabled:opacity-50 ${
                    rsvpStatus === status
                      ? "border-accent bg-accent text-[#0b0e14]"
                      : "border-ink/20 text-ink hover:border-ink/60"
                  }`}
                >
                  {status === "going" ? "Going" : "Maybe"}
                </button>
              ))}
            </div>
          ) : !isPast ? (
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
              {memberType === "alumni_network"
                ? "Invite only"
                : event.rsvpMode === "closed"
                ? "RSVP closed"
                : "Invite only"}
            </span>
          ) : null}
        </div>

        {event.imageUrl ? (
          <div className="relative h-56 w-full overflow-hidden border border-ink/10 bg-ink/5 md:h-64">
            <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />
          </div>
        ) : null}

        {event.description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-ink/80">
            {event.description}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink/10 pt-4 text-[11px] font-mono uppercase tracking-[0.22em]">
          <span className="text-accent">
            {VISIBILITY_LABELS[event.visibility] ?? "All members"}
          </span>
          {invitedTags.map((tag) => (
            <span key={tag} className="text-muted">
              · {tag}
            </span>
          ))}
          <span className="ml-auto text-muted">
            {rsvpCount} going
            {event.maxCapacity ? ` / ${event.maxCapacity}` : ""}
          </span>
          {event.externalUrl ? (
            <a
              href={event.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent transition hover:opacity-80"
            >
              More info &rarr;
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
