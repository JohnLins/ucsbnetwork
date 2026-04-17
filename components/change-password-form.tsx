"use client";

import { useState } from "react";

export function ChangePasswordForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("New password must be at least 8 characters.");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/members/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null;
        setStatus("error");
        setMessage(data?.error ?? "Failed to change password.");
        return;
      }

      setStatus("success");
      setMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong.");
    }
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="text-xs text-muted transition hover:text-ink"
      >
        Change password
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-4 border border-ink/10 bg-paper p-5"
    >
      <div className="flex items-baseline justify-between">
        <p className="eyebrow-accent">Account</p>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setMessage("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
          className="text-xs text-muted transition hover:text-ink"
        >
          Close
        </button>
      </div>
      <h3 className="font-display text-lg leading-tight text-ink">
        Change password
      </h3>
      <label className="block space-y-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Current password
        </span>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={inputClass}
          required
        />
      </label>
      <label className="block space-y-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          New password
        </span>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className={inputClass}
          required
          minLength={8}
        />
      </label>
      <label className="block space-y-1.5">
        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
          Confirm new password
        </span>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass}
          required
          minLength={8}
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {status === "loading" ? "Saving…" : "Update password"}
        </button>
      </div>
      {message ? (
        <p className={`border p-2 text-sm ${
          status === "success"
            ? "border-accent/40 bg-accent/10 text-ink"
            : "border-red-500/30 bg-red-500/5 text-red-500"
        }`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}

const inputClass =
  "h-10 w-full border border-ink/15 bg-paper px-3 text-sm text-ink outline-none transition focus:border-accent focus:ring-1 focus:ring-accent/25";
