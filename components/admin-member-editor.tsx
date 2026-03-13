"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminMember, MemberType, Tag } from "@/lib/types";

export function AdminMemberEditor({
  selectedMember,
  tags,
  defaultMemberType = "member"
}: {
  selectedMember?: AdminMember;
  tags: Tag[];
  defaultMemberType?: MemberType;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<{ kind: "idle" | "loading" | "success" | "error"; message?: string }>({
    kind: "idle"
  });
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [form, setForm] = useState({
    id: selectedMember?.id,
    email: selectedMember?.email ?? "",
    fullName: selectedMember?.fullName ?? "",
    headline: selectedMember?.headline ?? "",
    companyOrOrg: selectedMember?.companyOrOrg ?? "",
    location: selectedMember?.location ?? "",
    bio: selectedMember?.bio ?? "",
    websiteUrl: selectedMember?.websiteUrl ?? "",
    isPublished: selectedMember?.isPublished ?? true,
    memberType: (selectedMember?.memberType ?? defaultMemberType) as MemberType,
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

  async function handleDelete() {
    if (!selectedMember) return;

    setStatus({ kind: "loading", message: "Deleting..." });

    try {
      const response = await fetch(`/api/admin/members/${selectedMember.id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus({ kind: "error", message: data?.error ?? "Unable to delete member." });
        return;
      }

      setStatus({ kind: "success", message: "Member deleted." });
      router.refresh();
    } catch {
      setStatus({ kind: "error", message: "Something went wrong." });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line/40 bg-panel/60 p-6">
      <div className="space-y-2 border-b border-line/30 pb-5">
        <p className="text-xs font-medium text-muted">
          {selectedMember ? "Edit member" : "Create member"}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-ink">{selectedMember ? selectedMember.fullName : "New member"}</h2>
      </div>
      <div className="mt-8 space-y-6">
        <Labeled title="Full name">
          <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} />
        </Labeled>
        <Labeled title={selectedMember ? "Email (read-only)" : "Email (required for new members)"}>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="member@example.com"
            readOnly={!!selectedMember}
            className={`${inputClass}${selectedMember ? " opacity-60 cursor-not-allowed" : ""}`}
          />
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

        {/* Links editor */}
        <div className="space-y-4">
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted">Links</p>
          {form.links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <select
                value={link.linkType}
                onChange={(e) => {
                  const nextLinks = [...form.links];
                  nextLinks[index] = { ...link, linkType: e.target.value as "website" | "linkedin" | "github" | "x" | "other" };
                  setForm({ ...form, links: nextLinks });
                }}
                className="h-11 w-28 rounded-lg border border-line/60 bg-paper px-2 text-sm text-ink outline-none"
              >
                <option value="website">Website</option>
                <option value="linkedin">LinkedIn</option>
                <option value="github">GitHub</option>
                <option value="x">X</option>
                <option value="other">Other</option>
              </select>
              <input
                value={link.url}
                onChange={(e) => {
                  const nextLinks = [...form.links];
                  nextLinks[index] = { ...link, url: e.target.value };
                  setForm({ ...form, links: nextLinks });
                }}
                placeholder="https://..."
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, links: form.links.filter((_, i) => i !== index) })}
                className="shrink-0 text-sm text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setForm({ ...form, links: [...form.links, { linkType: "website", label: "", url: "" }] })
            }
            className="rounded-lg border border-dashed border-line/60 px-4 py-2 text-xs text-muted hover:border-accent/40 hover:text-ink transition"
          >
            + Add link
          </button>
        </div>

        <Labeled title="Directory type">
          <select
            value={form.memberType}
            onChange={(e) => setForm({ ...form, memberType: e.target.value as MemberType })}
            className="h-11 w-full rounded-lg border border-line/60 bg-paper px-4 text-sm text-ink outline-none"
          >
            <option value="member">Member</option>
            <option value="advisor">Advisor</option>
          </select>
        </Labeled>

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
      <div className="mt-8 flex flex-col gap-4 border-t border-line/30 pt-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted">{status.message ?? ""}</p>
        </div>
        <div className="flex items-center gap-3">
          {selectedMember && !deleteConfirm && (
            <button
              type="button"
              onClick={() => setDeleteConfirm(true)}
              className="rounded-xl border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
            >
              Delete
            </button>
          )}
          {selectedMember && deleteConfirm && (
            <>
              <span className="text-sm text-red-400">Are you sure?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={status.kind === "loading"}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                Confirm delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(false)}
                className="text-sm text-muted hover:text-ink transition"
              >
                Cancel
              </button>
            </>
          )}
          <button
            type="submit"
            disabled={status.kind === "loading"}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {status.kind === "loading" ? "Saving..." : "Save member"}
          </button>
        </div>
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
                  ? "border-accent/50 bg-accent/12 text-accent"
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
  "h-11 w-full rounded-lg border border-line/60 bg-paper px-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20";

const textareaClass =
  "w-full rounded-lg border border-line/60 bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20";
