"use client";

import { useState } from "react";

import type { DirectoryMember } from "@/lib/data/members";

type Tab = "partners" | "members" | "alumni";

function matchesSearch(m: DirectoryMember, q: string): boolean {
  return (
    m.fullName.toLowerCase().includes(q) ||
    m.headline?.toLowerCase().includes(q) ||
    m.bio.toLowerCase().includes(q) ||
    m.companyOrOrg?.toLowerCase().includes(q) ||
    m.roles.some((t) => t.name.toLowerCase().includes(q)) ||
    m.domains.some((t) => t.name.toLowerCase().includes(q))
  );
}

export function MemberDirectoryView({ members }: { members: DirectoryMember[] }) {
  const [tab, setTab] = useState<Tab>("partners");
  const [search, setSearch] = useState("");

  const partners = members.filter((m) => m.memberType === "partner");
  const regularMembers = members.filter((m) => m.memberType === "member");
  const alumniAdvisors = members.filter((m) => m.memberType === "alumni_advisor");
  const alumniNetwork = members.filter((m) => m.memberType === "alumni_network");
  const allAlumni = [...alumniAdvisors, ...alumniNetwork];

  const q = search.toLowerCase();

  return (
    <div>
      {/* Tab bar */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => { setTab("partners"); setSearch(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "partners"
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          Partners ({partners.length})
        </button>
        <button
          onClick={() => { setTab("members"); setSearch(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "members"
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          Members ({regularMembers.length})
        </button>
        <button
          onClick={() => { setTab("alumni"); setSearch(""); }}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "alumni"
              ? "bg-accent/15 text-accent"
              : "text-muted hover:text-ink"
          }`}
        >
          Alumni ({allAlumni.length})
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={
          tab === "alumni"
            ? "Search alumni…"
            : tab === "members"
            ? "Search members…"
            : "Search partners…"
        }
        className="mb-8 h-10 w-full max-w-sm rounded-lg border border-line/40 bg-paper px-4 text-sm text-ink outline-none transition placeholder:text-muted/50 focus:border-accent/40 focus:ring-1 focus:ring-accent/15"
      />

      {tab === "alumni" ? (
        <AlumniTab
          advisors={search ? alumniAdvisors.filter((m) => matchesSearch(m, q)) : alumniAdvisors}
          network={search ? alumniNetwork.filter((m) => matchesSearch(m, q)) : alumniNetwork}
        />
      ) : (
        <MemberGrid
          members={
            search
              ? (tab === "partners" ? partners : regularMembers).filter((m) => matchesSearch(m, q))
              : tab === "partners"
              ? partners
              : regularMembers
          }
          emptyLabel={tab === "partners" ? "No partners found." : "No members found."}
        />
      )}
    </div>
  );
}

function MemberGrid({ members, emptyLabel }: { members: DirectoryMember[]; emptyLabel: string }) {
  if (members.length === 0) {
    return <p className="text-sm text-muted">{emptyLabel}</p>;
  }
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <DirectoryCard key={member.id} member={member} />
      ))}
    </div>
  );
}

function AlumniTab({
  advisors,
  network
}: {
  advisors: DirectoryMember[];
  network: DirectoryMember[];
}) {
  if (advisors.length === 0 && network.length === 0) {
    return <p className="text-sm text-muted">No alumni found.</p>;
  }
  return (
    <div className="space-y-10">
      {advisors.length > 0 && (
        <section>
          <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.32em] text-accent">
            Advisors
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {advisors.map((member) => (
              <DirectoryCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}
      {network.length > 0 && (
        <section>
          <h3 className="mb-4 text-xs font-medium uppercase tracking-[0.32em] text-accent">
            Network
          </h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {network.map((member) => (
              <DirectoryCard key={member.id} member={member} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function DirectoryCard({ member }: { member: DirectoryMember }) {
  return (
    <div className="rounded-xl border border-line/40 bg-panel/60 p-5 transition hover:border-accent/30 hover:shadow-gold-sm">
      <h3 className="text-lg font-semibold text-ink">{member.fullName}</h3>
      {member.headline && (
        <p className="mt-1 text-sm text-muted">{member.headline}</p>
      )}
      {member.bio && (
        <p className="mt-3 text-sm leading-relaxed text-muted/80 line-clamp-3">
          {member.bio}
        </p>
      )}

      {/* Tags */}
      {(member.roles.length > 0 || member.domains.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {member.roles.map((tag) => (
            <span
              key={tag.id}
              className="rounded-md border border-line/30 px-2 py-0.5 text-[11px] text-muted"
            >
              {tag.name}
            </span>
          ))}
          {member.domains.map((tag) => (
            <span
              key={tag.id}
              className="rounded-md border border-accent/20 bg-accent/5 px-2 py-0.5 text-[11px] text-accent"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Contact links */}
      <div className="mt-4 flex items-center gap-3 border-t border-line/20 pt-3">
        {member.email && (
          <a
            href={`mailto:${member.email}`}
            className="text-muted transition hover:text-accent"
            title={member.email}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <polyline points="22,7 12,13 2,7" />
            </svg>
          </a>
        )}
        {member.links.map((link) => (
          <a
            key={link.id ?? link.url}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition hover:text-accent"
            title={link.label ?? link.linkType}
          >
            <LinkIcon type={link.linkType} />
          </a>
        ))}
        {member.websiteUrl &&
          !member.links.some((l) => l.linkType === "website") && (
            <a
              href={member.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted transition hover:text-accent"
              title="Website"
            >
              <LinkIcon type="website" />
            </a>
          )}
      </div>
    </div>
  );
}

function LinkIcon({ type }: { type: string }) {
  switch (type) {
    case "linkedin":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "github":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case "x":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "website":
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
  }
}
