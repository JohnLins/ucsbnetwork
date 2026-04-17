import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        navy: "rgb(var(--color-navy) / <alpha-value>)"
      },
      boxShadow: {
        subtle: "0 2px 12px rgba(0, 0, 0, 0.08)",
        "gold-sm": "0 0 12px 2px rgba(214, 145, 18, 0.15)",
        "gold-md": "0 0 24px 4px rgba(214, 145, 18, 0.2)"
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Inter",
          "Segoe UI",
          "Helvetica Neue",
          "Helvetica",
          "Arial",
          "sans-serif"
        ],
        display: [
          "var(--font-display)",
          "Instrument Serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "Times",
          "serif"
        ],
        mono: [
          "var(--font-mono)",
          "IBM Plex Mono",
          "JetBrains Mono",
          "SF Mono",
          "Menlo",
          "Consolas",
          "monospace"
        ]
      },
      fontSize: {
        "display-sm": ["clamp(2rem, 4vw, 2.75rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2.5rem, 6vw, 4rem)", { lineHeight: "1.0", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(3rem, 8vw, 5.5rem)", { lineHeight: "0.98", letterSpacing: "-0.03em" }],
        "display-xl": ["clamp(3.5rem, 10vw, 7rem)", { lineHeight: "0.96", letterSpacing: "-0.035em" }]
      },
      letterSpacing: {
        tightest: "-0.04em",
        eyebrow: "0.28em"
      }
    }
  },
  plugins: []
};

export default config;
