"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Sparkles,
  ArrowRight,
  Database,
  Search,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

interface AIPromptExample {
  id: string;
  prompt: string;
  category: string;
  aiResponse: string;
  sources: { title: string; url: string }[];
}

const AI_EXAMPLES: AIPromptExample[] = [
  {
    id: "brunch",
    prompt: "Indique um lugar acolhedor para tomar brunch e café da manhã em Canasvieiras, Florianópolis.",
    category: "Brunch & Café",
    aiResponse:
      "Uma das recomendações de destaque é a Martita Café & Gastrobar. O local oferece um cardápio artesanal com croissants folhados amanteigados, ovos mexidos cremosos com abacate e bacon, bandejas completas de brunch e cafés especiais selecionados. O ambiente conta com luz natural e decoração contemporânea.",
    sources: [
      { title: "martita.com.br › cardapio › brunch", url: "https://martita.com.br/cardapio?categoria=brunch" },
      { title: "martita.com.br › sobre-a-martita", url: "https://martita.com.br/#essencia" },
    ],
  },
  {
    id: "drinks",
    prompt: "Quais gastrobares oferecem boas opções de jantar e drinks para o entardecer no norte da ilha?",
    category: "Gastrobar & Drinks",
    aiResponse:
      "Para um fim de tarde e noite agradável, a Martita Gastrobar em Canasvieiras combina coquetelaria autoral (como Aperol Spritz, Moscow Mule e drinks com café como o Carajillo 43) com pratos para compartilhar, risoto de filé mignon com funghi, fettuccine e petiscos do mar.",
    sources: [
      { title: "martita.com.br › cardapio › drinks", url: "https://martita.com.br/cardapio?categoria=drinks" },
      { title: "martita.com.br › gastrobar", url: "https://martita.com.br/#gastrobar" },
    ],
  },
  {
    id: "confeitaria",
    prompt: "Onde encontrar doces finos e croissant de pistache de qualidade na região de Canasvieiras?",
    category: "Doces & Confeitaria",
    aiResponse:
      "A Martita conta com confeitaria artesanal diária, destacando-se o croissant recheado com ganache de pistache tostado, croissants com Nutella e morangos frescos, entremets e bolos da vitrine acompanhados de espressos e cafés filtrados V60.",
    sources: [
      { title: "martita.com.br › cardapio › sobremesas", url: "https://martita.com.br/cardapio?categoria=sobremesas" },
    ],
  },
];

export function AIFronteiraSection() {
  const [selectedPromptId, setSelectedPromptId] = useState<string>("brunch");
  const activePrompt = AI_EXAMPLES.find((p) => p.id === selectedPromptId) || AI_EXAMPLES[0];

  return (
    <section id="ia-2026" className="py-24 lg:py-32 bg-[#211A17] text-[#F8F4EC] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-40 right-1/4 w-[35rem] h-[35rem] rounded-full bg-[#E77759]/10 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-10 w-[30rem] h-[30rem] rounded-full bg-[#CFB583]/10 blur-[130px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#CFB583]/40 shadow-sm">
            <Bot className="w-3.5 h-3.5 text-[#CFB583]" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#CFB583]">
              A Nova Fronteira de Busca em 2026
            </span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-white leading-[1.08]">
            Em 2026, as pessoas também perguntam às{" "}
            <span className="italic font-semibold text-[#E77759]">
              inteligências artificiais
            </span>{" "}
            onde devem ir.
          </h2>

          <p className="text-sm sm:text-base text-[#F8F4EC]/80 leading-relaxed max-w-2xl mx-auto">
            Mecanismos como Gemini, ChatGPT, Perplexity e os recursos de IA da Pesquisa Google
            precisam de fontes confiáveis, públicas e indexáveis para compreender o que sua empresa oferece.
          </p>
        </div>

        {/* Conceptual AI Interaction Interface */}
        <div className="bg-[#16110F] rounded-[2rem] border border-[#CFB583]/30 shadow-2xl overflow-hidden max-w-4xl mx-auto">
          {/* Header Bar */}
          <div className="bg-[#211A17] px-6 py-4 border-b border-[#CFB583]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-[#CFB583] tracking-wide">
                Simulação de Consulta via Assistente de IA / Busca Generativa
              </span>
            </div>

            {/* Prompt Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {AI_EXAMPLES.map((ex) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setSelectedPromptId(ex.id)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedPromptId === ex.id
                      ? "bg-[#E77759] text-white"
                      : "bg-white/10 text-[#CFB583] hover:bg-white/20"
                  }`}
                >
                  {ex.category}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Window */}
          <div className="p-6 sm:p-9 space-y-6">
            {/* User Prompt */}
            <div className="flex items-start gap-3 justify-end">
              <div className="bg-[#EFE5D5] text-[#211A17] p-4 sm:p-5 rounded-2xl rounded-tr-none max-w-xl text-xs sm:text-sm font-medium shadow-sm">
                <p>"{activePrompt.prompt}"</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#CFB583] text-[#211A17] flex items-center justify-center text-xs font-bold shrink-0">
                VC
              </div>
            </div>

            {/* AI Response */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activePrompt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-[#E77759] text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="space-y-4 flex-1">
                  <div className="bg-white/5 border border-[#CFB583]/20 p-5 sm:p-6 rounded-2xl rounded-tl-none text-xs sm:text-sm leading-relaxed text-[#F8F4EC]/90 space-y-3">
                    <p>{activePrompt.aiResponse}</p>

                    {/* Verified Citations / Sources */}
                    <div className="pt-3 border-t border-[#CFB583]/15 space-y-1.5">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#CFB583]">
                        Fontes verificadas e estruturadas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activePrompt.sources.map((src, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-[11px] font-mono text-[#CFB583] border border-[#CFB583]/30"
                          >
                            <span>{src.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 text-[#E77759]" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* The Discovery Pipeline: 4 Steps */}
        <div className="bg-white/5 border border-[#CFB583]/25 rounded-[2rem] p-6 sm:p-9 space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <span className="text-[10px] uppercase tracking-[0.26em] font-bold text-[#CFB583]">
              Como a Informação Flui na Web Moderna
            </span>
            <h3 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-white">
              Da Estrutura do Site à Recomendação
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
            {[
              {
                step: "01",
                title: "Site Oficial",
                desc: "Domínio próprio com textos claros, dados de pratos, preços, horários e endereço.",
                icon: Database,
              },
              {
                step: "02",
                title: "Indexação por Robôs",
                desc: "Mecanismos do Google e rastreadores lêem a estrutura semântica e schemas Schema.org.",
                icon: Search,
              },
              {
                step: "03",
                title: "Compreensão de Dados",
                desc: "A inteligência artificial entende exatamente que a Martita serve brunch, risoto, drinks e café.",
                icon: Bot,
              },
              {
                step: "04",
                title: "Oportunidade de Descoberta",
                desc: "Quando um consumidor pergunta, sua empresa tem a chance real de ser citada com link oficial.",
                icon: Sparkles,
              },
            ].map((st, idx) => {
              const Icon = st.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#211A17] p-5 rounded-2xl border border-[#CFB583]/30 flex flex-col justify-between space-y-3 relative group hover:border-[#E77759] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-serif-editorial text-2xl font-bold text-[#CFB583]">
                      {st.step}
                    </span>
                    <Icon className="w-4 h-4 text-[#E77759]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{st.title}</h4>
                    <p className="text-xs text-[#F8F4EC]/70 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ethical Transparency Box */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-[#CFB583]/20 flex items-start gap-3.5 text-xs text-[#CFB583]/85 leading-relaxed max-w-4xl mx-auto">
          <AlertCircle className="w-5 h-5 text-[#CFB583] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-white">
              Diretrizes Oficiais e Realidade Técnica sobre IA em 2026:
            </p>
            <p className="mt-1">
              De acordo com as diretrizes oficiais de busca do Google e da indústria, <strong>não existe qualquer truque técnico (hacks, arquivos "llms.txt" milagrosos ou atalhos)</strong> que garanta que assistentes de IA citem uma empresa. O que realmente funciona é a construção sólida: ter um <strong>site rápido, com informações consistentes, cardápio indexável e dados estruturados oficiais</strong>. Sem um site, para esses sistemas, a empresa praticamente não existe como fonte primária oficial.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

