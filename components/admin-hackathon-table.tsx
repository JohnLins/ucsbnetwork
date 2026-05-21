"use client";

import { useEffect, useMemo, useState } from "react";
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

type ReviewModal = {
  signup: HackathonSignup;
  decision: Decision;
};

type FlashMessage = {
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
  const [modal, setModal] = useState<ReviewModal | null>(null);
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [flash, setFlash] = useState<FlashMessage | null>(null);

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

  async function submitReview(signup: HackathonSignup, decision: Decision, note: string) {
    setSubmittingId(signup.id);
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
        setFlash({
          ok: false,
          message: data?.error ?? "Unable to save review."
        });
        return;
      }

      const verb = decision === "accept" ? "Accepted" : "Rejected";
      const warningSuffix =
        data.warnings && data.warnings.length > 0
          ? ` (warnings: ${data.warnings.join("; ")})`
          : "";
      setFlash({
        ok: true,
        message: `${verb} ${signup.name}. Email sent.${warningSuffix}`
      });
      setModal(null);
      router.refresh();
    } catch (error) {
      setFlash({
        ok: false,
        message: error instanceof Error ? error.message : "Network error."
      });
    } finally {
      setSubmittingId(null);
    }
  }

  return (
    <div>
      {flash ? (
        <div
          className={`mb-6 border p-3 text-sm ${
            flash.ok
              ? "border-accent/40 bg-accent/10 text-ink"
              : "border-red-500/30 bg-red-500/5 text-red-500"
          }`}
        >
          <div className="flex items-start justify-between gap-4">
            <span>{flash.message}</span>
            <button
              type="button"
              onClick={() => setFlash(null)}
              className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted hover:text-ink"
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

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
        <div className="overflow-x-auto border border-line/40">
          <table className="w-full min-w-[1100px] text-sm">
            <thead className="bg-panel/70">
              <tr className="text-left">
                <Th>Date</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>School</Th>
                <Th>Team</Th>
                <Th>Status</Th>
                <Th>Pitch</Th>
                <Th className="w-44">Action</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/40">
              {filtered.map((s) => {
                const isOpen = expanded === s.id;
                const isSubmitting = submittingId === s.id;
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
                      {isSubmitting ? (
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                          Sending…
                        </span>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setModal({ signup: s, decision: "accept" })
                            }
                            disabled={s.status === "accepted"}
                            className="border border-accent/60 bg-accent/10 px-3 py-1 text-xs font-medium text-ink transition hover:bg-accent/20 disabled:opacity-40"
                          >
                            {s.status === "accepted" ? "Accepted" : "Accept"}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setModal({ signup: s, decision: "reject" })
                            }
                            disabled={s.status === "rejected"}
                            className="border border-line/60 bg-panel/60 px-3 py-1 text-xs font-medium text-ink/80 transition hover:bg-panel disabled:opacity-40"
                          >
                            {s.status === "rejected" ? "Rejected" : "Reject"}
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

      {modal ? (
        <ReviewModalView
          signup={modal.signup}
          decision={modal.decision}
          submitting={submittingId === modal.signup.id}
          onClose={() => setModal(null)}
          onSubmit={(note) => submitReview(modal.signup, modal.decision, note)}
        />
      ) : null}
    </div>
  );
}

function ReviewModalView({
  signup,
  decision,
  submitting,
  onClose,
  onSubmit
}: {
  signup: HackathonSignup;
  decision: Decision;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (note: string) => void;
}) {
  const [note, setNote] = useState("");

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) onClose();
    }
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, submitting]);

  const isAccept = decision === "accept";
  const title = isAccept
    ? `Accept ${signup.name}?`
    : `Reject ${signup.name}?`;
  const submitLabel = isAccept ? "Accept & send email" : "Reject & send email";
  const submitClass = isAccept
    ? "border-accent/60 bg-accent/20 text-ink hover:bg-accent/30"
    : "border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20";
  const description = isAccept
    ? "Sends the hackathon acceptance email with the Luma RSVP link."
    : "Sends the hackathon rejection email. They can apply again next time.";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 px-4 py-10"
      onClick={() => {
        if (!submitting) onClose();
      }}
    >
      <div
        className="w-full max-w-lg border border-line/40 bg-paper p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
              {isAccept ? "Acceptance" : "Rejection"}
            </p>
            <h2 className="mt-2 font-display text-2xl text-ink">{title}</h2>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted hover:text-ink disabled:opacity-50"
          >
            Close
          </button>
        </div>

        <dl className="mt-5 space-y-3 border-t border-line/40 pt-5 text-sm">
          <ModalRow label="Email" value={signup.email} />
          <ModalRow label="School" value={signup.school ?? "—"} />
          <ModalRow
            label="Team"
            value={
              signup.teamStatus === "team"
                ? signup.teammates
                  ? `Team:\n${signup.teammates}`
                  : "Team (no teammates listed)"
                : "Solo"
            }
          />
          <ModalRow label="Pitch" value={signup.pitch} />
        </dl>

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="hackathon-review-note"
            className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted"
          >
            Personal note (optional)
          </label>
          <textarea
            id="hackathon-review-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Appended to the email before the sign-off."
            className="w-full border border-line/40 bg-paper px-3 py-2 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-accent/60 focus:ring-1 focus:ring-accent/20"
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="border border-line/40 bg-paper px-4 py-2 text-sm text-muted transition hover:text-ink disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSubmit(note)}
            disabled={submitting}
            className={`border px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${submitClass}`}
          >
            {submitting ? "Sending…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[5.5rem_1fr] gap-3">
      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted">
        {label}
      </dt>
      <dd className="whitespace-pre-line text-sm text-ink/90">{value}</dd>
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

function Th({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={`border-b border-line/40 px-4 py-3 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-muted ${
        className ?? ""
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-4 py-4 align-top">{children}</td>;
}
