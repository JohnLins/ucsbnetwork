"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  HackathonReviewStatus,
  HackathonSignup
} from "@/lib/data/hackathon";

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
    "status",
    "reviewed_at",
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
      escapeCsvField(s.status),
      escapeCsvField(s.reviewedAt),
      escapeCsvField(s.link),
      escapeCsvField(s.pitch)
    ].join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}

type Decision = "accept" | "reject";
type StatusFilter = "all" | "pending" | "accepted" | "rejected";

type ReviewState =
  | { kind: "idle" }
  | { kind: "open"; signupId: string; decision: Decision; note: string }
  | { kind: "submitting"; signupId: string; decision: Decision }
  | {
      kind: "result";
      signupId: string;
      ok: boolean;
      message: string;
    };

export function HackathonSignupsTable({
  signups
}: {
  signups: HackathonSignup[];
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [review, setReview] = useState<ReviewState>({ kind: "idle" });

  const counts = useMemo(() => {
    return {
      pending: signups.filter((s) => s.status === "pending").length,
      accepted: signups.filter((s) => s.status === "accepted").length,
      rejected: signups.filter((s) => s.status === "rejected").length
    };
  }, [signups]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return signups.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.school ?? "").toLowerCase().includes(q) ||
        (s.teammates ?? "").toLowerCase().includes(q) ||
        s.pitch.toLowerCase().includes(q)
      );
    });
  }, [query, statusFilter, signups]);

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

  function openReview(signupId: string, decision: Decision) {
    setReview({ kind: "open", signupId, decision, note: "" });
  }

  function closeReview() {
    setReview({ kind: "idle" });
  }

  async function submitReview(signup: HackathonSignup, decision: Decision, note: string) {
    setReview({ kind: "submitting", signupId: signup.id, decision });
    try {
      const response = await fetch("/api/admin/hackathon/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          signupId: signup.id,
          decision,
          personalNote: note.trim() || undefined
        })
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        warnings?: string[];
        error?: string;
      } | null;

      if (!response.ok || !data?.ok) {
        setReview({
          kind: "result",
          signupId: signup.id,
          ok: false,
          message: data?.error ?? "Unable to save review."
        });
        return;
      }

      const verb = decision === "accept" ? "Accepted" : "Rejected";
      const warningSuffix = data.warnings && data.warnings.length > 0
        ? ` (warnings: ${data.warnings.join("; ")})`
        : "";
      setReview({
        kind: "result",
        signupId: signup.id,
        ok: true,
        message: `${verb} ${signup.name}. Email sent.${warningSuffix}`
      });
      router.refresh();
    } catch (error) {
      setReview({
        kind: "result",
        signupId: signup.id,
        ok: false,
        message: error instanceof Error ? error.message : "Network error."
      });
    }
  }

  const banner =
    review.kind === "result" ? (
      <div
        className={`mb-6 border p-3 text-sm ${
          review.ok
            ? "border-accent/40 bg-accent/10 text-ink"
            : "border-red-500/30 bg-red-500/5 text-red-500"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <span>{review.message}</span>
          <button
            type="button"
            onClick={() => setReview({ kind: "idle" })}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted hover:text-ink"
          >
            Dismiss
          </button>
        </div>
      </div>
    ) : null;

  return (
    <div>
      {banner}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <FilterChip
            label={`All (${signups.length})`}
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <FilterChip
            label={`Pending (${counts.pending})`}
            active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          />
          <FilterChip
            label={`Accepted (${counts.accepted})`}
            active={statusFilter === "accepted"}
            onClick={() => setStatusFilter("accepted")}
          />
          <FilterChip
            label={`Rejected (${counts.rejected})`}
            active={statusFilter === "rejected"}
            onClick={() => setStatusFilter("rejected")}
          />
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
          No signups match.
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
                <Th>Status</Th>
                <Th>Pitch</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filtered.map((s) => {
                const isOpen = expanded === s.id;
                const isReviewOpen =
                  review.kind === "open" && review.signupId === s.id;
                const isSubmitting =
                  review.kind === "submitting" && review.signupId === s.id;
                return (
                  <tr key={s.id} className="align-top hover:bg-panel/40">
                    <Td>
                      <span className="font-mono text-xs text-muted">
                        {formatDate(s.createdAt)}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-ink">{s.name}</span>
                        {s.link ? (
                          <a
                            href={s.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-accent underline underline-offset-2 hover:opacity-80"
                          >
                            link &rarr;
                          </a>
                        ) : null}
                      </div>
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
                      <StatusPill status={s.status} />
                      {s.reviewedAt ? (
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.16em] text-muted">
                          {formatDate(s.reviewedAt)}
                        </span>
                      ) : null}
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
                    <Td>
                      {isReviewOpen && review.kind === "open" ? (
                        <ReviewForm
                          decision={review.decision}
                          note={review.note}
                          onNoteChange={(value) =>
                            setReview({ ...review, note: value })
                          }
                          onSubmit={() => submitReview(s, review.decision, review.note)}
                          onCancel={closeReview}
                        />
                      ) : isSubmitting ? (
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                          Sending…
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() => openReview(s.id, "accept")}
                            disabled={s.status === "accepted"}
                            className="border border-accent/60 bg-accent/10 px-3 py-1 text-xs font-medium text-ink transition hover:bg-accent/20 disabled:opacity-40"
                          >
                            {s.status === "accepted"
                              ? "Accepted"
                              : "Accept & email"}
                          </button>
                          <button
                            type="button"
                            onClick={() => openReview(s.id, "reject")}
                            disabled={s.status === "rejected"}
                            className="border border-line/60 bg-panel/60 px-3 py-1 text-xs font-medium text-ink/80 transition hover:bg-panel disabled:opacity-40"
                          >
                            {s.status === "rejected"
                              ? "Rejected"
                              : "Reject & email"}
                          </button>
                        </div>
                      )}
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

function ReviewForm({
  decision,
  note,
  onNoteChange,
  onSubmit,
  onCancel
}: {
  decision: Decision;
  note: string;
  onNoteChange: (value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}) {
  const label = decision === "accept" ? "Send acceptance" : "Send rejection";
  const primaryClass =
    decision === "accept"
      ? "border-accent/60 bg-accent/20 text-ink hover:bg-accent/30"
      : "border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20";

  return (
    <div className="flex w-64 flex-col gap-2">
      <textarea
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        rows={3}
        placeholder="Optional personal note appended to the email"
        className="w-full border border-line/40 bg-paper px-2.5 py-2 text-xs text-ink outline-none transition placeholder:text-muted/60 focus:border-accent/60 focus:ring-1 focus:ring-accent/20"
      />
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onSubmit}
          className={`flex-1 border px-3 py-1 text-xs font-medium transition ${primaryClass}`}
        >
          {label}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-line/40 bg-paper px-3 py-1 text-xs text-muted hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] transition ${
        active
          ? "border-accent/60 bg-accent/10 text-ink"
          : "border-line/40 bg-paper text-muted hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function StatusPill({ status }: { status: HackathonReviewStatus }) {
  const styles =
    status === "accepted"
      ? "border-accent/50 bg-accent/15 text-ink"
      : status === "rejected"
        ? "border-red-500/30 bg-red-500/10 text-red-500"
        : "border-line/60 bg-panel/60 text-muted";
  return (
    <span
      className={`inline-flex w-fit border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] ${styles}`}
    >
      {status}
    </span>
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
