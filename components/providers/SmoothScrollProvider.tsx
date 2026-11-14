"use client";

import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ScrollToOptions {
  offset?: number;
  duration?: number;
  immediate?: boolean;
}

export interface SmoothScrollContextType {
  scrollTo: (target: string | HTMLElement, options?: ScrollToOptions) => void;
  lenis: Lenis | null;
}

const defaultContext: SmoothScrollContextType = {
  scrollTo: (target: string | HTMLElement, options?: ScrollToOptions) => {
    if (typeof window === "undefined") return;
    const offset = options?.offset ?? (window.innerWidth >= 1280 ? -108 : -88);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY + offset;
      window.scrollTo({
        top: Math.max(0, top),
        behavior: prefersReducedMotion || options?.immediate ? "auto" : "smooth",
      });
    }
  },
  lenis: null,
};

const SmoothScrollContext = createContext<SmoothScrollContextType>(defaultContext);

export const useSmoothScroll = () => useContext(SmoothScrollContext);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return;
    }

    const headerOffset = window.innerWidth >= 1280 ? -108 : -88;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      anchors: {
        offset: headerOffset,
        duration: 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      },
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);
    (window as any).__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Initial hash handling if landing directly with a section hash (e.g. /#destaques)
    if (window.location.hash) {
      const hash = window.location.hash;
      const timer = setTimeout(() => {
        const target = document.querySelector(hash);
        if (target) {
          lenis.scrollTo(hash, {
            offset: headerOffset,
            duration: 1.15,
          });
        }
      }, 350);

      return () => clearTimeout(timer);
    }

    return () => {
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
      setLenisInstance(null);
      delete (window as any).__lenis;
    };
  }, []);

  const scrollTo = (target: string | HTMLElement, options?: ScrollToOptions) => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const defaultOffset = window.innerWidth >= 1280 ? -108 : -88;
    const finalOffset = options?.offset ?? defaultOffset;

    if (prefersReducedMotion || options?.immediate) {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + finalOffset;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: "auto",
        });
      }
      return;
    }

    if (lenisRef.current) {
      lenisRef.current.scrollTo(target, {
        offset: finalOffset,
        duration: options?.duration ?? 1.15,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    } else {
      const el = typeof target === "string" ? document.querySelector(target) : target;
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY + finalOffset;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <SmoothScrollContext.Provider value={{ scrollTo, lenis: lenisInstance }}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
