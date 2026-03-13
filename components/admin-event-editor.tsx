"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { EventRecord, EventRsvp, EventVisibility, MemberType, RsvpMode } from "@/lib/types";

const VISIBILITY_OPTIONS: { value: EventVisibility; label: string }[] = [
  { value: "all", label: "All members" },
  { value: "partners_only", label: "Partners only" },
  { value: "advisors_only", label: "Advisors only" },
  { value: "partners_and_advisors", label: "Partners & Advisors" }
];

const RSVP_MODE_OPTIONS: { value: RsvpMode; label: string }[] = [
  { value: "open", label: "Open" },
  { value: "invite_only", label: "Invite only" },
  { value: "closed", label: "Closed" }
];

const MEMBER_TYPE_OPTIONS: { value: MemberType; label: string }[] = [
  { value: "partner", label: "Partners" },
  { value: "member", label: "Members" },
  { value: "alumni_advisor", label: "Alumni Advisors" },
  { value: "alumni_network", label: "Alumni Network" }
];

const inputClass =
  "h-11 w-full rounded-lg border border-line/60 bg-paper px-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20";
const textareaClass =
  "w-full rounded-lg border border-line/60 bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20";
const selectClass =
  "h-11 w-full rounded-lg border border-line/60 bg-paper px-4 text-sm text-ink outline-none";

function toLocalDatetime(isoStr: string): string {
  const d = new Date(isoStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${day}T${h}:${min}`;
}

export function AdminEventEditor({
  event
}: {
  event?: EventRecord;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "success" | "error"; message?: string }>({
    kind: "idle"
  });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [rsvps, setRsvps] = useState<EventRsvp[] | null>(null);
  const [loadingRsvps, setLoadingRsvps] = useState(false);

  const [form, setForm] = useState({
    id: event?.id,
    title: event?.title ?? "",
    description: event?.description ?? "",
    location: event?.location ?? "",
    eventDate: event?.eventDate ? toLocalDatetime(event.eventDate) : "",
    endDate: event?.endDate ? toLocalDatetime(event.endDate) : "",
    imageUrl: event?.imageUrl ?? "",
    externalUrl: event?.externalUrl ?? "",
    sponsor: event?.sponsor ?? "",
    maxCapacity: event?.maxCapacity ?? "",
    visibility: event?.visibility ?? "all" as EventVisibility,
    rsvpMode: event?.rsvpMode ?? "open" as RsvpMode,
    rsvpOpenTo: event?.rsvpOpenTo ?? ["partner"] as MemberType[]
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "loading" });

    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          maxCapacity: form.maxCapacity ? Number(form.maxCapacity) : null,
          endDate: form.endDate || undefined,
          imageUrl: form.imageUrl || undefined,
          externalUrl: form.externalUrl || undefined,
          sponsor: form.sponsor || undefined
        })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus({ kind: "error", message: data?.error ?? "Failed to save event." });
        return;
      }

      setStatus({ kind: "success", message: "Event saved." });
      router.refresh();
    } catch {
      setStatus({ kind: "error", message: "Something went wrong." });
    }
  }

  async function handleDelete() {
    if (!event) return;

    setStatus({ kind: "loading", message: "Deleting..." });

    try {
      const response = await fetch(`/api/admin/events/${event.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus({ kind: "error", message: data?.error ?? "Failed to delete event." });
        return;
      }

      setStatus({ kind: "success", message: "Event deleted." });
      router.push("/admin/events");
      router.refresh();
    } catch {
      setStatus({ kind: "error", message: "Something went wrong." });
    }
  }

  async function loadRsvps() {
    if (!event || loadingRsvps) return;
    setLoadingRsvps(true);

    try {
      const response = await fetch(`/api/admin/events/${event.id}`);
      if (response.ok) {
        const data = await response.json();
        setRsvps(data.rsvps ?? []);
      }
    } catch {
      // silent
    } finally {
      setLoadingRsvps(false);
    }
  }

  function toggleRsvpOpenTo(type: MemberType) {
    setForm((prev) => ({
      ...prev,
      rsvpOpenTo: prev.rsvpOpenTo.includes(type)
        ? prev.rsvpOpenTo.filter((t) => t !== type)
        : [...prev.rsvpOpenTo, type]
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line/40 bg-panel/60 p-6">
      <div className="space-y-2 border-b border-line/30 pb-5">
        <p className="text-xs font-medium text-muted">
          {event ? "Edit event" : "Create event"}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          {event ? event.title : "New event"}
        </h2>
      </div>

      <div className="mt-8 space-y-6">
        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-[0.32em] text-muted">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-[0.32em] text-muted">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className={textareaClass}
          />
        </div>

        {/* Date & location */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-[0.32em] text-muted">Event date</label>
            <input
              type="datetime-local"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              className={inputClass}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-[0.32em] text-muted">End date (optional)</label>
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] uppercase tracking-[0.32em] text-muted">Location</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className={inputClass}
          />
        </div>

        {/* Sponsor & image */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-[0.32em] text-muted">Sponsor</label>
            <input
              value={form.sponsor}
              onChange={(e) => setForm({ ...form, sponsor: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-[0.32em] text-muted">Max capacity</label>
            <input
              type="number"
              value={form.maxCapacity}
              onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })}
              className={inputClass}
              min={1}
            />
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-[0.32em] text-muted">Banner image URL</label>
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className={inputClass}
              placeholder="/cursor.png"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-[0.32em] text-muted">External link</label>
            <input
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Visibility */}
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted">Who can see this event</p>
          <div className="flex flex-wrap gap-2">
            {VISIBILITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, visibility: opt.value })}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  form.visibility === opt.value
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : "border-line/60 text-muted hover:border-accent/30 hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* RSVP mode */}
        <div className="space-y-2">
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted">RSVP mode</p>
          <div className="flex flex-wrap gap-2">
            {RSVP_MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, rsvpMode: opt.value })}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                  form.rsvpMode === opt.value
                    ? "border-accent/50 bg-accent/15 text-accent"
                    : "border-line/60 text-muted hover:border-accent/30 hover:text-ink"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* RSVP open to */}
        {form.rsvpMode === "open" && (
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.32em] text-muted">RSVP open to</p>
            <div className="flex flex-wrap gap-2">
              {MEMBER_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleRsvpOpenTo(opt.value)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    form.rsvpOpenTo.includes(opt.value)
                      ? "border-accent/50 bg-accent/15 text-accent"
                      : "border-line/60 text-muted hover:border-accent/30 hover:text-ink"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RSVPs viewer */}
      {event && (
        <div className="mt-8 border-t border-line/30 pt-5">
          <div className="flex items-center gap-3">
            <p className="text-[11px] uppercase tracking-[0.32em] text-muted">RSVPs</p>
            <button
              type="button"
              onClick={loadRsvps}
              disabled={loadingRsvps}
              className="text-xs text-accent hover:underline disabled:opacity-50"
            >
              {loadingRsvps ? "Loading…" : rsvps ? "Refresh" : "Load RSVPs"}
            </button>
          </div>
          {rsvps && (
            <div className="mt-4">
              {rsvps.length === 0 ? (
                <p className="text-sm text-muted">No RSVPs yet.</p>
              ) : (
                <div className="space-y-2">
                  {rsvps.map((rsvp) => (
                    <div
                      key={rsvp.id}
                      className="flex items-center justify-between rounded-lg border border-line/40 bg-paper/60 px-4 py-2.5 text-sm"
                    >
                      <div>
                        <span className="font-medium text-ink">{rsvp.memberName}</span>
                        <span className="ml-2 text-xs text-muted">
                          {rsvp.memberType === "partner"
                            ? "Partner"
                            : rsvp.memberType === "member"
                            ? "Member"
                            : rsvp.memberType === "alumni_advisor"
                            ? "Advisor"
                            : "Alumni"}
                        </span>
                      </div>
                      <span
                        className={`rounded-md px-2 py-0.5 text-xs font-medium ${
                          rsvp.status === "going"
                            ? "bg-green-500/15 text-green-400"
                            : rsvp.status === "maybe"
                            ? "bg-yellow-500/15 text-yellow-400"
                            : "bg-red-500/15 text-red-400"
                        }`}
                      >
                        {rsvp.status === "going" ? "Going" : rsvp.status === "maybe" ? "Maybe" : "Not Going"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-4 border-t border-line/30 pt-5 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">{status.message ?? ""}</p>
        <div className="flex items-center gap-3">
          {event && !deleteConfirm && (
            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
            >
              Delete
            </button>
          )}
          {event && deleteConfirm && (
            <>
              <span className="text-sm text-red-400">Are you sure?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={status.kind === "loading"}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                Confirm delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(false)}
                className="text-sm text-muted hover:text-ink transition"
              >
                Cancel
              </button>
            </>
          )}
          <button
            type="submit"
            disabled={status.kind === "loading"}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {status.kind === "loading" ? "Saving…" : "Save event"}
          </button>
        </div>
      </div>
    </form>
  );
}
