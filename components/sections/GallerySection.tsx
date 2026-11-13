"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Expand, ChevronLeft, ChevronRight, X } from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

export interface GalleryItemData {
  id: string;
  title: string;
  caption?: string | null;
  category: string;
  image: string;
  aspect: string;
  order: number;
  active: boolean;
}

const GALLERY_CATEGORIES = [
  "Todas",
  "Gastronomia",
  "Cafés",
  "Drinks",
  "Sobremesas",
  "Ambiente",
  "Experiências",
];

interface GallerySectionProps {
  items: GalleryItemData[];
}

// Deterministic Tetris bento packing for 12 items (perfect 24-cell coverage without gaps)
function getTetrisSpan(item: GalleryItemData, idx: number, total: number) {
  if (total === 12) {
    switch (idx) {
      case 0:
        return "sm:col-span-2 sm:row-span-2 min-h-[34rem]"; // Hero Big Square 2x2
      case 1:
        return "sm:col-span-2 sm:row-span-1 min-h-[16rem]"; // Horizontal 2x1
      case 2:
        return "sm:col-span-1 sm:row-span-2 min-h-[34rem]"; // Vertical Portrait 1x2
      case 3:
        return "sm:col-span-1 sm:row-span-2 min-h-[34rem]"; // Vertical Portrait 1x2
      case 4:
        return "sm:col-span-1 sm:row-span-1 min-h-[16rem]"; // Square 1x1
      case 5:
        return "sm:col-span-1 sm:row-span-2 min-h-[34rem]"; // Vertical Portrait 1x2
      case 6:
        return "sm:col-span-2 sm:row-span-1 min-h-[16rem]"; // Horizontal 2x1
      case 7:
        return "sm:col-span-1 sm:row-span-1 min-h-[16rem]"; // Square 1x1
      case 8:
        return "sm:col-span-1 sm:row-span-2 min-h-[34rem]"; // Vertical Portrait 1x2
      case 9:
        return "sm:col-span-2 sm:row-span-1 min-h-[16rem]"; // Horizontal 2x1
      case 10:
        return "sm:col-span-1 sm:row-span-2 min-h-[34rem]"; // Vertical Portrait 1x2
      case 11:
        return "sm:col-span-2 sm:row-span-1 min-h-[16rem]"; // Horizontal 2x1
      default:
        return "sm:col-span-1 sm:row-span-1 min-h-[16rem]";
    }
  }

  // When filtered by specific category:
  if (item.aspect === "wide") {
    return "sm:col-span-2 sm:row-span-1 min-h-[17rem]";
  }
  if (item.aspect === "portrait") {
    return "sm:col-span-1 sm:row-span-2 min-h-[34rem]";
  }
  if (item.aspect === "landscape") {
    return "sm:col-span-2 sm:row-span-1 min-h-[17rem]";
  }
  return "sm:col-span-1 sm:row-span-1 min-h-[17rem]";
}

export function GallerySection({ items }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activeItems = useMemo(() => {
    const visible = items.filter((item) => item.active);
    if (selectedCategory === "Todas") return visible;
    return visible.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex(
      (lightboxIndex - 1 + activeItems.length) % activeItems.length
    );
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % activeItems.length);
  };

  return (
    <section
      id="galeria"
      className="relative py-24 lg:py-36 bg-[#F8F4EC] text-[#211A17] overflow-hidden bg-grain"
    >
      <div className="max-w-[94rem] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 w-full">
        {/* Header & Category Filter */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE5D5] border border-[#CFB583]/60">
              <Camera className="w-3.5 h-3.5 text-[#E77759]" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#38271F]">
                Olhar Editorial
              </span>
            </div>
            <h2 className="font-serif-editorial text-4xl sm:text-6xl font-normal text-[#211A17]">
              Galeria{" "}
              <span className="italic font-semibold text-[#E77759]">
                Imersiva
              </span>
            </h2>
            <p className="text-sm sm:text-base text-[#38271F]/80">
              Cada ângulo revela nossa paixão por texturas, aromas, luz natural e encontros ao redor da mesa.
            </p>
          </div>

          {/* Visual Category Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {GALLERY_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setLightboxIndex(null);
                  }}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#211A17] text-[#F8F4EC] shadow-md"
                      : "bg-[#EFE5D5] text-[#38271F] hover:bg-[#CFB583]/45"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Full-Width Immersive Tetris Editorial Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[16rem] lg:auto-rows-[17.5rem] grid-flow-dense gap-6 lg:gap-7 items-stretch w-full">
          {activeItems.map((item, idx) => {
            const spanClass = getTetrisSpan(item, idx, activeItems.length);
            return (
              <div
                key={item.id}
                onClick={() => setLightboxIndex(idx)}
                className={`group relative rounded-[2rem] overflow-hidden border border-[#CFB583]/45 shadow-[0_12px_36px_rgba(33,26,23,0.08)] hover:shadow-[0_24px_55px_rgba(33,26,23,0.2)] cursor-pointer transition-all duration-500 flex flex-col justify-end ${spanClass}`}
              >
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#211A17]/90 via-[#211A17]/25 to-transparent opacity-75 group-hover:opacity-95 transition-opacity duration-300" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.22em] font-semibold bg-[#211A17]/85 backdrop-blur-sm text-[#CFB583] border border-[#CFB583]/35 shadow-sm">
                    {item.category}
                  </span>
                  <span className="w-9 h-9 rounded-full bg-[#F8F4EC]/90 text-[#211A17] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-md group-hover:scale-105">
                    <Expand className="w-4 h-4 text-[#E77759]" />
                  </span>
                </div>

                <div className="absolute bottom-5 left-5 right-5 text-[#F8F4EC] z-10 space-y-1">
                  <h3 className="font-serif-editorial italic text-2xl sm:text-3xl leading-tight text-white drop-shadow-sm">
                    {item.title}
                  </h3>
                  {item.caption && (
                    <p className="text-xs text-[#EFE5D5]/85 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && activeItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-50 bg-[#16110F]/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 z-30 w-11 h-11 rounded-full bg-white/10 text-[#F8F4EC] hover:bg-[#E77759] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Fechar galeria"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Prev Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-4 sm:left-8 z-30 w-12 h-12 rounded-full bg-white/10 text-[#F8F4EC] hover:bg-[#E77759] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-4 sm:right-8 z-30 w-12 h-12 rounded-full bg-white/10 text-[#F8F4EC] hover:bg-[#E77759] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Próxima foto"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <motion.div
              key={activeItems[lightboxIndex].id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-5xl w-full flex flex-col items-center space-y-5"
            >
              <div className="relative w-full max-h-[75vh] aspect-[16/10] rounded-3xl overflow-hidden border-2 border-[#CFB583]/45 shadow-2xl bg-[#211A17]">
                <SafeImage
                  src={activeItems[lightboxIndex].image}
                  alt={activeItems[lightboxIndex].title}
                  className="w-full h-full"
                />
              </div>

              <div className="text-center text-[#F8F4EC] max-w-2xl space-y-1">
                <span className="text-[10px] uppercase tracking-[0.28em] text-[#E77759] font-bold">
                  {activeItems[lightboxIndex].category} • {lightboxIndex + 1} de{" "}
                  {activeItems.length}
                </span>
                <h3 className="font-serif-editorial italic text-3xl">
                  {activeItems[lightboxIndex].title}
                </h3>
                {activeItems[lightboxIndex].caption && (
                  <p className="text-sm text-[#EFE5D5]/80">
                    {activeItems[lightboxIndex].caption}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

