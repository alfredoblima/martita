"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass,
  Search,
  Eye,
  CheckCircle,
  Navigation,
  ArrowRight,
  Sparkles,
  MessageCircle,
} from "lucide-react";

interface JourneyStage {
  step: string;
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Search;
  userThoughts: string;
  frictionWithoutSite: string;
  solutionWithSite: string;
  conversionRole: string;
}

const STAGES: JourneyStage[] = [
  {
    step: "01",
    id: "descobrir",
    title: "Descobrir",
    subtitle: "O consumidor pesquisa opções na internet",
    icon: Search,
    userThoughts: "“Onde tem um lugar bom para tomar café da manhã ou brunch perto de Canasvieiras?”",
    frictionWithoutSite:
      "A empresa depende exclusivamente de seguidores do Instagram ou de quem já passa em frente. Quem busca no Google encontra os concorrentes.",
    solutionWithSite:
      "O site posiciona a Martita nas buscas ativas do Google e Mapas para pessoas com intenção real de consumo.",
    conversionRole: "Captação de demanda existente que ainda não conhece a marca.",
  },
  {
    step: "02",
    id: "avaliar",
    title: "Avaliar",
    subtitle: "Compara fotos, cardápio, ambiente e avaliações",
    icon: Eye,
    userThoughts: "“Como é o salão? Tem opções de croissant e ovos? Quanto custa em média? Vale a visita?”",
    frictionWithoutSite:
      "Informações desorganizadas em stories salvos; fotos sem cardápio legível; preços desatualizados geram insegurança.",
    solutionWithSite:
      "Cardápio digital visual com fotos reais em alta definição, preços claros, ingredientes e atmosfera do salão.",
    conversionRole: "Eliminação de dúvidas e construção instantânea de percepção de valor.",
  },
  {
    step: "03",
    id: "decidir",
    title: "Decidir",
    subtitle: "Conclui que a Martita é a escolha ideal",
    icon: CheckCircle,
    userThoughts: "“O cardápio é impecável e o lugar é lindo. É exatamente aqui que vamos nos encontrar.”",
    frictionWithoutSite:
      "Se tiver que mandar direct para saber se está aberto ou se tem mesa, o cliente costuma migrar para outro lugar.",
    solutionWithSite:
      "Horários oficiais de atendimento, endereço exato e certeza de uma experiência gastronômica de alto nível.",
    conversionRole: "Fechamento da escolha em favor da Martita.",
  },
  {
    step: "04",
    id: "visitar",
    title: "Visitar & Consumir",
    subtitle: "Traça a rota, reserva ou entra em contato",
    icon: Navigation,
    userThoughts: "“Já escolhi meu prato, cliquei em como chegar e estamos a caminho.”",
    frictionWithoutSite:
      "Dificuldade de traçar rota, sem link direto para o Google Maps ou atendimento sem padronização.",
    solutionWithSite:
      "Botão de rota com um clique no GPS (Waze/Google Maps) e WhatsApp direto para reservas e pedidos.",
    conversionRole: "A decisão digital se materializa em faturamento na mesa.",
  },
];

export function ConsumerJourney() {
  const [activeStageId, setActiveStageId] = useState<string>("descobrir");
  const currentStage = STAGES.find((s) => s.id === activeStageId) || STAGES[0];

  return (
    <section id="jornada" className="py-24 lg:py-32 bg-[#EFE5D5]/65 text-[#211A17] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F4EC] border border-[#CFB583]/60 shadow-sm">
            <Compass className="w-3.5 h-3.5 text-[#E77759]" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#38271F]">
              Comportamento do Consumidor Moderno
            </span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#211A17] leading-[1.08]">
            A decisão de visitar um estabelecimento{" "}
            <span className="italic font-semibold text-[#E77759]">
              começa muito antes
            </span>{" "}
            de chegar até ele.
          </h2>

          <p className="text-sm sm:text-base text-[#38271F]/80 leading-relaxed max-w-2xl mx-auto">
            Em 2026, ninguém mais anda aleatoriamente esperando a sorte de encontrar um bom café ou gastrobar.
            O consumidor pesquisa, avalia e decide digitalmente.
          </p>
        </div>

        {/* 4 Interactive Journey Stage Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStageId(stage.id)}
                className={`p-6 rounded-[1.8rem] text-left transition-all duration-300 relative border cursor-pointer ${
                  isActive
                    ? "bg-[#211A17] text-white border-[#E77759] shadow-xl scale-[1.02]"
                    : "bg-[#F8F4EC] text-[#211A17] border-[#CFB583]/45 hover:border-[#E77759]/60 hover:bg-white"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`font-serif-editorial text-2xl font-bold ${
                      isActive ? "text-[#CFB583]" : "text-[#E77759]"
                    }`}
                  >
                    {stage.step}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      isActive ? "bg-[#E77759] text-white" : "bg-[#EFE5D5] text-[#38271F]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="font-serif-editorial text-2xl font-bold mb-1">
                  {stage.title}
                </h3>
                <p className={`text-xs ${isActive ? "text-white/80" : "text-[#38271F]/70"}`}>
                  {stage.subtitle}
                </p>

                {isActive && (
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-[#211A17] border-b border-r border-[#E77759] rotate-45" />
                )}
              </button>
            );
          })}
        </div>

        {/* Deep Dive Stage Breakdown Card */}
        <div className="bg-[#F8F4EC] rounded-[2rem] p-7 sm:p-10 border border-[#CFB583]/50 shadow-[0_16px_50px_rgba(33,26,23,0.06)] max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Top Thought Bubble */}
              <div className="bg-[#EFE5D5]/70 p-5 rounded-2xl border border-[#CFB583]/40">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#E77759]">
                  O que passa na mente do cliente no estágio {currentStage.step} ({currentStage.title}):
                </span>
                <p className="font-serif-editorial italic text-xl sm:text-2xl text-[#211A17] mt-1 font-semibold">
                  {currentStage.userThoughts}
                </p>
              </div>

              {/* Side-by-side Friction vs Solution */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/60 space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-rose-700">
                    O Risco de Não Ter Site Neste Ponto:
                  </span>
                  <p className="text-xs sm:text-sm text-rose-950 leading-relaxed">
                    {currentStage.frictionWithoutSite}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 space-y-2">
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-800">
                    O Impacto Positivo do Site Oficial:
                  </span>
                  <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                    {currentStage.solutionWithSite}
                  </p>
                </div>
              </div>

              {/* Role in conversion */}
              <div className="pt-4 border-t border-[#CFB583]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#38271F]/80">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#E77759]" />
                  <strong>Impacto Comercial:</strong> {currentStage.conversionRole}
                </span>
                <span className="text-[11px] font-mono text-[#E77759] font-bold">
                  Estágio {currentStage.step} de 04
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

