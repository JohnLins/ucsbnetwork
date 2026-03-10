"use client";

import { useEffect } from "react";

export function KeyboardNav() {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;

      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-section]")
      );
      if (!sections.length) return;

      let current = 0;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= 80) current = i;
      }

      const next =
        e.key === "ArrowDown"
          ? Math.min(current + 1, sections.length - 1)
          : Math.max(current - 1, 0);

      if (next !== current) {
        e.preventDefault();
        sections[next].scrollIntoView({ behavior: "smooth" });
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return null;
}
