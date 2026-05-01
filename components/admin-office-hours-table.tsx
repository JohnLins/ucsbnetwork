"use client";

import { useMemo, useState } from "react";

import type { OfficeHoursSignup } from "@/lib/data/office-hours";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function escapeCsvField(value: string | null | undefined): string {
  const v = value ?? "";
  if (/[",\n]/.test(v)) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}

function buildCsv(signups: OfficeHoursSignup[]): string {
  const headers = ["created_at", "names", "phone", "relevant_links", "project"];
  const rows = signups.map((s) =>
    [
      s.createdAt,
      escapeCsvField(s.names),
      escapeCsvField(s.phone),
      escapeCsvField(s.relevantLinks),
      escapeCsvField(s.project)
    ].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function OfficeHoursSignupsTable({ signups }: { signups: OfficeHoursSignup[] }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return signups;
    return signups.filter(
      (s) =>
        s.names.toLowerCase().includes(q) ||
        s.phone.toLowerCase().includes(q) ||
        (s.relevantLinks ?? "").toLowerCase().includes(q) ||
        s.project.toLowerCase().includes(q)
    );
  }, [query, signups]);

  function downloadCsv() {
    const csv = buildCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `office-hours-signups-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted">
            {filtered.length} / {signups.length} signups
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, links, project…"
            className="h-10 w-72 border border-line/40 bg-paper px-3.5 text-sm text-ink outline-none transition placeholder:text-muted/50 focus:border-accent/60 focus:ring-1 focus:ring-accent/20"
          />
          <button
            type="button"
            onClick={downloadCsv}
            disabled={filtered.length === 0}
            className="btn-secondary text-sm disabled:opacity-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-line/40 bg-panel/60 p-8 text-sm text-muted">
          No signups yet.
        </div>
      ) : (
        <div className="overflow-hidden border border-line/40">
          <table className="w-full text-sm">
            <thead className="bg-panel/70">
              <tr className="text-left">
                <Th>Date</Th>
                <Th>Name(s)</Th>
                <Th>Phone</Th>
                <Th>Links</Th>
                <Th>Project</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filtered.map((s) => {
                const isOpen = expanded === s.id;
                return (
                  <tr key={s.id} className="align-top hover:bg-panel/40">
                    <Td>
                      <span className="font-mono text-xs text-muted">
                        {formatDate(s.createdAt)}
                      </span>
                    </Td>
                    <Td>
                      <span className="font-medium text-ink">{s.names}</span>
                    </Td>
                    <Td>
                      <a
                        href={`tel:${s.phone.replace(/\s/g, "")}`}
                        className="text-ink underline decoration-accent underline-offset-2 hover:text-accent"
                      >
                        {s.phone}
                      </a>
                    </Td>
                    <Td>
                      {s.relevantLinks?.trim() ? (
                        <button
                          type="button"
                          onClick={() => setExpanded(isOpen ? null : s.id)}
                          className="text-left text-ink/80 transition hover:text-ink"
                        >
                          <span className={isOpen ? "whitespace-pre-wrap" : "line-clamp-2"}>
                            {s.relevantLinks}
                          </span>
                        </button>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </Td>
                    <Td>
                      <button
                        type="button"
                        onClick={() => setExpanded(isOpen ? null : s.id)}
                        className="text-left text-ink/80 transition hover:text-ink"
                      >
                        <span className={isOpen ? "whitespace-pre-wrap" : "line-clamp-2"}>
                          {s.project}
                        </span>
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-b border-line/40 px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-muted">
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-4 align-top">{children}</td>;
}
