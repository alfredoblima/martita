"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 160;
const START_FRAME = 49; // Frame 50 (0-indexed: 49)
const END_FRAME = 159; // Frame 160 (0-indexed: 159)

interface HeroCanvasScrubProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function HeroCanvasScrub({
  sectionRef,
  className = "",
}: HeroCanvasScrubProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<(HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );
  const targetFrameRef = useRef<number>(START_FRAME);
  const currentFrameRef = useRef<number>(START_FRAME);
  const lastDrawnFrameRef = useRef<number>(-1);
  const rafIdRef = useRef<number | null>(null);

  const [isReady, setIsReady] = useState(false);
  const [loadPercent, setLoadPercent] = useState(0);
  const [scrubProgress, setScrubProgress] = useState(0);

  // Helper to format frame path based on screen width
  const getFrameSrc = useCallback((index: number) => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const folder = isMobile ? "mobile" : "desktop";
    const frameNum = String(index + 1).padStart(4, "0");
    return `/frames/hero/${folder}/f_${frameNum}.webp`;
  }, []);

  // Check if a specific frame is loaded and valid
  const isFrameReady = useCallback((index: number) => {
    const img = imagesRef.current[index];
    return !!(img && img.complete && img.naturalWidth > 0);
  }, []);

  // Find nearest loaded frame if the requested one is still downloading
  const getNearestLoadedFrame = useCallback(
    (target: number) => {
      if (isFrameReady(target)) return target;
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        if (target - offset >= START_FRAME && isFrameReady(target - offset)) {
          return target - offset;
        }
        if (target + offset <= END_FRAME && isFrameReady(target + offset)) {
          return target + offset;
        }
      }
      return isFrameReady(START_FRAME) ? START_FRAME : -1;
    },
    [isFrameReady]
  );

  // Draw a frame onto the canvas: high-definition scaling, balanced size, slight right shift
  const drawFrame = useCallback(
    (frameIndex: number, force = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      const nearestIdx = getNearestLoadedFrame(frameIndex);
      if (nearestIdx < 0 || (nearestIdx === lastDrawnFrameRef.current && !force)) {
        return;
      }

      const img = imagesRef.current[nearestIdx];
      if (!img) return;

      const cw = canvas.width;
      const ch = canvas.height;

      // Clear previous frame to ensure alpha transparency remains perfectly crisp
      ctx.clearRect(0, 0, cw, ch);

      // High-Definition scaling (source desktop is 1200x1020 Lanczos sharpened)
      // Cup center in source 1200x1020 is at (761, 500)
      // Escala afinada: redução de 8% em relação ao tamanho anterior (1.12 * 0.92 = 1.03)
      const scale = Math.min(cw / 1040, ch / 860) * 1.03;
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;

      // Target cup center inside canvas:
      // Shifted slightly to the right (0.63) with balanced vertical position (0.53)
      const targetX = cw * 0.63;
      const targetY = ch * 0.53;

      const dx = targetX - 761 * scale;
      const dy = targetY - 500 * scale;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, dx, dy, dw, dh);

      lastDrawnFrameRef.current = nearestIdx;
    },
    [getNearestLoadedFrame]
  );

  // Load a single frame by index
  const loadFrame = useCallback(
    (index: number) => {
      if (imagesRef.current[index]) return imagesRef.current[index]!;
      const img = new Image();
      img.decoding = "async";
      img.src = getFrameSrc(index);
      img.onload = () => {
        if (
          Math.round(currentFrameRef.current) === index ||
          lastDrawnFrameRef.current === -1
        ) {
          drawFrame(index, true);
        }
      };
      imagesRef.current[index] = img;
      return img;
    },
    [getFrameSrc, drawFrame]
  );

  // Resize handler for Retina / High-DPI screens (forcing 2x min for maximum sharpness)
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.max(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      drawFrame(Math.round(currentFrameRef.current), true);
    }
  }, [drawFrame]);

  // Initial load: Start immediately from frame 50 (START_FRAME = 49)
  useEffect(() => {
    // 1. Immediately load frame 50 (index 49) for instant hero display
    const initialImg = loadFrame(START_FRAME);
    initialImg.onload = () => {
      setIsReady(true);
      handleResize();
      drawFrame(START_FRAME, true);
    };

    // 2. Multi-pass loading queue covering the active range [START_FRAME..END_FRAME] first
    const queue: number[] = [];
    for (const stride of [8, 4, 2, 1]) {
      for (let i = START_FRAME; i <= END_FRAME; i += stride) {
        if (!queue.includes(i)) queue.push(i);
      }
    }

    let loadedCount = 0;
    let queueIdx = 0;

    const loadBatch = () => {
      for (let i = 0; i < 6 && queueIdx < queue.length; i++) {
        const frameIdx = queue[queueIdx++];
        const img = loadFrame(frameIdx);
        if (img.complete) {
          loadedCount++;
        } else {
          img.addEventListener(
            "load",
            () => {
              loadedCount++;
              setLoadPercent(
                Math.round((loadedCount / (END_FRAME - START_FRAME + 1)) * 100)
              );
            },
            { once: true }
          );
        }
      }

      if (queueIdx < queue.length) {
        setTimeout(loadBatch, 30);
      }
    };

    const timer = setTimeout(loadBatch, 80);

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", handleResize);
    };
  }, [loadFrame, handleResize, drawFrame]);

  // Animation Loop (Smooth easing + RAF)
  useEffect(() => {
    let active = true;

    const tick = () => {
      if (!active) return;
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;

      // Smooth cinematic interpolation
      const next = current + (target - current) * 0.18;
      currentFrameRef.current = Math.abs(target - next) < 0.05 ? target : next;

      drawFrame(Math.round(currentFrameRef.current));
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      active = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [drawFrame]);

  // GSAP ScrollTrigger Binding: HERO SECTION LOCKED/PINNED UNTIL ANIMATION COMPLETES
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const targetSection = sectionRef.current;
    if (!targetSection) return;

    // Pin the hero section firmly in place until the 160-frame scrub completes
    const st = ScrollTrigger.create({
      trigger: targetSection,
      start: "top top",
      end: "+=125%", // Scroll distance while hero is locked
      pin: true,
      pinSpacing: true,
      anticipatePin: 0,
      scrub: 0.35,
      onUpdate: (self) => {
        const p = self.progress;
        setScrubProgress(p);
        // Scrub smoothly from START_FRAME (49 = frame 50) to END_FRAME (159 = frame 160)
        targetFrameRef.current = START_FRAME + p * (END_FRAME - START_FRAME);
      },
    });

    return () => {
      st.kill();
    };
  }, [sectionRef]);

  const isFinished = scrubProgress >= 0.98;

  return (
    <div
      ref={containerRef}
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
    >
      {/* 1. Ambient Warm Halos Behind Canvas */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full blur-[90px] opacity-65"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(207,181,131,0.5) 0%, rgba(231,119,89,0.22) 50%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* 2. Artisanal Pedestal / Leather-Inspired Circular Stage (Compact & proportional behind cup) */}
      <div
        className="relative w-[13.5rem] h-[13.5rem] sm:w-[17.5rem] sm:h-[17.5rem] md:w-[20rem] md:h-[20rem] lg:w-[22rem] lg:h-[22rem] xl:w-[24rem] xl:h-[24rem] rounded-full flex items-center justify-center shadow-[0_25px_70px_rgba(33,26,23,0.35)]"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #5C3825 0%, #3D2316 65%, #23140C 100%)",
        }}
      >
        {/* Decorative Concentric Stitched Rings */}
        <div className="absolute inset-2 sm:inset-3 rounded-full border border-dashed border-[#CFB583]/40 pointer-events-none" />
        <div className="absolute inset-6 sm:inset-8 rounded-full border border-[#CFB583]/20 pointer-events-none" />

        {/* Circular Rotating Brand Text Ring */}
        <div className="absolute inset-3 sm:inset-4 rounded-full pointer-events-none flex items-center justify-center opacity-45">
          <svg viewBox="0 0 200 200" className="w-full h-full animate-[spin_60s_linear_infinite]">
            <defs>
              <path
                id="heroOrbitText"
                d="M 100, 100 m -86, 0 a 86,86 0 1,1 172,0 a 86,86 0 1,1 -172,0"
              />
            </defs>
            <text fill="#CFB583" fontSize="5.6" fontWeight="600" letterSpacing="3.5px">
              <textPath href="#heroOrbitText">
                • MARTITA CAFÉ &amp; GASTROBAR • EXTRAÇÃO ARTESANAL • SABOR &amp; MOMENTOS •
              </textPath>
            </text>
          </svg>
        </div>

        {/* 3. HTML5 Interactive Scrub Canvas: High-Def, Balanced, Beans Escaping Upwards */}
        <div
          className="absolute -top-14 sm:-top-18 md:-top-20 lg:-top-24 bottom-0 left-1/2 -translate-x-[57%] w-[22rem] sm:w-[29rem] md:w-[35rem] lg:w-[39rem] xl:w-[43rem] flex items-center justify-center pointer-events-none z-10 overflow-visible"
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full object-contain filter drop-shadow-[0_22px_45px_rgba(0,0,0,0.65)] transition-opacity duration-500"
            style={{ opacity: isReady ? 1 : 0 }}
          />

          {/* Initial Loading Skeleton */}
          {!isReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#CFB583] border-t-transparent animate-spin" />
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#CFB583] font-semibold">
                Carregando Cena...
              </p>
            </div>
          )}
        </div>

        {/* 4. Interactive Floating Badge: Pin Status & Scrub Progress */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 px-5 py-2 rounded-full bg-[#211A17]/95 backdrop-blur-md text-[#F8F4EC] border border-[#CFB583]/50 shadow-2xl flex items-center gap-3 whitespace-nowrap">
          <span
            className={`w-2 h-2 rounded-full ${
              isFinished ? "bg-emerald-400" : "bg-[#E77759] animate-pulse"
            }`}
          />
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#CFB583] font-semibold">
            {isFinished
              ? "Extração concluída • Role para continuar"
              : "Role para transformar os grãos em espresso"}
          </span>
          <span className="text-[10px] font-mono text-[#E77759]">
            {Math.round(scrubProgress * 100)}%
          </span>
        </div>
      </div>

      {/* 7. Subtle Scrub Progress Bar */}
      <div className="mt-8 w-48 sm:w-64 h-1 bg-[#211A17]/10 rounded-full overflow-hidden border border-[#CFB583]/30">
        <div
          className="h-full bg-gradient-to-r from-[#CFB583] via-[#E77759] to-[#CFB583] transition-all duration-75 ease-out rounded-full"
          style={{ width: `${Math.max(5, scrubProgress * 100)}%` }}
        />
      </div>
    </div>
  );
}
