"use client";

import React from "react";
import { type SiteConfigData } from "@/components/sections/ContactAndLocation";

// Presentation Subcomponents
import { HeroCommercial } from "./components/HeroCommercial";
import { ConsumerJourney } from "./components/ConsumerJourney";
import { InstagramVsEcosystem } from "./components/InstagramVsEcosystem";
import { AlwaysOpenBistro } from "./components/AlwaysOpenBistro";
import { CommercialPillars } from "./components/CommercialPillars";
import { GoogleSearchSimulator } from "./components/GoogleSearchSimulator";
import { AIFronteiraSection } from "./components/AIFronteiraSection";
import { MartitaOpportunities } from "./components/MartitaOpportunities";
import { IntegratedFunnelFlow } from "./components/IntegratedFunnelFlow";
import { FinancialSimulator } from "./components/FinancialSimulator";
import { AnalyticsDashboard } from "./components/AnalyticsDashboard";
import { WithVsWithoutSite } from "./components/WithVsWithoutSite";
import { DeliverablesRoadmap } from "./components/DeliverablesRoadmap";
import { ClosingAction } from "./components/ClosingAction";
import { PresentationHUD } from "./components/PresentationHUD";

interface ApresentacaoClientProps {
  config: SiteConfigData;
}

export function ApresentacaoClient({ config }: ApresentacaoClientProps) {
  return (
    <div className="min-h-screen bg-brand-dark text-brand-cream selection:bg-brand-gold selection:text-brand-dark">
      {/* Floating Presentation HUD Controls for Pitching */}
      <PresentationHUD />

      <main className="relative">
        {/* Seção 01: Hero Comercial */}
        <div id="hero">
          <HeroCommercial />
        </div>

        {/* Seção 02: A Jornada do Consumidor Mudou */}
        <div id="jornada-consumidor">
          <ConsumerJourney />
        </div>

        {/* Seção 03: Instagram Isolado vs Ecossistema Integrado */}
        <div id="instagram-vs-ecossistema">
          <InstagramVsEcosystem />
        </div>

        {/* Seção 04: Um Estabelecimento Aberto 24 Horas */}
        <div id="sempre-aberto">
          <AlwaysOpenBistro />
        </div>

        {/* Seção 05: 6 Pilares Comerciais */}
        <div id="pilares-comerciais">
          <CommercialPillars />
        </div>

        {/* Seção 06: Google Search & SEO Local */}
        <div id="google-search">
          <GoogleSearchSimulator />
        </div>

        {/* Seção 07: Busca na Era da Inteligência Artificial 2026 */}
        <div id="fronteira-ia">
          <AIFronteiraSection />
        </div>

        {/* Seção 08: 7 Ocasiões & Oportunidades Martita */}
        <div id="momentos-martita">
          <MartitaOpportunities />
        </div>

        {/* Seção 09: Fluxo Integrado de Conversão */}
        <div id="funil-conversao">
          <IntegratedFunnelFlow />
        </div>

        {/* Seção 10: Simulador de Impacto Financeiro (ROI) */}
        <div id="simulador-roi">
          <FinancialSimulator />
        </div>

        {/* Seção 11: Painel de Inteligência & Métricas (Analytics) */}
        <div id="analytics-dashboard">
          <AnalyticsDashboard />
        </div>

        {/* Seção 12: Comparativo Direto Com vs Sem Site */}
        <div id="com-vs-sem-site">
          <WithVsWithoutSite />
        </div>

        {/* Seções 13 & 14: O que Estamos Propondo Entregar & Roadmap de Evolução */}
        <div id="entregaveis">
          <DeliverablesRoadmap />
        </div>

        {/* Seção 15: Fechamento de Alto Impacto & Decisão Estratégica */}
        <div id="decisao">
          <ClosingAction whatsappNumber={config.whatsapp} />
        </div>
      </main>
    </div>
  );
}

