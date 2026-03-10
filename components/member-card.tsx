import Link from "next/link";

import type { MemberCard as Member } from "@/lib/types";

export function MemberCard({ member }: { member: Member }) {
  return (
    <article className="group rounded-xl border border-line/40 bg-paper p-5 transition hover:border-line">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 space-y-3">
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold tracking-tight text-ink">{member.fullName}</h3>
            {member.headline ? <p className="text-sm text-muted">{member.headline}</p> : null}
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-muted">{member.bio}</p>
          <div className="flex flex-wrap gap-1.5">
            {member.roles.map((tag) => (
              <TagPill key={tag.id}>{tag.name}</TagPill>
            ))}
            {member.domains.map((tag) => (
              <TagPill key={tag.id}>{tag.name}</TagPill>
            ))}
            {member.keywords.map((tag) => (
              <TagPill key={tag.id}>{tag.name}</TagPill>
            ))}
          </div>
        </div>

        <div className="min-w-48 space-y-3 border-t border-line/40 pt-4 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          {member.companyOrOrg ? (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted">Organization</p>
              <p className="mt-1 text-sm text-ink">{member.companyOrOrg}</p>
            </div>
          ) : null}
          {member.location ? (
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted">Location</p>
              <p className="mt-1 text-sm text-ink">{member.location}</p>
            </div>
          ) : null}
          <div className="space-y-1.5">
            <p className="text-[11px] uppercase tracking-wider text-muted">Links</p>
            <div className="flex flex-wrap gap-1.5">
              {member.websiteUrl ? (
                <ExternalChip href={member.websiteUrl}>Site</ExternalChip>
              ) : null}
              {member.links.map((link) => (
                <ExternalChip key={`${member.id}-${link.url}`} href={link.url}>
                  {link.label ?? link.linkType}
                </ExternalChip>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function TagPill({ children }: { children: string }) {
  return (
    <span className="rounded-md border border-line/50 px-2.5 py-1 text-[11px] font-medium text-muted">
      {children}
    </span>
  );
}

function ExternalChip({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center rounded-lg border border-line/50 px-2.5 py-1.5 text-xs text-muted transition hover:border-accent/40 hover:text-ink"
    >
      {children}
    </Link>
  );
}
