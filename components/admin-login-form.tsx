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
    <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-line/80 bg-panel/80 p-8 shadow-halo">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.38em] text-accent">Admin access</p>
        <h2 className="font-display text-4xl text-ink">Magic link sign-in</h2>
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
          className="h-12 w-full rounded-[1rem] border border-line/80 bg-paper px-4 text-sm text-ink outline-none transition focus:border-accent/45"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-full border border-accent/45 bg-accent/10 px-6 py-3 text-xs uppercase tracking-[0.28em] text-ink transition hover:bg-accent/20 disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send magic link"}
      </button>
      {message ? <p className="text-sm text-muted">{message}</p> : null}
    </form>
  );
}
