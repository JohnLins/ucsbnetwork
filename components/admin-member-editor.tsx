"use client";

import { useState } from "react";

import type { MemberCard, Tag } from "@/lib/types";

export function AdminMemberEditor({
  selectedMember,
  tags
}: {
  selectedMember?: MemberCard;
  tags: Tag[];
}) {
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "success" | "error"; message?: string }>({
    kind: "idle"
  });
  const [form, setForm] = useState({
    id: selectedMember?.id,
    fullName: selectedMember?.fullName ?? "",
    headline: selectedMember?.headline ?? "",
    companyOrOrg: selectedMember?.companyOrOrg ?? "",
    location: selectedMember?.location ?? "",
    bio: selectedMember?.bio ?? "",
    websiteUrl: selectedMember?.websiteUrl ?? "",
    isPublished: selectedMember?.isPublished ?? true,
    roles: selectedMember?.roles.map((tag) => tag.slug) ?? [],
    domains: selectedMember?.domains.map((tag) => tag.slug) ?? [],
    keywords: selectedMember?.keywords.map((tag) => tag.slug) ?? [],
    links:
      selectedMember?.links.map((link) => ({
        linkType: link.linkType,
        label: link.label ?? "",
        url: link.url
      })) ?? []
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ kind: "loading" });

    const response = await fetch("/api/admin/members", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setStatus({ kind: "error", message: data?.error ?? "Unable to save member." });
      return;
    }

    setStatus({ kind: "success", message: "Member saved. Refresh to see the latest data." });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-line/80 bg-panel/80 p-6 shadow-halo">
      <div className="space-y-3 border-b border-line/70 pb-6">
        <p className="text-xs uppercase tracking-[0.38em] text-accent">
          {selectedMember ? "Edit member" : "Create member"}
        </p>
        <h2 className="font-display text-4xl text-ink">{selectedMember ? selectedMember.fullName : "New member"}</h2>
      </div>
      <div className="mt-8 space-y-6">
        <Labeled title="Full name">
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
        </Labeled>
        <Labeled title="Headline">
          <input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} className={inputClass} />
        </Labeled>
        <div className="grid gap-5 md:grid-cols-2">
          <Labeled title="Company">
            <input value={form.companyOrOrg} onChange={(e) => setForm({ ...form, companyOrOrg: e.target.value })} className={inputClass} />
          </Labeled>
          <Labeled title="Location">
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
          </Labeled>
        </div>
        <Labeled title="Website">
          <input value={form.websiteUrl} onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })} className={inputClass} />
        </Labeled>
        <Labeled title="Bio">
          <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={6} className={textareaClass} />
        </Labeled>
        <TokenPicker title="Roles" tags={tags.filter((tag) => tag.tagType === "role")} values={form.roles} onChange={(roles) => setForm({ ...form, roles })} />
        <TokenPicker title="Domains" tags={tags.filter((tag) => tag.tagType === "domain")} values={form.domains} onChange={(domains) => setForm({ ...form, domains })} />
        <TokenPicker title="Keywords" tags={tags.filter((tag) => tag.tagType === "keyword")} values={form.keywords} onChange={(keywords) => setForm({ ...form, keywords })} />
        <label className="flex items-center gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            className="h-4 w-4 accent-[rgb(var(--color-accent))]"
          />
          Publish this profile
        </label>
      </div>
      <div className="mt-8 flex flex-col gap-4 border-t border-line/70 pt-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">{status.message ?? "Save curated member profiles directly to the public directory."}</p>
        <button
          type="submit"
          disabled={status.kind === "loading"}
          className="rounded-full border border-accent/45 bg-accent/10 px-5 py-3 text-xs uppercase tracking-[0.28em] text-ink transition hover:bg-accent/20 disabled:opacity-60"
        >
          {status.kind === "loading" ? "Saving..." : "Save member"}
        </button>
      </div>
    </form>
  );
}

function Labeled({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-3">
      <span className="text-[11px] uppercase tracking-[0.32em] text-muted">{title}</span>
      {children}
    </label>
  );
}

function TokenPicker({
  title,
  tags,
  values,
  onChange
}: {
  title: string;
  tags: Tag[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-[11px] uppercase tracking-[0.32em] text-muted">{title}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isActive = values.includes(tag.slug);
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() =>
                onChange(isActive ? values.filter((value) => value !== tag.slug) : [...values, tag.slug])
              }
              className={`rounded-full border px-4 py-2 text-sm transition ${
                isActive
                  ? "border-accent bg-accent/12 text-ink"
                  : "border-line/80 bg-paper/70 text-muted hover:border-accent/40 hover:text-ink"
              }`}
            >
              {tag.name}
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
