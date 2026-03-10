"use client";

import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme !== "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center gap-3 rounded-full border border-line/70 bg-panel/70 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-muted transition hover:border-accent/50 hover:text-ink"
      aria-label="Toggle theme"
    >
      <span className="text-[10px] text-accent">{isDark ? "Dark" : "Light"}</span>
      <span className="relative block h-5 w-10 rounded-full bg-ink/10">
        <span
          className={`absolute top-1 h-3 w-3 rounded-full bg-accent transition ${isDark ? "left-1" : "left-6"}`}
        />
      </span>
    </button>
  );
}
