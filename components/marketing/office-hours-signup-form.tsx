"use client";

import { useState } from "react";

type SubmissionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

type FormState = {
  names: string;
  phone: string;
  relevantLinks: string;
  project: string;
  formStartedAt: number;
  honeypot: string;
};

export function OfficeHoursSignupForm() {
  const [state, setState] = useState<SubmissionState>({ status: "idle" });
  const [form, setForm] = useState<FormState>(() => ({
    names: "",
    phone: "",
    relevantLinks: "",
    project: "",
    formStartedAt: Date.now(),
    honeypot: ""
  }));

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((cur) => ({ ...cur, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.names.trim() || !form.phone.trim() || !form.project.trim()) {
      setState({
        status: "error",
        message: "Please fill in your name(s), phone, and project details."
      });
      return;
    }

    setState({ status: "loading" });

    try {
      const response = await fetch("/api/office-hours/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          names: form.names,
          phone: form.phone,
          relevantLinks: form.relevantLinks,
          project: form.project,
          formStartedAt: form.formStartedAt,
          honeypot: form.honeypot
        })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        setState({
          status: "error",
          message: data?.error ?? "Unable to submit."
        });
        return;
      }

      setState({ status: "success" });
      setForm({
        names: "",
        phone: "",
        relevantLinks: "",
        project: "",
        formStartedAt: Date.now(),
        honeypot: ""
      });
    } catch {
      setState({ status: "error", message: "Something went wrong." });
    }
  }

  if (state.status === "success") {
    return (
      <div className="border border-ink/10 bg-panel/60 p-10 text-center">
        <p className="eyebrow-accent">Thank you</p>
        <p className="mt-4 max-w-lg mx-auto text-base leading-relaxed text-ink/80">
          We will reach out soon to schedule a time for office hours. Expect
          them to be on campus.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        type="text"
        value={form.honeypot}
        onChange={(e) => update("honeypot", e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <Field label="Name(s) *">
        <input
          value={form.names}
          onChange={(e) => update("names", e.target.value)}
          className={inputClass}
          autoComplete="name"
          placeholder="You and/or your cofounder"
        />
      </Field>

      <Field label="Phone number *">
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          className={inputClass}
          autoComplete="tel"
          placeholder="Best number to reach you"
        />
      </Field>

      <Field label="Relevant links">
        <textarea
          value={form.relevantLinks}
          onChange={(e) => update("relevantLinks", e.target.value)}
          rows={3}
          className={textareaClass}
          placeholder="Project link, personal site, GitHub, LinkedIn — one per line is fine"
        />
      </Field>

      <div className="space-y-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Project *
        </span>
        <p className="text-xs text-muted leading-relaxed">
          What you&apos;re working on, when you started, what it does,
          industry or area, and any context we should know.
        </p>
        <textarea
          value={form.project}
          onChange={(e) => update("project", e.target.value)}
          rows={8}
          className={textareaClass}
        />
      </div>

      {state.status === "error" ? (
        <p className="border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-500">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state.status === "loading"}
        className="btn-primary w-full sm:w-auto"
      >
        {state.status === "loading" ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "h-11 w-full border border-ink/15 bg-paper px-3.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent/25";

const textareaClass =
  "w-full border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent/25";
