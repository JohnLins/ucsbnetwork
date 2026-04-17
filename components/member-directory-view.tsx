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
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow-accent">Directory</p>
          <h1 className="mt-3 font-display text-4xl text-ink">The network.</h1>
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
          className="h-10 w-full max-w-xs border border-ink/15 bg-paper px-3.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent/25"
        />
      </div>

      {/* Tab bar */}
      <div className="mt-8 flex items-end gap-8 border-b border-ink/10">
        {(
          [
            { id: "partners" as Tab, label: "Partners", count: partners.length },
            { id: "members" as Tab, label: "Members", count: regularMembers.length },
            { id: "alumni" as Tab, label: "Alumni", count: allAlumni.length }
          ]
        ).map((t) => {
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                setSearch("");
              }}
              className={`relative pb-3 text-sm transition ${
                isActive ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {t.label}{" "}
              <span className="font-mono text-xs text-muted/80">
                ({t.count})
              </span>
              {isActive ? (
                <span className="absolute inset-x-0 -bottom-[1px] h-[2px] bg-accent" />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {tab === "alumni" ? (
          <AlumniTab
            advisors={search ? alumniAdvisors.filter((m) => matchesSearch(m, q)) : alumniAdvisors}
            network={search ? alumniNetwork.filter((m) => matchesSearch(m, q)) : alumniNetwork}
          />
        ) : tab === "partners" ? (
          <PartnersByCohort
            partners={search ? partners.filter((m) => matchesSearch(m, q)) : partners}
          />
        ) : (
          <MemberGrid
            members={search ? regularMembers.filter((m) => matchesSearch(m, q)) : regularMembers}
            emptyLabel="No members found."
          />
        )}
      </div>
    </div>
  );
}

function PartnersByCohort({ partners }: { partners: DirectoryMember[] }) {
  if (partners.length === 0) {
    return <p className="text-sm text-muted">No partners found.</p>;
  }

  const cohortMap = new Map<number | null, DirectoryMember[]>();
  for (const p of partners) {
    const key = p.cohort ?? null;
    const list = cohortMap.get(key) ?? [];
    list.push(p);
    cohortMap.set(key, list);
  }

  const sortedCohorts = [...cohortMap.entries()].sort((a, b) => {
    if (a[0] === null && b[0] === null) return 0;
    if (a[0] === null) return 1;
    if (b[0] === null) return -1;
    return a[0] - b[0];
  });

  if (sortedCohorts.length === 1) {
    return <PartnerGrid members={sortedCohorts[0][1]} />;
  }

  return (
    <div className="space-y-12">
      {sortedCohorts.map(([cohort, cohortMembers]) => (
        <section key={cohort ?? "none"}>
          <p className="eyebrow-accent">
            {cohort === 0
              ? "Founding Operators"
              : cohort != null
              ? `Cohort ${cohort}`
              : "Other"}
          </p>
          <div className="mt-4">
            <PartnerGrid members={cohortMembers} />
          </div>
        </section>
      ))}
    </div>
  );
}

function PartnerGrid({ members }: { members: DirectoryMember[] }) {
  return (
    <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
      {members.map((member) => (
        <DirectoryCard key={member.id} member={member} />
      ))}
    </div>
  );
}

function MemberGrid({ members, emptyLabel }: { members: DirectoryMember[]; emptyLabel: string }) {
  if (members.length === 0) {
    return <p className="text-sm text-muted">{emptyLabel}</p>;
  }
  return (
    <div className="grid gap-px overflow-hidden border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
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
    <div className="space-y-12">
      {advisors.length > 0 ? (
        <section>
          <p className="eyebrow-accent">Advisors</p>
          <div className="mt-4">
            <MemberGrid members={advisors} emptyLabel="No advisors found." />
          </div>
        </section>
      ) : null}
      {network.length > 0 ? (
        <section>
          <p className="eyebrow-accent">Network</p>
          <div className="mt-4">
            <MemberGrid members={network} emptyLabel="No network alumni found." />
          </div>
        </section>
      ) : null}
    </div>
  );
}

function DirectoryCard({ member }: { member: DirectoryMember }) {
  return (
    <article className="flex flex-col gap-4 bg-paper p-6">
      <div className="flex items-baseline justify-between gap-3">
        <p className="eyebrow-accent">
          {member.roles[0]?.name ?? typeLabel(member.memberType)}
        </p>
        {member.cohort != null ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
            Cohort {member.cohort}
          </span>
        ) : null}
      </div>

      <div>
        <h3 className="font-display text-xl leading-tight text-ink">
          {member.fullName}
        </h3>
        {member.headline ? (
          <p className="mt-1 text-sm text-muted">{member.headline}</p>
        ) : null}
      </div>

      {member.companyOrOrg ? (
        <p className="text-sm font-medium text-ink">{member.companyOrOrg}</p>
      ) : null}

      {member.bio ? (
        <p className="text-sm leading-relaxed text-ink/75 line-clamp-4">
          {member.bio}
        </p>
      ) : null}

      {(member.roles.length > 0 || member.domains.length > 0) ? (
        <div className="flex flex-wrap gap-1.5">
          {member.roles.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="border border-ink/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ink/70"
            >
              {tag.name}
            </span>
          ))}
          {member.domains.slice(0, 3).map((tag) => (
            <span
              key={tag.id}
              className="border border-accent/60 px-2 py-0.5 text-[10px] uppercase tracking-wide text-accent"
            >
              {tag.name}
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex items-center gap-3 border-t border-ink/10 pt-4">
        {member.email ? (
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
        ) : null}
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
        {member.websiteUrl && !member.links.some((l) => l.linkType === "website") ? (
          <a
            href={member.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition hover:text-accent"
            title="Website"
          >
            <LinkIcon type="website" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

function typeLabel(t: DirectoryMember["memberType"]) {
  switch (t) {
    case "partner":
      return "Partner";
    case "member":
      return "Member";
    case "alumni_advisor":
      return "Advisor";
    case "alumni_network":
      return "Alumni";
    default:
      return "Member";
  }
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
