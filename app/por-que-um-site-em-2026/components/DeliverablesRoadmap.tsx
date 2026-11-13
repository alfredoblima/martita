"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Layers, 
  Smartphone, 
  Sparkles, 
  MapPin, 
  Code2, 
  MessageSquare, 
  Clock, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Rocket, 
  ArrowRight,
  Flame
} from "lucide-react";

interface Deliverable {
  title: string;
  category: string;
  icon: any;
  summary: string;
  benefits: string[];
}

const DELIVERABLES: Deliverable[] = [
  {
    title: "Abertura Cinematográfica & Identidade",
    category: "Direção de Arte & Branding",
    icon: Sparkles,
    summary: "Hero section com estética refinada, tipografia elegante e fotografia gastronômica que transmitem o posicionamento premium da Martita.",
    benefits: ["Primeira impressão inesquecível", "Valorização imediata do ticket médio", "Alinhamento com a vibe autêntica da casa"]
  },
  {
    title: "Cardápio Digital Vivo & Flexível",
    category: "Engenharia & Conteúdo",
    icon: Layers,
    summary: "Estrutura categorizada por turnos (manhã, almoço, cafés especiais, happy hour, jantar) com fotos em alta resolução, descrições e preços atualizáveis.",
    benefits: ["Fim dos custos de reimpressão de papel", "Atualização instantânea de pratos sazonais", "Navegação ágil com filtros por ocasião"]
  },
  {
    title: "Engenharia de SEO Local & Google Maps",
    category: "Visibilidade & Descoberta",
    icon: MapPin,
    summary: "Otimização técnica para ranquear em buscas de alta intenção como 'café especial', 'gastrobar', 'onde comer em Bento Gonçalves' e 'brunch'.",
    benefits: ["Atração contínua de moradores e turistas", "Integração oficial com ficha do Google Maps", "Coordenadas com traçado de rota em 1 clique"]
  },
  {
    title: "Marcação Estruturada para Inteligência Artificial",
    category: "Tecnologia de Vanguarda 2026",
    icon: Code2,
    summary: "Implementação de Schema.org/Restaurant e JSON-LD para que ChatGPT, Google Gemini e Perplexity leiam e citem a Martita com precisão.",
    benefits: ["Recomendações automáticas em IAs", "Dados limpos de horários e especialidades", "Pioneirismo regional no ecossistema de busca conversacional"]
  },
  {
    title: "Experiência Mobile-First Ultrarrápida",
    category: "Performance & Usabilidade",
    icon: Smartphone,
    summary: "Desenvolvido em Next.js com carregamento em menos de 1 segundo mesmo em conexões móveis (4G/5G), sem travamentos e com design responsivo.",
    benefits: ["Zero abandono por lentidão", "Funciona perfeitamente em qualquer smartphone", "Consumo mínimo de dados móveis do visitante"]
  },
  {
    title: "Canais Diretos de Ação & WhatsApp",
    category: "Conversão Comercial",
    icon: MessageSquare,
    summary: "Botões de conversão estrategicamente posicionados com mensagem contextualizada para WhatsApp, solicitação de reservas e botão de chamada telefônica.",
    benefits: ["Atendimento mais rápido e sem atrito", "Mensagem pré-formatada informando a origem do lead", "Canal direto de reserva sem comissões de terceiros"]
  }
];

const TIMELINE_PHASES = [
  {
    phase: "Fase 01",
    timeframe: "Mês 1 • Lançamento",
    title: "Publicação & Ativação do Ativo",
    desc: "Colocação do site no ar no domínio próprio (ex: martita.com.br), configuração das ferramentas de mensuração (Google Search Console e GA4), submissão dos sitemaps e conexão com a bio do Instagram e Google Meu Negócio.",
    status: "Imediato",
    icon: Rocket
  },
  {
    phase: "Fase 02",
    timeframe: "Meses 2 a 3 • Maturação",
    title: "Indexação Local & Primeiras Descobertas",
    desc: "O Google começa a consolidar as páginas do site nos resultados de busca da Serra Gaúcha. Visitantes que pesquisam por termos locais e turistas nos fins de semana passam a encontrar a Martita organicamente.",
    status: "Consolidação",
    icon: TrendingUp
  },
  {
    phase: "Fase 03",
    timeframe: "Meses 4 a 6 • Expansão",
    title: "Fortalecimento & Sazonalidade",
    desc: "Atualização de cardápios de inverno/verão, divulgação de festivais gastronômicos, cartas de vinhos e cafés especiais. As IAs passam a citar a Martita em roteiros gastronômicos de Bento Gonçalves.",
    status: "Crescimento",
    icon: Flame
  },
  {
    phase: "Fase 04",
    timeframe: "Longo Prazo • Patrimônio Digital",
    title: "Ativo Próprio & Independência de Algoritmo",
    desc: "A Martita consolida um canal oficial próprio que não depende de pagar anúncios para ser visto nem sofre com quedas de alcance de redes sociais. O site se torna referência de autoridade e valor para a marca.",
    status: "Permanente",
    icon: ShieldCheck
  }
];

export function DeliverablesRoadmap() {
  const [activeTab, setActiveTab] = useState<"escopo" | "timeline">("escopo");

  return (
    <section id="entregaveis" className="py-24 bg-brand-dark text-brand-cream relative overflow-hidden border-t border-brand-cream/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-semibold tracking-wider uppercase mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Escopo & Cronograma Executivo</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-brand-cream tracking-tight mb-6">
            O que estamos construindo: um ativo digital completo e perene.
          </h2>

          <p className="text-brand-cream/70 font-sans text-base sm:text-lg leading-relaxed">
            Nada de soluções genéricas ou modelos prontos. Cada linha de código e escolha de design foi pensada para valorizar a essência da Martita e gerar retorno prático ao negócio.
          </p>

          {/* Toggle entre Escopo de Entregáveis e Linha do Tempo */}
          <div className="inline-flex p-1 rounded-xl bg-brand-cream/10 border border-brand-cream/15 mt-8">
            <button
              onClick={() => setActiveTab("escopo")}
              className={`px-5 py-2.5 rounded-lg text-sm font-sans font-medium transition-all ${
                activeTab === "escopo"
                  ? "bg-brand-gold text-brand-dark shadow-sm"
                  : "text-brand-cream/70 hover:text-brand-cream"
              }`}
            >
              Entregáveis Propostos (6 Pilares)
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className={`px-5 py-2.5 rounded-lg text-sm font-sans font-medium transition-all ${
                activeTab === "timeline"
                  ? "bg-brand-gold text-brand-dark shadow-sm"
                  : "text-brand-cream/70 hover:text-brand-cream"
              }`}
            >
              Evolução no Tempo (Roadmap)
            </button>
          </div>
        </div>

        {/* View 1: Escopo Detalhado */}
        {activeTab === "escopo" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {DELIVERABLES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-7 rounded-2xl bg-brand-cream/5 border border-brand-cream/10 hover:border-brand-gold/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-gold/5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-xl bg-brand-gold/15 border border-brand-gold/25 text-brand-gold group-hover:bg-brand-gold group-hover:text-brand-dark transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-brand-cream/50">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-brand-cream font-medium mb-3 group-hover:text-brand-gold transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-sm text-brand-cream/70 font-sans leading-relaxed mb-6">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-brand-cream/10 space-y-2">
                    {item.benefits.map((b, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-brand-cream/80 font-sans">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* View 2: Linha do Tempo e Maturação */}
        {activeTab === "timeline" && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            {TIMELINE_PHASES.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-2xl bg-brand-cream/5 border border-brand-cream/10 hover:border-brand-gold/30 transition-all flex flex-col sm:flex-row items-start gap-6 relative"
                >
                  <div className="p-3.5 rounded-xl bg-brand-gold/15 border border-brand-gold/25 text-brand-gold shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-brand-gold uppercase tracking-wider">
                          {p.phase}
                        </span>
                        <span className="text-xs text-brand-cream/50">•</span>
                        <span className="text-xs text-brand-cream/60 font-sans">
                          {p.timeframe}
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-brand-cream/10 border border-brand-cream/15 text-brand-cream/80">
                        {p.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-xl sm:text-2xl text-brand-cream font-medium">
                      {p.title}
                    </h3>

                    <p className="text-sm sm:text-base text-brand-cream/75 font-sans leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </div>
    </section>
  );
}

