import Link from "next/link";

import type { MemberCard as Member, LinkType } from "@/lib/types";

export function MemberCard({ member }: { member: Member }) {
  return (
    <article className="group rounded-xl border border-line/40 bg-paper p-5 transition hover:border-accent/30 hover:shadow-gold-sm">
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
              <TagPill key={tag.id} variant="accent">{tag.name}</TagPill>
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
          {(() => {
            const hasWebsiteLinkInLinks = member.links.some((l) => l.linkType === "website");
            const showWebsiteUrl = member.websiteUrl && !hasWebsiteLinkInLinks;
            const hasAnyLinks = showWebsiteUrl || member.links.length > 0;
            if (!hasAnyLinks) return null;
            return (
              <div className="space-y-1.5">
                <p className="text-[11px] uppercase tracking-wider text-muted">Links</p>
                <div className="flex items-center gap-2">
                  {showWebsiteUrl ? (
                    <LinkIcon href={member.websiteUrl!} type="website" />
              ) : null}
              {member.links.map((link) => (
                    <LinkIcon
                      key={`${member.id}-${link.url}`}
                      href={link.url}
                      type={link.linkType}
                    />
              ))}
            </div>
          </div>
            );
          })()}
        </div>
      </div>
    </article>
  );
}

function TagPill({ children, variant = "default" }: { children: string; variant?: "default" | "accent" }) {
  const styles = variant === "accent"
    ? "rounded-md border border-accent/30 bg-accent/5 px-2.5 py-1 text-[11px] font-medium text-accent"
    : "rounded-md border border-line/50 px-2.5 py-1 text-[11px] font-medium text-muted";
  return <span className={styles}>{children}</span>;
}

function LinkIcon({ href, type }: { href: string; type: LinkType | "website" }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:text-accent"
      aria-label={type}
    >
      {getLinkSvg(type)}
    </Link>
  );
}

function getLinkSvg(type: LinkType | "website") {
  switch (type) {
    case "linkedin":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "github":
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      );
    case "x":
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case "website":
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      );
    default:
      return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      );
  }
}
