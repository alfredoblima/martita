"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wine, Sparkles, Flame, Utensils, MessageCircle } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { buildWhatsAppLink } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface GastrobarSectionProps {
  headline: string;
  description: string;
  whatsapp?: string;
}

const NIGHT_HIGHLIGHTS = [
  {
    tag: "Drinks & Taças",
    title: "Aperol Spritz & Coquetéis",
    desc: "Taças borbulhantes com cítricos frescos, gelo cristalino e equilíbrio entre dulçor e amargor para brindar ao cair da noite.",
    image: "/images/martita/drink-spritz-almondegas.jpg",
  },
  {
    tag: "Para Compartilhar",
    title: "Mix Martita & Petiscos do Mar",
    desc: "Camarão à milanesa crocante, lulas douradas, iscas de peixe, ostras gratinadas e empanadas argentinas assadas na hora.",
    image: "/images/martita/empanadas-argentinas.jpg",
  },
  {
    tag: "Na Panelinha & Baguete",
    title: "Hambúrguer Martita & Lomito",
    desc: "Brioche dourado com blend artesanal, cheddar e bacon, ou nosso clássico Lomito na baguete crocante com batatas canoa.",
    image: "/images/martita/hamburguer-panelinha.jpg",
  },
  {
    tag: "Jantar & Sobremesas",
    title: "Risotos, Massas & Confeitaria",
    desc: "Do risoto de filé mignon com funghi ao vinho branco até nossos croissants doces e entremets sob luz intimista.",
    image: "/images/martita/risoto-file-funghi.jpg",
  },
];

export function GastrobarSection({
  headline,
  description,
  whatsapp,
}: GastrobarSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const heroCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".gastro-reveal", {
        y: 24,
        duration: 0.65,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="gastrobar"
      ref={sectionRef}
      className="relative overflow-hidden"
    >
      {/* Top Day-to-Night Atmospheric Gradient Bridge */}
      <div
        className="h-28 sm:h-40 w-full bg-gradient-to-b from-[#F8F4EC] via-[#38271F] to-[#211A17]"
        aria-hidden="true"
      />

      {/* Main Nocturnal Gastrobar Stage */}
      <div className="bg-[#211A17] text-[#F8F4EC] py-20 lg:py-32 relative">
        {/* Warm Candlelight / Amber Ambient Glows */}
        <div
          className="pointer-events-none absolute top-16 left-1/4 w-[34rem] h-[34rem] rounded-full bg-[#E77759]/15 blur-[140px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-16 right-10 w-[30rem] h-[30rem] rounded-full bg-[#CFB583]/12 blur-[140px]"
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10 space-y-20">
          {/* Editorial Night Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-7 space-y-5">
              <div className="gastro-reveal inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#38271F] border border-[#CFB583]/40 text-[#CFB583]">
                <Wine className="w-4 h-4 text-[#E77759]" />
                <span className="text-[11px] uppercase tracking-[0.28em] font-semibold">
                  Atmosfera Noturna • Experiência Gastrobar
                </span>
              </div>

              <h2 className="gastro-reveal font-serif-editorial text-4xl sm:text-6xl xl:text-[4.1rem] font-normal leading-[1.05] text-[#F8F4EC]">
                {headline.split("bons momentos").length > 1 ? (
                  <>
                    {headline.split("bons momentos")[0]}
                    <span className="italic font-semibold text-[#CFB583]">
                      bons momentos
                    </span>
                    {headline.split("bons momentos")[1]}
                  </>
                ) : (
                  headline
                )}
              </h2>
            </div>

            <div className="lg:col-span-5 space-y-5">
              <p className="gastro-reveal text-base sm:text-lg text-[#EFE5D5]/80 leading-relaxed">
                {description}
              </p>

              <div className="gastro-reveal flex flex-wrap items-center gap-4">
                <a
                  href="#cardapio"
                  className="px-7 py-3.5 rounded-full bg-[#E77759] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#CFB583] hover:text-[#211A17] transition-colors"
                >
                  Ver Carta de Drinks & Petiscos
                </a>
                <a
                  href={buildWhatsAppLink(
                    whatsapp,
                    "Olá! Gostaria de informações sobre mesas para hoje à noite no Gastrobar Martita."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-[#CFB583]/50 text-[#CFB583] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#CFB583]/15 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#E77759]" />
                  <span>Planejar sua Noite</span>
                </a>
              </div>
            </div>
          </div>

          {/* Centerpiece Cinematic Banner: Drink in Foreground + Gastronomy in Background */}
          <div
            ref={heroCardRef}
            className="relative rounded-[2.25rem] overflow-hidden border-2 border-[#CFB583]/45 shadow-[0_35px_100px_rgba(0,0,0,0.55)] grid grid-cols-1 lg:grid-cols-12 bg-[#38271F]/55 backdrop-blur-md"
          >
            <div className="lg:col-span-7 h-80 sm:h-[28rem] relative overflow-hidden">
              <SafeImage
                src="/images/martita/drink-spritz-almondegas.jpg"
                alt="Taça de Aperol Spritz em primeiro plano com gastronomia Martita ao fundo"
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#211A17]/80 hidden lg:block" />
            </div>

            <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-center space-y-6 bg-gradient-to-br from-[#211A17] via-[#2A1E19] to-[#38271F]">
              <div className="flex items-center gap-3 text-[#CFB583]">
                <Flame className="w-5 h-5 text-[#E77759]" />
                <span className="text-xs uppercase tracking-[0.28em] font-semibold">
                  Luz Quente & Sabor Intenso
                </span>
              </div>

              <h3 className="font-serif-editorial italic text-3xl sm:text-4xl text-[#F8F4EC] leading-snug">
                “Onde as histórias ficam melhores depois de um drinque.”
              </h3>

              <p className="text-sm sm:text-base text-[#EFE5D5]/80 leading-relaxed">
                Nossas noites combinam a descontração de um gastrobar contemporâneo com o cuidado de uma cozinha autoral. Da taça gelada ao prato fumegante, cada escolha convida a prolongar a conversa.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#CFB583]/25">
                <div>
                  <span className="font-serif-editorial italic text-2xl text-[#CFB583] block">
                    Coquetelaria
                  </span>
                  <span className="text-xs text-[#EFE5D5]/70">
                    Clássicos & refrescantes
                  </span>
                </div>
                <div>
                  <span className="font-serif-editorial italic text-2xl text-[#E77759] block">
                    Porções & Jantar
                  </span>
                  <span className="text-xs text-[#EFE5D5]/70">
                    Mar, terra & massas
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Night Experience Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {NIGHT_HIGHLIGHTS.map((item) => (
              <div
                key={item.title}
                className="gastro-reveal group rounded-3xl overflow-hidden bg-[#38271F]/50 border border-[#CFB583]/30 hover:border-[#E77759] transition-all duration-500 flex flex-col justify-between"
              >
                <div className="h-56 overflow-hidden relative">
                  <SafeImage
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211A17] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] font-semibold bg-[#211A17]/85 text-[#CFB583] border border-[#CFB583]/35">
                    {item.tag}
                  </span>
                </div>

                <div className="p-6 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif-editorial text-2xl text-[#F8F4EC] group-hover:text-[#CFB583] transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#EFE5D5]/75 leading-relaxed mt-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-4 flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-[#E77759] font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Experiência Martita</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Transition back to Off-white */}
      <div
        className="h-24 sm:h-32 w-full bg-gradient-to-b from-[#211A17] to-[#F8F4EC]"
        aria-hidden="true"
      />
    </section>
  );
}

