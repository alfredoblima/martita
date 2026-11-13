"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Share2, MessageCircle, Sparkles, Lock, Check } from "lucide-react";
import { MartitaLogo } from "@/components/ui/MartitaLogo";
import { buildWhatsAppLink } from "@/lib/utils";

interface NavbarProps {
  whatsapp?: string;
  instagram?: string;
}

const navLinks = [
  { label: "Início", href: "/#topo" },
  { label: "Nossa Essência", href: "/#essencia" },
  { label: "Queridinhos", href: "/#destaques" },
  { label: "Gastrobar", href: "/#gastrobar" },
  { label: "Galeria", href: "/#galeria" },
  { label: "Contato", href: "/#contato" },
];

export function Navbar({ whatsapp }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: "Martita — Café & Gastrobar",
      text: "Um lugar para saborear cada momento. Do primeiro café da manhã ao último drink da noite.",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopiedShare(true);
        setTimeout(() => setCopiedShare(false), 2500);
      }
    } catch {
      // User dismissed share dialog
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "py-2.5" : "py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div
            className={`flex items-center justify-between gap-4 rounded-full px-5 sm:px-7 transition-all duration-300 ${
              scrolled
                ? "h-16 bg-[#F8F4EC]/95 backdrop-blur-xl border border-[#CFB583]/45 shadow-[0_12px_36px_rgba(33,26,23,0.08)]"
                : "h-18 bg-[#F8F4EC]/85 backdrop-blur-md border border-[#CFB583]/30 shadow-[0_6px_24px_rgba(33,26,23,0.04)]"
            }`}
          >
            {/* Brand Logo — Fixed height, never changes size on scroll */}
            <a
              href="#topo"
              className="group focus:outline-none shrink-0 flex items-center"
              aria-label="Martita Café & Gastrobar - Início"
            >
              <MartitaLogo size="sm" showTagline={false} />
            </a>

            {/* Desktop Navigation — Harmonious Editorial Links */}
            <nav
              className="hidden xl:flex items-center gap-6"
              aria-label="Navegação Principal"
            >
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="relative whitespace-nowrap text-[11px] uppercase tracking-[0.22em] font-semibold text-[#38271F]/85 hover:text-[#E77759] transition-colors py-1.5 group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[1.5px] bg-[#E77759] transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden sm:flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handleShare}
                title="Compartilhar experiência"
                className="w-9 h-9 rounded-full border border-[#CFB583]/45 text-[#38271F] hover:border-[#E77759] hover:text-[#E77759] flex items-center justify-center transition-all duration-200 bg-white/70 cursor-pointer"
                aria-label="Compartilhar página"
              >
                {copiedShare ? (
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
              </button>

              <Link
                href="/cardapio"
                className="whitespace-nowrap px-5 py-2.5 rounded-full text-[11px] uppercase tracking-[0.18em] font-semibold bg-[#211A17] text-[#F8F4EC] hover:bg-[#E77759] hover:text-white transition-all duration-300"
              >
                Cardápio
              </Link>

              <a
                href={buildWhatsAppLink(
                  whatsapp,
                  "Olá! Gostaria de saber mais sobre a experiência Martita Café & Gastrobar."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="whitespace-nowrap inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[11px] uppercase tracking-[0.16em] font-semibold bg-[#EFE5D5] text-[#211A17] border border-[#CFB583]/60 hover:bg-[#CFB583] transition-all duration-300"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#E77759]" />
                <span>WhatsApp</span>
              </a>

              <Link
                href="/admin"
                title="Painel Administrativo"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#38271F]/55 hover:text-[#E77759] hover:bg-[#EFE5D5] transition-colors"
                aria-label="Acesso Administrativo"
              >
                <Lock className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Mobile Menu Trigger */}
            <div className="flex items-center gap-2 xl:hidden">
              <button
                type="button"
                onClick={handleShare}
                className="w-9 h-9 rounded-full border border-[#CFB583]/45 text-[#38271F] bg-white/70 flex items-center justify-center sm:hidden"
                aria-label="Compartilhar página"
              >
                {copiedShare ? (
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="w-10 h-10 rounded-full bg-[#211A17] text-[#F8F4EC] hover:bg-[#E77759] flex items-center justify-center transition-colors cursor-pointer"
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-[#211A17] text-[#F8F4EC] pt-24 pb-10 px-6 flex flex-col justify-between overflow-y-auto xl:hidden"
          >
            <div className="space-y-2 max-w-lg mx-auto w-full">
              <p className="text-[10px] uppercase tracking-[0.35em] text-[#CFB583] mb-4 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[#E77759]" />
                Navegação Martita
              </p>
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-3 text-2xl sm:text-3xl font-serif-editorial italic text-[#F8F4EC] hover:text-[#E77759] border-b border-[#CFB583]/15 transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="pt-8 space-y-4 max-w-lg mx-auto w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href="/cardapio"
                  onClick={() => setMobileOpen(false)}
                  className="w-full py-3.5 rounded-full text-center text-xs uppercase tracking-[0.2em] font-semibold bg-[#E77759] text-white"
                >
                  Explorar Cardápio
                </Link>
                <a
                  href={buildWhatsAppLink(
                    whatsapp,
                    "Olá! Gostaria de falar com a Martita Café & Gastrobar."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-full text-center text-xs uppercase tracking-[0.2em] font-semibold border border-[#CFB583] text-[#CFB583]"
                >
                  Falar no WhatsApp
                </a>
              </div>
              <div className="flex items-center justify-between pt-4 text-xs text-[#CFB583]/70">
                <span>Martita — Café & Gastrobar</span>
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center gap-1.5 text-[#CFB583] hover:text-[#E77759]"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Painel Admin
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
