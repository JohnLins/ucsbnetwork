"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion } from "framer-motion";

import { Globe } from "@/components/ui/globe";

interface ScrollExpansionHeroProps {
  children?: ReactNode;
}

const textSelectionSelector = [
  "[data-allow-selection]",
  "p",
  "span",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "a",
  "label",
  "input",
  "textarea",
  "select"
].join(", ");

export function ScrollExpansionHero({ children }: ScrollExpansionHeroProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const heroViewportRef = useRef<HTMLDivElement | null>(null);

  const isSelectableTarget = (target: EventTarget | null) =>
    target instanceof Element && Boolean(target.closest(textSelectionSelector));

  // Reset on mount
  useEffect(() => {
    setScrollProgress(0);
    setShowContent(false);
    setMediaFullyExpanded(false);
  }, []);

  // Scroll/touch handlers
  useEffect(() => {
    const heroViewport = heroViewportRef.current;
    if (!heroViewport) return;

    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isSelectableTarget(e.target)) {
        setTouchStartY(0);
        return;
      }

      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isSelectableTarget(e.target)) {
        return;
      }

      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(Math.max(scrollProgress + scrollDelta, 0), 1);
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = () => {
      setTouchStartY(0);
    };

    const handleScroll = () => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    heroViewport.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("scroll", handleScroll);
    heroViewport.addEventListener("touchstart", handleTouchStart, { passive: false });
    heroViewport.addEventListener("touchmove", handleTouchMove, { passive: false });
    heroViewport.addEventListener("touchend", handleTouchEnd);

    return () => {
      heroViewport.removeEventListener("wheel", handleWheel);
      window.removeEventListener("scroll", handleScroll);
      heroViewport.removeEventListener("touchstart", handleTouchStart);
      heroViewport.removeEventListener("touchmove", handleTouchMove);
      heroViewport.removeEventListener("touchend", handleTouchEnd);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Globe container sizing: starts big, expands to fill viewport
  const globeSize = (isMobile ? 460 : 800) + scrollProgress * (isMobile ? 420 : 580);
  const globeHeight = (isMobile ? 460 : 800) + scrollProgress * (isMobile ? 220 : 180);

  // Text split distance
  const textTranslateX = scrollProgress * (isMobile ? 120 : 100);

  // Subtitle and scroll-hint fade out
  const subtitleOpacity = Math.max(0, 1 - scrollProgress * 3);
  const hintOpacity = Math.max(0, 1 - scrollProgress * 4);

  // Gold dot scale grows with expansion
  const dotScale = 1 + scrollProgress * 1.5;

  return (
    <div
      ref={sectionRef}
      className="overflow-x-hidden transition-colors duration-700 ease-in-out"
    >
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          {/* Navy background — uses the unified paper token */}
          <div className="absolute inset-0 z-0 bg-paper" />

          <div className="container relative z-10 mx-auto flex flex-col items-center justify-start">
            <div
              ref={heroViewportRef}
              className="relative flex h-[100dvh] w-full flex-col items-center justify-center"
            >

              {/* Globe container — expands on scroll */}
              <div
                className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl"
                style={{
                  width: `${globeSize}px`,
                  height: `${globeHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "90vh",
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-2xl">
                  <Globe className="top-1/2 -translate-y-1/2 !max-w-none" />

                  {/* Radial overlay for depth */}
                  <motion.div
                    className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgb(var(--color-paper))_75%)]"
                    animate={{ opacity: 1 - scrollProgress * 0.5 }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
              </div>

              {/* Title text — splits apart on scroll */}
              <div
                data-allow-selection
                className="relative z-10 flex flex-col items-center justify-center gap-2"
              >
                <div className="flex items-center gap-3">
                  <motion.span
                    className="text-6xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl"
                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                  >
                    ucsb
                  </motion.span>

                  {/* Gold dot — mirrors the logo */}
                  <motion.span
                    className="inline-block h-3 w-3 rounded-full bg-accent sm:h-4 sm:w-4 lg:h-5 lg:w-5"
                    animate={{
                      scale: dotScale,
                      opacity: Math.max(0, 1 - scrollProgress * 1.5),
                    }}
                    transition={{ duration: 0.1 }}
                  />

                  <motion.span
                    className="text-6xl font-bold tracking-tight text-white/60 sm:text-7xl lg:text-8xl"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    network
                  </motion.span>
                </div>

                {/* Subtitle */}
                <motion.p
                  className="mt-4 text-base tracking-wide text-white/40 sm:text-lg"
                  animate={{ opacity: subtitleOpacity }}
                  transition={{ duration: 0.1 }}
                >
                  founders. builders. the cracked.
                </motion.p>
              </div>

              {/* Scroll hint */}
              <motion.div
                className="absolute bottom-10 z-10 flex w-full justify-center"
                animate={{ opacity: hintOpacity }}
                transition={{ duration: 0.1 }}
              >
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-accent/40">
                    Scroll to explore
                  </span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="animate-float-down text-accent/40"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </motion.div>
            </div>

            {/* Content revealed after full expansion */}
            <motion.div
              className={`flex w-full flex-col ${showContent ? "visible" : "pointer-events-none invisible"}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
              aria-hidden={!showContent}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
