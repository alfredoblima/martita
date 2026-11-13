"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { formatBRL } from "@/lib/utils";

export function FinancialSimulator() {
  const [novosClientes, setNovosClientes] = useState<number>(20);
  const [ticketMedio, setTicketMedio] = useState<number>(50);
  const [frequencia, setFrequencia] = useState<number>(1);

  // Real-time calculations
  const receitaMensal = useMemo(() => {
    return novosClientes * ticketMedio * frequencia;
  }, [novosClientes, ticketMedio, frequencia]);

  const receitaAnual = useMemo(() => {
    return receitaMensal * 12;
  }, [receitaMensal]);

  const atendimentosAnuais = useMemo(() => {
    return novosClientes * frequencia * 12;
  }, [novosClientes, frequencia]);

  // 3 Scenarios
  const cenarios = useMemo(() => {
    const conservador = Math.round(novosClientes * 0.7);
    const intermediario = novosClientes;
    const otimista = Math.round(novosClientes * 1.6);

    return [
      {
        nome: "Conservador",
        clientes: conservador,
        mensal: conservador * ticketMedio * frequencia,
        anual: conservador * ticketMedio * frequencia * 12,
        cor: "#CFB583",
        tag: "-30% do fluxo projetado",
      },
      {
        nome: "Intermediário (Projeção Base)",
        clientes: intermediario,
        mensal: intermediario * ticketMedio * frequencia,
        anual: intermediario * ticketMedio * frequencia * 12,
        cor: "#E77759",
        tag: "Projeção realista calculada",
        destaque: true,
      },
      {
        nome: "Otimista (Alta Temporada & Gastrobar)",
        clientes: otimista,
        mensal: otimista * ticketMedio * frequencia,
        anual: otimista * ticketMedio * frequencia * 12,
        cor: "#211A17",
        tag: "+60% com eventos e turismo",
      },
    ];
  }, [novosClientes, ticketMedio, frequencia]);

  const maxAnual = Math.max(...cenarios.map((c) => c.anual), 1);

  return (
    <section id="simulador" className="py-24 lg:py-32 bg-[#EFE5D5]/80 text-[#211A17] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F4EC] border border-[#CFB583]/60 shadow-sm">
            <Calculator className="w-3.5 h-3.5 text-[#E77759]" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#38271F]">
              Simulador Comercial Interativo
            </span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#211A17] leading-[1.08]">
            Pequenas quantidades de novos clientes podem representar uma{" "}
            <span className="italic font-semibold text-[#E77759]">
              oportunidade significativa
            </span>
            .
          </h2>

          <p className="text-sm sm:text-base text-[#38271F]/80 leading-relaxed max-w-2xl mx-auto">
            Ajuste os controles abaixo para simular em tempo real o impacto que um
            fluxo contínuo de pessoas descobrindo a Martita pelo site pode gerar no faturamento.
          </p>
        </div>

        {/* Interactive Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-[#F8F4EC] rounded-[2rem] p-6 sm:p-8 border border-[#CFB583]/50 shadow-[0_12px_40px_rgba(33,26,23,0.06)] flex flex-col justify-between space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#CFB583]/30 pb-3">
                <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#38271F]/80">
                  Parâmetros de Simulação
                </span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#E77759] font-semibold bg-[#EFE5D5] px-2.5 py-1 rounded-full">
                  100% Interativo
                </span>
              </div>

              {/* Slider 1: Novos clientes por mês */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#211A17] flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#E77759]" />
                    <span>Novos clientes adicionais por mês</span>
                  </label>
                  <span className="font-serif-editorial text-2xl font-bold text-[#E77759]">
                    {novosClientes}{" "}
                    <span className="text-xs font-sans font-normal text-[#38271F]/70">
                      clientes/mês
                    </span>
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="150"
                  step="5"
                  value={novosClientes}
                  onChange={(e) => setNovosClientes(Number(e.target.value))}
                  className="w-full accent-[#E77759] h-2 bg-[#EFE5D5] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#38271F]/60 font-mono">
                  <span>5 clientes</span>
                  <span>20 (Padrão)</span>
                  <span>80</span>
                  <span>150 clientes</span>
                </div>
              </div>

              {/* Input/Slider 2: Ticket Médio */}
              <div className="space-y-2.5 pt-3 border-t border-[#CFB583]/30">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#211A17] flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#CFB583]" />
                    <span>Ticket médio por cliente (R$)</span>
                  </label>
                  <div className="flex items-center gap-1 bg-[#EFE5D5] px-3 py-1 rounded-full border border-[#CFB583]/50">
                    <span className="text-xs font-semibold text-[#38271F]">R$</span>
                    <input
                      type="number"
                      min="20"
                      max="300"
                      step="5"
                      value={ticketMedio}
                      onChange={(e) => setTicketMedio(Math.max(10, Number(e.target.value)))}
                      className="w-14 bg-transparent font-serif-editorial text-xl font-bold text-[#211A17] focus:outline-none text-right"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min="20"
                  max="200"
                  step="5"
                  value={ticketMedio}
                  onChange={(e) => setTicketMedio(Number(e.target.value))}
                  className="w-full accent-[#CFB583] h-2 bg-[#EFE5D5] rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#38271F]/60 font-mono">
                  <span>R$ 20 (Café/Doce)</span>
                  <span>R$ 50 (Brunch/Refeição)</span>
                  <span>R$ 150+ (Gastrobar/Jantar)</span>
                </div>
              </div>

              {/* Selector 3: Frequência Mensal */}
              <div className="space-y-2.5 pt-3 border-t border-[#CFB583]/30">
                <label className="text-xs font-semibold text-[#211A17] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#38271F]" />
                    Frequência média de visitas/mês
                  </span>
                  <span className="text-xs font-bold text-[#E77759]">{frequencia}x por mês</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFrequencia(f)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        frequencia === f
                          ? "bg-[#211A17] text-[#F8F4EC] border-[#211A17]"
                          : "bg-white text-[#38271F] border-[#CFB583]/45 hover:border-[#E77759]"
                      }`}
                    >
                      {f === 1 ? "1x (Novo cliente)" : f === 2 ? "2x (Recorrência)" : "3x (Frequente)"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Micro Helper Note */}
            <div className="pt-4 border-t border-[#CFB583]/30 text-[11px] text-[#38271F]/70 flex items-start gap-2 bg-[#EFE5D5]/50 p-3 rounded-xl">
              <Sparkles className="w-4 h-4 text-[#E77759] shrink-0 mt-0.5" />
              <span>
                Com apenas <strong>1 novo cliente a cada 1,5 dia</strong> (20 no mês),
                a Martita já ativa uma nova alavanca de receita contínua.
              </span>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Mensal */}
              <div className="bg-[#F8F4EC] rounded-2xl p-6 border border-[#CFB583]/50 shadow-sm relative overflow-hidden">
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#38271F]/70">
                  Receita Bruta Adicional Estimada / Mês
                </span>
                <p className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#E77759] mt-2">
                  {formatBRL(receitaMensal)}
                </p>
                <p className="text-xs text-[#38271F]/75 mt-1">
                  Baseado em {novosClientes} clientes &times; {formatBRL(ticketMedio)}
                </p>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#E77759]/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-[#E77759]" />
                </div>
              </div>

              {/* Card 2: Anual */}
              <div className="bg-[#211A17] text-[#F8F4EC] rounded-2xl p-6 border border-[#CFB583]/40 shadow-md relative overflow-hidden">
                <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#CFB583]">
                  Potencial em 12 Meses
                </span>
                <p className="font-serif-editorial text-4xl sm:text-5xl font-bold text-[#CFB583] mt-2">
                  {formatBRL(receitaAnual)}
                </p>
                <p className="text-xs text-[#F8F4EC]/75 mt-1">
                  {atendimentosAnuais} atendimentos adicionais no ano
                </p>
                <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#CFB583]/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#CFB583]" />
                </div>
              </div>
            </div>

            {/* Scenario Breakdown Chart */}
            <div className="bg-[#F8F4EC] rounded-[2rem] p-6 sm:p-7 border border-[#CFB583]/50 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#CFB583]/30 pb-3">
                <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[#211A17]">
                  Comparativo de Cenários de Impacto Anual
                </h4>
                <span className="text-[10px] text-[#38271F]/60 font-mono">12 Meses</span>
              </div>

              <div className="space-y-4 pt-1">
                {cenarios.map((cenario, idx) => {
                  const percent = Math.max(12, Math.round((cenario.anual / maxAnual) * 100));
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-[#211A17] flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: cenario.cor }}
                          />
                          {cenario.nome}
                        </span>
                        <div className="text-right">
                          <span className="font-serif-editorial font-bold text-base text-[#211A17]">
                            {formatBRL(cenario.anual)}
                          </span>
                          <span className="text-[10px] text-[#38271F]/60 ml-1.5">
                            ({formatBRL(cenario.mensal)}/mês)
                          </span>
                        </div>
                      </div>

                      {/* Bar Representation */}
                      <div className="h-3 w-full bg-[#EFE5D5] rounded-full overflow-hidden relative">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          style={{ backgroundColor: cenario.cor }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-[#38271F]/60">
                        <span>{cenario.tag}</span>
                        <span>{cenario.clientes} clientes/mês</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mandatory Transparency & Methodology Disclaimer */}
            <div className="bg-[#F8F4EC]/70 rounded-2xl p-4 border border-[#CFB583]/40 flex items-start gap-3 text-xs text-[#38271F]/75 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-[#CFB583] shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-[#211A17]">
                  Nota de Transparência e Responsabilidade Metodológica:
                </p>
                <p className="mt-0.5">
                  Os valores acima representam uma <strong>simulação hipotética e ilustrativa de receita bruta</strong>,
                  e não uma promessa ou garantia de faturamento ou lucro líquido. O resultado real depende de fatores como
                  volume de busca, concorrência na região, localização em Canasvieiras, qualidade do atendimento,
                  sazonalidade turística de Florianópolis e capacidade operacional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

