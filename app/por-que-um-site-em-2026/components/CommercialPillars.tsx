"use client";

import React from "react";
import {
  Compass,
  ShieldCheck,
  Sparkles,
  Zap,
  Lock,
  BarChart3,
  ArrowUpRight,
} from "lucide-react";

const PILLARS = [
  {
    num: "01",
    title: "Descoberta",
    tagline: "Ser encontrado por quem ainda não te conhece",
    desc: "Capturar novos clientes, moradores e turistas em Florianópolis no momento exato em que pesquisam por café, brunch ou gastrobar no Google ou assistentes virtuais.",
    icon: Compass,
    accent: "#E77759",
  },
  {
    num: "02",
    title: "Credibilidade",
    tagline: "Percepção imediata de alto padrão",
    desc: "Um endereço oficial sob domínio próprio transmite profissionalismo, maturidade e segurança para quem vai sair de casa ou convidar amigos e parceiros de negócios.",
    icon: ShieldCheck,
    accent: "#CFB583",
  },
  {
    num: "03",
    title: "Experiência",
    tagline: "Apresentação à altura do salão físico",
    desc: "Fotografias gastronômicas de alta qualidade, cardápio legível com preços e descrições dos pratos, transmitindo a mesma atmosfera acolhedora que o cliente encontra ao vivo.",
    icon: Sparkles,
    accent: "#E77759",
  },
  {
    num: "04",
    title: "Conversão",
    tagline: "Do interesse ao cliente na mesa",
    desc: "Facilidade de contato imediato via WhatsApp com prato selecionado, traçado de rota no GPS a 1 toque e facilidade para planejar visitas sem atrito ou espera.",
    icon: Zap,
    accent: "#CFB583",
  },
  {
    num: "05",
    title: "Autonomia",
    tagline: "Canal próprio sem depender de algoritmos",
    desc: "Sua marca não fica refém de mudanças no Instagram, bloqueios temporários ou oscilações de entrega orgânica. O site é patrimônio digital exclusivo da Martita.",
    icon: Lock,
    accent: "#211A17",
  },
  {
    num: "06",
    title: "Mensuração",
    tagline: "Entender dados para crescer com inteligência",
    desc: "Acompanhar quantos clientes visitaram o cardápio, quais pratos chamaram mais atenção, de onde os visitantes vieram e quais campanhas geram mais clientes reais.",
    icon: BarChart3,
    accent: "#E77759",
  },
];

export function CommercialPillars() {
  return (
    <section id="pilares" className="py-24 lg:py-32 bg-[#EFE5D5]/70 text-[#211A17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F4EC] border border-[#CFB583]/60 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E77759]" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#38271F]">
              6 Pilares Estratégicos
            </span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#211A17] leading-[1.08]">
            Um site profissional não é apenas uma vitrine. É uma{" "}
            <span className="italic font-semibold text-[#E77759]">
              ferramenta comercial
            </span>
            .
          </h2>

          <p className="text-sm sm:text-base text-[#38271F]/80 leading-relaxed max-w-2xl mx-auto">
            Cada recurso do projeto foi desenhado com um propósito claro: transformar curiosidade
            em faturamento e posicionar a Martita como referência gastronômica permanente.
          </p>
        </div>

        {/* 6 Pillars Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PILLARS.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-[#F8F4EC] rounded-[2rem] p-7 sm:p-8 border border-[#CFB583]/45 shadow-[0_8px_30px_rgba(33,26,23,0.04)] hover:shadow-[0_16px_50px_rgba(231,119,89,0.12)] hover:border-[#E77759]/60 transition-all duration-300 flex flex-col justify-between group space-y-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-[#CFB583]/30 pb-3">
                    <span className="font-serif-editorial text-2xl font-bold text-[#CFB583]">
                      {p.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#EFE5D5] flex items-center justify-center text-[#211A17] group-hover:bg-[#E77759] group-hover:text-white transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-serif-editorial text-2xl font-bold text-[#211A17] group-hover:text-[#E77759] transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs uppercase tracking-wider font-semibold text-[#E77759] mt-0.5">
                      {p.tagline}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-[#38271F]/80 leading-relaxed">
                    {p.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#CFB583]/20 flex items-center justify-between text-[11px] text-[#38271F]/60">
                  <span>Pilar de Crescimento</span>
                  <ArrowUpRight className="w-4 h-4 text-[#CFB583] group-hover:text-[#E77759] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

