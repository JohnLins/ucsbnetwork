import Link from "next/link";

import { AdminEventEditor } from "@/components/admin-event-editor";
import { AdminShell } from "@/components/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { getAllEvents } from "@/lib/data/events";
import { hasServiceSupabaseEnv } from "@/lib/env";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminEventsPage({ searchParams }: PageProps) {
  const session = await requireAdmin();
  const params = searchParams ? await searchParams : {};

  if (!hasServiceSupabaseEnv || !session.isConfigured) {
    return (
      <AdminShell eyebrow="Admin" title="Events">
        <div className="rounded-2xl border border-line/40 bg-panel/60 p-8 text-sm leading-7 text-muted">
          Configure Supabase before managing events.
        </div>
      </AdminShell>
    );
  }

  const events = await getAllEvents();

  const selectedId = typeof params.id === "string" ? params.id : undefined;
  const selectedEvent = events.find((e) => e.id === selectedId);

  return (
    <AdminShell eyebrow="Admin" title="Events">
      <div className="grid gap-8 xl:grid-cols-[0.38fr_0.62fr]">
        <aside className="space-y-3 rounded-2xl border border-line/40 bg-panel/60 p-4">
          <Link
            href="/admin/events"
            className={`block rounded-[1.3rem] border px-4 py-4 transition ${
              !selectedEvent
                ? "border-accent/50 bg-accent/10"
                : "border-line/70 bg-paper/70 hover:border-accent/40"
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.32em] text-accent">Create</p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">New event</h2>
          </Link>
          {events.map((event) => {
            const isPast = new Date(event.eventDate) < new Date();
            return (
              <Link
                key={event.id}
                href={`/admin/events?id=${event.id}`}
                className={`block rounded-[1.3rem] border px-4 py-4 transition ${
                  selectedEvent?.id === event.id
                    ? "border-accent/50 bg-accent/10"
                    : "border-line/70 bg-paper/70 hover:border-accent/40"
                }`}
              >
                <p className="text-[11px] uppercase tracking-[0.32em] text-accent">
                  {isPast ? "Past" : "Upcoming"}
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-ink">{event.title}</h2>
                <p className="mt-2 text-sm text-muted">
                  {formatShortDate(event.eventDate)}
                  {event.sponsor ? ` · ${event.sponsor}` : ""}
                </p>
              </Link>
            );
          })}
        </aside>
        <AdminEventEditor
          key={selectedEvent?.id ?? "new"}
          event={selectedEvent}
        />
      </div>
    </AdminShell>
  );
}
