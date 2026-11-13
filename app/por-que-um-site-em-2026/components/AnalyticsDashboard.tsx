"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  MapPin,
  Smartphone,
  Globe,
  PieChart,
  ArrowUpRight,
  AlertCircle,
} from "lucide-react";

export function AnalyticsDashboard() {
  const [activeMetricTab, setActiveMetricTab] = useState<"funil" | "origem" | "categorias">("funil");

  return (
    <section id="metricas" className="py-24 lg:py-32 bg-[#EFE5D5]/80 text-[#211A17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F4EC] border border-[#CFB583]/60 shadow-sm">
            <BarChart3 className="w-3.5 h-3.5 text-[#E77759]" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#38271F]">
              Inteligência de Dados &amp; CRO
            </span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#211A17] leading-[1.08]">
            Seu site também permite{" "}
            <span className="italic font-semibold text-[#E77759]">
              entender o comportamento
            </span>{" "}
            dos consumidores.
          </h2>

          <p className="text-sm sm:text-base text-[#38271F]/80 leading-relaxed max-w-2xl mx-auto">
            Curtidas nas redes sociais não pagam contas. No site próprio, você acompanha métricas reais de intenção de compra:
            quais pratos despertam mais interesse, quantos pedem pelo WhatsApp e quantos clicam para traçar a rota.
          </p>
        </div>

        {/* Dashboard Frame (Dark Editorial Theme) */}
        <div className="bg-[#211A17] text-[#F8F4EC] rounded-[2.5rem] p-6 sm:p-10 border border-[#CFB583]/40 shadow-2xl space-y-8 max-w-5xl mx-auto">
          {/* Top Bar: Live Indicators */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#CFB583]/20 pb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-white">
                  Painel de Inteligência de Negócio
                </h3>
                <p className="text-[11px] text-[#CFB583]">
                  Integração nativa com Google Analytics 4 &amp; Google Search Console
                </p>
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#CFB583] bg-white/10 px-3 py-1 rounded-full border border-[#CFB583]/30 self-start sm:self-auto">
              Simulação Ilustrativa
            </span>
          </div>

          {/* 4 Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-[#CFB583]/20 space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#CFB583] font-bold flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-[#E77759]" />
                Buscas no Google
              </span>
              <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-white">8.420</p>
              <p className="text-[10px] text-emerald-400">+28% impressões</p>
            </div>

            <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-[#CFB583]/20 space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#CFB583] font-bold flex items-center gap-1.5">
                <Eye className="w-3 h-3 text-[#CFB583]" />
                Visitas ao Cardápio
              </span>
              <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-white">3.150</p>
              <p className="text-[10px] text-[#CFB583]">37% novos visitantes</p>
            </div>

            <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-[#CFB583]/20 space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#CFB583] font-bold flex items-center gap-1.5">
                <MessageCircle className="w-3 h-3 text-emerald-400" />
                Cliques WhatsApp
              </span>
              <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#E77759]">284</p>
              <p className="text-[10px] text-[#F8F4EC]/70">Pedidos &amp; Reservas</p>
            </div>

            <div className="bg-white/5 p-4 sm:p-5 rounded-2xl border border-[#CFB583]/20 space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-[#CFB583] font-bold flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-rose-400" />
                Rotas / GPS
              </span>
              <p className="font-serif-editorial text-2xl sm:text-3xl font-bold text-white">412</p>
              <p className="text-[10px] text-emerald-400">Intenção de visita física</p>
            </div>
          </div>

          {/* Interactive Visualizations Switcher */}
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#CFB583]/20 pb-3">
              <div className="flex items-center gap-2">
                {[
                  { id: "funil", label: "Funil de Conversão" },
                  { id: "origem", label: "Origem dos Clientes" },
                  { id: "categorias", label: "Pratos Mais Consultados" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveMetricTab(t.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeMetricTab === t.id
                        ? "bg-[#E77759] text-white shadow-sm"
                        : "bg-white/10 text-[#CFB583] hover:bg-white/20"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-[#CFB583]/70 font-mono hidden sm:inline">
                Amostragem Mensal Conceitual
              </span>
            </div>

            {/* Tab 1: Funil */}
            {activeMetricTab === "funil" && (
              <div className="space-y-3 p-2">
                {[
                  { stage: "1. Descoberta (Buscas no Google & Redes)", count: "8.420 pessoas", width: "100%", color: "#CFB583" },
                  { stage: "2. Acesso ao Site & Ambiente", count: "3.150 acessos (37%)", width: "70%", color: "#E2CFA8" },
                  { stage: "3. Consulta Ativa de Pratos & Preços", count: "2.480 visualizações de itens (30%)", width: "50%", color: "#E77759" },
                  { stage: "4. Ação Comercial (WhatsApp / Como Chegar)", count: "696 intenções diretas (8.3%)", width: "32%", color: "#C85A3D" },
                ].map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white font-medium">{item.stage}</span>
                      <span className="text-[#CFB583] font-mono">{item.count}</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: item.width, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Origem */}
            {activeMetricTab === "origem" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-2">
                {[
                  { channel: "Google Orgânico (Busca & Maps)", share: "48%", desc: "Pessoas pesquisando café, almoço ou brunch perto de si.", color: "#E77759" },
                  { channel: "Redes Sociais (Instagram / Link na Bio)", share: "32%", desc: "Visitantes que viram um reel ou post e foram ver o cardápio.", color: "#CFB583" },
                  { channel: "Acesso Direto & Indicações", share: "14%", desc: "Clientes habituais que já salvaram o link no navegador.", color: "#EFE5D5" },
                  { channel: "Inteligência Artificial & Outros", share: "6%", desc: "Recomendações e consultas de assistentes de busca.", color: "#A68A56" },
                ].map((ch, idx) => (
                  <div key={idx} className="bg-white/5 p-4 rounded-xl border border-[#CFB583]/20 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-white">{ch.channel}</span>
                      <span className="font-serif-editorial text-xl font-bold" style={{ color: ch.color }}>{ch.share}</span>
                    </div>
                    <p className="text-[11px] text-[#F8F4EC]/70 leading-relaxed">{ch.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Categorias */}
            {activeMetricTab === "categorias" && (
              <div className="space-y-3 p-2">
                {[
                  { name: "Café da Manhã & Brunch (Croissants e Ovos)", pct: "38%", color: "#E77759" },
                  { name: "Gastrobar & Drinks (Aperol, Spritz e Chopp)", pct: "26%", color: "#CFB583" },
                  { name: "Almoço & Pratos Principais (Risotos e Massas)", pct: "21%", color: "#E2CFA8" },
                  { name: "Sobremesas & Confeitaria (Pistache e Nutella)", pct: "15%", color: "#A68A56" },
                ].map((cat, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-white">{cat.name}</span>
                      <span className="text-[#CFB583] font-bold font-mono">{cat.pct}</span>
                    </div>
                    <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: cat.pct, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ethics & Disclaimer */}
          <div className="p-4 rounded-xl bg-white/5 border border-[#CFB583]/20 text-[11px] text-[#CFB583]/80 leading-relaxed flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-[#CFB583] shrink-0 mt-0.5" />
            <p>
              <strong>Transparência:</strong> Os números acima são dados demonstrativos conceituais para ilustrar como a telemetria do site funciona na prática.
              Após a publicação do site oficial da Martita, a equipe passa a ter acesso aos números reais e auditáveis de seus próprios clientes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

