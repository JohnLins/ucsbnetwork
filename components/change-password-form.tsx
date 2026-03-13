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
        className="text-sm text-muted hover:text-accent transition"
      >
        Change password
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm space-y-4 rounded-xl border border-line/40 bg-panel/60 p-5"
    >
      <p className="text-sm font-medium text-ink">Change password</p>
      <label className="block space-y-1.5">
        <span className="text-[11px] uppercase tracking-[0.32em] text-muted">Current password</span>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className={inputClass}
          required
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-[11px] uppercase tracking-[0.32em] text-muted">New password</span>
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
        <span className="text-[11px] uppercase tracking-[0.32em] text-muted">Confirm new password</span>
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
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "Saving…" : "Update password"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setMessage("");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          }}
          className="text-sm text-muted hover:text-ink transition"
        >
          Cancel
        </button>
      </div>
      {message ? (
        <p className={`text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}

const inputClass =
  "h-10 w-full rounded-lg border border-line/60 bg-paper px-3 text-sm text-ink outline-none transition focus:border-accent/50 focus:ring-1 focus:ring-accent/20";
