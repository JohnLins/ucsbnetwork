"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { ApplicationRecord, MemberType, Tag } from "@/lib/types";

type RejectionVariant =
  | "standard"
  | "hackathon"
  | "next_cohort"
  | "team_matching";

const REJECTION_VARIANTS: Array<{
  value: RejectionVariant;
  label: string;
  blurb: string;
}> = [
  {
    value: "standard",
    label: "Standard",
    blurb: "Polite, short. No next-step nudge."
  },
  {
    value: "hackathon",
    label: "Hackathon",
    blurb: "Cracked engineer, wrong fit for cohort. Pushes them to the hackathon."
  },
  {
    value: "next_cohort",
    label: "Next cohort",
    blurb: "Top of the pile but didn't make the cut. Asks them to apply next cycle."
  },
  {
    value: "team_matching",
    label: "Team matching",
    blurb: "Not a founder fit, but strong. Hold for intros to cohort startups."
  }
];

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
    memberType: (isAdvisor ? "alumni_advisor" : "partner") as MemberType,
    cohort: isAdvisor ? null : 1 as number | null,
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
  const [rejectionVariant, setRejectionVariant] = useState<RejectionVariant>("standard");
  const [applicantNote, setApplicantNote] = useState("");

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
        memberDraft: draft,
        ...(decision === "reject"
          ? {
              rejectionVariant,
              applicantNote: applicantNote.trim() ? applicantNote.trim() : undefined
            }
          : {})
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
      ? ` (warning: ${result.warnings.join("; ")})`
      : "";

    setStatus({
      kind: "success",
      message:
        (decision === "approve" ? "Application approved." : "Application rejected.") +
        warningText
    });

    router.refresh();
  }

  return (
    <div className="border border-ink/10 bg-paper">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-ink/10 p-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="eyebrow-accent">{application.status}</p>
          <h2 className="mt-3 font-display text-3xl leading-tight text-ink">
            {application.fullName}
          </h2>
          <p className="mt-2 text-sm text-muted">
            {application.currentTitle}
            {application.companyOrOrg ? ` at ${application.companyOrOrg}` : ""}
          </p>
        </div>
        <div className="space-y-1 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          <p>{application.email}</p>
          <p>
            {application.ucsbAffiliationType} · {application.ucsbAffiliationDetail}
          </p>
        </div>
      </div>

      {/* Application answers (read-only) */}
      <div className="border-b border-ink/10 p-6">
        <p className="eyebrow mb-5">Application answers</p>
        <dl className="space-y-5 text-sm leading-7 text-muted">
          <AnswerBlock label="What are you building?">{application.bio}</AnswerBlock>
          <AnswerBlock label="Most impressive thing built/shipped/accomplished (last 12 months)">
            {application.whyJoin}
          </AnswerBlock>
          {application.whatYouCanHelpWith ? (
            <AnswerBlock label="Can help other members with">
              {application.whatYouCanHelpWith}
            </AnswerBlock>
          ) : null}
          {application.whatYouAreLookingFor ? (
            <AnswerBlock label="People they think should be in the network">
              {application.whatYouAreLookingFor}
            </AnswerBlock>
          ) : null}
          {application.referredBy ? (
            <AnswerBlock label="Referred by">{application.referredBy}</AnswerBlock>
          ) : null}
          {application.websiteUrl ? (
            <AnswerBlock label="Website">
              <a
                href={application.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-editorial"
              >
                {application.websiteUrl}
              </a>
            </AnswerBlock>
          ) : null}
          {application.resumeSignedUrl ? (
            <AnswerBlock label="Uploaded file">
              <a
                href={application.resumeSignedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-accent transition hover:opacity-80"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                View file
              </a>
            </AnswerBlock>
          ) : null}
          {application.links.length > 0 ? (
            <AnswerBlock label="Links">
              <ul className="space-y-1">
                {application.links.map((link) => (
                  <li key={link.id ?? link.url}>
                    <span className="font-mono text-xs uppercase tracking-wide text-ink">
                      {link.linkType}
                    </span>
                    :{" "}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-editorial"
                    >
                      {link.url}
                    </a>
                  </li>
                ))}
              </ul>
            </AnswerBlock>
          ) : null}
        </dl>
      </div>

      {/* Editable member draft */}
      <div className="border-b border-ink/10 p-6">
        <p className="eyebrow mb-5">Member draft</p>
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-5">
            <EditableField label="Public name">
              <input
                value={draft.fullName}
                onChange={(e) => setDraft({ ...draft, fullName: e.target.value })}
                className={inputClass}
              />
            </EditableField>
            <EditableField label="Headline">
              <input
                value={draft.headline}
                onChange={(e) => setDraft({ ...draft, headline: e.target.value })}
                className={inputClass}
              />
            </EditableField>
            <div className="grid gap-5 md:grid-cols-2">
              <EditableField label="Company">
                <input
                  value={draft.companyOrOrg}
                  onChange={(e) => setDraft({ ...draft, companyOrOrg: e.target.value })}
                  className={inputClass}
                />
              </EditableField>
              <EditableField label="Location">
                <input
                  value={draft.location}
                  onChange={(e) => setDraft({ ...draft, location: e.target.value })}
                  className={inputClass}
                />
              </EditableField>
            </div>
            <EditableField label="Website">
              <input
                value={draft.websiteUrl}
                onChange={(e) => setDraft({ ...draft, websiteUrl: e.target.value })}
                className={inputClass}
              />
            </EditableField>
            <EditableField label="Member bio (editable)">
              <textarea
                value={draft.bio}
                onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
                rows={6}
                className={textareaClass}
              />
            </EditableField>
            <EditableField label="Review notes (internal)">
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                rows={4}
                className={textareaClass}
              />
            </EditableField>
            <TokenField
              title="Keywords"
              values={draft.keywords}
              options={keywords}
              onChange={(values) => setDraft({ ...draft, keywords: values })}
            />
          </div>
          <div className="space-y-5">
            <TokenField
              title="Roles"
              values={draft.roles}
              options={roles}
              onChange={(values) => setDraft({ ...draft, roles: values })}
            />
            <TokenField
              title="Domains"
              values={draft.domains}
              options={domains}
              onChange={(values) => setDraft({ ...draft, domains: values })}
            />
          </div>
        </div>
      </div>

      {/* Decision */}
      <div className="p-6">
        <div className="mb-5">
          <p className="eyebrow mb-3">Accept as</p>
          <div className="flex flex-wrap gap-2">
            {([
              { value: "partner", label: "Partner" },
              { value: "member", label: "Member" },
              { value: "alumni_advisor", label: "Alumni Advisor" },
              { value: "alumni_network", label: "Alumni Network" }
            ] as const).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDraft({ ...draft, memberType: option.value })}
                className={`border px-3.5 py-1.5 text-sm transition ${
                  draft.memberType === option.value
                    ? "border-accent bg-accent text-[#0b0e14]"
                    : "border-ink/15 text-ink hover:border-ink/40"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {draft.memberType === "partner" && (
          <div className="mb-5">
            <p className="eyebrow mb-3">Cohort</p>
            <input
              type="number"
              min={0}
              value={draft.cohort ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  cohort: e.target.value !== "" ? parseInt(e.target.value, 10) : null
                })
              }
              placeholder="e.g. 1"
              className="h-10 w-24 border border-ink/15 bg-paper px-3.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/25"
            />
          </div>
        )}

        <div className="mb-5 border-t border-ink/10 pt-5">
          <p className="eyebrow mb-3">Rejection email</p>
          <p className="mb-4 text-xs text-muted">
            Used only when you click Reject. An email is sent from{" "}
            <span className="font-mono text-ink">apply@ucsb.network</span> with
            this body, plus your optional note below.
          </p>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {REJECTION_VARIANTS.map((option) => {
              const isActive = rejectionVariant === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setRejectionVariant(option.value)}
                  className={`flex flex-col gap-1 border p-3 text-left transition ${
                    isActive
                      ? "border-accent bg-accent/5"
                      : "border-ink/15 hover:border-ink/40"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isActive ? "text-accent" : "text-ink"
                    }`}
                  >
                    {option.label}
                  </span>
                  <span className="text-xs leading-snug text-muted">
                    {option.blurb}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="mt-4">
            <label className="block space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
                Personal note to applicant (optional, appears in email)
              </span>
              <textarea
                value={applicantNote}
                onChange={(e) => setApplicantNote(e.target.value)}
                rows={3}
                placeholder="One line if you want to add something specific. Leave blank otherwise."
                className={textareaClass}
              />
            </label>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-ink/10 pt-5 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted">{status.message ?? ""}</div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => submit("reject")}
              disabled={status.kind === "loading"}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Reject &amp; send email
            </button>
            <button
              type="button"
              onClick={() => submit("approve")}
              disabled={status.kind === "loading"}
              className="btn-primary text-sm disabled:opacity-50"
            >
              Approve as{" "}
              {draft.memberType === "partner"
                ? "Partner"
                : draft.memberType === "member"
                ? "Member"
                : draft.memberType === "alumni_advisor"
                ? "Alumni Advisor"
                : "Alumni Network"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnswerBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink">{label}</dt>
      <dd className="mt-1.5">{children}</dd>
    </div>
  );
}

function EditableField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        {label}
      </span>
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
    <div className="space-y-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const isActive = values.includes(option.slug);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() =>
                onChange(
                  isActive
                    ? values.filter((value) => value !== option.slug)
                    : [...values, option.slug]
                )
              }
              className={`border px-2.5 py-1 text-xs transition ${
                isActive
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-ink/15 text-ink/70 hover:border-ink/40 hover:text-ink"
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
  "h-10 w-full border border-ink/15 bg-paper px-3.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/25";

const textareaClass =
  "w-full border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/25";
