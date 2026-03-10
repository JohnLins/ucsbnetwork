"use client";

import { useEffect, useRef, useState } from "react";

/* ── Typing text ── */

export function TypingText({
  text,
  className,
  delay = 400,
  speed = 90
}: {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (count >= text.length) {
      const hide = setTimeout(() => setCursorVisible(false), 1800);
      return () => clearTimeout(hide);
    }
    const interval = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(interval);
  }, [started, count, text.length, speed]);

  return (
    <span className={className}>
      {text.slice(0, count)}
      {cursorVisible && (
        <span className="ml-0.5 inline-block w-[3px] animate-blink bg-current align-middle" style={{ height: "0.75em" }} />
      )}
    </span>
  );
}

/* ── Fade-in after delay ── */

export function FadeIn({
  children,
  delay = 0,
  className
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);

  return (
    <div
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
      } ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

/* ── Reveal on scroll ── */

export function Reveal({
  children,
  className,
  direction = "up"
}: {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const translate = {
    up: visible ? "translate-y-0" : "translate-y-8",
    left: visible ? "translate-x-0" : "translate-x-8",
    right: visible ? "translate-x-0" : "-translate-x-8",
    none: ""
  }[direction];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      } ${translate} ${className ?? ""}`}
    >
      {children}
    </div>
  );
}
