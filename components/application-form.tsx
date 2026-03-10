"use client";

import { useState } from "react";

import { defaultDomainOptions, defaultRoleOptions, ucsbAffiliationOptions } from "@/lib/constants/options";
import type { ApplicationInput, Tag } from "@/lib/types";
import { slugify } from "@/lib/utils/slug";

type SubmissionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

function tagsByType(tags: Tag[], tagType: Tag["tagType"], fallback: readonly string[]) {
  const matching = tags.filter((tag) => tag.tagType === tagType);
  if (matching.length > 0) return matching;

  return fallback.map((name, index) => ({
    id: `${tagType}-${index}`,
    name,
    slug: slugify(name),
    tagType,
    isActive: true
  }));
}

export function ApplicationForm({ tags }: { tags: Tag[] }) {
  const roleOptions = tagsByType(tags, "role", defaultRoleOptions);
  const domainOptions = tagsByType(tags, "domain", defaultDomainOptions);
  const [submission, setSubmission] = useState<SubmissionState>({ status: "idle" });
  const [form, setForm] = useState<ApplicationInput>({
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
    roles: [],
    customRoles: [],
    domains: [],
    customDomains: [],
    keywords: [],
    linkedinUrl: "",
    xUrl: "",
    githubUrl: "",
    additionalLinks: [],
    whatYouCanHelpWith: "",
    whatYouAreLookingFor: "",
    whyJoin: "",
    consentToPublishSelectedProfileFields: false,
    formStartedAt: Date.now(),
    honeypot: ""
  });

  function updateField<Key extends keyof ApplicationInput>(key: Key, value: ApplicationInput[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleValue(key: "roles" | "domains", value: string) {
    setForm((current) => {
      const nextValues = current[key].includes(value)
        ? current[key].filter((entry) => entry !== value)
        : [...current[key], value];
      return { ...current, [key]: nextValues };
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmission({ status: "loading" });

    const payload: ApplicationInput = {
      ...form,
      customRoles: tokenize(form.customRoles?.join(",") ?? ""),
      customDomains: tokenize(form.customDomains?.join(",") ?? ""),
      keywords: tokenize(form.keywords.join(",")),
      graduationYear: form.graduationYear ? Number(form.graduationYear) : null
    };

    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setSubmission({ status: "error", message: data?.error ?? "Unable to submit." });
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
      roles: [],
      customRoles: [],
      domains: [],
      customDomains: [],
      keywords: [],
      linkedinUrl: "",
      xUrl: "",
      githubUrl: "",
      additionalLinks: [],
      whatYouCanHelpWith: "",
      whatYouAreLookingFor: "",
      whyJoin: "",
      consentToPublishSelectedProfileFields: false,
      formStartedAt: Date.now(),
      honeypot: ""
    }));
  }

  if (submission.status === "success") {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-medium text-ink">Received.</p>
          <p className="mt-2 text-sm text-muted">We&apos;ll be in touch.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Apply.</h2>

      <form className="mt-10 space-y-5" onSubmit={handleSubmit}>
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
              type="number"
              value={form.graduationYear ?? ""}
              onChange={(e) => updateField("graduationYear", e.target.value ? Number(e.target.value) : null)}
              className={inputClass}
            />
          </Field>
          <Field label="Major *">
            <input
              value={form.ucsbAffiliationDetail}
              onChange={(e) => updateField("ucsbAffiliationDetail", e.target.value)}
              className={inputClass}
            />
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="What you do *">
            <input
              value={form.currentTitle}
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

        <div className="grid gap-6 sm:grid-cols-2">
          <ChipGroup
            title="Roles"
            items={roleOptions}
            active={form.roles}
            onToggle={(v) => toggleValue("roles", v)}
          />
          <ChipGroup
            title="Domains"
            items={domainOptions}
            active={form.domains}
            onToggle={(v) => toggleValue("domains", v)}
          />
        </div>

        <Field label="What are you building? *">
          <textarea
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            rows={3}
            className={textareaClass}
          />
        </Field>

        <Field label="What is one opinion you hold that you think most people miss? *">
          <textarea
            value={form.whyJoin}
            onChange={(e) => updateField("whyJoin", e.target.value)}
            rows={3}
            className={textareaClass}
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

        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.consentToPublishSelectedProfileFields}
            onChange={(e) => updateField("consentToPublishSelectedProfileFields", e.target.checked)}
            className="mt-0.5 h-4 w-4 accent-[rgb(var(--color-accent))]"
          />
          <span>I consent to selected profile fields being published if approved.</span>
        </label>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={submission.status === "loading"}
            className="rounded-xl bg-ink px-6 py-3 text-sm font-medium text-paper transition hover:opacity-90 disabled:opacity-50"
          >
            {submission.status === "loading" ? "Submitting…" : "Submit"}
          </button>
          {submission.status === "error" && (
            <p className="text-sm text-red-400">{submission.message}</p>
          )}
        </div>
      </form>
    </div>
  );
}

/* ---------- helpers ---------- */

function tokenize(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted">{label}</span>
      {children}
    </label>
  );
}

function ChipGroup({
  title,
  items,
  active,
  onToggle
}: {
  title: string;
  items: Tag[];
  active: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => {
          const isActive = active.includes(item.slug);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.slug)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                isActive
                  ? "border-ink/40 bg-ink/10 text-ink"
                  : "border-line/40 text-muted hover:border-line hover:text-ink"
              }`}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const inputClass =
  "h-10 w-full rounded-lg border border-line/40 bg-paper px-3.5 text-sm text-ink outline-none transition placeholder:text-muted/50 focus:border-ink/30 focus:ring-1 focus:ring-ink/10";

const textareaClass =
  "w-full rounded-lg border border-line/40 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/50 focus:border-ink/30 focus:ring-1 focus:ring-ink/10";
