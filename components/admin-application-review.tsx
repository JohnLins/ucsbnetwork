"use client";

import { useState } from "react";

import type { ApplicationRecord, Tag } from "@/lib/types";

type AdminApplicationReviewProps = {
  application: ApplicationRecord;
  tags: Tag[];
};

export function AdminApplicationReview({ application, tags }: AdminApplicationReviewProps) {
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "success" | "error"; message?: string }>({
    kind: "idle"
  });
  const [draft, setDraft] = useState({
    fullName: application.fullName,
    headline: [application.currentTitle, application.companyOrOrg].filter(Boolean).join(" at "),
    companyOrOrg: application.companyOrOrg ?? "",
    location: application.location ?? "",
    bio: application.bio,
    websiteUrl: application.websiteUrl ?? "",
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

    setStatus({
      kind: "success",
      message: decision === "approve" ? "Application approved." : "Application rejected."
    });
  }

  return (
    <div className="rounded-[2rem] border border-line/80 bg-panel/80 p-6 shadow-halo">
      <div className="flex flex-col gap-4 border-b border-line/70 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.38em] text-accent">{application.status}</p>
          <h2 className="mt-3 font-display text-4xl text-ink">{application.fullName}</h2>
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
          <EditableField label="Public bio">
            <textarea value={draft.bio} onChange={(e) => setDraft({ ...draft, bio: e.target.value })} rows={6} className={textareaClass} />
          </EditableField>
          <EditableField label="Review notes">
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
          <EditableField label="Private context">
            <div className="rounded-[1.25rem] border border-line/80 bg-paper/60 p-4 text-sm leading-7 text-muted">
              <p><strong className="text-ink">Why join:</strong> {application.whyJoin}</p>
              {application.whatYouCanHelpWith ? (
                <p className="mt-3"><strong className="text-ink">Can help with:</strong> {application.whatYouCanHelpWith}</p>
              ) : null}
              {application.whatYouAreLookingFor ? (
                <p className="mt-3"><strong className="text-ink">Looking for:</strong> {application.whatYouAreLookingFor}</p>
              ) : null}
            </div>
          </EditableField>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 border-t border-line/70 pt-6 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-muted">{status.message ?? "Review and curate the public-facing profile before approval."}</div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => submit("reject")}
            disabled={status.kind === "loading"}
            className="rounded-full border border-line/80 px-5 py-3 text-xs uppercase tracking-[0.28em] text-muted transition hover:text-ink disabled:opacity-60"
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => submit("approve")}
            disabled={status.kind === "loading"}
            className="rounded-full border border-accent/45 bg-accent/10 px-5 py-3 text-xs uppercase tracking-[0.28em] text-ink transition hover:bg-accent/20 disabled:opacity-60"
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
                  ? "border-accent bg-accent/12 text-ink"
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
  "h-12 w-full rounded-[1rem] border border-line/80 bg-paper px-4 text-sm text-ink outline-none transition focus:border-accent/45";

const textareaClass =
  "w-full rounded-[1rem] border border-line/80 bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/45";
