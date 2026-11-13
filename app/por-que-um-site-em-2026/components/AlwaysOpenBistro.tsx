"use client";

import React, { useState } from "react";
import {
  Clock,
  Smartphone,
  Monitor,
  CheckCircle2,
  Utensils,
  MapPin,
  MessageCircle,
  Coffee,
  Sparkles,
  Wine,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

export function AlwaysOpenBistro() {
  const [activeTab, setActiveTab] = useState<"mobile" | "desktop">("mobile");

  return (
    <section id="aberto-24h" className="py-24 lg:py-32 bg-[#211A17] text-[#F8F4EC] relative overflow-hidden">
      {/* Background warm lighting */}
      <div
        className="pointer-events-none absolute top-1/4 -left-32 w-[35rem] h-[35rem] rounded-full bg-[#E77759]/10 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-1/4 -right-32 w-[30rem] h-[30rem] rounded-full bg-[#CFB583]/10 blur-[140px]"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#CFB583]/40 shadow-sm">
            <Clock className="w-3.5 h-3.5 text-[#CFB583]" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#CFB583]">
              Atendimento Digital Contínuo
            </span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-white leading-[1.08]">
            Enquanto você prepara o próximo café, seu site continua{" "}
            <span className="italic font-semibold text-[#E77759]">
              apresentando sua empresa
            </span>
            .
          </h2>

          <p className="text-sm sm:text-base text-[#F8F4EC]/80 leading-relaxed max-w-2xl mx-auto">
            Às 23h, quando as portas se fecham, ou às 07h da manhã, antes de abrir o salão,
            clientes estão no celular decidindo onde tomarão o café da manhã ou onde brindarão à noite.
          </p>
        </div>

        {/* 2-Column Showcase: Features vs Interactive Device Mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Features Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#E77759]">
                O Que Fica Disponível Sem Nenhuma Fricção
              </span>
              <h3 className="font-serif-editorial text-2xl sm:text-4xl font-normal text-white">
                Respostas Imediatas para Clientes Decidirem na Hora
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {[
                { title: "Cardápio Completo", desc: "Mais de 100 itens com fotos reais e preços claros.", icon: Utensils },
                { title: "Café da Manhã & Brunch", desc: "Croissants folhados, ovos com abacate e sucos.", icon: Coffee },
                { title: "Gastrobar & Drinks", desc: "Aperol Spritz, coquetelaria autoral e chopp.", icon: Wine },
                { title: "Almoço & Jantar", desc: "Risotos, massas artesanais e picanha grelhada.", icon: Sparkles },
                { title: "Localização & Waze/Maps", desc: "Traçado de rota no GPS a 1 toque no celular.", icon: MapPin },
                { title: "Horários de Funcionamento", desc: "Sem dúvidas sobre abertura em feriados e fins de semana.", icon: Clock },
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/5 border border-[#CFB583]/20 hover:border-[#E77759]/60 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center gap-2 text-[#CFB583]">
                      <Icon className="w-4 h-4 text-[#E77759]" />
                      <h4 className="text-xs font-semibold text-white">{feat.title}</h4>
                    </div>
                    <p className="text-[11px] text-[#F8F4EC]/70 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* Direct WhatsApp Callout */}
            <div className="p-4 rounded-2xl bg-[#E77759]/15 border border-[#E77759]/40 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#E77759] text-white flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-white">Zero Espera no Direct do Instagram:</p>
                <p className="text-[#F8F4EC]/75">
                  O cliente tira dúvidas sozinho no cardápio e só chama no WhatsApp quando já está pronto para consumir.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Mockup Column (6 cols) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Device Switcher Toggle */}
            <div className="inline-flex items-center p-1 rounded-full bg-white/10 border border-[#CFB583]/30 mb-6 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("mobile")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  activeTab === "mobile"
                    ? "bg-[#E77759] text-white shadow-md"
                    : "text-[#CFB583] hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Celular (Mobile)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("desktop")}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                  activeTab === "desktop"
                    ? "bg-[#E77759] text-white shadow-md"
                    : "text-[#CFB583] hover:text-white"
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop (Computador)</span>
              </button>
            </div>

            {/* Visual Screen Representation */}
            {activeTab === "mobile" ? (
              /* Mobile Mockup (iPhone Frame) */
              <div className="w-[19rem] sm:w-[22rem] h-[38rem] rounded-[3rem] p-3.5 bg-[#16110F] border-4 border-[#CFB583]/40 shadow-[0_25px_80px_rgba(0,0,0,0.6)] relative overflow-hidden flex flex-col">
                {/* Dynamic Island */}
                <div className="w-24 h-5 rounded-full bg-black mx-auto mb-2 shrink-0" />

                {/* Simulated Screen Content */}
                <div className="flex-1 rounded-[2.2rem] bg-[#F8F4EC] text-[#211A17] overflow-hidden flex flex-col shadow-inner">
                  {/* Mini Top Bar */}
                  <div className="bg-[#211A17] px-4 py-2.5 flex items-center justify-between text-white text-[10px]">
                    <span className="font-serif-editorial font-bold text-[#CFB583] tracking-widest">
                      MARTITA
                    </span>
                    <span className="bg-[#E77759] px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-bold">
                      Cardápio
                    </span>
                  </div>

                  {/* Dish Showcase in Mobile */}
                  <div className="p-4 space-y-3 flex-1 overflow-y-auto">
                    <div className="h-36 rounded-2xl overflow-hidden relative border border-[#CFB583]/40">
                      <SafeImage
                        src="/images/martita/produtos/croissant-presunto-queijo-mesa.jpg"
                        alt="Croissant"
                        className="w-full h-full"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[8px] uppercase tracking-wider font-bold bg-[#211A17]/85 text-[#CFB583]">
                        Café da Manhã
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h5 className="font-serif-editorial text-lg font-bold text-[#211A17]">
                          Croissant Presunto e Queijo
                        </h5>
                        <span className="font-serif-editorial font-bold text-[#E77759] text-base">
                          R$ 30,00
                        </span>
                      </div>
                      <p className="text-[10px] text-[#38271F]/75 leading-relaxed">
                        Massa folhada artesanal dourada na manteiga, presunto fatiado e queijo derretido.
                      </p>
                    </div>

                    {/* Scent 2 Mini Card */}
                    <div className="p-2.5 rounded-xl bg-white border border-[#CFB583]/40 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0">
                        <SafeImage
                          src="/images/martita/produtos/aperol-spritz-fettuccine.jpg"
                          alt="Aperol Spritz"
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-serif-editorial text-xs font-bold truncate">
                          Aperol Spritz Clássico
                        </p>
                        <p className="text-[10px] text-[#E77759] font-bold">R$ 30,00</p>
                        <p className="text-[9px] text-[#38271F]/60 truncate">Gastrobar • Noite</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="w-full py-2.5 rounded-full bg-[#E77759] text-white text-[10px] uppercase tracking-widest font-bold text-center shadow-sm">
                        Pedir pelo WhatsApp
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop Mockup (Laptop Frame) */
              <div className="w-full max-w-lg rounded-2xl p-3 bg-[#16110F] border-2 border-[#CFB583]/40 shadow-2xl flex flex-col space-y-2">
                <div className="flex items-center gap-1.5 px-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 px-3 py-0.5 rounded-md bg-white/10 text-[9px] font-mono text-[#CFB583]">
                    https://martita.com.br
                  </span>
                </div>
                <div className="h-64 rounded-xl bg-[#F8F4EC] text-[#211A17] overflow-hidden p-4 flex flex-col justify-between border border-[#CFB583]/30">
                  <div className="flex items-center justify-between border-b border-[#CFB583]/30 pb-2">
                    <span className="font-serif-editorial text-xs font-bold text-[#CFB583]">
                      MARTITA CAFÉ &amp; GASTROBAR
                    </span>
                    <div className="flex gap-2 text-[9px] uppercase font-semibold text-[#38271F]/70">
                      <span>Cardápio</span>
                      <span>História</span>
                      <span>Galeria</span>
                      <span>Contato</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 items-center">
                    <div className="space-y-1.5">
                      <span className="text-[8px] uppercase tracking-wider text-[#E77759] font-bold">
                        Gastronomia em Canasvieiras
                      </span>
                      <p className="font-serif-editorial text-lg font-bold leading-tight">
                        Do primeiro café ao último drink da noite.
                      </p>
                      <p className="text-[10px] text-[#38271F]/70">
                        Croissants folhados, cafés especiais e coquetelaria autoral.
                      </p>
                    </div>
                    <div className="h-32 rounded-lg overflow-hidden border border-[#CFB583]/40">
                      <SafeImage
                        src="/images/martita/produtos/croissant-presunto-queijo-mesa.jpg"
                        alt="Mesa Martita"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="text-[9px] text-[#38271F]/60 flex justify-between border-t border-[#CFB583]/20 pt-1">
                    <span>Aberto de Terça a Domingo</span>
                    <span className="text-[#E77759] font-bold">Cardápio 100% Interativo</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

