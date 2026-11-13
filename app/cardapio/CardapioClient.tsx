"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Sparkles,
  MessageCircle,
  Utensils,
  X,
  ArrowUpRight,
  ChevronLeft,
  Coffee,
  Wine,
  Sun,
  Flame,
  Check,
} from "lucide-react";
import { Navbar } from "@/components/sections/Navbar";
import {
  ContactAndLocation,
  type SiteConfigData,
} from "@/components/sections/ContactAndLocation";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatBRL, buildWhatsAppLink } from "@/lib/utils";

export interface MenuProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  ingredients?: string | null;
  price: number | null;
  image: string;
  badge?: string | null;
  isFeatured: boolean;
  isAvailable: boolean;
  isDemo: boolean;
  categoryId: string;
}

export interface MenuCategory {
  id: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  description?: string | null;
  order: number;
  active: boolean;
  products: MenuProduct[];
}

interface CardapioClientProps {
  categories: MenuCategory[];
  config: SiteConfigData;
}

function CardapioContent({ categories, config }: CardapioClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("categoria") || "todas";

  const [currentSlug, setCurrentSlug] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDish, setSelectedDish] = useState<
    (MenuProduct & { categoryName: string }) | null
  >(null);

  useEffect(() => {
    const cat = searchParams.get("categoria");
    if (cat) {
      setCurrentSlug(cat);
    }
  }, [searchParams]);

  const activeCategories = useMemo(
    () => categories.filter((c) => c.active),
    [categories]
  );

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return activeCategories
      .filter((cat) => currentSlug === "todas" || cat.slug === currentSlug)
      .map((cat) => ({
        ...cat,
        products: cat.products.filter((prod) => {
          if (!q) return true;
          return (
            prod.name.toLowerCase().includes(q) ||
            prod.description.toLowerCase().includes(q) ||
            (prod.ingredients && prod.ingredients.toLowerCase().includes(q))
          );
        }),
      }))
      .filter((cat) => cat.products.length > 0);
  }, [activeCategories, currentSlug, searchQuery]);

  const totalProductsCount = useMemo(
    () => activeCategories.reduce((acc, c) => acc + c.products.length, 0),
    [activeCategories]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4EC] text-[#211A17] relative bg-grain">
      <Navbar whatsapp={config.whatsapp} instagram={config.instagram} />

      <main className="flex-1 pt-28 lg:pt-36 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          {/* Breadcrumb & Back Link */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-[#38271F]/70 hover:text-[#E77759] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Voltar para o Início</span>
            </Link>
          </div>

          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#EFE5D5] border border-[#CFB583]/60 shadow-sm">
              <Utensils className="w-3.5 h-3.5 text-[#E77759]" />
              <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#38271F]">
                Curadoria Gastronômica Martita
              </span>
            </div>

            <h1 className="font-serif-editorial text-4xl sm:text-6xl lg:text-7xl font-normal text-[#211A17] leading-[1.05]">
              Cardápio Digital{" "}
              <span className="italic font-semibold text-[#E77759]">Martita</span>
            </h1>

            <p className="text-sm sm:text-base text-[#38271F]/80 leading-relaxed max-w-2xl mx-auto">
              Do café da manhã artesanal e brunch sem pressa às massas de almoço,
              porções do mar, confeitaria fina e coquetelaria de gastrobar ao entardecer.
            </p>

            {/* Quick highlights */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#38271F]/75">
              <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-[#CFB583]/40">
                <Coffee className="w-3.5 h-3.5 text-[#E77759]" />
                Cafés &amp; Confeitaria
              </span>
              <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-[#CFB583]/40">
                <Sun className="w-3.5 h-3.5 text-[#CFB583]" />
                Brunch &amp; Almoço
              </span>
              <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1 rounded-full border border-[#CFB583]/40">
                <Wine className="w-3.5 h-3.5 text-[#E77759]" />
                Drinks &amp; Gastrobar
              </span>
            </div>
          </div>

          {/* Search Bar & Category Filter Container */}
          <div className="bg-[#EFE5D5]/80 backdrop-blur-md rounded-[2rem] p-5 sm:p-7 border border-[#CFB583]/50 mb-14 space-y-5 shadow-[0_8px_30px_rgba(33,26,23,0.04)]">
            {/* Search Input Row */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="w-4 h-4 text-[#38271F]/60 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por prato, ingrediente, drink, café ou doce..."
                  className="w-full pl-11 pr-10 py-3 rounded-full bg-[#F8F4EC] border border-[#CFB583]/60 text-sm text-[#211A17] placeholder:text-[#38271F]/50 focus:outline-none focus:border-[#E77759] shadow-inner transition-colors"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#38271F]/60 hover:text-[#E77759]"
                    aria-label="Limpar busca"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#38271F]/80">
                <Sparkles className="w-3.5 h-3.5 text-[#E77759] shrink-0" />
                <span>
                  {totalProductsCount} itens artesanais disponíveis
                </span>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div
              className="flex flex-wrap items-center gap-2 pt-1 border-t border-[#CFB583]/30"
              role="tablist"
              aria-label="Categorias do Cardápio"
            >
              <button
                type="button"
                role="tab"
                aria-selected={currentSlug === "todas"}
                onClick={() => setCurrentSlug("todas")}
                className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer ${
                  currentSlug === "todas"
                    ? "bg-[#211A17] text-[#F8F4EC] shadow-sm"
                    : "bg-[#F8F4EC] text-[#38271F] border border-[#CFB583]/50 hover:border-[#E77759] hover:text-[#E77759]"
                }`}
              >
                Todas ({totalProductsCount})
              </button>

              {activeCategories.map((cat) => {
                const active = currentSlug === cat.slug;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCurrentSlug(cat.slug)}
                    className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer ${
                      active
                        ? "bg-[#E77759] text-white shadow-sm"
                        : "bg-[#F8F4EC] text-[#38271F] border border-[#CFB583]/50 hover:border-[#E77759] hover:text-[#E77759]"
                    }`}
                  >
                    {cat.name} ({cat.products.length})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Sections & Dish Cards */}
          {filteredCategories.length === 0 ? (
            <div className="text-center py-20 px-6 rounded-3xl bg-[#EFE5D5]/60 border border-[#CFB583]/40 max-w-xl mx-auto space-y-4">
              <p className="font-serif-editorial italic text-3xl text-[#211A17]">
                Nenhum item encontrado para “{searchQuery}”.
              </p>
              <p className="text-xs text-[#38271F]/70">
                Tente buscar por termos como "croissant", "café", "picanha", "drink", "ostras" ou "chocolate".
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setCurrentSlug("todas");
                }}
                className="px-6 py-3 rounded-full bg-[#E77759] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#211A17] transition-colors cursor-pointer"
              >
                Ver Todas as Categorias
              </button>
            </div>
          ) : (
            <div className="space-y-20">
              {filteredCategories.map((category, catIdx) => (
                <section
                  key={category.id}
                  id={category.slug}
                  className="space-y-8 scroll-mt-36"
                >
                  {/* Editorial Category Header */}
                  <div className="border-b border-[#CFB583]/60 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] uppercase tracking-[0.28em] text-[#E77759] font-bold">
                          {String(catIdx + 1).padStart(2, "0")} • Martita
                        </span>
                      </div>
                      <h2 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#211A17]">
                        {category.name}
                      </h2>
                    </div>
                    {category.subtitle && (
                      <p className="font-serif-editorial italic text-lg sm:text-xl text-[#38271F]/80 md:text-right max-w-md">
                        {category.subtitle}
                      </p>
                    )}
                  </div>

                  {/* 2-Column Bistro Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {category.products.map((product) => (
                      <article
                        key={product.id}
                        onClick={() =>
                          setSelectedDish({
                            ...product,
                            categoryName: category.name,
                          })
                        }
                        className={`group rounded-2xl bg-white/95 hover:bg-white border border-[#CFB583]/45 hover:border-[#E77759]/70 p-4 sm:p-5 shadow-[0_6px_24px_rgba(33,26,23,0.04)] hover:shadow-[0_16px_40px_rgba(231,119,89,0.14)] transition-all duration-300 flex items-center gap-4 sm:gap-5 cursor-pointer ${
                          !product.isAvailable ? "opacity-55" : ""
                        }`}
                      >
                        {/* Square Thumbnail */}
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 relative border border-[#CFB583]/35 bg-[#EFE5D5]">
                          <SafeImage
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                          />
                          {product.badge && (
                            <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-[0.15em] font-bold bg-[#211A17]/90 text-[#CFB583]">
                              {product.badge}
                            </span>
                          )}
                        </div>

                        {/* Title, Dotted Leader, Price & Description */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-2">
                          <div>
                            <div className="flex items-baseline justify-between gap-2">
                              <h3 className="font-serif-editorial text-xl sm:text-2xl font-semibold text-[#211A17] group-hover:text-[#E77759] transition-colors leading-snug truncate">
                                {product.name}
                              </h3>

                              <span
                                className="hidden sm:block flex-1 border-b border-dotted border-[#CFB583]/70 mx-2"
                                aria-hidden="true"
                              />

                              <div className="shrink-0">
                                {product.price !== null &&
                                product.price !== undefined ? (
                                  <span className="font-serif-editorial italic text-xl sm:text-2xl font-bold text-[#211A17]">
                                    {formatBRL(product.price)}
                                  </span>
                                ) : (
                                  <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-[#38271F]/70 bg-[#EFE5D5] px-2.5 py-1 rounded-full">
                                    Sob consulta
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs sm:text-sm text-[#38271F]/80 leading-relaxed line-clamp-2 mt-1">
                              {product.description}
                            </p>
                          </div>

                          <div className="pt-1.5 flex items-center justify-between gap-2 text-[11px]">
                            <span className="text-[#38271F]/60 italic truncate">
                              {product.ingredients
                                ? product.ingredients
                                : "Preparo artesanal da casa"}
                            </span>

                            <span className="inline-flex items-center gap-1 text-[#E77759] font-semibold uppercase tracking-[0.16em] text-[10px] group-hover:translate-x-0.5 transition-transform shrink-0">
                              <span>Detalhes</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Detail Modal with Direct WhatsApp Order */}
      <AnimatePresence>
        {selectedDish && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/65 backdrop-blur-sm"
            onClick={() => setSelectedDish(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#F8F4EC] rounded-[2rem] border border-[#CFB583]/60 shadow-[0_25px_80px_rgba(0,0,0,0.35)] max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]"
            >
              {/* Modal Image Hero */}
              <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0 bg-[#EFE5D5]">
                <SafeImage
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  className="w-full h-full"
                />
                <button
                  type="button"
                  onClick={() => setSelectedDish(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#211A17]/80 text-[#F8F4EC] hover:bg-[#E77759] flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Fechar modal"
                >
                  <X className="w-5 h-5" />
                </button>

                {selectedDish.badge && (
                  <span className="absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold bg-[#E77759] text-white shadow-md">
                    {selectedDish.badge}
                  </span>
                )}
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-5 overflow-y-auto flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-[0.28em] text-[#CFB583] font-bold">
                      {selectedDish.categoryName}
                    </span>
                    <h3 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#211A17]">
                      {selectedDish.name}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    {selectedDish.price !== null &&
                    selectedDish.price !== undefined ? (
                      <p className="font-serif-editorial italic text-3xl font-bold text-[#E77759]">
                        {formatBRL(selectedDish.price)}
                      </p>
                    ) : (
                      <span className="text-xs uppercase tracking-[0.16em] font-semibold text-[#38271F]/70 bg-[#EFE5D5] px-3 py-1.5 rounded-full">
                        Preço sob consulta
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#CFB583]/30 pt-4">
                  <h4 className="text-[11px] uppercase tracking-[0.22em] font-bold text-[#38271F]/75">
                    Descrição do Prato
                  </h4>
                  <p className="text-sm sm:text-base text-[#38271F]/90 leading-relaxed">
                    {selectedDish.description}
                  </p>
                </div>

                {selectedDish.ingredients && (
                  <div className="space-y-2 border-t border-[#CFB583]/30 pt-4">
                    <h4 className="text-[11px] uppercase tracking-[0.22em] font-bold text-[#38271F]/75">
                      Ingredientes Selecionados
                    </h4>
                    <p className="text-xs sm:text-sm text-[#38271F]/80 italic leading-relaxed">
                      {selectedDish.ingredients}
                    </p>
                  </div>
                )}

                {/* WhatsApp Action */}
                <div className="pt-4 border-t border-[#CFB583]/40 flex flex-col sm:flex-row items-center gap-3">
                  <a
                    href={buildWhatsAppLink(
                      config.whatsapp,
                      `Olá! Gostaria de pedir ou saber mais sobre o prato "${selectedDish.name}" do cardápio Martita.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-full bg-[#E77759] text-white text-xs uppercase tracking-[0.22em] font-semibold hover:bg-[#211A17] transition-all duration-300 shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Pedir / Reservar no WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedDish(null)}
                    className="w-full sm:w-auto px-6 py-4 rounded-full border border-[#38271F]/30 text-[#38271F] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#EFE5D5] transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating WhatsApp Concierge Button */}
      <a
        href={buildWhatsAppLink(
          config.whatsapp,
          "Olá! Estou visualizando o cardápio da Martita Café & Gastrobar e gostaria de atendimento."
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

      {/* Footer & Location */}
      <ContactAndLocation config={config} />
    </div>
  );
}

export function CardapioClient(props: CardapioClientProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8F4EC] text-[#211A17]">
          <p className="font-serif-editorial italic text-2xl animate-pulse">
            Carregando Cardápio Martita...
          </p>
        </div>
      }
    >
      <CardapioContent {...props} />
    </Suspense>
  );
}

