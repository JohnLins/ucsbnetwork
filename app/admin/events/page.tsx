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
        <div className="border border-ink/10 bg-paper p-8 text-sm leading-7 text-muted">
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
        <aside className="divide-y divide-ink/10 border border-ink/10 bg-paper">
          <Link
            href="/admin/events"
            className={`block px-5 py-4 transition ${
              !selectedEvent ? "bg-accent/5" : "hover:bg-panel/60"
            }`}
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
              Create
            </p>
            <h2 className="mt-2 font-display text-xl leading-tight text-ink">
              New event
            </h2>
          </Link>
          {events.map((event) => {
            const isPast = new Date(event.eventDate) < new Date();
            const isSelected = selectedEvent?.id === event.id;
            return (
              <Link
                key={event.id}
                href={`/admin/events?id=${event.id}`}
                className={`block px-5 py-4 transition ${
                  isSelected ? "bg-accent/5" : "hover:bg-panel/60"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-accent">
                    {isPast ? "Past" : "Upcoming"}
                  </p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                    {formatShortDate(event.eventDate)}
                  </p>
                </div>
                <h2 className="mt-2 font-display text-xl leading-tight text-ink">
                  {event.title}
                </h2>
                {event.sponsor ? (
                  <p className="mt-1 text-sm text-muted">{event.sponsor}</p>
                ) : null}
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
