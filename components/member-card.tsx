import Link from "next/link";

import type { MemberCard as Member } from "@/lib/types";

export function MemberCard({ member }: { member: Member }) {
  return (
    <article className="group rounded-[1.75rem] border border-line/80 bg-paper/70 p-6 transition hover:-translate-y-0.5 hover:border-accent/45 hover:bg-paper">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-display text-3xl text-ink">{member.fullName}</h3>
            {member.headline ? <p className="max-w-2xl text-sm leading-7 text-muted">{member.headline}</p> : null}
          </div>
          <p className="max-w-3xl text-sm leading-7 text-muted">{member.bio}</p>
          <div className="flex flex-wrap gap-2">
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

        <div className="min-w-56 space-y-4 border-t border-line/70 pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          {member.companyOrOrg ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-muted">Organization</p>
              <p className="mt-2 text-sm text-ink">{member.companyOrOrg}</p>
            </div>
          ) : null}
          {member.location ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-muted">Location</p>
              <p className="mt-2 text-sm text-ink">{member.location}</p>
            </div>
          ) : null}
          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-[0.32em] text-muted">Links</p>
            <div className="flex flex-wrap gap-2">
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
    <span className="rounded-full border border-line/80 px-3 py-1 text-[11px] uppercase tracking-[0.26em] text-muted">
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
      className="inline-flex items-center rounded-full border border-line/80 px-3 py-2 text-sm text-muted transition hover:border-accent/45 hover:text-ink"
    >
      {children}
    </Link>
  );
}
