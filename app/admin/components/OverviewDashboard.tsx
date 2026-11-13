"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Compass,
  Smartphone,
  Monitor,
  Tablet,
  Calendar,
  RefreshCw,
  MessageCircle,
  Phone,
  UtensilsCrossed,
  Sparkles,
  ExternalLink,
} from "lucide-react";

interface OverviewDashboardProps {
  onNavigateToTab?: (tab: string) => void;
}

export function OverviewDashboard({ onNavigateToTab }: OverviewDashboardProps) {
  const [period, setPeriod] = useState<string>("7d");
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<any>(null);

  const fetchAnalytics = async (selectedPeriod = period) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?period=${selectedPeriod}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load analytics data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(period);
  }, [period]);

  const summary = data?.summary || {
    totalSessions: 0,
    totalPageviews: 0,
    uniqueVisitors: 0,
    bounceRate: 0,
    avgDuration: 0,
    totalConversions: 0,
    whatsappClicks: 0,
    phoneClicks: 0,
    menuViews: 0,
    conversionRate: 0,
    diffSessionsPercent: 0,
    diffPageviewsPercent: 0,
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs.toString().padStart(2, "0")}s`;
  };

  const timeline = data?.trafficTimeline || [];
  const maxSessions = Math.max(...timeline.map((t: any) => t.sessions), 1);

  return (
    <div className="space-y-8">
      {/* Top Header: Title & Period Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#CFB583]/15">
        <div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#211A17] flex items-center gap-2.5">
            <span>Visão Geral &amp; Métricas em Tempo Real</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Feed ativo" />
          </h2>
          <p className="text-xs sm:text-sm text-[#38271F]/70 mt-1">
            Métricas de tráfego próprio, comportamento do consumidor e conversões da Martita.
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "today", label: "Hoje" },
            { id: "yesterday", label: "Ontem" },
            { id: "7d", label: "7 Dias" },
            { id: "30d", label: "30 Dias" },
            { id: "this_month", label: "Este Mês" },
            { id: "last_month", label: "Mês Anterior" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setPeriod(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-medium whitespace-nowrap transition-all ${
                period === item.id
                  ? "bg-[#211A17] text-[#CFB583] shadow-sm"
                  : "bg-white/80 hover:bg-white text-[#38271F]/70 border border-[#CFB583]/20"
              }`}
            >
              {item.label}
            </button>
          ))}

          <button
            onClick={() => fetchAnalytics(period)}
            title="Recarregar dados"
            className="p-2 rounded-lg bg-white/80 hover:bg-white border border-[#CFB583]/20 text-[#38271F]/70 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#CFB583]" : ""}`} />
          </button>
        </div>
      </div>

      {/* 6 Key Performance Indicators (Cards com percentual de comparação) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Sessões / Acessos */}
        <div className="p-5 rounded-2xl bg-white border border-[#CFB583]/25 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#38271F]/60 text-xs font-medium mb-3">
            <span>Acessos no Período</span>
            <Users className="w-4 h-4 text-[#CFB583]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif-editorial text-3xl font-bold text-[#211A17]">
              {loading ? "..." : summary.totalSessions.toLocaleString("pt-BR")}
            </span>
            <span
              className={`text-xs font-mono font-semibold flex items-center ${
                summary.diffSessionsPercent >= 0 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {summary.diffSessionsPercent >= 0 ? "+" : ""}
              {summary.diffSessionsPercent}%
            </span>
          </div>
          <p className="text-[11px] text-[#38271F]/50 mt-1">vs. período anterior</p>
        </div>

        {/* Card 2: Visualizações de Página */}
        <div className="p-5 rounded-2xl bg-white border border-[#CFB583]/25 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#38271F]/60 text-xs font-medium mb-3">
            <span>Pageviews</span>
            <Eye className="w-4 h-4 text-[#E77759]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif-editorial text-3xl font-bold text-[#211A17]">
              {loading ? "..." : summary.totalPageviews.toLocaleString("pt-BR")}
            </span>
            <span
              className={`text-xs font-mono font-semibold flex items-center ${
                summary.diffPageviewsPercent >= 0 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {summary.diffPageviewsPercent >= 0 ? "+" : ""}
              {summary.diffPageviewsPercent}%
            </span>
          </div>
          <p className="text-[11px] text-[#38271F]/50 mt-1">
            {(summary.totalPageviews / Math.max(1, summary.totalSessions)).toFixed(1)} páginas/sessão
          </p>
        </div>

        {/* Card 3: Duração Média */}
        <div className="p-5 rounded-2xl bg-white border border-[#CFB583]/25 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#38271F]/60 text-xs font-medium mb-3">
            <span>Duração Média</span>
            <Clock className="w-4 h-4 text-[#CFB583]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif-editorial text-2xl font-bold text-[#211A17]">
              {loading ? "..." : formatDuration(summary.avgDuration)}
            </span>
          </div>
          <p className="text-[11px] text-[#38271F]/50 mt-1">Tempo de leitura do visitante</p>
        </div>

        {/* Card 4: Taxa de Rejeição */}
        <div className="p-5 rounded-2xl bg-white border border-[#CFB583]/25 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#38271F]/60 text-xs font-medium mb-3">
            <span>Taxa de Rejeição</span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif-editorial text-3xl font-bold text-[#211A17]">
              {loading ? "..." : `${summary.bounceRate}%`}
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-1">
            {100 - summary.bounceRate}% taxa de engajamento
          </p>
        </div>

        {/* Card 5: Cliques no WhatsApp */}
        <div className="p-5 rounded-2xl bg-white border border-[#CFB583]/25 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#38271F]/60 text-xs font-medium mb-3">
            <span>Cliques WhatsApp</span>
            <MessageCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif-editorial text-3xl font-bold text-emerald-700">
              {loading ? "..." : summary.whatsappClicks}
            </span>
            <span className="text-xs font-mono font-medium text-emerald-600">Alta intenção</span>
          </div>
          <p className="text-[11px] text-[#38271F]/50 mt-1">Leads para reservas e dúvidas</p>
        </div>

        {/* Card 6: Taxa de Conversão Global */}
        <div className="p-5 rounded-2xl bg-white border border-[#CFB583]/25 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-[#38271F]/60 text-xs font-medium mb-3">
            <span>Taxa de Conversão</span>
            <TrendingUp className="w-4 h-4 text-[#E77759]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-serif-editorial text-3xl font-bold text-[#E77759]">
              {loading ? "..." : `${summary.conversionRate}%`}
            </span>
          </div>
          <p className="text-[11px] text-[#38271F]/50 mt-1">
            {summary.totalConversions} ações de alto valor
          </p>
        </div>
      </div>

      {/* Main Charts Row: Timeline & Channel Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Timeline Chart (Col 8) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
                Evolução de Acessos no Tempo
              </h3>
              <p className="text-xs text-[#38271F]/60">Sessões e visualizações registradas no período selecionado</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[#211A17]">
                <span className="w-3 h-3 rounded-full bg-[#CFB583]" />
                Sessões
              </span>
              <span className="flex items-center gap-1.5 text-[#38271F]/60">
                <span className="w-3 h-3 rounded-full bg-[#E77759]/40" />
                Pageviews
              </span>
            </div>
          </div>

          {/* Simple Clean Responsive SVG Bar Chart */}
          <div className="h-64 flex items-end gap-2 sm:gap-3 pt-6 pb-2 border-b border-[#CFB583]/15">
            {timeline.length > 0 ? (
              timeline.map((point: any, idx: number) => {
                const heightPercent = Math.max(6, Math.round((point.sessions / maxSessions) * 100));
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#211A17] text-white text-[11px] font-mono px-2.5 py-1 rounded shadow-lg whitespace-nowrap z-20">
                      {point.date}: {point.sessions} sessões ({point.pageviews} views)
                    </div>

                    <div className="w-full max-w-[28px] flex items-end justify-center h-full">
                      <div
                        className="w-full rounded-t-lg bg-gradient-to-t from-[#CFB583] to-[#E77759] transition-all duration-300 group-hover:brightness-110 shadow-sm"
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-[#38271F]/50 truncate max-w-full">
                      {point.date}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[#38271F]/40 font-mono">
                Carregando dados da linha do tempo...
              </div>
            )}
          </div>
        </div>

        {/* Channel Distribution (Col 4) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
                Origens de Tráfego
              </h3>
              <Compass className="w-4 h-4 text-[#CFB583]" />
            </div>
            <p className="text-xs text-[#38271F]/60 mb-6">
              Participação de cada canal na atração de visitantes
            </p>

            <div className="space-y-4">
              {(data?.channelDistribution || []).map((ch: any) => (
                <div key={ch.channel} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="font-medium text-[#211A17] truncate">{ch.label}</span>
                    <span className="font-mono text-[#38271F]/60">
                      {ch.count} ({ch.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F4ECE0] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#CFB583] to-[#E77759] transition-all duration-500"
                      style={{ width: `${Math.max(4, ch.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-[#CFB583]/15 flex items-center justify-between text-xs text-[#38271F]/70">
            <span>Rastreamento UTM + Referrer ativo</span>
            <button
              onClick={() => onNavigateToTab && onNavigateToTab("marketing_sources")}
              className="text-[#E77759] font-medium hover:underline flex items-center gap-1"
            >
              <span>Ver detalhes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Second Row: Devices + Top Pages + Hourly activity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Dispositivos */}
        <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm">
          <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17] mb-2">
            Dispositivos Utilizados
          </h3>
          <p className="text-xs text-[#38271F]/60 mb-6">Distribuição mobile vs. desktop</p>

          <div className="space-y-4">
            {(data?.deviceBreakdown || []).map((d: any) => {
              const Icon = d.device === "mobile" ? Smartphone : d.device === "tablet" ? Tablet : Monitor;
              return (
                <div key={d.device} className="p-3.5 rounded-xl bg-[#F8F4EC]/60 border border-[#CFB583]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#CFB583]/20 text-[#211A17]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#211A17]">{d.label}</p>
                      <p className="text-[11px] text-[#38271F]/60">{d.count} acessos</p>
                    </div>
                  </div>
                  <span className="font-mono text-base font-bold text-[#E77759]">
                    {d.percentage}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Páginas Mais Acessadas */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
              Páginas Mais Acessadas
            </h3>
            <span className="text-xs text-[#38271F]/50 font-mono">Rankings de Pageviews</span>
          </div>
          <p className="text-xs text-[#38271F]/60 mb-6">Conteúdo com maior interesse dos visitantes</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#CFB583]/20 text-[#38271F]/60 uppercase font-mono text-[10px]">
                  <th className="pb-3">URL da Página</th>
                  <th className="pb-3 text-right">Visualizações</th>
                  <th className="pb-3 text-right">Sessões Únicas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CFB583]/10 font-sans">
                {(data?.topPages || []).map((p: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[#F8F4EC]/50 transition-colors">
                    <td className="py-3 font-mono font-medium text-[#211A17] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-[#CFB583]/20 text-[#211A17] text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{p.page}</span>
                    </td>
                    <td className="py-3 text-right font-mono text-[#211A17] font-semibold">
                      {p.views.toLocaleString("pt-BR")}
                    </td>
                    <td className="py-3 text-right font-mono text-[#38271F]/70">
                      {p.uniqueSessions.toLocaleString("pt-BR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
              Últimas Sessões Registradas
            </h3>
            <p className="text-xs text-[#38271F]/60">Feed anônimo e em tempo real dos visitantes</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#CFB583]/20 text-[#38271F]/60 uppercase font-mono text-[10px]">
                <th className="pb-3">Sessão ID</th>
                <th className="pb-3">Canal de Origem</th>
                <th className="pb-3">Dispositivo</th>
                <th className="pb-3">Página de Entrada</th>
                <th className="pb-3 text-right">Views</th>
                <th className="pb-3 text-right">Duração</th>
                <th className="pb-3 text-right">Horário</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#CFB583]/10 font-sans">
              {(data?.recentSessions || []).map((s: any) => (
                <tr key={s.id} className="hover:bg-[#F8F4EC]/50 transition-colors">
                  <td className="py-3 font-mono text-[#38271F]/80">{s.sessionId}</td>
                  <td className="py-3">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#CFB583]/15 text-[#211A17] font-medium border border-[#CFB583]/30">
                      {s.channel}
                    </span>
                  </td>
                  <td className="py-3 capitalize text-[#38271F]/80">{s.deviceType}</td>
                  <td className="py-3 font-mono text-[#38271F]/80">{s.entryPage}</td>
                  <td className="py-3 text-right font-mono font-medium">{s.pageViewsCount}</td>
                  <td className="py-3 text-right font-mono">{formatDuration(s.durationSeconds)}</td>
                  <td className="py-3 text-right font-mono text-[#38271F]/50">
                    {new Date(s.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

