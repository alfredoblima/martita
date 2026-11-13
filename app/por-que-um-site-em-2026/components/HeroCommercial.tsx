"use client";

import { motion } from "framer-motion";
import { ArrowDown, Sparkles, Compass, ShieldCheck, TrendingUp, ChevronRight } from "lucide-react";
import Image from "next/image";

interface HeroCommercialProps {
  onStartPresentation?: () => void;
}

export function HeroCommercial({ onStartPresentation }: HeroCommercialProps) {
  const scrollToNext = () => {
    const nextSection = document.getElementById("jornada-consumidor");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-brand-dark text-brand-cream pt-24 pb-16">
      {/* Background imagery with subtle atmospheric gradient */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/martita/IMG_6214.jpeg"
          alt="Martita Café e Gastrobar ambiente"
          fill
          priority
          className="object-cover object-center opacity-25 scale-105 filter brightness-75 contrast-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/85 to-brand-dark/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-gold/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Badge superior */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-8 shadow-inner backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
          <span>Martita Café & Gastrobar • Estratégia de Presença Digital 2026</span>
        </motion.div>

        {/* Título Principal */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: "easeOut" }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-7xl font-normal tracking-tight text-brand-cream max-w-5xl leading-[1.08] mb-8"
        >
          O próximo cliente pode estar procurando você{" "}
          <span className="italic font-serif text-brand-gold relative inline-block">
            agora.
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-gold to-transparent origin-left"
            />
          </span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
          className="text-base sm:text-xl md:text-2xl text-brand-cream/80 font-sans font-light max-w-3xl leading-relaxed mb-12"
        >
          Em 2026, não basta oferecer uma experiência extraordinária no salão. É preciso ser encontrado com clareza, velocidade e autoridade por quem ainda não conhece a sua marca.
        </motion.p>

        {/* CTA e atalhos da apresentação */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <button
            onClick={scrollToNext}
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-brand-gold hover:bg-brand-gold/90 text-brand-dark font-sans font-semibold text-base transition-all duration-300 shadow-lg shadow-brand-gold/20 hover:shadow-brand-gold/30 hover:scale-[1.02] flex items-center justify-center gap-3 group"
          >
            <span>Iniciar Apresentação Comercial</span>
            <ChevronRight className="w-5 h-5 text-brand-dark group-hover:translate-x-1 transition-transform" />
          </button>

          <a
            href="#simulador-roi"
            className="w-full sm:w-auto px-6 py-4 rounded-full bg-brand-dark/60 hover:bg-brand-cream/10 border border-brand-cream/20 hover:border-brand-gold/40 text-brand-cream font-sans font-medium text-sm sm:text-base transition-all duration-300 flex items-center justify-center gap-2.5 backdrop-blur-sm"
          >
            <TrendingUp className="w-4 h-4 text-brand-gold" />
            <span>Ver Simulador de Impacto Financeiro</span>
          </a>
        </motion.div>

        {/* 3 micro destaques do valor executivo */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-16 pt-12 border-t border-brand-cream/10 w-full max-w-4xl text-left"
        >
          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-brand-gold/10 border border-brand-gold/20 text-brand-gold shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif text-base text-brand-cream font-medium">Jornada do Consumidor</p>
              <p className="text-xs text-brand-cream/60 font-sans mt-0.5">82% decidem antes de sair de casa através de busca e fotos reais.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-brand-gold/10 border border-brand-gold/20 text-brand-gold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif text-base text-brand-cream font-medium">Ativo Digital Próprio</p>
              <p className="text-xs text-brand-cream/60 font-sans mt-0.5">Independência do algoritmo do Instagram e controle 100% da marca.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-brand-gold/10 border border-brand-gold/20 text-brand-gold shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="font-serif text-base text-brand-cream font-medium">Conversão 24 Horas</p>
              <p className="text-xs text-brand-cream/60 font-sans mt-0.5">Cardápio vivo, localização e reservas diretas no WhatsApp.</p>
            </div>
          </div>
        </motion.div>

        {/* Indicador de rolagem */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-14 flex flex-col items-center gap-2 cursor-pointer text-brand-cream/50 hover:text-brand-gold transition-colors"
          onClick={scrollToNext}
        >
          <span className="text-[11px] uppercase tracking-widest font-mono">Role para explorar</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-brand-gold" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

