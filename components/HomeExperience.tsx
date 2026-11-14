"use client";

import React, { useState } from "react";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Navbar } from "@/components/sections/Navbar";
import { HeroCinematic } from "@/components/sections/HeroCinematic";
import { ScrollStorytelling } from "@/components/sections/ScrollStorytelling";
import { EssenceSection } from "@/components/sections/EssenceSection";
import {
  FeaturedSection,
  type FeaturedProductItem,
} from "@/components/sections/FeaturedSection";
import { GastrobarSection } from "@/components/sections/GastrobarSection";
import {
  GallerySection,
  type GalleryItemData,
} from "@/components/sections/GallerySection";
import {
  ContactAndLocation,
  type SiteConfigData,
} from "@/components/sections/ContactAndLocation";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/utils";
import { CoffeeLiquidStream } from "@/components/cinematic/CoffeeLiquidStream";

interface HomeExperienceProps {
  config: SiteConfigData & {
    heroHeadline: string;
    heroSubheadline: string;
    heroImage: string;
    heroCtaText: string;
    essenceHeadline: string;
    essenceSubheadline: string;
    essenceQuote: string;
    gastrobarHeadline: string;
    gastrobarDescription: string;
  };
  featuredProducts: FeaturedProductItem[];
  galleryItems: GalleryItemData[];
}

export function HomeExperience({
  config,
  featuredProducts,
  galleryItems,
}: HomeExperienceProps) {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col bg-[#F8F4EC] text-[#211A17] relative">
        <Navbar whatsapp={config.whatsapp} instagram={config.instagram} />

        <main className="flex-1">
          {/* 1. HERO SECTION */}
          <HeroCinematic
            headline={config.heroHeadline}
            subheadline={config.heroSubheadline}
            ctaText={config.heroCtaText}
            heroImage={config.heroImage}
          />

          {/* 2. SCROLL STORYTELLING ("Cada momento tem seu sabor") */}
          <ScrollStorytelling />

          {/* 3. NOSSA ESSÊNCIA ("Mais que uma pausa. Um jeito de aproveitar a vida.") */}
          <EssenceSection
            headline={config.essenceHeadline}
            subheadline={config.essenceSubheadline}
            quote={config.essenceQuote}
          />

          {/* 4. SEÇÃO DESTAQUES ("Os queridinhos da Martita") */}
          <FeaturedSection products={featuredProducts} />

          {/* 5. EXPERIÊNCIA GASTROBAR NOTURNA */}
          <GastrobarSection
            headline={config.gastrobarHeadline}
            description={config.gastrobarDescription}
            whatsapp={config.whatsapp}
          />

          {/* 6. GALERIA IMERSIVA */}
          <GallerySection items={galleryItems} />
        </main>

        {/* 8. LOCALIZAÇÃO, CONTATO & MÓDULOS COMERCIAIS */}
        <ContactAndLocation config={config} />

        {/* Continuous Cinematic Coffee Liquid Stream running across all sections */}
        <CoffeeLiquidStream />

        {/* Floating WhatsApp Concierge Pill */}
        <a
          href={buildWhatsAppLink(
            config.whatsapp,
            "Olá! Estou navegando no site da Martita Café & Gastrobar e gostaria de atendimento."
          )}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Falar com a Martita no WhatsApp"
          className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-[#211A17] text-[#F8F4EC] border border-[#CFB583]/60 shadow-[0_14px_40px_rgba(33,26,23,0.35)] hover:bg-[#E77759] hover:border-[#E77759] transition-all duration-300 group"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <MessageCircle className="w-4 h-4 text-[#CFB583] group-hover:text-white" />
          <span className="text-xs uppercase tracking-[0.18em] font-semibold hidden sm:inline">
            Atendimento
          </span>
        </a>
      </div>
    </SmoothScrollProvider>
  );
}

