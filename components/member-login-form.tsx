"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function MemberLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/members/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setStatus("error");
        setMessage(data?.error ?? "Login failed.");
        return;
      }

      router.push("/members/events");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Something went wrong.");
    }
  }

  return (
    <div>
      <Link href="/" className="flex items-baseline gap-2">
        <span className="font-display text-2xl leading-none text-ink">ucsb</span>
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
        <span className="text-base font-medium tracking-wide text-ink">network</span>
      </Link>

      <div className="mt-10">
        <p className="eyebrow-accent">Member access</p>
        <h1 className="mt-3 font-display text-4xl leading-tight text-ink">
          Sign in to the portal.
        </h1>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
          Use the credentials you received when you joined the cohort.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <label className="block space-y-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoFocus
            className="h-11 w-full border border-ink/15 bg-paper px-3.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/25"
          />
        </label>
        <label className="block space-y-1.5">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="h-11 w-full border border-ink/15 bg-paper px-3.5 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/25"
          />
        </label>
        <button
          type="submit"
          disabled={status === "loading" || !email || !password}
          className="btn-primary w-full disabled:opacity-50"
        >
          {status === "loading" ? "Signing in…" : "Sign in"}
        </button>
        {message ? (
          <p className="border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-500">
            {message}
          </p>
        ) : null}
      </form>

      <hr className="hr-hairline my-8" />

      <p className="text-xs text-muted">
        Not a member yet?{" "}
        <Link href="/apply" className="link-editorial">
          Apply to the cohort
        </Link>
        .
      </p>
    </div>
  );
}
