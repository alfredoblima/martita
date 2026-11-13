"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coffee,
  Sun,
  Utensils,
  Wine,
  CakeSlice,
  MapPin,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { SafeImage } from "@/components/ui/SafeImage";

interface MomentOpportunity {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  commercialValue: string;
  dishes: string[];
}

const MOMENTS: MomentOpportunity[] = [
  {
    id: "cafe-manha",
    category: "08h00 - 11h00",
    title: "Café da Manhã & Pães Artesanais",
    subtitle: "Despertar com aroma e crocância na manteiga",
    description:
      "A primeira refeição do dia é uma oportunidade gigante para captar quem busca qualidade acima da padaria convencional: croissants recheados, pão de queijo quentinho, mistos especiais e cafés espressos com crema densa.",
    image: "/images/martita/produtos/croissant-presunto-queijo-mesa.jpg",
    commercialValue: "Atrai rotina diária de moradores e café matinal de turistas.",
    dishes: ["Croissant Presunto & Queijo", "Misto Quente Especial", "Café com Leite", "Pão na Chapa"],
  },
  {
    id: "brunch",
    category: "10h30 - 13h00",
    title: "Brunch Autoral & Encontros Sem Pressa",
    subtitle: "A tendência gastronômica que mais cresce",
    description:
      "O brunch é a celebração dos fins de semana e manhãs ensolaradas. Pratos fotogênicos e equilibrados que estimulam o compartilhamento espontâneo nas redes e ticket médio superior.",
    image: "/images/martita/ovos-bacon-abacate-top.jpg",
    commercialValue: "Ticket médio elevado e forte atratividade para casais e grupos.",
    dishes: ["Ovos com Bacon & Abacate", "Bandeja Brunch Completa", "Suco Natural na Taça", "Tigela de Frutas"],
  },
  {
    id: "almoco",
    category: "12h00 - 15h00",
    title: "Almoço Reconfortante & Massas Artesanais",
    subtitle: "Sabores com alma para quem trabalha ou passeia",
    description:
      "Receitas de alta gastronomia com preparo artesanal impecável: fettuccine ao sugo com almôndegas suculentas, galeto ao primo canto com polenta e penne carbonara cremoso.",
    image: "/images/martita/fettuccine-almondegas.jpg",
    commercialValue: "Faturamento garantido no meio do dia com pratos individuais.",
    dishes: ["Fettuccine com Almôndegas", "Galeto ao Primo Canto", "Penne Carbonara", "Saladas Frescas"],
  },
  {
    id: "cafes-especiais",
    category: "A Qualquer Hora",
    title: "Cafés Especiais & Ritual Barista",
    subtitle: "Para os verdadeiros apreciadores do grão arábica",
    description:
      "Do espresso duplo calibrado à extração individualizada pelo método V60 na mesa, passando por iced lattes gelados e cappuccinos com latte art.",
    image: "/images/martita/produtos/cafe-coado-v60.jpg",
    commercialValue: "Gera fidelidade, recorrência e consumo complementar.",
    dishes: ["Café Coado V60", "Iced Latte Gelado", "Cappuccino Italiano", "Affogato com Sorvete"],
  },
  {
    id: "confeitaria",
    category: "15h00 - 18h00",
    title: "Confeitaria Fina & Sobremesas Autorais",
    subtitle: "A pausa indulgente do meio da tarde",
    description:
      "Vitrine de doces que encanta aos olhos e ao paladar: croissant com ganache aveludada de pistache, croissant Nutella com morangos frescos, entremets e bolos caseiros.",
    image: "/images/martita/croissant-pistache.jpg",
    commercialValue: "Consumo por impulso de alto valor agregado com café.",
    dishes: ["Croissant de Pistache", "Croissant Nutella com Morango", "Bolo Dois Amores", "Torta Banoffee"],
  },
  {
    id: "gastrobar",
    category: "18h00 - Noite",
    title: "Gastrobar, Drinks & Noite Noturna",
    subtitle: "Quando o dia termina, os brindes continuam",
    description:
      "Ao entardecer, a iluminação intimista acolhe amigos e casais: Aperol Spritz na taça, hambúrguer artesanal na panelinha com onion rings, risoto de filé mignon com funghi e petiscos do mar.",
    image: "/images/martita/produtos/hamburguer-martita-onion.jpg",
    commercialValue: "O maior ticket médio do dia em clima descontraído.",
    dishes: ["Aperol Spritz", "Hambúrguer Martita", "Risoto de Filé & Funghi", "Mix do Mar (Camarão e Lula)"],
  },
  {
    id: "turistas",
    category: "Oportunidade Floripa",
    title: "Turistas & Novos Visitantes da Ilha",
    subtitle: "O público que pesquisa na internet antes de sair",
    description:
      "Milhares de turistas de todo o Brasil e de países vizinhos (Argentina, Uruguai, etc.) hospedam-se em Canasvieiras. Quem não tem site é invisível para quem busca 'onde tomar café' no Google e no Maps.",
    image: "/images/martita/mesa-brunch-compartilhada.jpg",
    commercialValue: "Captação de fluxo novo e qualificado sem custo por anúncio.",
    dishes: ["Descoberta no Google", "Cardápio em Português e Espanhol", "Rotas no Waze/Maps", "Atendimento WhatsApp"],
  },
];

export function MartitaOpportunities() {
  const [activeMomentId, setActiveMomentId] = useState<string>("cafe-manha");
  const currentMoment = MOMENTS.find((m) => m.id === activeMomentId) || MOMENTS[0];

  return (
    <section id="oportunidades-martita" className="py-24 lg:py-32 bg-[#F8F4EC] text-[#211A17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE5D5] border border-[#CFB583]/60 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#E77759]" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#38271F]">
              Potencial Multi-Experiência
            </span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#211A17] leading-[1.08]">
            Um único estabelecimento.{" "}
            <span className="italic font-semibold text-[#E77759]">
              Diversas oportunidades
            </span>{" "}
            de descoberta.
          </h2>

          <p className="text-sm sm:text-base text-[#38271F]/80 leading-relaxed max-w-2xl mx-auto">
            A Martita possui a virtude rara de transitar com maestria do café matinal ao gastrobar noturno.
            O site oficial permite posicionar cada um desses momentos para públicos e intenções diferentes.
          </p>
        </div>

        {/* Moment Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
          {MOMENTS.map((m) => {
            const isActive = m.id === activeMomentId;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setActiveMomentId(m.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#211A17] text-[#F8F4EC] shadow-md scale-105"
                    : "bg-[#EFE5D5] text-[#38271F] border border-[#CFB583]/40 hover:border-[#E77759]"
                }`}
              >
                {m.title.split("&")[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Dynamic Showcase Card */}
        <div className="bg-[#EFE5D5]/60 rounded-[2.5rem] p-6 sm:p-10 border border-[#CFB583]/50 shadow-[0_16px_50px_rgba(33,26,23,0.06)] max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentMoment.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Photo on Left (6 cols) */}
              <div className="lg:col-span-6 h-72 sm:h-96 rounded-2xl overflow-hidden relative border border-[#CFB583]/50 shadow-md bg-[#211A17]">
                <SafeImage
                  src={currentMoment.image}
                  alt={currentMoment.title}
                  className="w-full h-full"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold bg-[#211A17]/90 text-[#CFB583] backdrop-blur-sm">
                  {currentMoment.category}
                </span>
              </div>

              {/* Text Information on Right (6 cols) */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#E77759]">
                    Momento Gastronômico
                  </span>
                  <h3 className="font-serif-editorial text-3xl sm:text-4xl font-normal text-[#211A17] mt-1 leading-tight">
                    {currentMoment.title}
                  </h3>
                  <p className="font-serif-editorial italic text-lg text-[#38271F]/80 mt-1">
                    “{currentMoment.subtitle}”
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#38271F]/85 leading-relaxed">
                  {currentMoment.description}
                </p>

                {/* Example Dishes Tags */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-[#38271F]/70">
                    Destaques no Cardápio:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentMoment.dishes.map((dish, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg bg-[#F8F4EC] text-[11px] font-semibold text-[#211A17] border border-[#CFB583]/40"
                      >
                        {dish}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Commercial Opportunity Highlight */}
                <div className="p-3.5 rounded-xl bg-white/80 border border-[#CFB583]/40 text-xs text-[#211A17] flex items-center gap-2.5 shadow-sm">
                  <Sparkles className="w-4 h-4 text-[#E77759] shrink-0" />
                  <span>
                    <strong>Oportunidade Comercial:</strong> {currentMoment.commercialValue}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

