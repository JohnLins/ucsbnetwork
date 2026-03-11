"use client";

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

      router.push("/members");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-line/40 bg-panel/60 p-8"
    >
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          Member login
        </h2>
        <p className="text-sm text-muted">
          Use the credentials you received when accepted.
        </p>
      </div>
      <label className="block space-y-1.5">
        <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
          Email
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoFocus
          className="h-11 w-full rounded-lg border border-line/60 bg-paper px-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••"
          className="h-11 w-full rounded-lg border border-line/60 bg-paper px-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading" || !email || !password}
        className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Signing in…" : "Sign in"}
      </button>
      {message ? (
        <p className="text-sm text-red-400">{message}</p>
      ) : null}
    </form>
  );
}
