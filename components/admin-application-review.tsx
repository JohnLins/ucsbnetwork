"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { ApplicationRecord, MemberType, Tag } from "@/lib/types";

const NON_STUDENT_TYPES = new Set([
  "Alumni",
  "Faculty",
  "Researcher",
  "Staff",
  "Community collaborator"
]);

type AdminApplicationReviewProps = {
  application: ApplicationRecord;
  tags: Tag[];
};

export function AdminApplicationReview({ application, tags }: AdminApplicationReviewProps) {
  const router = useRouter();
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "success" | "error"; message?: string }>({
    kind: "idle"
  });
  const isAdvisor = NON_STUDENT_TYPES.has(application.ucsbAffiliationType);

  const [draft, setDraft] = useState({
    fullName: application.fullName,
    headline: [application.currentTitle, application.companyOrOrg].filter(Boolean).join(" at "),
    companyOrOrg: application.companyOrOrg ?? "",
    location: application.location ?? "",
    bio: application.bio,
    websiteUrl: application.websiteUrl ?? "",
    memberType: (isAdvisor ? "advisor" : "member") as MemberType,
    roles: application.roles.map((tag) => tag.slug),
    domains: application.domains.map((tag) => tag.slug),
    keywords: application.keywords.map((tag) => tag.slug),
    links: application.links.length
      ? application.links.map((link) => ({
          linkType: link.linkType,
          label: link.label ?? "",
          url: link.url
        }))
      : [
          ...(application.websiteUrl
            ? [{ linkType: "website" as const, label: "Site", url: application.websiteUrl }]
            : [])
        ]
  });
  const [reviewNotes, setReviewNotes] = useState(application.reviewNotes ?? "");

  const roles = tags.filter((tag) => tag.tagType === "role");
  const domains = tags.filter((tag) => tag.tagType === "domain");
  const keywords = tags.filter((tag) => tag.tagType === "keyword");

  async function submit(decision: "approve" | "reject") {
    setStatus({ kind: "loading" });

    const response = await fetch(`/api/admin/${decision}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        applicationId: application.id,
        decision,
        reviewNotes,
        memberDraft: draft
      })
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus({
        kind: "error",
        message: data?.error ?? `Unable to ${decision} this application right now.`
      });
      return;
    }

    const result = (await response.json().catch(() => null)) as {
      ok?: boolean;
      warnings?: string[];
    } | null;

    const warningText = result?.warnings?.length
      ? ` (⚠ ${result.warnings.join("; ")})`
      : "";

    setStatus({
      kind: "success",
      message:
        (decision === "approve" ? "Application approved." : "Application rejected.") +
        warningText
    });

    // Refresh the page data so the list updates
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-line/40 bg-panel/60 p-6">
      <div className="flex flex-col gap-4 border-b border-line/30 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-medium text-muted">{application.status}</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink">{application.fullName}</h2>
          <p className="mt-2 text-sm text-muted">
            {application.currentTitle}
            {application.companyOrOrg ? ` at ${application.companyOrOrg}` : ""}
          </p>
        </div>
        <div className="text-sm leading-7 text-muted">
          <p>{application.email}</p>
          <p>
            {application.ucsbAffiliationType} · {application.ucsbAffiliationDetail}
          </p>
        </div>
      </div>

      {/* ── Application answers (read-only) ── */}
      <div className="mt-8 space-y-4">
        <p className="text-[11px] uppercase tracking-[0.32em] text-muted">Application answers</p>
        <div className="rounded-xl border border-line/40 bg-paper/60 p-5 text-sm leading-7 text-muted space-y-4">
          <p><strong className="text-ink">What are you building?</strong><br />{application.bio}</p>
          <p><strong className="text-ink">Most impressive thing built/shipped/accomplished (last 12 months):</strong><br />{application.whyJoin}</p>
          {application.whatYouCanHelpWith ? (
            <p><strong className="text-ink">Can help other members with:</strong><br />{application.whatYouCanHelpWith}</p>
          ) : null}
          {application.whatYouAreLookingFor ? (
            <p><strong className="text-ink">People they think should be in the network:</strong><br />{application.whatYouAreLookingFor}</p>
          ) : null}
          {application.referredBy ? (
            <p><strong className="text-ink">Referred by:</strong><br />{application.referredBy}</p>
          ) : null}
          {application.websiteUrl ? (
            <p><strong className="text-ink">Website:</strong>{" "}
              <a href={application.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{application.websiteUrl}</a>
            </p>
          ) : null}
          {application.resumeSignedUrl ? (
            <p>
              <strong className="text-ink">Uploaded file:</strong>{" "}
              <a
                href={application.resumeSignedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-accent hover:underline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                View file
              </a>
            </p>
          ) : null}
          {application.links.length > 0 ? (
            <div>
              <strong className="text-ink">Links:</strong>
              <ul className="mt-1 space-y-1">
                {application.links.map((link) => (
                  <li key={link.id ?? link.url}>
                    <span className="capitalize text-ink">{link.linkType}</span>:{" "}
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{link.url}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Editable member draft ── */}
      <div className="mt-8 grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <EditableField label="Public name">
            <input value={draft.fullName} onChange={(e) => setDraft({ ...draft, fullName: e.target.value })} className={inputClass} />
          </EditableField>
          <EditableField label="Headline">
            <input value={draft.headline} onChange={(e) => setDraft({ ...draft, headline: e.target.value })} className={inputClass} />
          </EditableField>
          <div className="grid gap-5 md:grid-cols-2">
            <EditableField label="Company">
              <input value={draft.companyOrOrg} onChange={(e) => setDraft({ ...draft, companyOrOrg: e.target.value })} className={inputClass} />
            </EditableField>
            <EditableField label="Location">
              <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} className={inputClass} />
            </EditableField>
          </div>
          <EditableField label="Website">
            <input value={draft.websiteUrl} onChange={(e) => setDraft({ ...draft, websiteUrl: e.target.value })} className={inputClass} />
          </EditableField>
          <EditableField label="Directory type">
            <select
              value={draft.memberType}
              onChange={(e) => setDraft({ ...draft, memberType: e.target.value as MemberType })}
              className="h-11 w-full rounded-lg border border-line/60 bg-paper px-4 text-sm text-ink outline-none"
            >
              <option value="member">Member</option>
              <option value="advisor">Advisor</option>
            </select>
          </EditableField>
          <EditableField label="Member bio (editable)">
            <textarea value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} rows={6} className={textareaClass} />
          </EditableField>
          <EditableField label="Review notes (internal)">
            <textarea value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} rows={4} className={textareaClass} />
          </EditableField>
          <TokenField
            title="Keywords"
            values={draft.keywords}
            options={keywords}
            onChange={(values) => setDraft({ ...draft, keywords: values })}
          />
        </div>
        <div className="space-y-6">
          <TokenField title="Roles" values={draft.roles} options={roles} onChange={(values) => setDraft({ ...draft, roles: values })} />
          <TokenField title="Domains" values={draft.domains} options={domains} onChange={(values) => setDraft({ ...draft, domains: values })} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-line/30 pt-5 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted">{status.message ?? ""}</div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => submit("reject")}
            disabled={status.kind === "loading"}
            className="rounded-xl border border-line/50 px-5 py-2.5 text-sm text-muted transition hover:text-ink disabled:opacity-50"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => submit("approve")}
            disabled={status.kind === "loading"}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            Approve and publish
          </button>
        </div>
      </div>
    </div>
  );
}

function EditableField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-3">
      <span className="text-[11px] uppercase tracking-[0.32em] text-muted">{label}</span>
      {children}
    </label>
  );
}

function TokenField({
  title,
  values,
  options,
  onChange
}: {
  title: string;
  values: string[];
  options: Tag[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] uppercase tracking-[0.32em] text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isActive = values.includes(option.slug);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                onChange(
                  isActive ? values.filter((value) => value !== option.slug) : [...values, option.slug]
                )
              }
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-accent/50 bg-accent/12 text-accent"
                  : "border-line/80 bg-paper/70 text-muted hover:border-accent/40 hover:text-ink"
              }`}
            >
              {option.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const inputClass =
  "h-11 w-full rounded-lg border border-line/60 bg-paper px-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20";

const textareaClass =
  "w-full rounded-lg border border-line/60 bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20";
