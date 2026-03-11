"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setStatus("error");
        setMessage(data?.error ?? "Login failed.");
        return;
      }

      router.push("/admin/applications");
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
          Admin
        </h2>
        <p className="text-sm text-muted">
          Enter the admin password to continue.
        </p>
      </div>
      <label className="block space-y-3">
        <span className="text-[11px] uppercase tracking-[0.32em] text-muted">
          Password
        </span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="••••••••••••"
          autoFocus
          className="h-11 w-full rounded-lg border border-line/60 bg-paper px-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading" || !password}
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
