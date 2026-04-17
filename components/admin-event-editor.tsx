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
  "h-10 w-full border border-ink/15 bg-paper px-3.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/25";
const textareaClass =
  "w-full border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/25";

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

    setStatus({ kind: "loading", message: "Deleting…" });

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
    <form onSubmit={handleSubmit} className="border border-ink/10 bg-paper">
      <div className="border-b border-ink/10 p-6">
        <p className="eyebrow-accent">
          {event ? "Edit event" : "Create event"}
        </p>
        <h2 className="mt-3 font-display text-3xl leading-tight text-ink">
          {event ? event.title : "New event"}
        </h2>
      </div>

      <div className="space-y-5 border-b border-ink/10 p-6">
        <Labeled title="Title">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
            required
          />
        </Labeled>

        <Labeled title="Description">
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className={textareaClass}
          />
        </Labeled>

        <div className="grid gap-5 md:grid-cols-2">
          <Labeled title="Event date">
            <input
              type="datetime-local"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
              className={inputClass}
              required
            />
          </Labeled>
          <Labeled title="End date (optional)">
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              className={inputClass}
            />
          </Labeled>
        </div>

        <Labeled title="Location">
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className={inputClass}
          />
        </Labeled>

        <div className="grid gap-5 md:grid-cols-2">
          <Labeled title="Sponsor">
            <input
              value={form.sponsor}
              onChange={(e) => setForm({ ...form, sponsor: e.target.value })}
              className={inputClass}
            />
          </Labeled>
          <Labeled title="Max capacity">
            <input
              type="number"
              value={form.maxCapacity}
              onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })}
              className={inputClass}
              min={1}
            />
          </Labeled>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Labeled title="Banner image URL">
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className={inputClass}
              placeholder="/cursor.png"
            />
          </Labeled>
          <Labeled title="External link">
            <input
              value={form.externalUrl}
              onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
              className={inputClass}
              placeholder="https://…"
            />
          </Labeled>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Who can see this event
          </p>
          <div className="flex flex-wrap gap-2">
            {VISIBILITY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, visibility: opt.value })}
                className={`border px-3.5 py-1.5 text-sm transition ${
                  form.visibility === opt.value
                    ? "border-accent bg-accent text-[#0b0e14]"
                    : "border-ink/15 text-ink hover:border-ink/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">RSVP mode</p>
          <div className="flex flex-wrap gap-2">
            {RSVP_MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm({ ...form, rsvpMode: opt.value })}
                className={`border px-3.5 py-1.5 text-sm transition ${
                  form.rsvpMode === opt.value
                    ? "border-accent bg-accent text-[#0b0e14]"
                    : "border-ink/15 text-ink hover:border-ink/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {form.rsvpMode === "open" && (
          <div className="space-y-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              RSVP open to
            </p>
            <div className="flex flex-wrap gap-2">
              {MEMBER_TYPE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggleRsvpOpenTo(opt.value)}
                  className={`border px-3.5 py-1.5 text-sm transition ${
                    form.rsvpOpenTo.includes(opt.value)
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-ink/15 text-ink hover:border-ink/40"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {event && (
        <div className="border-b border-ink/10 p-6">
          <div className="flex items-center gap-4">
            <p className="eyebrow">RSVPs</p>
            <button
              type="button"
              onClick={loadRsvps}
              disabled={loadingRsvps}
              className="text-xs text-accent transition hover:opacity-80 disabled:opacity-50"
            >
              {loadingRsvps ? "Loading…" : rsvps ? "Refresh" : "Load RSVPs"}
            </button>
          </div>
          {rsvps && (
            <div className="mt-4">
              {rsvps.length === 0 ? (
                <p className="text-sm text-muted">No RSVPs yet.</p>
              ) : (
                <div className="divide-y divide-ink/10 border-y border-ink/10">
                  {rsvps.map((rsvp) => (
                    <div
                      key={rsvp.id}
                      className="flex items-center justify-between px-0 py-3 text-sm"
                    >
                      <div>
                        <span className="font-medium text-ink">{rsvp.memberName}</span>
                        <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.22em] text-muted">
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
                        className={`border px-2 py-0.5 text-[10px] uppercase tracking-wide ${
                          rsvp.status === "going"
                            ? "border-accent/50 bg-accent/10 text-accent"
                            : rsvp.status === "maybe"
                            ? "border-ink/20 text-ink/70"
                            : "border-red-500/30 text-red-500"
                        }`}
                      >
                        {rsvp.status === "going"
                          ? "Going"
                          : rsvp.status === "maybe"
                          ? "Maybe"
                          : "Not Going"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">{status.message ?? ""}</p>
        <div className="flex items-center gap-3">
          {event && !deleteConfirm && (
            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="border border-red-500/40 px-3.5 py-2 text-sm text-red-500 transition hover:bg-red-500/10"
            >
              Delete
            </button>
          )}
          {event && deleteConfirm && (
            <>
              <span className="text-sm text-red-500">Are you sure?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={status.kind === "loading"}
                className="border border-red-600 bg-red-600 px-3.5 py-2 text-sm text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                Confirm delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(false)}
                className="text-sm text-muted transition hover:text-ink"
              >
                Cancel
              </button>
            </>
          )}
          <button
            type="submit"
            disabled={status.kind === "loading"}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {status.kind === "loading" ? "Saving…" : "Save event"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Labeled({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        {title}
      </span>
      {children}
    </label>
  );
}
