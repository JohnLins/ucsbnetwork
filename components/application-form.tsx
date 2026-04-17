"use client";

import { useState } from "react";

import { ucsbAffiliationOptions } from "@/lib/constants/options";
import type { ApplicationInput } from "@/lib/types";

type SubmissionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "uploaded"; path: string; name: string }
  | { status: "error"; message: string };

export function ApplicationForm() {
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const [upload, setUpload] = useState<UploadState>({ status: "idle" });
  const [form, setForm] = useState<ApplicationInput>(() => ({
    fullName: "",
    email: "",
    phone: "",
    ucsbAffiliationType: ucsbAffiliationOptions[0],
    ucsbAffiliationDetail: "",
    graduationYear: null,
    currentTitle: "",
    companyOrOrg: "",
    location: "",
    websiteUrl: "",
    bio: "",
    linkedinUrl: "",
    xUrl: "",
    githubUrl: "",
    additionalLinks: [],
    whatYouCanHelpWith: "",
    whatYouAreLookingFor: "",
    referredBy: "",
    consentToPublishSelectedProfileFields: true,
    formStartedAt: Date.now(),
    honeypot: ""
  }));

  // April 10, 2026 11:59 PM PDT = April 11, 2026 06:59:00 UTC
  const DEADLINE = new Date("2026-04-11T06:59:00Z");
  const isClosed = new Date() >= DEADLINE;

  // Non-student types only need name, email, and "what can you help with"
  const NON_STUDENT_TYPES = ["Alumni", "Faculty", "Researcher", "Staff", "Community collaborator"];
  const isNonStudent = NON_STUDENT_TYPES.includes(form.ucsbAffiliationType);

  function updateField<Key extends keyof ApplicationInput>(key: Key, value: ApplicationInput[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      setUpload({ status: "error", message: "Only PDF, PNG, and JPG files are accepted." });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUpload({ status: "error", message: "File must be 10 MB or smaller." });
      return;
    }

    setUpload({ status: "uploading" });

    const body = new FormData();
    body.append("file", file);

    try {
      const response = await fetch("/api/upload", { method: "POST", body });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setUpload({ status: "error", message: data?.error ?? "Upload failed." });
        return;
      }

      const data = (await response.json()) as { path: string; name: string };
      setUpload({ status: "uploaded", path: data.path, name: data.name });
      updateField("resumeUrl", data.path);
    } catch {
      setUpload({ status: "error", message: "Upload failed. Please try again." });
    }
  }

  function removeUpload() {
    setUpload({ status: "idle" });
    updateField("resumeUrl", undefined);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const missing: string[] = [];
    if (!form.fullName.trim()) missing.push("Name");
    if (!form.email.trim()) missing.push("Email");
    if (!form.bio.trim()) missing.push("What are you building");
    if (isNonStudent && !(form.whatYouCanHelpWith ?? "").trim()) missing.push("What can you help other members with");
    if (missing.length > 0) {
      setSubmission({
        status: "error",
        message: `Please fill in: ${missing.join(", ")}`,
      });
      return;
    }

    const wordErrors: string[] = [];
    if (countWords(form.bio) > 250) wordErrors.push("\"What are you building?\" exceeds 250 words");
    if (isNonStudent && countWords(form.whatYouCanHelpWith ?? "") > 100) wordErrors.push("\"What can you help with\" exceeds 100 words");
    if (wordErrors.length > 0) {
      setSubmission({
        status: "error",
        message: wordErrors.join(". ") + ". Please shorten your response.",
      });
      return;
    }

    setSubmission({ status: "loading" });

    const payload: ApplicationInput = {
      ...form,
      graduationYear: form.graduationYear || null
    };

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        fieldErrors?: Record<string, string>;
      } | null;
      setSubmission({
        status: "error",
        message: data?.error ?? "Unable to submit.",
        fieldErrors: data?.fieldErrors,
      });
      return;
    }

    setSubmission({ status: "success" });
    setForm((current) => ({
      ...current,
      fullName: "",
      email: "",
      phone: "",
      ucsbAffiliationDetail: "",
      graduationYear: null,
      currentTitle: "",
      companyOrOrg: "",
      location: "",
      websiteUrl: "",
      bio: "",
      linkedinUrl: "",
      xUrl: "",
      githubUrl: "",
      additionalLinks: [],
      whatYouCanHelpWith: "",
      whatYouAreLookingFor: "",
      referredBy: "",
      consentToPublishSelectedProfileFields: true,
      formStartedAt: Date.now(),
      honeypot: ""
    }));
  }

  if (isClosed) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <p className="eyebrow-accent">Closed</p>
          <p className="mt-4 font-display text-3xl text-ink">
            Applications closed.
          </p>
          <p className="mt-3 text-sm text-muted">
            Applications for the first cohort closed on April 10, 2026.
          </p>
        </div>
      </div>
    );
  }

  if (submission.status === "success") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <p className="eyebrow-accent">Received</p>
          <p className="mt-4 font-display text-3xl text-ink">
            Thanks for applying.
          </p>
          <p className="mt-3 text-sm text-muted">We&apos;ll be in touch.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <p className="eyebrow-accent">
        Applications for Cohort 1 close April 10
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        <input
          type="text"
          value={form.honeypot}
          onChange={(e) => updateField("honeypot", e.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name *">
            <input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Email *">
            <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="UCSB status">
            <select
              value={form.ucsbAffiliationType}
              onChange={(e) => updateField("ucsbAffiliationType", e.target.value)}
              className={inputClass}
            >
              {ucsbAffiliationOptions.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </Field>
          <Field label="Year">
            <input
              value={form.graduationYear ?? ""}
              onChange={(e) => updateField("graduationYear", e.target.value || null)}
              placeholder="e.g. 2027, 1st year"
              className={inputClass}
            />
          </Field>
          <Field label={isNonStudent ? "Major / department" : "Major"}>
            <input
              value={form.ucsbAffiliationDetail ?? ""}
              onChange={(e) => updateField("ucsbAffiliationDetail", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="What you do">
            <input
              value={form.currentTitle ?? ""}
              onChange={(e) => updateField("currentTitle", e.target.value)}
              placeholder="e.g. founder, engineer"
              className={inputClass}
            />
          </Field>
          <Field label="Company">
            <input
              value={form.companyOrOrg ?? ""}
              onChange={(e) => updateField("companyOrOrg", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <WordCountField label="What are you building? *" maxWords={250}>
          <textarea
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            rows={4}
            className={textareaClass}
          />
        </WordCountField>

        {isNonStudent && (
          <WordCountField label="What can you help other members with? *" maxWords={100}>
            <textarea
              value={form.whatYouCanHelpWith ?? ""}
              onChange={(e) => updateField("whatYouCanHelpWith", e.target.value)}
              rows={3}
              className={textareaClass}
            />
          </WordCountField>
        )}

        <Field label="Who are 1–2 people you think should also be in this network?">
          <textarea
            value={form.whatYouAreLookingFor ?? ""}
            onChange={(e) => updateField("whatYouAreLookingFor", e.target.value)}
            rows={2}
            placeholder="Names, links, or how to reach them"
            className={textareaClass}
          />
        </Field>

        <Field label="Who referred you?">
          <input
            value={form.referredBy ?? ""}
            onChange={(e) => updateField("referredBy", e.target.value)}
            placeholder="Name or how you heard about us"
            className={inputClass}
          />
        </Field>

        <div className="space-y-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Additional context upload (resume, portfolio, one-pager)
          </span>
          {upload.status === "idle" || upload.status === "error" ? (
            <label className="flex cursor-pointer items-center justify-center gap-2 border border-dashed border-ink/20 bg-paper px-4 py-5 text-sm text-muted transition hover:border-ink/50 hover:text-ink">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Choose a file (PDF, PNG, JPG; max 10 MB)</span>
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          ) : upload.status === "uploading" ? (
            <div className="flex items-center gap-2 border border-ink/15 bg-paper px-4 py-3 text-sm text-muted">
              <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Uploading…
            </div>
          ) : (
            <div className="flex items-center justify-between border border-accent/40 bg-accent/5 px-4 py-3 text-sm">
              <span className="truncate text-ink">{upload.name}</span>
              <button
                type="button"
                onClick={removeUpload}
                className="ml-3 shrink-0 text-xs text-muted hover:text-ink"
              >
                Remove
              </button>
            </div>
          )}
          {upload.status === "error" && (
            <p className="text-xs text-red-500">{upload.message}</p>
          )}
        </div>

        <Field label="Personal website">
          <input
            value={form.websiteUrl ?? ""}
            onChange={(e) => updateField("websiteUrl", e.target.value)}
            placeholder="https://yoursite.com"
            className={inputClass}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="LinkedIn">
            <input
              value={form.linkedinUrl ?? ""}
              onChange={(e) => updateField("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className={inputClass}
            />
          </Field>
          <Field label="GitHub">
            <input
              value={form.githubUrl ?? ""}
              onChange={(e) => updateField("githubUrl", e.target.value)}
              placeholder="https://github.com/..."
              className={inputClass}
            />
          </Field>
        </div>

        {submission.status === "error" && (
          <div className="border border-red-500/30 bg-red-500/5 px-4 py-3">
            {submission.fieldErrors ? (
              <ul className="space-y-1 text-sm text-red-500">
                {Object.values(submission.fieldErrors).map((msg) => (
                  <li key={msg} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">•</span>
                    <span>{msg}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-red-500">{submission.message}</p>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={submission.status === "loading"}
            className="btn-primary text-sm disabled:opacity-50"
          >
            {submission.status === "loading" ? "Submitting…" : "Submit application"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------- helpers ---------- */

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

function WordCountField({
  label,
  maxWords,
  children,
}: {
  label: string;
  maxWords: number;
  children: React.ReactElement<{ value?: string }>;
}) {
  const value = (children.props.value as string) ?? "";
  const words = countWords(value);
  const isOver = words > maxWords;

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          {label}
        </span>
        <span className={`font-mono text-[11px] tabular-nums ${isOver ? "text-red-500" : "text-muted/60"}`}>
          {words}/{maxWords} words
        </span>
      </div>
      {children}
    </div>
  );
}

const inputClass =
  "h-10 w-full border border-ink/15 bg-paper px-3.5 text-sm text-ink outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent/25";

const textareaClass =
  "w-full border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/50 focus:border-accent focus:ring-1 focus:ring-accent/25";
