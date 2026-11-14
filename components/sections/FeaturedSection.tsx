"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatBRL } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface FeaturedProductItem {
  id: string;
  name: string;
  description: string;
  ingredients?: string | null;
  price: number | null;
  image: string;
  badge?: string | null;
  isDemo?: boolean;
  category?: {
    name: string;
    slug: string;
  };
}

interface FeaturedSectionProps {
  products: FeaturedProductItem[];
  onSelectCategory?: (slug: string) => void;
}

export function FeaturedSection({
  products,
  onSelectCategory,
}: FeaturedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".featured-card-item", {
        y: 35,
        duration: 0.7,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [products]);

  const displayProducts = products.slice(0, 6);

  return (
    <section
      id="destaques"
      ref={sectionRef}
      className="relative py-24 lg:py-32 bg-[#EFE5D5] text-[#211A17] overflow-hidden scroll-mt-24 xl:scroll-mt-28"
    >
      {/* Top & Bottom Subtle Borders */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F4EC] border border-[#CFB583]/60">
              <Star className="w-3.5 h-3.5 text-[#E77759] fill-[#E77759]" />
              <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#38271F]">
                Curadoria Gastronômica
              </span>
            </div>
            <h2 className="font-serif-editorial text-4xl sm:text-6xl font-normal leading-[1.05] text-[#211A17]">
              Os queridinhos da{" "}
              <span className="italic font-semibold text-[#E77759]">
                Martita
              </span>
              .
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm text-[#38271F]/80 max-w-xs">
              Criações que conquistaram o paladar de quem vive a experiência Martita do café à noite.
            </p>
            <Link
              href="/cardapio"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#211A17] text-[#F8F4EC] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#E77759] transition-colors shrink-0"
            >
              <span>Cardápio Completo</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Asymmetric Editorial Showcase (Avoids conventional uniform e-commerce grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
          {displayProducts.map((item, idx) => {
            // Asymmetric column spans for magazine layout:
            // Row 1: 7 cols + 5 cols
            // Row 2: 5 cols + 7 cols
            // Row 3: 6 cols + 6 cols
            const spanClass =
              idx === 0
                ? "md:col-span-7"
                : idx === 1
                ? "md:col-span-5"
                : idx === 2
                ? "md:col-span-5"
                : idx === 3
                ? "md:col-span-7"
                : "md:col-span-6";

            const isHeroFeature = idx === 0 || idx === 3;

            return (
              <article
                key={item.id}
                className={`featured-card-item group relative rounded-[2rem] overflow-hidden bg-[#F8F4EC] border border-[#CFB583]/45 shadow-[0_18px_50px_rgba(33,26,23,0.08)] hover:shadow-[0_25px_70px_rgba(231,119,89,0.18)] transition-all duration-500 flex flex-col justify-between ${spanClass}`}
              >
                {/* Image Wrapper */}
                <div
                  className={`relative overflow-hidden ${
                    isHeroFeature ? "h-80 sm:h-96" : "h-72 sm:h-80"
                  }`}
                >
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#211A17]/80 via-[#211A17]/15 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] font-semibold bg-[#211A17]/85 text-[#CFB583] backdrop-blur-md border border-[#CFB583]/30">
                      {item.category?.name || "Especialidade"}
                    </span>

                    {item.badge && (
                      <span className="px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold bg-[#E77759] text-white shadow-sm">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Price Tag Floating Bottom Right of Image */}
                  <div className="absolute bottom-4 right-4">
                    {item.price !== null && item.price !== undefined ? (
                      <span className="inline-block px-4 py-2 rounded-full bg-[#F8F4EC] text-[#211A17] font-serif-editorial italic text-xl font-bold shadow-lg border border-[#CFB583]">
                        {formatBRL(item.price)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#211A17]/90 text-[#CFB583] text-[10px] uppercase tracking-[0.18em] border border-[#CFB583]/40">
                        <Sparkles className="w-3 h-3 text-[#E77759]" />
                        Consulte no Cardápio
                      </span>
                    )}
                  </div>
                </div>

                {/* Editorial Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#211A17] group-hover:text-[#E77759] transition-colors">
                        {item.name}
                      </h3>
                    </div>

                    <p className="text-sm text-[#38271F]/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#CFB583]/30 flex items-center justify-between gap-4">
                    {item.ingredients ? (
                      <span className="text-xs text-[#38271F]/65 line-clamp-1 italic">
                        {item.ingredients}
                      </span>
                    ) : (
                      <span className="text-xs text-[#38271F]/65 italic">
                        Preparo artesanal Martita
                      </span>
                    )}

                    <Link
                      href={`/cardapio?categoria=${item.category?.slug || "todas"}`}
                      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] font-bold text-[#E77759] group-hover:translate-x-1 transition-transform shrink-0"
                    >
                      <span>Explorar</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

