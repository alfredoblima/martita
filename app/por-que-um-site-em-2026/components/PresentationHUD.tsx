"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Sparkles, 
  Sliders, 
  BarChart3, 
  Bot, 
  Layers, 
  TrendingUp, 
  Globe 
} from "lucide-react";

interface SectionAnchor {
  id: string;
  shortLabel: string;
  fullTitle: string;
  icon?: any;
}

const PRESENTATION_SECTIONS: SectionAnchor[] = [
  { id: "hero", shortLabel: "Abertura", fullTitle: "01. O Próximo Cliente", icon: Sparkles },
  { id: "jornada-consumidor", shortLabel: "Jornada", fullTitle: "02. A Nova Jornada", icon: Compass },
  { id: "instagram-vs-ecossistema", shortLabel: "Instagram", fullTitle: "03. Instagram vs Ecossistema", icon: Globe },
  { id: "sempre-aberto", shortLabel: "24h Aberto", fullTitle: "04. Sempre Aberto", icon: Layers },
  { id: "pilares-comerciais", shortLabel: "6 Pilares", fullTitle: "05. Pilares Comerciais", icon: Layers },
  { id: "google-search", shortLabel: "Google & SEO", fullTitle: "06. Google & SEO Local", icon: Globe },
  { id: "fronteira-ia", shortLabel: "IAs 2026", fullTitle: "07. Busca por Inteligência Artificial", icon: Bot },
  { id: "momentos-martita", shortLabel: "7 Ocasiões", fullTitle: "08. Oportunidades Martita", icon: Sparkles },
  { id: "funil-conversao", shortLabel: "Funil Integrado", fullTitle: "09. Arquitetura de Conversão", icon: TrendingUp },
  { id: "simulador-roi", shortLabel: "Simulador ROI", fullTitle: "10. Impacto Financeiro", icon: Sliders },
  { id: "analytics-dashboard", shortLabel: "Métricas", fullTitle: "11. Painel de Inteligência", icon: BarChart3 },
  { id: "com-vs-sem-site", shortLabel: "Comparativo", fullTitle: "12. Com vs Sem Site", icon: Layers },
  { id: "entregaveis", shortLabel: "Entregáveis", fullTitle: "13. Escopo & Roadmap", icon: Layers },
  { id: "decisao", shortLabel: "Decisão", fullTitle: "14. Parceria Oficial", icon: Sparkles },
];

export function PresentationHUD() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Monitor scroll progress and current active section
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100)));
      }

      // Find active section
      const scrollPosition = currentScroll + window.innerHeight * 0.35;
      for (let i = PRESENTATION_SECTIONS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(PRESENTATION_SECTIONS[i].id);
        if (sec && sec.offsetTop <= scrollPosition) {
          setCurrentSectionIndex(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const jumpToSection = (index: number) => {
    if (index >= 0 && index < PRESENTATION_SECTIONS.length) {
      const target = document.getElementById(PRESENTATION_SECTIONS[index].id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        setCurrentSectionIndex(index);
      }
    }
  };

  const nextSection = () => {
    if (currentSectionIndex < PRESENTATION_SECTIONS.length - 1) {
      jumpToSection(currentSectionIndex + 1);
    }
  };

  const prevSection = () => {
    if (currentSectionIndex > 0) {
      jumpToSection(currentSectionIndex - 1);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none select-none">
      {/* Menu Expandido de Tópicos */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto mb-3 p-4 rounded-2xl bg-brand-dark/95 border border-brand-gold/30 backdrop-blur-xl shadow-2xl text-brand-cream max-w-sm w-80 max-h-[70vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-t-0 border-b border-brand-cream/10">
              <span className="text-xs font-mono font-bold text-brand-gold uppercase tracking-wider">
                Roteiro da Apresentação
              </span>
              <span className="text-[11px] text-brand-cream/60 font-mono">
                {currentSectionIndex + 1} / {PRESENTATION_SECTIONS.length}
              </span>
            </div>

            <div className="space-y-1">
              {PRESENTATION_SECTIONS.map((sec, idx) => {
                const isActive = currentSectionIndex === idx;
                return (
                  <button
                    key={sec.id}
                    onClick={() => {
                      jumpToSection(idx);
                      setIsExpanded(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-sans flex items-center justify-between transition-colors ${
                      isActive
                        ? "bg-brand-gold text-brand-dark font-semibold shadow-sm"
                        : "text-brand-cream/70 hover:text-brand-cream hover:bg-brand-cream/10"
                    }`}
                  >
                    <span className="truncate">{sec.fullTitle}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-dark" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating HUD Bar */}
      <div className="pointer-events-auto flex items-center gap-2 p-2 rounded-full bg-brand-dark/90 border border-brand-gold/40 shadow-2xl backdrop-blur-md text-brand-cream">
        {/* Previous Button */}
        <button
          onClick={prevSection}
          disabled={currentSectionIndex === 0}
          title="Seção anterior"
          className="p-2 rounded-full hover:bg-brand-cream/10 disabled:opacity-30 disabled:pointer-events-none transition-colors text-brand-cream"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Current Section Pill with Toggle */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-cream/10 hover:bg-brand-cream/15 text-xs font-mono text-brand-gold transition-colors"
        >
          <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
          <span className="max-w-[130px] truncate">
            {PRESENTATION_SECTIONS[currentSectionIndex].shortLabel}
          </span>
          {isExpanded ? (
            <ChevronDown className="w-3.5 h-3.5 text-brand-cream/70" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 text-brand-cream/70" />
          )}
        </button>

        {/* Next Button */}
        <button
          onClick={nextSection}
          disabled={currentSectionIndex === PRESENTATION_SECTIONS.length - 1}
          title="Próxima seção"
          className="p-2 rounded-full hover:bg-brand-cream/10 disabled:opacity-30 disabled:pointer-events-none transition-colors text-brand-cream"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Mini progress bar ring or indicator */}
        <div className="px-2 border-l border-brand-cream/15 flex items-center gap-1.5 text-[11px] font-mono text-brand-cream/60">
          <span>{Math.round(scrollProgress)}%</span>
        </div>
      </div>
    </div>
  );
}

