"use client";

import { useState } from "react";

import { defaultDomainOptions, defaultRoleOptions, ucsbAffiliationOptions } from "@/lib/constants/options";
import type { ApplicationInput, Tag } from "@/lib/types";
import { slugify } from "@/lib/utils/slug";

type ApplicationFormProps = {
  tags: Tag[];
};

type SubmissionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

function tagsByType(tags: Tag[], tagType: Tag["tagType"], fallback: readonly string[]) {
  const matching = tags.filter((tag) => tag.tagType === tagType);
  if (matching.length > 0) {
    return matching;
  }

  return fallback.map((name, index) => ({
    id: `${tagType}-${index}`,
    name,
    slug: slugify(name),
    tagType,
    isActive: true
  }));
}

export function ApplicationForm({ tags }: ApplicationFormProps) {
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

      return {
        ...current,
        [key]: nextValues
      };
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setSubmission({
        status: "error",
        message: data?.error ?? "Unable to submit the application right now."
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

  return (
    <section id="apply" className="rounded-[2rem] border border-line/80 bg-panel/80 p-6 shadow-halo lg:p-8">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.38em] text-accent">Apply to join</p>
        <h2 className="mt-4 font-display text-4xl text-ink">A real network needs signal, context, and good people.</h2>
        <p className="mt-4 text-sm leading-7 text-muted">
          This form is designed to collect enough context for a thoughtful review and a credible public profile if
          accepted.
        </p>
      </div>

      <form className="mt-10 space-y-10" onSubmit={handleSubmit}>
        <input
          type="text"
          value={form.honeypot}
          onChange={(event) => updateField("honeypot", event.target.value)}
          className="hidden"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Full name" required>
            <input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Email" required>
            <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Phone">
            <input value={form.phone ?? ""} onChange={(e) => updateField("phone", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Graduation year">
            <input
              type="number"
              value={form.graduationYear ?? ""}
              onChange={(e) => updateField("graduationYear", e.target.value ? Number(e.target.value) : null)}
              className={inputClass}
            />
          </Field>
          <Field label="UCSB affiliation" required>
            <select
              value={form.ucsbAffiliationType}
              onChange={(e) => updateField("ucsbAffiliationType", e.target.value)}
              className={inputClass}
            >
              {ucsbAffiliationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Affiliation detail" required>
            <input
              value={form.ucsbAffiliationDetail}
              onChange={(e) => updateField("ucsbAffiliationDetail", e.target.value)}
              placeholder="Example: Class of 2022, Computer Engineering"
              className={inputClass}
            />
          </Field>
          <Field label="Current title" required>
            <input value={form.currentTitle} onChange={(e) => updateField("currentTitle", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Company or organization">
            <input value={form.companyOrOrg ?? ""} onChange={(e) => updateField("companyOrOrg", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Location">
            <input value={form.location ?? ""} onChange={(e) => updateField("location", e.target.value)} className={inputClass} />
          </Field>
          <Field label="Website">
            <input value={form.websiteUrl ?? ""} onChange={(e) => updateField("websiteUrl", e.target.value)} className={inputClass} />
          </Field>
          <Field label="LinkedIn">
            <input value={form.linkedinUrl ?? ""} onChange={(e) => updateField("linkedinUrl", e.target.value)} className={inputClass} />
          </Field>
          <Field label="GitHub / X">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input value={form.githubUrl ?? ""} onChange={(e) => updateField("githubUrl", e.target.value)} className={inputClass} placeholder="GitHub" />
              <input value={form.xUrl ?? ""} onChange={(e) => updateField("xUrl", e.target.value)} className={inputClass} placeholder="X" />
            </div>
          </Field>
        </div>

        <Field label="Bio" required>
          <textarea value={form.bio} onChange={(e) => updateField("bio", e.target.value)} rows={5} className={textareaClass} />
        </Field>

        <div className="grid gap-8 lg:grid-cols-2">
          <MultiSelectGroup
            title="Roles"
            items={roleOptions}
            activeValues={form.roles}
            onToggle={(value) => toggleValue("roles", value)}
          />
          <MultiSelectGroup
            title="Domains"
            items={domainOptions}
            activeValues={form.domains}
            onToggle={(value) => toggleValue("domains", value)}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Custom roles">
            <input
              value={(form.customRoles ?? []).join(", ")}
              onChange={(e) => updateField("customRoles", tokenize(e.target.value))}
              placeholder="Example: angel investor, product lead"
              className={inputClass}
            />
          </Field>
          <Field label="Custom domains">
            <input
              value={(form.customDomains ?? []).join(", ")}
              onChange={(e) => updateField("customDomains", tokenize(e.target.value))}
              placeholder="Example: supply chain, mobility"
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Keywords">
          <input
            value={form.keywords.join(", ")}
            onChange={(e) => updateField("keywords", tokenize(e.target.value))}
            placeholder="Example: vc, fintech, climate, infra"
            className={inputClass}
          />
        </Field>

        <Field label="Additional links">
          <div className="space-y-3">
            {form.additionalLinks?.map((link, index) => (
              <div key={`${link.linkType}-${index}`} className="grid gap-3 md:grid-cols-[0.7fr_0.9fr_2fr_auto]">
                <select
                  value={link.linkType}
                  onChange={(e) =>
                    updateLink(index, {
                      ...link,
                      linkType: e.target.value as typeof link.linkType
                    })
                  }
                  className={inputClass}
                >
                  <option value="other">Other</option>
                  <option value="website">Website</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="github">GitHub</option>
                  <option value="x">X</option>
                </select>
                <input
                  value={link.label ?? ""}
                  onChange={(e) => updateLink(index, { ...link, label: e.target.value })}
                  placeholder="Label"
                  className={inputClass}
                />
                <input
                  value={link.url}
                  onChange={(e) => updateLink(index, { ...link, url: e.target.value })}
                  placeholder="URL"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() =>
                    updateField(
                      "additionalLinks",
                      (form.additionalLinks ?? []).filter((_, linkIndex) => linkIndex !== index)
                    )
                  }
                  className="rounded-full border border-line/80 px-4 py-2 text-sm text-muted transition hover:text-ink"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                updateField("additionalLinks", [
                  ...(form.additionalLinks ?? []),
                  { linkType: "other", label: "", url: "" }
                ])
              }
              className="rounded-full border border-line/80 px-4 py-2 text-xs uppercase tracking-[0.26em] text-muted transition hover:border-accent/45 hover:text-ink"
            >
              Add link
            </button>
          </div>
        </Field>

        <div className="grid gap-5 md:grid-cols-2">
          <Field label="What you can help with">
            <textarea
              value={form.whatYouCanHelpWith ?? ""}
              onChange={(e) => updateField("whatYouCanHelpWith", e.target.value)}
              rows={4}
              className={textareaClass}
            />
          </Field>
          <Field label="What you are looking for">
            <textarea
              value={form.whatYouAreLookingFor ?? ""}
              onChange={(e) => updateField("whatYouAreLookingFor", e.target.value)}
              rows={4}
              className={textareaClass}
            />
          </Field>
        </div>

        <Field label="Why do you want to join?" required>
          <textarea value={form.whyJoin} onChange={(e) => updateField("whyJoin", e.target.value)} rows={5} className={textareaClass} />
        </Field>

        <label className="flex items-start gap-3 rounded-[1.25rem] border border-line/80 bg-paper/60 p-4 text-sm leading-7 text-muted">
          <input
            type="checkbox"
            checked={form.consentToPublishSelectedProfileFields}
            onChange={(e) => updateField("consentToPublishSelectedProfileFields", e.target.checked)}
            className="mt-2 h-4 w-4 accent-[rgb(var(--color-accent))]"
          />
          <span>
            I consent to the selected public profile fields being published on the directory if my application is
            approved.
          </span>
        </label>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button
            type="submit"
            disabled={submission.status === "loading"}
            className="rounded-full border border-accent/45 bg-accent/10 px-6 py-4 text-xs uppercase tracking-[0.3em] text-ink transition hover:bg-accent/20 disabled:opacity-60"
          >
            {submission.status === "loading" ? "Submitting..." : "Submit application"}
          </button>
          <StatusMessage submission={submission} />
        </div>
      </form>
    </section>
  );

  function updateLink(index: number, nextLink: NonNullable<ApplicationInput["additionalLinks"]>[number]) {
    const links = [...(form.additionalLinks ?? [])];
    links[index] = nextLink;
    updateField("additionalLinks", links);
  }
}

function tokenize(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function Field({
  label,
  required,
  children
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-3">
      <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}

function MultiSelectGroup({
  title,
  items,
  activeValues,
  onToggle
}: {
  title: string;
  items: Tag[];
  activeValues: string[];
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] uppercase tracking-[0.32em] text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => {
          const isActive = activeValues.includes(item.slug);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onToggle(item.slug)}
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-accent bg-accent/12 text-ink"
                  : "border-line/80 bg-paper/70 text-muted hover:border-accent/40 hover:text-ink"
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

function StatusMessage({ submission }: { submission: SubmissionState }) {
  if (submission.status === "success") {
    return <p className="text-sm text-muted">Application received. You should hear back after review.</p>;
  }

  if (submission.status === "error") {
    return <p className="text-sm text-red-400">{submission.message}</p>;
  }

  return <p className="text-sm text-muted">You can include as much useful context as needed. Keep it plain text.</p>;
}

const inputClass =
  "h-12 w-full rounded-[1rem] border border-line/80 bg-paper px-4 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent/45";

const textareaClass =
  "w-full rounded-[1rem] border border-line/80 bg-paper px-4 py-3 text-sm text-ink outline-none transition placeholder:text-muted focus:border-accent/45";
