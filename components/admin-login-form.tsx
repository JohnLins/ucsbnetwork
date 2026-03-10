"use client";

import { useState } from "react";

import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const [email, setEmail] = useState("hurshshah483@gmail.com");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      setStatus("error");
      setMessage("Supabase environment variables are not configured yet.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/applications`
      }
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage("Magic link sent. Open the email for this admin address to continue.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-line/40 bg-panel/60 p-8">
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">Sign in</h2>
        <p className="text-sm leading-7 text-muted">
          Only the seeded admin email in Supabase should receive an authorized session.
        </p>
      </div>
      <label className="block space-y-3">
        <span className="text-[11px] uppercase tracking-[0.32em] text-muted">Email</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-11 w-full rounded-lg border border-line/60 bg-paper px-4 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Sending..." : "Send magic link"}
      </button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </form>
  );
}
