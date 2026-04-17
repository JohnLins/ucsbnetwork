import type { ReactNode } from "react";

import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

type MarketingShellProps = {
  children: ReactNode;
  announcement?: {
    label: string;
    href: string;
    ctaLabel?: string;
  };
};

export function MarketingShell({ children, announcement }: MarketingShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      {announcement ? (
        <AnnouncementBar
          label={announcement.label}
          href={announcement.href}
          ctaLabel={announcement.ctaLabel}
        />
      ) : null}
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
