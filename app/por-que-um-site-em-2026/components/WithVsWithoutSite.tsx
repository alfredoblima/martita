"use client";

import React from "react";
import {
  XCircle,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export function WithVsWithoutSite() {
  return (
    <section id="comparativo" className="py-24 lg:py-32 bg-[#F8F4EC] text-[#211A17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE5D5] border border-[#CFB583]/60 shadow-sm">
            <AlertOctagon className="w-3.5 h-3.5 text-[#E77759]" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#38271F]">
              Custo de Oportunidade
            </span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#211A17] leading-[1.08]">
            Não ter um site não significa deixar de vender. Significa{" "}
            <span className="italic font-semibold text-[#E77759]">
              abrir mão de oportunidades
            </span>
            .
          </h2>

          <p className="text-sm sm:text-base text-[#38271F]/80 leading-relaxed max-w-2xl mx-auto">
            A Martita já tem produtos excepcionais e clientes fiéis. A questão estratégica é:
            quantas pessoas que não conhecem a casa deixam de visitá-la simplesmente porque não encontraram o cardápio e o endereço no momento da decisão?
          </p>
        </div>

        {/* Side-by-Side Asymmetric Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Box 1: Sem Site */}
          <div className="bg-[#EFE5D5]/50 rounded-[2.2rem] p-7 sm:p-10 border border-rose-200/60 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#CFB583]/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                    <TrendingDown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-editorial text-2xl font-bold text-[#211A17]">
                      Sem Site Profissional
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-rose-700 font-semibold">
                      Oportunidades Perdidas Silenciosamente
                    </p>
                  </div>
                </div>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-[#38271F]/80 leading-relaxed pt-2">
                {[
                  "Dependência contínua do algoritmo do Instagram para ser visto.",
                  "Quem pesquisa ativamente 'café da manhã Canasvieiras' no Google cai na concorrência.",
                  "Informações de preços e opções espalhadas em destaques difíceis de navegar.",
                  "Sobrecarga da equipe respondendo dúvidas básicas no Direct e WhatsApp manual.",
                  "Sem presença oficial estruturada quando clientes buscam via assistentes de IA.",
                  "Falta de histórico de dados analíticos sobre o interesse do público.",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-rose-100/60 text-xs text-rose-950 font-medium">
              💡 <strong>O custo invisível:</strong> O cliente que não acha o cardápio em 30 segundos raramente insiste; ele simplesmente escolhe outro lugar.
            </div>
          </div>

          {/* Box 2: Com Site Próprio */}
          <div className="bg-[#211A17] text-[#F8F4EC] rounded-[2.2rem] p-7 sm:p-10 border-2 border-[#E77759] shadow-2xl flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#CFB583]/20 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#E77759] text-white flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-editorial text-2xl font-bold text-white">
                      Com Site Oficial Estruturado
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-[#CFB583] font-semibold">
                      Ativo Comercial Permanente
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-widest font-bold text-white bg-[#E77759] px-3 py-1 rounded-full shadow-sm">
                  Crescimento
                </span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-[#F8F4EC]/90 leading-relaxed pt-2">
                {[
                  "Canal próprio e perene sob domínio oficial da Martita.",
                  "Indexação contínua nas buscas locais do Google, atraindo turistas e moradores.",
                  "Cardápio visual interativo com categorias, preços em R$ e ingredientes.",
                  "Atendimento direto: cliente clica no prato e abre o WhatsApp com pedido pronto.",
                  "Base técnica pronta para indexação em mecanismos de IA contemporâneos.",
                  "Painel de métricas para entender exatamente o que seu público mais deseja.",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 border border-[#CFB583]/30 text-xs text-[#CFB583] font-medium">
              ✨ <strong>O ganho estratégico:</strong> A Martita passa a ser dona do seu próprio canal, aumentando faturamento e valor de marca a cada semana.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

