"use client";

import { useMemo, useState } from "react";

import type { HackathonSignup } from "@/lib/data/hackathon";

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

function buildCsv(signups: HackathonSignup[]): string {
  const headers = [
    "created_at",
    "name",
    "email",
    "school",
    "team_status",
    "teammates",
    "link",
    "pitch"
  ];
  const rows = signups.map((s) =>
    [
      s.createdAt,
      escapeCsvField(s.name),
      escapeCsvField(s.email),
      escapeCsvField(s.school),
      escapeCsvField(s.teamStatus),
      escapeCsvField(s.teammates),
      escapeCsvField(s.link),
      escapeCsvField(s.pitch)
    ].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

export function HackathonSignupsTable({ signups }: { signups: HackathonSignup[] }) {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return signups;
    return signups.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.school ?? "").toLowerCase().includes(q) ||
        (s.teammates ?? "").toLowerCase().includes(q) ||
        s.pitch.toLowerCase().includes(q)
    );
  }, [query, signups]);

  function downloadCsv() {
    const csv = buildCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hackathon-signups-${new Date().toISOString().slice(0, 10)}.csv`;
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
            placeholder="Search name, email, school, pitch…"
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
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>School</Th>
                <Th>Team</Th>
                <Th>Link</Th>
                <Th>Pitch</Th>
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
                      <span className="font-medium text-ink">{s.name}</span>
                    </Td>
                    <Td>
                      <a
                        href={`mailto:${s.email}`}
                        className="text-ink underline decoration-accent underline-offset-2 hover:text-accent"
                      >
                        {s.email}
                      </a>
                    </Td>
                    <Td>
                      <span className="text-ink/80">{s.school ?? "—"}</span>
                    </Td>
                    <Td>
                      <div className="flex flex-col gap-1">
                        <span
                          className={`inline-flex w-fit border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] ${
                            s.teamStatus === "team"
                              ? "border-accent/40 bg-accent/10 text-accent"
                              : "border-line/60 bg-panel/60 text-muted"
                          }`}
                        >
                          {s.teamStatus === "team" ? "Team" : "Solo"}
                        </span>
                        {s.teammates ? (
                          <span className="whitespace-pre-line text-xs text-ink/80">
                            {s.teammates}
                          </span>
                        ) : null}
                      </div>
                    </Td>
                    <Td>
                      {s.link ? (
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent underline underline-offset-2 hover:opacity-80"
                        >
                          Open &rarr;
                        </a>
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
                        <span className={isOpen ? "" : "line-clamp-2"}>
                          {s.pitch}
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
