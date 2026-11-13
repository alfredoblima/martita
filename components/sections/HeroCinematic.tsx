"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowDown, Compass, Coffee, Wine, Sparkles } from "lucide-react";
import { MartitaLogo } from "@/components/ui/MartitaLogo";
import { HeroCanvasScrub } from "@/components/sections/HeroCanvasScrub";

interface HeroCinematicProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  heroImage: string;
}

export function HeroCinematic({
  headline,
  subheadline,
  ctaText,
}: HeroCinematicProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Entrance animation for editorial text items
      gsap.fromTo(
        ".hero-editorial-item",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="topo"
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-[#F8F4EC] via-[#F4ECE0] to-[#EFE5D5] bg-grain overflow-hidden flex items-center"
    >
      {/* Warm Ambient Table Lighting */}
      <div
        className="pointer-events-none absolute -top-24 left-1/3 w-[38rem] h-[38rem] rounded-full bg-[#CFB583]/25 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 right-10 w-[30rem] h-[30rem] rounded-full bg-[#E77759]/15 blur-[130px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 w-full relative z-10 py-20 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* LEFT COLUMN: Editorial Brand & Narrative */}
          <div className="lg:col-span-6 space-y-6 text-left order-2 lg:order-1">
            <div className="hero-editorial-item inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#EFE5D5] border border-[#CFB583]/60">
              <span className="w-2 h-2 rounded-full bg-[#E77759] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.26em] font-semibold text-[#38271F]">
                Café &amp; Gastrobar • Experiência Gastronômica
              </span>
            </div>

            <div className="hero-editorial-item">
              <MartitaLogo size="lg" className="items-start" />
            </div>

            <h1 className="hero-editorial-item font-serif-editorial text-4xl sm:text-6xl xl:text-[4.2rem] font-normal leading-[1.04] tracking-tight text-[#211A17]">
              {headline.split("saborear").length > 1 ? (
                <>
                  {headline.split("saborear")[0]}
                  <span className="italic font-semibold text-[#E77759]">
                    saborear
                  </span>
                  {headline.split("saborear")[1]}
                </>
              ) : (
                headline
              )}
            </h1>

            <p className="hero-editorial-item text-base sm:text-lg text-[#38271F]/85 leading-relaxed max-w-xl">
              {subheadline}
            </p>

            {/* CTAs */}
            <div className="hero-editorial-item flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/cardapio"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#E77759] text-white text-xs uppercase tracking-[0.22em] font-semibold shadow-[0_14px_34px_rgba(231,119,89,0.32)] hover:bg-[#211A17] transition-all duration-300"
              >
                <Compass className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" />
                <span>{ctaText}</span>
              </Link>

              <a
                href="#jornada"
                className="inline-flex items-center gap-3 px-7 py-4 rounded-full border border-[#38271F]/30 bg-white/80 backdrop-blur-sm text-[#211A17] text-xs uppercase tracking-[0.2em] font-semibold hover:border-[#CFB583] hover:bg-[#EFE5D5] transition-all duration-300"
              >
                <span>Acompanhar a Jornada</span>
                <ArrowDown className="w-4 h-4 text-[#E77759] animate-bounce" />
              </a>
            </div>

            {/* Day-to-Night Highlights */}
            <div className="hero-editorial-item pt-6 border-t border-[#CFB583]/40 grid grid-cols-3 gap-4 max-w-lg">
              <div className="flex items-start gap-2.5">
                <Coffee className="w-4 h-4 text-[#E77759] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#211A17]">
                    Manhã &amp; Brunch
                  </p>
                  <p className="text-xs text-[#38271F]/75">
                    Cafés &amp; folhados
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#CFB583] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#211A17]">
                    Almoço &amp; Tarde
                  </p>
                  <p className="text-xs text-[#38271F]/75">
                    Pratos &amp; confeitaria
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Wine className="w-4 h-4 text-[#E77759] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#211A17]">
                    Gastrobar
                  </p>
                  <p className="text-xs text-[#38271F]/75">
                    Drinks &amp; encontros
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 160-FRAME SCROLL-DRIVEN TRANSPARENT VIDEO CANVAS */}
          <div className="lg:col-span-6 flex items-center justify-center relative min-h-[26rem] sm:min-h-[32rem] order-1 lg:order-2">
            <HeroCanvasScrub sectionRef={sectionRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
