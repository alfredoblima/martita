"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  HeartHandshake, 
  TrendingUp, 
  Globe, 
  ArrowUp,
  CheckCircle2,
  Coffee
} from "lucide-react";

interface ClosingActionProps {
  whatsappNumber?: string;
}

export function ClosingAction({ whatsappNumber }: ClosingActionProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const PILLARS_SYNTHESIS = [
    {
      title: "Visibilidade Ativa",
      desc: "Ser a primeira escolha no Google e IAs no momento exato em que o cliente decide onde tomar café, almoçar ou jantar.",
      icon: Eye
    },
    {
      title: "Credibilidade Inabalável",
      desc: "Um ativo visual premium com fotos reais e cardápio organizado que transmite segurança e justifica o valor da experiência.",
      icon: ShieldCheck
    },
    {
      title: "Experiência Sem Atrito",
      desc: "Cardápio 100% vivo, horários confiáveis e rota no mapa em 1 clique, eliminando a espera por respostas no direct.",
      icon: HeartHandshake
    },
    {
      title: "Crescimento Perpétuo",
      desc: "Um patrimônio digital independente que continua atraindo novos consumidores e elevando o ticket médio mês após mês.",
      icon: TrendingUp
    }
  ];

  return (
    <section id="decisao" className="py-24 bg-gradient-to-b from-brand-dark/95 to-brand-dark text-brand-cream relative overflow-hidden border-t border-brand-cream/10">
      {/* Decorative atmospheric light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-gold/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-gold/15 border border-brand-gold/30 text-brand-gold text-xs sm:text-sm font-semibold tracking-widest uppercase mb-8"
        >
          <Sparkles className="w-4 h-4 text-brand-gold" />
          <span>Decisão Estratégica 2026</span>
        </motion.div>

        {/* Frase de Fechamento Impactante */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-brand-cream tracking-tight max-w-4xl mx-auto leading-[1.15] mb-8"
        >
          Não espere o próximo cliente encontrar outro estabelecimento.{" "}
          <span className="italic text-brand-gold font-serif">
            Prepare a Martita para ser encontrada.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-base sm:text-xl text-brand-cream/75 font-sans font-light max-w-2xl mx-auto leading-relaxed mb-16"
        >
          O público qualificado da Serra Gaúcha e os turistas que visitam a região já usam o celular para decidir sua próxima parada. O que resta saber é se eles encontrarão a Martita ou o concorrente ao lado.
        </motion.p>

        {/* 4 Pilares de Síntese */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left mb-16">
          {PILLARS_SYNTHESIS.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-brand-cream/5 border border-brand-cream/10 hover:border-brand-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-brand-gold/15 border border-brand-gold/25 flex items-center justify-center text-brand-gold mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl text-brand-cream font-medium mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-brand-cream/70 font-sans leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-brand-cream/10 flex items-center gap-1.5 text-xs text-brand-gold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Ativo garantido no projeto</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Card de Chamada para Ação */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-cream/10 via-brand-cream/5 to-transparent border border-brand-gold/30 backdrop-blur-md max-w-3xl mx-auto shadow-2xl relative"
        >
          <div className="flex items-center justify-center gap-2 text-brand-gold font-mono text-xs uppercase tracking-widest mb-3">
            <Coffee className="w-4 h-4" />
            <span>Próximo Passo Comercial</span>
          </div>

          <h3 className="font-serif text-2xl sm:text-4xl text-brand-cream font-medium mb-4">
            Vamos colocar a Martita no lugar que ela merece?
          </h3>

          <p className="text-sm sm:text-base text-brand-cream/80 font-sans leading-relaxed mb-8 max-w-xl mx-auto">
            Esta apresentação foi elaborada sob medida para demonstrar o potencial real de crescimento da Martita Café & Gastrobar. O site já está desenhado e pronto para entrar em produção.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-sans font-semibold text-base transition-all duration-300 shadow-xl shadow-emerald-600/30 hover:shadow-emerald-500/40 flex items-center justify-center gap-3 hover:scale-[1.02] group"
            >
              <Globe className="w-5 h-5 text-white" />
              <span>Visualizar site demonstrativo</span>
            </Link>

            <button
              onClick={scrollToTop}
              className="w-full sm:w-auto px-6 py-4 rounded-full bg-brand-cream/10 hover:bg-brand-cream/15 border border-brand-cream/20 text-brand-cream font-sans font-medium text-sm transition-all flex items-center justify-center gap-2"
            >
              <ArrowUp className="w-4 h-4 text-brand-gold" />
              <span>Voltar ao Topo da Apresentação</span>
            </button>
          </div>

          <p className="text-[11px] text-brand-cream/50 font-sans mt-8">
            Martita Café & Gastrobar • Apresentação Estratégica de Presença Digital 2026. Todos os direitos reservados.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

