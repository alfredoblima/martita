"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Quote, Sparkles, HeartHandshake, Coffee, UtensilsCrossed } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface EssenceSectionProps {
  headline: string;
  subheadline: string;
  quote: string;
}

export function EssenceSection({
  headline,
  subheadline,
  quote,
}: EssenceSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".essence-reveal", {
        y: 28,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });

      gsap.to(".essence-parallax-up", {
        y: -45,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".essence-parallax-down", {
        y: 35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="essencia"
      ref={sectionRef}
      className="relative py-24 lg:py-36 bg-[#F8F4EC] text-[#211A17] overflow-hidden bg-grain scroll-mt-24 xl:scroll-mt-28"
    >
      {/* Decorative Editorial Vertical Line */}
      <div
        className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#CFB583]/30 to-transparent"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        {/* Asymmetric Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Architectural & Interior Photography Mosaic */}
          <div className="lg:col-span-7 relative">
            <div className="grid grid-cols-12 gap-4 sm:gap-6 items-center">
              {/* Main Salon Photograph */}
              <div className="col-span-12 sm:col-span-8 essence-parallax-down">
                <div className="rounded-[2rem] overflow-hidden shadow-[0_25px_70px_rgba(33,26,23,0.14)] border border-[#CFB583]/45 h-72 sm:h-96">
                  <SafeImage
                    src="/images/martita/ambiente-salao.jpg"
                    alt="Ambiente interno da Martita Café & Gastrobar com cadeiras de madeira e palhinha natural"
                    className="w-full h-full hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Right Tall Coffee / Table Detail Photograph */}
              <div className="col-span-12 sm:col-span-4 space-y-4 sm:space-y-6 essence-parallax-up">
                <div className="rounded-3xl overflow-hidden shadow-xl border border-[#CFB583]/40 h-64 sm:h-72">
                  <SafeImage
                    src="/images/martita/cafe-especial-taca.jpg"
                    alt="Taça de café especial preparado na Martita"
                    className="w-full h-full hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-[#EFE5D5] border border-[#CFB583]/50 shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#E77759] mb-2" />
                  <p className="font-serif-editorial italic text-lg leading-snug text-[#211A17]">
                    Madeira quente, palhinha natural, cerâmica artesanal e luz acolhedora.
                  </p>
                </div>
              </div>
            </div>

            {/* Wall Quote Badge Inspired by the Real Wall Inscription in Photo 4192 */}
            <div className="mt-6 sm:mt-8 p-6 sm:p-8 rounded-3xl bg-[#211A17] text-[#F8F4EC] shadow-2xl border border-[#CFB583]/35 max-w-xl">
              <div className="flex items-start gap-4">
                <Quote className="w-8 h-8 text-[#E77759] shrink-0 opacity-80" />
                <div>
                  <p className="font-script-brand text-3xl sm:text-4xl text-[#CFB583] leading-relaxed">
                    “{quote}”
                  </p>
                  <span className="block mt-2 text-[10px] uppercase tracking-[0.28em] text-[#F8F4EC]/70">
                    Inscrição nas paredes da Martita
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy & Pillars */}
          <div className="lg:col-span-5 space-y-7">
            <div className="essence-reveal inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EFE5D5] border border-[#CFB583]/50">
              <span className="w-2 h-2 rounded-full bg-[#E77759]" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#38271F]">
                Nossa Essência
              </span>
            </div>

            <h2 className="essence-reveal font-serif-editorial text-4xl sm:text-5xl xl:text-6xl font-normal leading-[1.06] text-[#211A17]">
              {headline}
            </h2>

            <p className="essence-reveal text-base sm:text-lg text-[#38271F]/85 leading-relaxed">
              {subheadline}
            </p>

            <p className="essence-reveal text-sm sm:text-base text-[#38271F]/75 leading-relaxed">
              Na Martita, cada detalhe da mesa foi pensado para despertar o prazer de estar presente: da louça de cerâmica que acolhe o croissant quentinho pela manhã à taça que celebra o encontro ao fim do dia.
            </p>

            {/* 3 Pillars */}
            <div className="essence-reveal pt-4 space-y-4 border-t border-[#CFB583]/35">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#EFE5D5] border border-[#CFB583]/50 flex items-center justify-center shrink-0 text-[#E77759]">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-editorial italic text-xl font-semibold text-[#211A17]">
                    Cafeteria Boutique & Confeitaria
                  </h3>
                  <p className="text-xs sm:text-sm text-[#38271F]/75">
                    Grãos selecionados, extrações cremosas e croissants folhados recheados na hora.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#EFE5D5] border border-[#CFB583]/50 flex items-center justify-center shrink-0 text-[#E77759]">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-editorial italic text-xl font-semibold text-[#211A17]">
                    Gastronomia para Todos os Momentos
                  </h3>
                  <p className="text-xs sm:text-sm text-[#38271F]/75">
                    Do brunch completo ao almoço executivo com massas, risotos e cortes nobres.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-[#EFE5D5] border border-[#CFB583]/50 flex items-center justify-center shrink-0 text-[#E77759]">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif-editorial italic text-xl font-semibold text-[#211A17]">
                    Encontros & Bons Drinks
                  </h3>
                  <p className="text-xs sm:text-sm text-[#38271F]/75">
                    Um ambiente acolhedor que se estende pela noite com drinks e porções para compartilhar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

