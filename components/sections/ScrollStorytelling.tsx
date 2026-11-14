"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sun, Sunrise, Utensils, CakeSlice, Wine, ArrowRight } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StoryScene {
  id: string;
  number: string;
  timeTag: string;
  title: string;
  subtitle: string;
  description: string;
  dishTitle: string;
  dishDetail: string;
  mainImage: string;
  secondaryImage: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  cardBg: string;
  isNight?: boolean;
}

const SCENES: StoryScene[] = [
  {
    id: "cena-01",
    number: "CENA 01",
    timeTag: "08h00 • Despertar & Aroma",
    title: "Café da Manhã",
    subtitle: "O perfume do café recém-moído e a crocância da massa folhada dourada.",
    description:
      "A manhã começa em ritmo acolhedor: xícaras fumegantes extraídas com precisão, pães artesanais tostados na manteiga e croissants folhados recheados que despertam todos os sentidos.",
    dishTitle: "Espresso Artesanal & Croissant Folhado",
    dishDetail: "Crema aveludada 100% arábica com folhado dourado",
    mainImage: "/images/martita/cafe-crema-topdown.jpg",
    secondaryImage: "/images/martita/croissant-prato-topdown.jpg",
    bgColor: "#F8F4EC",
    textColor: "#211A17",
    accentColor: "#E77759",
    cardBg: "rgba(239, 229, 213, 0.9)",
  },
  {
    id: "cena-02",
    number: "CENA 02",
    timeTag: "10h30 • Manhãs Sem Pressa",
    title: "Brunch Autoral",
    subtitle: "Ovos mexidos cremosos, fatias de abacate fresco, bacon dourado e frutas.",
    description:
      "Quando o café da manhã encontra a leveza do fim de manhã: bandejas generosas, suco de laranja natural na taça de cristal, pão de queijo quentinho e combinações cheias de frescor.",
    dishTitle: "Bandeja Brunch & Ovos com Avocado",
    dishDetail: "Pão rústico, bacon crocante, frutas com granola e suco fresco",
    mainImage: "/images/martita/ovos-bacon-abacate-top.jpg",
    secondaryImage: "/images/martita/brunch-bandeja.jpg",
    bgColor: "#EFE5D5",
    textColor: "#211A17",
    accentColor: "#E77759",
    cardBg: "rgba(248, 244, 236, 0.92)",
  },
  {
    id: "cena-03",
    number: "CENA 03",
    timeTag: "12h30 • Alta Gastronomia",
    title: "Almoço & Pratos",
    subtitle: "Risotos aveludados, massas ao molho rústico e grelhados no ponto.",
    description:
      "Ao meio-dia, nossa cozinha celebra receitas intensas e reconfortantes: risoto de filé mignon com funghi ao vinho branco, fettuccine com almôndegas artesanais e galeto ao primo canto.",
    dishTitle: "Risoto de Filé Mignon & Funghi",
    dishDetail: "Arroz arbóreo cremoso finalizado com manteiga e parmesão",
    mainImage: "/images/martita/risoto-file-funghi.jpg",
    secondaryImage: "/images/martita/fettuccine-almondegas.jpg",
    bgColor: "#E7DAC4",
    textColor: "#211A17",
    accentColor: "#C85A3D",
    cardBg: "rgba(248, 244, 236, 0.9)",
  },
  {
    id: "cena-04",
    number: "CENA 04",
    timeTag: "16h30 • Pausa Doce",
    title: "Café & Sobremesas",
    subtitle: "Texturas de pistache, morangos frescos, chocolate e confeitaria autoral.",
    description:
      "A tarde convida a uma pausa indulgente. Croissants recheados com ganache de pistache ou Nutella com morangos, entremets delicados e taças de café com calda de caramelo.",
    dishTitle: "Croissant de Pistache & Confeitaria Fina",
    dishDetail: "Creme artesanal de pistache com castanhas tostadas",
    mainImage: "/images/martita/croissant-pistache.jpg",
    secondaryImage: "/images/martita/sobremesa-morango-torta.jpg",
    bgColor: "#38271F",
    textColor: "#F8F4EC",
    accentColor: "#CFB583",
    cardBg: "rgba(33, 26, 23, 0.88)",
    isNight: true,
  },
  {
    id: "cena-05",
    number: "CENA 05",
    timeTag: "19h30 • Atmosfera Noturna",
    title: "Experiência Gastrobar",
    subtitle: "Drinks borbulhantes, taças brindando, petiscos e luz intimista.",
    description:
      "Quando o sol se despede, a Martita se transforma. Iluminação quente, Aperol Spritz gelado, empanadas argentinas assadas, porções do mar e sanduíches artesanais para celebrar a noite.",
    dishTitle: "Aperol Spritz & Petiscos para Compartilhar",
    dishDetail: "Coquetelaria refrescante e gastronomia noturna",
    mainImage: "/images/martita/drink-spritz-almondegas.jpg",
    secondaryImage: "/images/martita/hamburguer-panelinha.jpg",
    bgColor: "#211A17",
    textColor: "#F8F4EC",
    accentColor: "#E77759",
    cardBg: "rgba(56, 39, 31, 0.85)",
    isNight: true,
  },
];

export function ScrollStorytelling() {
  const containerRef = useRef<HTMLElement>(null);
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const dishPlateRef = useRef<HTMLDivElement>(null);
  const activeIdxRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !containerRef.current || !pinWrapRef.current) {
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const totalScenes = SCENES.length;

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * 2.5}`,
        pin: pinWrapRef.current,
        pinSpacing: true,
        scrub: 0.4,
        onUpdate: (self) => {
          const progress = self.progress;
          const idx = Math.min(
            totalScenes - 1,
            Math.floor(progress * totalScenes)
          );

          if (idx !== activeIdxRef.current) {
            activeIdxRef.current = idx;
            setActiveIndex(idx);
          }

          if (wheelRef.current) {
            gsap.set(wheelRef.current, {
              rotation: progress * 360,
            });
          }
          if (dishPlateRef.current) {
            gsap.set(dishPlateRef.current, {
              rotation: progress * 180,
            });
          }
        },
      });
    });

    return () => mm.revert();
  }, []);

  const currentScene = SCENES[activeIndex] || SCENES[0];

  const getSceneIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Sunrise className="w-4 h-4" />;
      case 1:
        return <Sun className="w-4 h-4" />;
      case 2:
        return <Utensils className="w-4 h-4" />;
      case 3:
        return <CakeSlice className="w-4 h-4" />;
      default:
        return <Wine className="w-4 h-4" />;
    }
  };

  return (
    <section
      id="jornada"
      ref={containerRef}
      style={{
        backgroundColor: currentScene.bgColor,
        color: currentScene.textColor,
      }}
      className="relative w-full overflow-hidden transition-colors duration-700 ease-out scroll-mt-24 xl:scroll-mt-28"
    >
      {/* DESKTOP PINNED CINEMATIC STORYTELLING STAGE: SPACIOUS TOP PADDING SO IT CLEARS THE FIXED NAVBAR */}
      <div
        ref={pinWrapRef}
        style={{
          backgroundColor: currentScene.bgColor,
          color: currentScene.textColor,
        }}
        className="hidden lg:flex min-h-screen w-full flex-col justify-between pt-28 pb-8 lg:pt-36 lg:pb-10 px-8 lg:px-12 transition-colors duration-500 ease-out relative overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="max-w-7xl mx-auto w-full relative z-20 flex items-center justify-between border-b border-[#CFB583]/30 pb-5">
          <div>
            <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#E77759] block">
              Narrativa Gastronômica Sincronizada
            </span>
            <h2 className="font-serif-editorial italic text-2xl xl:text-3xl">
              Cada momento tem seu sabor.
            </h2>
          </div>

          {/* Interactive Scene Selector Pills */}
          <div className="flex items-center gap-2">
            {SCENES.map((scene, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => {
                    activeIdxRef.current = idx;
                    setActiveIndex(idx);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-[0.16em] font-semibold transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "bg-[#E77759] text-white shadow-md scale-105"
                      : currentScene.isNight
                      ? "bg-white/10 text-[#CFB583] hover:bg-white/20"
                      : "bg-[#211A17]/8 text-[#38271F] hover:bg-[#211A17]/15"
                  }`}
                >
                  {getSceneIcon(idx)}
                  <span>{scene.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Stage: Left Editorial Narrative + Right Revolving Dish Medallion */}
        <div className="max-w-7xl mx-auto w-full my-auto grid grid-cols-12 gap-12 items-center relative z-20 py-6">
          {/* Left Narrative Column */}
          <div className="col-span-5 space-y-6">
            <div className="inline-flex items-center gap-3">
              <span
                className="px-3.5 py-1 rounded-full text-[11px] uppercase tracking-[0.26em] font-bold"
                style={{
                  backgroundColor: currentScene.accentColor,
                  color: "#FFFFFF",
                }}
              >
                {currentScene.number}
              </span>
              <span className="text-xs uppercase tracking-[0.22em] opacity-80 font-medium">
                {currentScene.timeTag}
              </span>
            </div>

            <h3 className="font-serif-editorial text-5xl xl:text-6xl leading-[1.05] font-normal">
              {currentScene.title}
            </h3>

            <p
              className="font-serif-editorial italic text-2xl leading-snug"
              style={{ color: currentScene.accentColor }}
            >
              “{currentScene.subtitle}”
            </p>

            <p className="text-base leading-relaxed opacity-85">
              {currentScene.description}
            </p>

            {/* Dish Spotlight Card */}
            <div
              style={{ backgroundColor: currentScene.cardBg }}
              className="p-5 rounded-2xl border border-[#CFB583]/40 flex items-center justify-between gap-4 shadow-lg"
            >
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#E77759] font-bold block">
                  Protagonista da Cena
                </span>
                <p className="font-serif-editorial italic text-xl font-semibold mt-0.5">
                  {currentScene.dishTitle}
                </p>
                <p className="text-xs opacity-75 mt-0.5">
                  {currentScene.dishDetail}
                </p>
              </div>
              <Link
                href="/cardapio"
                className="shrink-0 w-11 h-11 rounded-full bg-[#E77759] text-white flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Ver no cardápio"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Revolving Medallion Stage */}
          <div className="col-span-7 flex items-center justify-center relative">
            {/* Outer Golden Orbit Ring */}
            <div
              ref={wheelRef}
              className="w-[28rem] h-[28rem] xl:w-[32rem] xl:h-[32rem] rounded-full border-2 border-dashed border-[#CFB583]/60 flex items-center justify-center relative will-change-transform"
            >
              <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#E77759]" />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#CFB583]" />
              <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#CFB583]" />
              <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 rounded-full bg-[#E77759]" />
            </div>

            {/* Central Circular Dish / Cup / Glass Showcase */}
            <div
              ref={dishPlateRef}
              className="absolute w-[22rem] h-[22rem] xl:w-[25rem] xl:h-[25rem] rounded-full overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.32)] border-4 border-[#CFB583] will-change-transform"
            >
              {SCENES.map((scene, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={scene.id}
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                  >
                    <SafeImage
                      src={scene.mainImage}
                      alt={scene.dishTitle}
                      priority={idx === 0}
                      className="w-full h-full"
                    />
                  </div>
                );
              })}
            </div>

            {/* Secondary Floating Detail Frame */}
            <div className="absolute -bottom-4 right-4 xl:right-8 z-30 w-44 h-52 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#CFB583] bg-[#211A17]">
              <SafeImage
                src={currentScene.secondaryImage}
                alt={currentScene.title}
                className="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-3">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#F8F4EC] font-semibold">
                  {currentScene.title}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Progress Bar */}
        <div className="max-w-7xl mx-auto w-full relative z-20 flex items-center justify-between gap-6 pt-4">
          <span className="text-xs uppercase tracking-[0.24em] opacity-75">
            Role para avançar do dia para a noite ({activeIndex + 1}/
            {SCENES.length})
          </span>
          <div className="flex-1 h-1 bg-[#CFB583]/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E77759] transition-all duration-300"
              style={{
                width: `${((activeIndex + 1) / SCENES.length) * 100}%`,
              }}
            />
          </div>
          <Link
            href="/cardapio"
            className="text-xs uppercase tracking-[0.22em] font-semibold hover:text-[#E77759] transition-colors"
          >
            Pular para o Cardápio →
          </Link>
        </div>
      </div>

      {/* TABLET & MOBILE OPTIMIZED STORYTELLING CARDS */}
      <div className="lg:hidden py-20 px-4 sm:px-6 bg-[#F8F4EC] space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#E77759]">
            Jornada Gastronômica Martita
          </span>
          <h2 className="font-serif-editorial text-4xl sm:text-5xl text-[#211A17]">
            Cada momento tem seu <span className="italic text-[#E77759]">sabor</span>.
          </h2>
          <p className="text-sm text-[#38271F]/80">
            Do primeiro espresso da manhã aos drinks autorais da noite.
          </p>
        </div>

        <div className="space-y-8 max-w-2xl mx-auto">
          {SCENES.map((scene) => (
            <div
              key={scene.id}
              style={{
                backgroundColor: scene.bgColor,
                color: scene.textColor,
              }}
              className="rounded-3xl p-6 sm:p-8 shadow-xl border border-[#CFB583]/35 space-y-5 overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.24em] font-bold bg-[#E77759] text-white">
                  {scene.number}
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] opacity-80">
                  {scene.timeTag}
                </span>
              </div>

              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden border border-[#CFB583]/40">
                <SafeImage
                  src={scene.mainImage}
                  alt={scene.title}
                  className="w-full h-full"
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif-editorial text-3xl font-normal">
                  {scene.title}
                </h3>
                <p
                  className="font-serif-editorial italic text-xl"
                  style={{ color: scene.accentColor }}
                >
                  “{scene.subtitle}”
                </p>
                <p className="text-sm leading-relaxed opacity-85">
                  {scene.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
