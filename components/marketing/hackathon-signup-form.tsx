"use client";

import { useState } from "react";

type SubmissionState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; message: string };

type TeamStatus = "solo" | "team";

type FormState = {
  name: string;
  email: string;
  school: string;
  pitch: string;
  link: string;
  teamStatus: TeamStatus;
  teammates: string;
  formStartedAt: number;
  honeypot: string;
};

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function HackathonSignupForm() {
  const [state, setState] = useState<SubmissionState>({ status: "idle" });
  const [form, setForm] = useState<FormState>(() => ({
    name: "",
    email: "",
    school: "UCSB",
    pitch: "",
    link: "",
    teamStatus: "solo",
    teammates: "",
    formStartedAt: Date.now(),
    honeypot: ""
  }));

  const MAX_PITCH_WORDS = 120;
  const pitchWords = countWords(form.pitch);
  const pitchOverLimit = pitchWords > MAX_PITCH_WORDS;

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((cur) => ({ ...cur, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.pitch.trim()) {
      setState({
        status: "error",
        message: "Please fill in your name, email, and a short pitch."
      });
      return;
    }

    if (pitchOverLimit) {
      setState({
        status: "error",
        message: `Pitch must be ${MAX_PITCH_WORDS} words or fewer.`
      });
      return;
    }

    if (form.teamStatus === "team" && !form.teammates.trim()) {
      setState({
        status: "error",
        message: "List your teammates or switch to solo."
      });
      return;
    }

    setState({ status: "loading" });

    try {
      const response = await fetch("/api/hackathon/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
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
        name: "",
        email: "",
        school: "UCSB",
        pitch: "",
        link: "",
        teamStatus: "solo",
        teammates: "",
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
        <p className="eyebrow-accent">Received</p>
        <h3 className="mt-4 font-display text-2xl text-ink">You&rsquo;re on the list.</h3>
        <p className="mt-4 max-w-md mx-auto text-sm text-ink/80">
          We&rsquo;ll reach out personally if you&rsquo;re a fit for the
          hackathon. Spots are limited and we confirm one-on-one.
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

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name *">
          <input
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className={inputClass}
            autoComplete="name"
          />
        </Field>
        <Field label="Email *">
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className={inputClass}
            autoComplete="email"
          />
        </Field>
      </div>

      <Field label="School or organization">
        <input
          value={form.school}
          onChange={(e) => update("school", e.target.value)}
          className={inputClass}
          placeholder="UCSB, UCSD, other"
        />
      </Field>

      <div className="space-y-2.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Team *
        </span>
        <div className="grid grid-cols-2 gap-px overflow-hidden border border-ink/15 bg-ink/10">
          <TeamOption
            label="Solo"
            description="Just me."
            selected={form.teamStatus === "solo"}
            onSelect={() => update("teamStatus", "solo")}
          />
          <TeamOption
            label="With a team"
            description="Up to four total, including you."
            selected={form.teamStatus === "team"}
            onSelect={() => update("teamStatus", "team")}
          />
        </div>
        {form.teamStatus === "team" ? (
          <div className="space-y-1.5 pt-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              Teammates *
            </span>
            <textarea
              value={form.teammates}
              onChange={(e) => update("teammates", e.target.value)}
              rows={3}
              className={textareaClass}
              placeholder={"One per line: name + email or link.\nJane Doe \u2014 jane@ucsb.edu\nJohn Smith \u2014 github.com/jsmith"}
            />
            <p className="font-mono text-[11px] text-muted">
              Not everyone needs to sign up separately. We&rsquo;ll follow up with the address above.
            </p>
          </div>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            What would you build? *
          </span>
          <span
            className={`font-mono text-[11px] tabular-nums ${
              pitchOverLimit ? "text-red-500" : "text-muted"
            }`}
          >
            {pitchWords}/{MAX_PITCH_WORDS} words
          </span>
        </div>
        <textarea
          value={form.pitch}
          onChange={(e) => update("pitch", e.target.value)}
          rows={4}
          className={textareaClass}
          placeholder="Short and specific. What problem, who is it for, why you."
        />
      </div>

      <Field label="Link (website, GitHub, Twitter; optional)">
        <input
          value={form.link}
          onChange={(e) => update("link", e.target.value)}
          className={inputClass}
          placeholder="https://"
        />
      </Field>

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
        {state.status === "loading" ? "Submitting…" : "Submit signup"}
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

function TeamOption({
  label,
  description,
  selected,
  onSelect
}: {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`flex flex-col items-start gap-1 p-4 text-left transition ${
        selected
          ? "bg-accent/10 text-ink"
          : "bg-paper text-ink/80 hover:bg-panel/60"
      }`}
    >
      <span
        className={`font-mono text-[11px] uppercase tracking-[0.22em] ${
          selected ? "text-accent" : "text-muted"
        }`}
      >
        {selected ? "Selected" : "Choose"}
      </span>
      <span className="font-display text-base text-ink">{label}</span>
      <span className="text-xs leading-relaxed text-ink/70">{description}</span>
    </button>
  );
}

const inputClass =
  "h-11 w-full border border-ink/15 bg-paper px-3.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent/25";

const textareaClass =
  "w-full border border-ink/15 bg-paper px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-accent focus:ring-1 focus:ring-accent/25";
