"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Globe,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileCode,
  Map,
  Compass,
} from "lucide-react";

interface SearchScenario {
  id: string;
  query: string;
  label: string;
  headline: string;
  snippet: string;
  sitelinks: { label: string; href: string }[];
  intent: "Local" | "Descoberta" | "Gastrobar" | "Sobremesas";
}

const SEARCH_SCENARIOS: SearchScenario[] = [
  {
    id: "brunch",
    query: "café e brunch em canasvieiras florianópolis",
    label: "Café & Brunch",
    headline: "Martita Café & Gastrobar — Experiência do Café ao Brunch em Canasvieiras",
    snippet:
      "Café da manhã artesanal, croissants folhados na manteiga, ovos mexidos com bacon e abacate, cafés especiais 100% arábica e sucos naturais em ambiente acolhedor.",
    sitelinks: [
      { label: "Ver Cardápio Digital", href: "/cardapio" },
      { label: "Croissants & Pães", href: "/cardapio?categoria=cafe-da-manha" },
      { label: "Horários & Endereço", href: "#" },
      { label: "Falar no WhatsApp", href: "#" },
    ],
    intent: "Local",
  },
  {
    id: "gastrobar",
    query: "gastrobar drinks e jantar canasvieiras",
    label: "Gastrobar & Noite",
    headline: "Martita Gastrobar — Drinks Autorais, Aperol Spritz & Pratos para Compartilhar",
    snippet:
      "Ao entardecer, viva o gastrobar: Aperol Spritz, chopp gelado, lula à milanesa, empanadas argentinas, hambúrgueres artesanais e ambiente intimista em Canasvieiras.",
    sitelinks: [
      { label: "Carta de Drinks", href: "/cardapio?categoria=drinks" },
      { label: "Petiscos & Porções", href: "/cardapio?categoria=entradas-e-petiscos" },
      { label: "Pratos & Almoço", href: "/cardapio?categoria=almoco" },
      { label: "Localização no Mapa", href: "#" },
    ],
    intent: "Gastrobar",
  },
  {
    id: "especiais",
    query: "onde tomar café especial florianópolis norte da ilha",
    label: "Cafés Especiais",
    headline: "Cafés Especiais & Confeitaria Fina — Martita Florianópolis",
    snippet:
      "Baristas especializados, extração V60 filtrada na mesa, espresso duplo com crema densa, cappuccinos italianos e doces finos com pistache e Nutella.",
    sitelinks: [
      { label: "Cafés Filtrados & Espresso", href: "/cardapio?categoria=cafes-especiais" },
      { label: "Sobremesas & Tortas", href: "/cardapio?categoria=sobremesas" },
      { label: "Galeria de Fotos", href: "#" },
      { label: "Avaliações no Google", href: "#" },
    ],
    intent: "Descoberta",
  },
  {
    id: "jantar",
    query: "lugar agradável para jantar canasvieiras",
    label: "Jantar & Risoto",
    headline: "Martita Café & Gastrobar — Risotos, Massas Artesanais & Picanha Grelhada",
    snippet:
      "Risoto de filé mignon com funghi ao vinho branco, fettuccine artesanal com almôndegas e cortes nobres grelhados. Uma noite aconchegante para amigos e casais.",
    sitelinks: [
      { label: "Pratos Principais", href: "/cardapio?categoria=pratos-principais" },
      { label: "Cervejas & Chopp", href: "/cardapio?categoria=bebidas" },
      { label: "Ambiente do Salão", href: "#" },
      { label: "Como Chegar", href: "#" },
    ],
    intent: "Local",
  },
];

export function GoogleSearchSimulator() {
  const [selectedId, setSelectedId] = useState<string>("brunch");
  const currentScenario = SEARCH_SCENARIOS.find((s) => s.id === selectedId) || SEARCH_SCENARIOS[0];

  return (
    <section id="google-seo" className="py-24 lg:py-32 bg-[#F8F4EC] text-[#211A17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE5D5] border border-[#CFB583]/60 shadow-sm">
            <Globe className="w-3.5 h-3.5 text-[#E77759]" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#38271F]">
              Presença Orgânica no Google
            </span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#211A17] leading-[1.08]">
            Quando alguém procura um lugar para comer, sua empresa precisa{" "}
            <span className="italic font-semibold text-[#E77759]">
              estar entre as opções encontradas
            </span>
            .
          </h2>

          <p className="text-sm sm:text-base text-[#38271F]/80 leading-relaxed max-w-2xl mx-auto">
            Turistas, novos moradores e clientes da região pesquisam no Google antes de sair de casa.
            Veja abaixo como um site estruturado transforma buscas reais em visitas ao salão.
          </p>
        </div>

        {/* Interactive Google Simulation Box */}
        <div className="bg-white rounded-[2rem] border border-[#CFB583]/50 shadow-[0_16px_50px_rgba(33,26,23,0.08)] overflow-hidden max-w-4xl mx-auto">
          {/* Browser / Search Chrome Bar */}
          <div className="bg-[#EFE5D5]/60 px-5 py-4 border-b border-[#CFB583]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#E77759]/60" />
              <span className="w-3 h-3 rounded-full bg-[#CFB583]/60" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/60" />
              <span className="text-xs font-mono text-[#38271F]/60 ml-2 hidden sm:inline">
                https://www.google.com.br/search
              </span>
            </div>

            {/* Scenario Quick Selector Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#38271F]/60 font-semibold mr-1">
                Termo:
              </span>
              {SEARCH_SCENARIOS.map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setSelectedId(sc.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedId === sc.id
                      ? "bg-[#211A17] text-white"
                      : "bg-white text-[#38271F] border border-[#CFB583]/40 hover:border-[#E77759]"
                  }`}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Query Input Display */}
          <div className="p-6 sm:p-8 space-y-6">
            <div className="relative">
              <Search className="w-4 h-4 text-blue-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <div className="w-full pl-11 pr-4 py-3 rounded-full bg-[#F8F4EC] border border-[#CFB583]/40 font-mono text-xs sm:text-sm text-[#211A17] flex items-center justify-between">
                <span>{currentScenario.query}</span>
                <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-sans font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {currentScenario.intent}
                </span>
              </div>
            </div>

            {/* Simulated Google Organic Snippet */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScenario.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 pt-2"
              >
                {/* Site Brand Info */}
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#211A17] text-[#CFB583] flex items-center justify-center font-serif-editorial text-xs font-bold">
                    M
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#211A17] leading-none">
                      Martita Café &amp; Gastrobar
                    </p>
                    <p className="text-[11px] text-[#38271F]/60 leading-none mt-1">
                      https://martita.com.br › cardapio
                    </p>
                  </div>
                </div>

                {/* Blue Clickable Title */}
                <h3 className="text-lg sm:text-xl font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                  {currentScenario.headline}
                </h3>

                {/* Meta Description */}
                <p className="text-xs sm:text-sm text-[#4d5156] leading-relaxed">
                  {currentScenario.snippet}
                </p>

                {/* Star Rating & Price snippet */}
                <div className="flex items-center gap-2 text-xs text-[#38271F]/70 pt-1">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-[#211A17]">4.9</span>
                  <span>• Canasvieiras, Florianópolis - SC</span>
                  <span>• R$ 20 - R$ 80</span>
                </div>

                {/* Sitelinks Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3 border-t border-[#CFB583]/20">
                  {currentScenario.sitelinks.map((link, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#F8F4EC]/60 hover:bg-[#EFE5D5] transition-colors border border-[#CFB583]/30 cursor-pointer"
                    >
                      <p className="text-xs font-semibold text-[#1a0dab] hover:underline flex items-center justify-between">
                        <span>{link.label}</span>
                        <ExternalLink className="w-3 h-3 text-[#38271F]/40" />
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* 3 Pillars of Technical SEO Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pillar 1: SEO On-Page */}
          <div className="bg-[#EFE5D5]/70 rounded-[1.8rem] p-7 border border-[#CFB583]/45 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#211A17] text-[#CFB583] flex items-center justify-center">
              <FileCode className="w-5 h-5 text-[#E77759]" />
            </div>
            <h4 className="font-serif-editorial text-2xl font-bold text-[#211A17]">
              1. SEO On-Page
            </h4>
            <p className="text-xs text-[#38271F]/80 leading-relaxed">
              Otimização de cada página para ser compreendida com perfeição pelos robôs do Google:
            </p>
            <ul className="space-y-2 text-xs text-[#38271F]/85">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>Títulos e descrições estratégicas por prato e categoria</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>Hierarquia semântica de títulos (H1, H2, H3)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>URLs amigáveis (ex: /cardapio, /cardapio?categoria=drinks)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>Imagens compactadas em WebP com textos alternativos (alt)</span>
              </li>
            </ul>
          </div>

          {/* Pillar 2: SEO Local */}
          <div className="bg-[#EFE5D5]/70 rounded-[1.8rem] p-7 border border-[#CFB583]/45 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#211A17] text-[#CFB583] flex items-center justify-center">
              <Map className="w-5 h-5 text-[#CFB583]" />
            </div>
            <h4 className="font-serif-editorial text-2xl font-bold text-[#211A17]">
              2. SEO Local &amp; Maps
            </h4>
            <p className="text-xs text-[#38271F]/80 leading-relaxed">
              Para atrair clientes geograficamente próximos em Canasvieiras e turistas:
            </p>
            <ul className="space-y-2 text-xs text-[#38271F]/85">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>Dados estruturados <strong>LocalBusiness &amp; Restaurant</strong> (Schema.org)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>Consistência total de nome, endereço e horário com o Perfil Google</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>Integração de traçado de rotas direto no Google Maps</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>Palavras-chave regionais com foco em gastronomia local</span>
              </li>
            </ul>
          </div>

          {/* Pillar 3: Indexação & Search Console */}
          <div className="bg-[#EFE5D5]/70 rounded-[1.8rem] p-7 border border-[#CFB583]/45 space-y-4">
            <div className="w-10 h-10 rounded-xl bg-[#211A17] text-[#CFB583] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <h4 className="font-serif-editorial text-2xl font-bold text-[#211A17]">
              3. Indexação &amp; Monitoramento
            </h4>
            <p className="text-xs text-[#38271F]/80 leading-relaxed">
              Estrutura técnica profissional para garantir indexação rápida e contínua:
            </p>
            <ul className="space-y-2 text-xs text-[#38271F]/85">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>Sitemap.xml automático e arquivo robots.txt configurado</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>Vinculação ao Google Search Console oficial</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>Acompanhamento de cliques, impressões e consultas reais</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E77759] shrink-0 mt-0.5" />
                <span>Conformidade total com as métricas Core Web Vitals do Google</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Conceptual Visibility Growth Chart & Disclaimer */}
        <div className="bg-[#211A17] text-[#F8F4EC] rounded-[2rem] p-6 sm:p-9 border border-[#CFB583]/40 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CFB583]/20 pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#CFB583]">
                Conceito Estratégico
              </span>
              <h4 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-white mt-1">
                Evolução Teórica da Descoberta Orgânica
              </h4>
            </div>
            <span className="text-xs text-[#CFB583]/80 bg-white/10 px-3 py-1 rounded-full">
              Ilustração Conceitual
            </span>
          </div>

          {/* SVG Line Curve Illustration */}
          <div className="w-full h-48 sm:h-56 relative">
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E77759" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#E77759" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="30" x2="580" y2="30" stroke="#CFB583" strokeOpacity="0.15" strokeDasharray="4" />
              <line x1="40" y1="80" x2="580" y2="80" stroke="#CFB583" strokeOpacity="0.15" strokeDasharray="4" />
              <line x1="40" y1="130" x2="580" y2="130" stroke="#CFB583" strokeOpacity="0.15" strokeDasharray="4" />
              <line x1="40" y1="170" x2="580" y2="170" stroke="#CFB583" strokeOpacity="0.3" />

              {/* Line 1: Sem Site (Flat / Limited) */}
              <path
                d="M 40,165 Q 180,163 320,164 T 580,162"
                fill="none"
                stroke="#A68A56"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />

              {/* Line 2: Com Site & SEO (Progressive Curve) */}
              <path
                d="M 40,165 Q 160,150 280,110 T 440,55 T 580,25"
                fill="none"
                stroke="#E77759"
                strokeWidth="4"
              />

              {/* Filled Area below Line 2 */}
              <path
                d="M 40,165 Q 160,150 280,110 T 440,55 T 580,25 L 580,170 L 40,170 Z"
                fill="url(#curveGradient)"
              />

              {/* Key Data Nodes */}
              <circle cx="40" cy="165" r="4" fill="#CFB583" />
              <circle cx="280" cy="110" r="5" fill="#E77759" />
              <circle cx="580" cy="25" r="6" fill="#E77759" stroke="#F8F4EC" strokeWidth="2" />

              {/* Labels */}
              <text x="40" y="190" fill="#CFB583" fontSize="10" fontFamily="sans-serif">Lançamento</text>
              <text x="260" y="190" fill="#CFB583" fontSize="10" fontFamily="sans-serif">Mês 3-6 (Indexação)</text>
              <text x="480" y="190" fill="#CFB583" fontSize="10" fontFamily="sans-serif">Maturidade Orgânica</text>
            </svg>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs pt-2">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 text-white">
                <span className="w-3 h-1 bg-[#E77759] rounded-full" />
                Com Site Oficial + SEO Local (Descoberta Contínua)
              </span>
              <span className="flex items-center gap-2 text-[#CFB583]/70">
                <span className="w-3 h-1 bg-[#A68A56] rounded-full border border-dashed" />
                Sem Site (Apenas Redes Sociais)
              </span>
            </div>
          </div>

          {/* Ethical Disclaimer */}
          <div className="p-4 rounded-xl bg-white/5 border border-[#CFB583]/20 flex items-start gap-3 text-xs text-[#CFB583]/80 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-[#CFB583] shrink-0 mt-0.5" />
            <p>
              <strong>Compromisso Ético:</strong> Nenhuma agência ou ferramenta pode prometer a 1ª posição absoluta no Google,
              pois o algoritmo avalia dezenas de fatores dinâmicos (concorrência, histórico de busca do usuário e autoridade).
              O que o trabalho técnico de SEO entrega é <strong>garantir que a Martita esteja perfeitamente estruturada, indexada e apta a disputar as melhores posições</strong> toda vez que alguém pesquisar por gastronomia na região.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

