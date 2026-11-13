"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  Globe, 
  UtensilsCrossed, 
  MessageCircle, 
  Star, 
  ArrowRight, 
  Search, 
  Instagram, 
  Bot, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Zap, 
  TrendingUp 
} from "lucide-react";

interface StepDetail {
  id: string;
  stepNumber: string;
  title: string;
  tagline: string;
  icon: any;
  color: string;
  channels: { name: string; desc: string; icon?: any }[];
  impactSummary: string;
}

const FUNNEL_STEPS: StepDetail[] = [
  {
    id: "atracao",
    stepNumber: "01",
    title: "Atração Multicanal",
    tagline: "Onde o desejo e a intenção de consumo se iniciam",
    icon: Compass,
    color: "#E77759", // brand-terracotta
    channels: [
      { name: "Google Busca & Maps", desc: "\"Café especial em Bento Gonçalves\", \"Gastrobar para jantar\"", icon: Search },
      { name: "Assistentes de IA", desc: "Perguntas conversacionais no ChatGPT, Gemini e Perplexity", icon: Bot },
      { name: "Instagram Bio & Stories", desc: "Link direto que direciona quem viu a foto para o cardápio e endereço", icon: Instagram },
      { name: "Recomendações Locais", desc: "Turistas e moradores indicando o link do site em grupos e chats", icon: MapPin },
    ],
    impactSummary: "Capta tanto a demanda ativa (quem pesquisa no Google/IA com intenção de ir) quanto a demanda passiva (quem foi atraído pelo feed do Instagram)."
  },
  {
    id: "hub",
    stepNumber: "02",
    title: "O Hub Oficial (Site)",
    tagline: "Ambiente 100% controlado, sem anúncios de concorrentes",
    icon: Globe,
    color: "#CFB583", // brand-gold
    channels: [
      { name: "Primeira Impressão Premium", desc: "Identidade visual sofisticada que valoriza o produto e justifica o preço" },
      { name: "Velocidade Instantânea", desc: "Abre em menos de 1 segundo direto no celular, sem login nem burocracia" },
      { name: "Zero Ruído de Concorrentes", desc: "Ao contrário das redes sociais, aqui não há anúncios de outros cafés no meio da tela" },
      { name: "Disponibilidade 24/7", desc: "Responde dúvidas de cardápio e horário mesmo quando o salão está fechado" },
    ],
    impactSummary: "O site funciona como o hall de entrada digital da Martita: transmite o mesmo aconchego e padrão de qualidade que o cliente encontrará presencialmente."
  },
  {
    id: "experiencia",
    stepNumber: "03",
    title: "Experiência & Segurança",
    tagline: "Apresentação que elimina dúvidas e estimula o apetite",
    icon: UtensilsCrossed,
    color: "#CFB583",
    channels: [
      { name: "Cardápio Vivo com Fotos Reais", desc: "Pratos, drinks autorais e doces com fotos de alta resolução do ensaio" },
      { name: "Preços & Ingredientes Transparentes", desc: "O visitante escolhe antecipadamente, reduzindo atrito e agilizando o atendimento" },
      { name: "Atmosfera e Espaço Físico", desc: "Mostra o ambiente aconchegante, ideal para casais, famílias ou trabalho remoto" },
      { name: "Horários & Endereço Preciso", desc: "Certeza de que a casa está aberta e rota pronta com 1 clique" },
    ],
    impactSummary: "O consumidor que vê fotos de alta qualidade e cardápio organizado toma a decisão 3x mais rápido e já chega ao salão com escolhas em mente."
  },
  {
    id: "conversao",
    stepNumber: "04",
    title: "Conversão Direta",
    tagline: "Do interesse digital ao ato prático de visitar ou reservar",
    icon: MessageCircle,
    color: "#25D366", // WhatsApp green / highlight
    channels: [
      { name: "WhatsApp com Mensagem Pronta", desc: "\"Olá! Estava no site da Martita e gostaria de reservar uma mesa...\"" },
      { name: "1 Clique para Traçar Rota", desc: "Abre diretamente no Google Maps, Apple Maps ou Waze com as coordenadas exatas" },
      { name: "Ligação Telefônica Direta", desc: "Acesso rápido ao telefone para quem prefere contato tradicional imediato" },
      { name: "Compartilhamento no Grupo", desc: "Facilidade para a pessoa enviar o link do site no grupo da família ou amigos" },
    ],
    impactSummary: "Zero fricção. O cliente não precisa digitar número, procurar endereço nos destaques do Instagram ou esperar horas por um Direct."
  },
  {
    id: "retencao",
    stepNumber: "05",
    title: "Visita, Ticket & Fidelização",
    tagline: "O ciclo que retroalimenta a autoridade da marca",
    icon: Star,
    color: "#E77759",
    channels: [
      { name: "Consumo Presencial no Salão", desc: "Cliente chega informado e confiante, pronto para saborear a experiência" },
      { name: "Aumento do Ticket Médio", desc: "Ao conhecer os drinks e sobremesas pelo site, o pedido tende a ser mais completo" },
      { name: "Novas Avaliações 5 Estrelas", desc: "Expectativa alinhada com a realidade gera elogios recorrentes no Google" },
      { name: "Retorno Recorrente", desc: "O site permanece salvo para consultar novos horários e pratos sazonais" },
    ],
    impactSummary: "A engrenagem se completa: clientes satisfeitos geram avaliações no Google que atraem a próxima onda de novos visitantes."
  }
];

export function IntegratedFunnelFlow() {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = FUNNEL_STEPS[activeStepIndex];

  return (
    <section id="funil-conversao" className="py-24 bg-brand-dark/95 text-brand-cream relative overflow-hidden border-t border-brand-cream/10">
      {/* Background accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-brand-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header da Seção */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs font-semibold tracking-wider uppercase mb-4">
            <Zap className="w-3.5 h-3.5" />
            <span>Arquitetura Comercial de Alta Conversão</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-brand-cream tracking-tight mb-6">
            O fluxo integrado de conversão: da primeira busca até a mesa do salão.
          </h2>

          <p className="text-brand-cream/70 font-sans text-base sm:text-lg leading-relaxed">
            Um site profissional não existe no vácuo. Ele é o coração que unifica o tráfego do Google, as buscas de inteligência artificial, o feed do Instagram e os contatos no WhatsApp em um motor previsível de novos clientes.
          </p>
        </div>

        {/* Timeline Horizontal dos 5 Estágios */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-12">
          {FUNNEL_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isSelected = activeStepIndex === idx;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`text-left p-4 rounded-xl border transition-all duration-300 relative flex flex-col justify-between ${
                  isSelected
                    ? "bg-brand-cream/10 border-brand-gold shadow-lg shadow-brand-gold/10 scale-[1.02]"
                    : "bg-brand-cream/5 border-brand-cream/10 hover:border-brand-cream/25 hover:bg-brand-cream/[0.07]"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeStepGlow"
                    className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-brand-gold text-brand-dark text-[10px] font-bold tracking-wider uppercase"
                  >
                    Ativo
                  </motion.div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-brand-gold font-bold">
                      FASE {step.stepNumber}
                    </span>
                    <Icon className="w-4 h-4 text-brand-cream/70" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-brand-cream leading-snug">
                    {step.title}
                  </h3>
                </div>

                <div className="mt-4 pt-2 border-t border-brand-cream/10 flex items-center justify-between text-xs text-brand-cream/50">
                  <span>{step.channels.length} canais</span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "text-brand-gold translate-x-1" : ""}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Painel do Estágio Ativo com Visual Interativo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="p-6 sm:p-10 rounded-2xl bg-brand-cream/5 border border-brand-cream/15 backdrop-blur-md relative overflow-hidden"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Coluna descritiva */}
              <div className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-md bg-brand-gold/15 text-brand-gold text-xs font-mono font-semibold">
                  <span>ETAPA {activeStep.stepNumber} DE 05</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-4xl text-brand-cream leading-tight">
                  {activeStep.title}
                </h3>

                <p className="text-brand-gold font-serif text-lg italic">
                  &ldquo;{activeStep.tagline}&rdquo;
                </p>

                <p className="text-brand-cream/80 font-sans text-sm sm:text-base leading-relaxed">
                  {activeStep.impactSummary}
                </p>

                <div className="p-4 rounded-xl bg-brand-dark/70 border border-brand-cream/10 flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-brand-gold shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-brand-cream/75 leading-relaxed">
                    <strong className="text-brand-cream font-semibold">Impacto no negócio:</strong> Esta etapa reduz o custo de aquisição de clientes ao transformar tráfego gratuito e orgânico em visitas presenciais com alto valor de consumo.
                  </p>
                </div>
              </div>

              {/* Coluna com cards de canais e evidências */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeStep.channels.map((ch, i) => (
                  <div
                    key={i}
                    className="p-4 sm:p-5 rounded-xl bg-brand-dark/60 border border-brand-cream/10 hover:border-brand-gold/30 transition-all group"
                  >
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-2 h-2 rounded-full bg-brand-gold group-hover:scale-125 transition-transform" />
                      <h4 className="font-serif text-base sm:text-lg text-brand-cream font-medium">
                        {ch.name}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-brand-cream/65 font-sans leading-relaxed">
                      {ch.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Flow diagram footer */}
            <div className="mt-10 pt-6 border-t border-brand-cream/10 flex flex-wrap items-center justify-between gap-4 text-xs font-sans text-brand-cream/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Processo 100% automatizado pelo site e integrado ao WhatsApp</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-brand-gold">
                <span>Clique nos estágios acima para navegar pelo fluxo</span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

