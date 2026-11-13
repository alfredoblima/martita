"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Sparkles,
  MessageCircle,
  Utensils,
  X,
  ArrowUpRight,
} from "lucide-react";
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

interface DigitalMenuSectionProps {
  categories: MenuCategory[];
  whatsapp?: string;
  selectedCategorySlug?: string;
  onSelectCategorySlug?: (slug: string) => void;
}

export function DigitalMenuSection({
  categories,
  whatsapp,
  selectedCategorySlug,
  onSelectCategorySlug,
}: DigitalMenuSectionProps) {
  const activeCategories = useMemo(
    () => categories.filter((c) => c.active),
    [categories]
  );

  const [internalCatSlug, setInternalCatSlug] = useState<string>("todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDish, setSelectedDish] = useState<
    (MenuProduct & { categoryName: string }) | null
  >(null);

  const currentSlug = selectedCategorySlug || internalCatSlug;

  const handleCategoryChange = (slug: string) => {
    setInternalCatSlug(slug);
    if (onSelectCategorySlug) {
      onSelectCategorySlug(slug);
    }
  };

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

  return (
    <section
      id="cardapio"
      className="relative py-24 lg:py-32 bg-[#F8F4EC] text-[#211A17] bg-grain"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Editorial Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE5D5] border border-[#CFB583]/60">
            <Utensils className="w-3.5 h-3.5 text-[#E77759]" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-semibold text-[#38271F]">
              Gastronomia Autoral • Do Café ao Gastrobar
            </span>
          </div>

          <h2 className="font-serif-editorial text-4xl sm:text-6xl font-normal text-[#211A17]">
            Cardápio Digital{" "}
            <span className="italic font-semibold text-[#E77759]">Martita</span>
          </h2>

          <p className="text-sm sm:text-base text-[#38271F]/75 leading-relaxed">
            Receitas artesanais preparadas com ingredientes selecionados para cada momento do seu dia.
          </p>
        </div>

        {/* Harmonious Filter & Search Bar (Non-intrusive, well-proportioned) */}
        <div className="bg-[#EFE5D5]/65 rounded-[2rem] p-5 sm:p-7 border border-[#CFB583]/45 mb-16 space-y-5">
          {/* Top Row: Search Input & Subtle Info */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#38271F]/60 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar prato, ingrediente, bebida ou sobremesa..."
                className="w-full pl-11 pr-9 py-2.5 rounded-full bg-[#F8F4EC] border border-[#CFB583]/55 text-sm text-[#211A17] placeholder:text-[#38271F]/50 focus:outline-none focus:border-[#E77759] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#38271F]/60 hover:text-[#E77759]"
                  aria-label="Limpar busca"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-[#38271F]/75">
              <Sparkles className="w-3.5 h-3.5 text-[#E77759] shrink-0" />
              <span>
                Clique em qualquer prato para ampliar a fotografia e ver ingredientes
              </span>
            </div>
          </div>

          {/* Wrapped Harmonious Category Buttons (Never broken or cut off by scrollbars) */}
          <div
            className="flex flex-wrap items-center gap-2 pt-1"
            role="tablist"
            aria-label="Categorias do Cardápio"
          >
            <button
              type="button"
              role="tab"
              aria-selected={currentSlug === "todas"}
              onClick={() => handleCategoryChange("todas")}
              className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer ${
                currentSlug === "todas"
                  ? "bg-[#211A17] text-[#F8F4EC] shadow-sm"
                  : "bg-[#F8F4EC] text-[#38271F] border border-[#CFB583]/45 hover:border-[#E77759] hover:text-[#E77759]"
              }`}
            >
              Todas ({activeCategories.reduce((acc, c) => acc + c.products.length, 0)})
            </button>

            {activeCategories.map((cat) => {
              const active = currentSlug === cat.slug;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold transition-all cursor-pointer ${
                    active
                      ? "bg-[#E77759] text-white shadow-sm"
                      : "bg-[#F8F4EC] text-[#38271F] border border-[#CFB583]/45 hover:border-[#E77759] hover:text-[#E77759]"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Sections & Dishes */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 px-6 rounded-3xl bg-[#EFE5D5]/60 border border-[#CFB583]/40 max-w-xl mx-auto space-y-4">
            <p className="font-serif-editorial italic text-2xl text-[#211A17]">
              Nenhum item encontrado para “{searchQuery}”.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                handleCategoryChange("todas");
              }}
              className="px-6 py-2.5 rounded-full bg-[#E77759] text-white text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer"
            >
              Ver Cardápio Completo
            </button>
          </div>
        ) : (
          <div className="space-y-20">
            {filteredCategories.map((category, catIdx) => (
              <div key={category.id} className="space-y-8">
                {/* Refined Editorial Category Header */}
                <div className="border-b border-[#CFB583]/50 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-[10px] uppercase tracking-[0.28em] text-[#E77759] font-bold">
                        0{catIdx + 1} • Martita Menu
                      </span>
                    </div>
                    <h3 className="font-serif-editorial text-3xl sm:text-5xl font-normal text-[#211A17]">
                      {category.name}
                    </h3>
                  </div>
                  {category.subtitle && (
                    <p className="font-serif-editorial italic text-lg sm:text-xl text-[#38271F]/80 md:text-right max-w-md">
                      {category.subtitle}
                    </p>
                  )}
                </div>

                {/* Harmonious 2-Column Editorial Bistro Menu Grid */}
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
                      className={`group rounded-2xl bg-white/90 hover:bg-white border border-[#CFB583]/40 hover:border-[#E77759]/60 p-4 sm:p-5 shadow-[0_6px_24px_rgba(33,26,23,0.04)] hover:shadow-[0_14px_36px_rgba(231,119,89,0.12)] transition-all duration-300 flex items-center gap-4 sm:gap-5 cursor-pointer ${
                        !product.isAvailable ? "opacity-55" : ""
                      }`}
                    >
                      {/* Fixed-Proportion Square Dish Thumbnail */}
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

                      {/* Balanced Dish Typography & Dotted Price Line */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-full space-y-2">
                        <div>
                          {/* Title + Dotted Leader + Price */}
                          <div className="flex items-baseline justify-between gap-2">
                            <h4 className="font-serif-editorial text-xl sm:text-2xl font-semibold text-[#211A17] group-hover:text-[#E77759] transition-colors leading-snug truncate">
                              {product.name}
                            </h4>

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

                          {/* Description */}
                          <p className="text-xs sm:text-sm text-[#38271F]/80 leading-relaxed line-clamp-2 mt-1">
                            {product.description}
                          </p>
                        </div>

                        {/* Subtle Bottom Line: Ingredients & Action */}
                        <div className="pt-1.5 flex items-center justify-between gap-2 text-[11px]">
                          <span className="text-[#38271F]/60 italic truncate">
                            {product.ingredients
                              ? product.ingredients
                              : "Preparo artesanal Martita"}
                          </span>

                          <span className="shrink-0 inline-flex items-center gap-1 uppercase tracking-[0.16em] text-[10px] font-bold text-[#E77759] group-hover:translate-x-0.5 transition-transform">
                            <span>Ver</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedDish && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDish(null)}
            className="fixed inset-0 z-50 bg-[#211A17]/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.94, opacity: 0, y: 16 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-[2rem] overflow-hidden bg-[#F8F4EC] text-[#211A17] border-2 border-[#CFB583] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setSelectedDish(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-[#211A17]/85 text-[#F8F4EC] flex items-center justify-center hover:bg-[#E77759] transition-colors cursor-pointer"
                aria-label="Fechar detalhes"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="h-72 sm:h-80 w-full relative">
                <SafeImage
                  src={selectedDish.image}
                  alt={selectedDish.name}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#211A17]/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4 text-[#F8F4EC]">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] uppercase tracking-[0.22em] bg-[#E77759] text-white font-bold">
                      {selectedDish.categoryName}
                    </span>
                    <h3 className="font-serif-editorial text-3xl sm:text-4xl mt-2">
                      {selectedDish.name}
                    </h3>
                  </div>
                  {selectedDish.price !== null && (
                    <span className="shrink-0 px-4 py-1.5 rounded-full bg-[#F8F4EC] text-[#211A17] font-serif-editorial italic text-2xl font-bold">
                      {formatBRL(selectedDish.price)}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <p className="text-sm sm:text-base text-[#38271F] leading-relaxed">
                  {selectedDish.description}
                </p>

                {selectedDish.ingredients && (
                  <div className="p-4 rounded-2xl bg-[#EFE5D5] border border-[#CFB583]/45">
                    <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#E77759] block mb-1">
                      Ingredientes & Composição
                    </span>
                    <p className="text-xs sm:text-sm text-[#211A17]">
                      {selectedDish.ingredients}
                    </p>
                  </div>
                )}

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={buildWhatsAppLink(
                      whatsapp,
                      `Olá! Vi o prato "${selectedDish.name}" no cardápio digital da Martita e gostaria de mais informações.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#E77759] text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#211A17] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Pedir Informações via WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedDish(null)}
                    className="px-5 py-3 rounded-full border border-[#38271F]/30 text-xs uppercase tracking-[0.18em] font-semibold text-[#38271F] hover:bg-[#EFE5D5] cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
