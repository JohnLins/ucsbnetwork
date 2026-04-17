"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/program", label: "Program" },
  { href: "/batch", label: "Batch" },
  { href: "/demo-day", label: "Demo Day" },
  { href: "/hackathon", label: "Hackathon" },
  { href: "/faq", label: "FAQ" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur supports-[backdrop-filter]:bg-paper/75">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2 leading-none">
          <span className="font-display text-xl leading-none text-ink">ucsb</span>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="text-sm font-medium leading-none tracking-wide text-ink">network</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-sm transition ${
                  isActive ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
                {isActive ? (
                  <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-accent" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/members/login"
            className="text-sm text-muted transition hover:text-ink"
          >
            Sign in
          </Link>
          <Link href="/apply" className="btn-primary text-sm">
            Apply
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className="flex h-10 w-10 items-center justify-center border border-ink/20 md:hidden"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="6" y1="18" x2="18" y2="6" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-paper md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-ink"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-3 border-t border-ink/10 pt-4">
              <Link
                href="/members/login"
                className="text-sm text-muted"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <Link href="/apply" className="btn-primary ml-auto text-sm" onClick={() => setOpen(false)}>
                Apply
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
