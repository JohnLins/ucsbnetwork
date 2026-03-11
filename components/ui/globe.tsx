"use client";

import createGlobe, { COBEOptions } from "cobe";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

// Navy/gold themed globe — matches the ucsb.network brand palette
const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 1,
  diffuse: 0.6,
  mapSamples: 16000,
  mapBrightness: 2.5,
  baseColor: [0.04, 0.16, 0.32],        // navy base (#0A2952)
  markerColor: [241 / 255, 168 / 255, 37 / 255], // UCSB gold (#F1A825)
  glowColor: [0.02, 0.1, 0.22],         // deep navy glow
  markers: [
    // Santa Barbara / UCSB — home base, large marker
    { location: [34.4140, -119.8489], size: 0.12 },
    // Major tech/startup hubs where UCSB network extends
    { location: [37.7749, -122.4194], size: 0.08 },  // San Francisco
    { location: [40.7128, -74.006], size: 0.08 },     // New York
    { location: [34.0522, -118.2437], size: 0.07 },   // Los Angeles
    { location: [47.6062, -122.3321], size: 0.05 },   // Seattle
    { location: [30.2672, -97.7431], size: 0.05 },    // Austin
    { location: [51.5074, -0.1278], size: 0.06 },     // London
    { location: [1.3521, 103.8198], size: 0.05 },     // Singapore
    { location: [35.6762, 139.6503], size: 0.04 },    // Tokyo
    { location: [52.52, 13.405], size: 0.04 },        // Berlin
    { location: [19.076, 72.8777], size: 0.05 },      // Mumbai
  ],
};

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string;
  config?: COBEOptions;
}) {
  let phi = 0;
  let width = 0;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  const onRender = useCallback(
    (state: Record<string, number>) => {
      if (pointerInteracting.current === null) phi += 0.005;
      state.phi = phi + r;
      state.width = width * 2;
      state.height = width * 2;
    },
    [r],
  );

  const onResize = () => {
    if (canvasRef.current) {
      width = canvasRef.current.offsetWidth;
    }
  };

  useEffect(() => {
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      ...config,
      width: width * 2,
      height: width * 2,
      onRender,
    });

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });
    return () => {
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]",
        className,
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]",
        )}
        ref={canvasRef}
        onPointerDown={(e) =>
          updatePointerInteraction(
            e.clientX - pointerInteractionMovement.current,
          )
        }
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  );
}
