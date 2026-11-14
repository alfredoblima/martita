"use client";

import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Instagram,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  CalendarClock,
  ShoppingBag,
  Truck,
  TicketPercent,
  Award,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { MartitaLogo } from "@/components/ui/MartitaLogo";
import { buildWhatsAppLink } from "@/lib/utils";

export interface SiteConfigData {
  brandName: string;
  brandTagline: string;
  address: string;
  cityState: string;
  openingHours: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  email: string;
  mapLat?: number | null;
  mapLng?: number | null;
  mapQuery?: string | null;
  enableReservations: boolean;
  enableOnlineOrders: boolean;
  enableDelivery: boolean;
  enableCoupons: boolean;
  enableLoyalty: boolean;
}

interface ContactAndLocationProps {
  config: SiteConfigData;
}

export function ContactAndLocation({ config }: ContactAndLocationProps) {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Informações / Eventos / Atendimento",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Não foi possível enviar sua mensagem.");
        return;
      }

      setStatus("success");
      setFormState({
        name: "",
        email: "",
        phone: "",
        subject: "Informações / Eventos / Atendimento",
        message: "",
      });
    } catch {
      setStatus("error");
      setErrorMsg("Erro de conexão ao enviar sua mensagem.");
    }
  };

  // Safe OpenStreetMap embed without exposing any frontend API keys
  const lat = config.mapLat ?? -27.4316;
  const lng = config.mapLng ?? -48.4596;
  const bbox = `${lng - 0.012}%2C${lat - 0.008}%2C${lng + 0.012}%2C${lat + 0.008}`;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`;

  const futureModules = [
    {
      icon: CalendarClock,
      title: "Reservas de Mesas",
      desc: "Agendamento prioritário para brunch, almoço e noites de gastrobar.",
      enabled: config.enableReservations,
    },
    {
      icon: ShoppingBag,
      title: "Pedidos Online & Retirada",
      desc: "Peça seus croissants e cafés especiais antecipadamente pelo site.",
      enabled: config.enableOnlineOrders,
    },
    {
      icon: Truck,
      title: "Delivery Martita",
      desc: "Experiência Martita entregue com cuidado no seu endereço.",
      enabled: config.enableDelivery,
    },
    {
      icon: TicketPercent,
      title: "Cupons & Experiências",
      desc: "Vouchers exclusivos e benefícios sazonais para clientes.",
      enabled: config.enableCoupons,
    },
    {
      icon: Award,
      title: "Clube de Fidelidade",
      desc: "Acumule momentos e desfrute de cortesias selecionadas.",
      enabled: config.enableLoyalty,
    },
  ];

  return (
    <footer
      id="contato"
      className="relative bg-[#EFE5D5] text-[#211A17] pt-24 pb-12 border-t border-[#CFB583]/45 overflow-hidden scroll-mt-24 xl:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-20">
        {/* Top Section: Location, Contact Cards & Configurable Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left 5 Cols: Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F8F4EC] border border-[#CFB583]/60">
              <MapPin className="w-3.5 h-3.5 text-[#E77759]" />
              <span className="text-[11px] uppercase tracking-[0.28em] font-semibold text-[#38271F]">
                Visite a Martita
              </span>
            </div>

            <h2 className="font-serif-editorial text-4xl sm:text-5xl font-normal text-[#211A17] leading-tight">
              Localização, Horários &{" "}
              <span className="italic font-semibold text-[#E77759]">
                Contato
              </span>
            </h2>

            <p className="text-sm sm:text-base text-[#38271F]/80 leading-relaxed">
              Todas as informações abaixo são gerenciadas em tempo real pelo Painel Administrativo da Martita. Entre em contato para eventos, grupos ou dúvidas.
            </p>

            {/* Administrable Info Cards */}
            <div className="space-y-4 pt-2">
              <div className="p-5 rounded-2xl bg-[#F8F4EC] border border-[#CFB583]/45 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EFE5D5] flex items-center justify-center shrink-0 text-[#E77759]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#38271F]/70 block">
                    Endereço & Região
                  </span>
                  <p className="font-serif-editorial italic text-xl font-semibold text-[#211A17] mt-0.5">
                    {config.cityState || "Canasvieiras — Florianópolis, SC"}
                  </p>
                  <p className="text-xs text-[#38271F]/80 mt-0.5">
                    {config.address ||
                      "Configure o logradouro completo no Painel Administrativo"}
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8F4EC] border border-[#CFB583]/45 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#EFE5D5] flex items-center justify-center shrink-0 text-[#E77759]">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#38271F]/70 block">
                    Horários de Funcionamento
                  </span>
                  <p className="text-sm font-medium text-[#211A17] mt-1 whitespace-pre-line">
                    {config.openingHours ||
                      "Do café da manhã ao gastrobar noturno.\nConfigure os horários oficiais no Painel Administrativo."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a
                  href={buildWhatsAppLink(
                    config.whatsapp,
                    "Olá! Gostaria de falar com o atendimento da Martita Café & Gastrobar."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-2xl bg-[#211A17] text-[#F8F4EC] hover:bg-[#E77759] transition-colors flex items-center gap-3.5 shadow-md"
                >
                  <MessageCircle className="w-5 h-5 text-[#CFB583] shrink-0" />
                  <div>
                    <span className="text-[9px] uppercase tracking-[0.22em] text-[#CFB583] block">
                      Atendimento Rápido
                    </span>
                    <span className="text-sm font-semibold">
                      {config.whatsapp ? config.whatsapp : "WhatsApp Martita"}
                    </span>
                  </div>
                </a>

                {config.instagram ? (
                  <a
                    href={
                      config.instagram.startsWith("http")
                        ? config.instagram
                        : `https://instagram.com/${config.instagram.replace("@", "")}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#CFB583]/60 text-[#211A17] hover:border-[#E77759] transition-colors flex items-center gap-3.5"
                  >
                    <Instagram className="w-5 h-5 text-[#E77759] shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.22em] text-[#38271F]/70 block">
                        Instagram Oficial
                      </span>
                      <span className="text-sm font-semibold">
                        {config.instagram}
                      </span>
                    </div>
                  </a>
                ) : (
                  <Link
                    href="/admin"
                    className="p-4 rounded-2xl bg-[#F8F4EC] border border-[#CFB583]/60 text-[#211A17] hover:border-[#E77759] transition-colors flex items-center gap-3.5"
                  >
                    <Instagram className="w-5 h-5 text-[#E77759] shrink-0" />
                    <div>
                      <span className="text-[9px] uppercase tracking-[0.22em] text-[#38271F]/70 block">
                        Redes Sociais
                      </span>
                      <span className="text-xs font-semibold">
                        Configurar no Admin
                      </span>
                    </div>
                  </Link>
                )}
              </div>

              {(config.phone || config.email) && (
                <div className="p-4 rounded-2xl bg-[#F8F4EC]/75 border border-[#CFB583]/35 flex flex-wrap items-center gap-6 text-xs text-[#38271F]">
                  {config.phone && (
                    <span className="inline-flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#E77759]" />
                      {config.phone}
                    </span>
                  )}
                  {config.email && (
                    <span className="inline-flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#E77759]" />
                      {config.email}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right 7 Cols: Configurable Map + Real Contact Form */}
          <div className="lg:col-span-7 space-y-8">
            {/* Configurable Map (Keyless OpenStreetMap Integration) */}
            <div className="rounded-[2rem] overflow-hidden border-2 border-[#CFB583]/50 shadow-xl bg-[#F8F4EC]">
              <div className="h-64 sm:h-72 w-full relative">
                <iframe
                  title="Mapa de Localização Martita Café & Gastrobar"
                  src={osmEmbedUrl}
                  className="w-full h-full border-0 filter contrast-[1.02] sepia-[0.12]"
                  loading="lazy"
                />
              </div>
              <div className="px-6 py-3.5 bg-[#211A17] text-[#F8F4EC] flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[#CFB583] font-medium">
                  Mapa Interativo Configurável • Sem exposição de chaves de API
                </span>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="uppercase tracking-[0.18em] text-[10px] font-semibold text-[#E77759] hover:underline"
                >
                  Abrir Mapa Ampliado →
                </a>
              </div>
            </div>

            {/* Real Database-Backed Contact Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-[2rem] bg-[#F8F4EC] border border-[#CFB583]/50 shadow-lg space-y-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.26em] text-[#E77759] font-bold">
                    Canal Direto
                  </span>
                  <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#211A17]">
                    Envie uma mensagem para a Martita
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] font-semibold text-[#38271F] mb-1.5">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.name}
                    onChange={(e) =>
                      setFormState({ ...formState, name: e.target.value })
                    }
                    placeholder="Como podemos te chamar?"
                    className="w-full px-4 py-3 rounded-xl bg-[#EFE5D5]/70 border border-[#CFB583]/50 text-sm text-[#211A17] focus:outline-none focus:border-[#E77759]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] font-semibold text-[#38271F] mb-1.5">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={formState.email}
                    onChange={(e) =>
                      setFormState({ ...formState, email: e.target.value })
                    }
                    placeholder="seu@email.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#EFE5D5]/70 border border-[#CFB583]/50 text-sm text-[#211A17] focus:outline-none focus:border-[#E77759]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] font-semibold text-[#38271F] mb-1.5">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formState.phone}
                    onChange={(e) =>
                      setFormState({ ...formState, phone: e.target.value })
                    }
                    placeholder="(48) 99999-9999"
                    className="w-full px-4 py-3 rounded-xl bg-[#EFE5D5]/70 border border-[#CFB583]/50 text-sm text-[#211A17] focus:outline-none focus:border-[#E77759]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.18em] font-semibold text-[#38271F] mb-1.5">
                    Assunto
                  </label>
                  <select
                    value={formState.subject}
                    onChange={(e) =>
                      setFormState({ ...formState, subject: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#EFE5D5]/70 border border-[#CFB583]/50 text-sm text-[#211A17] focus:outline-none focus:border-[#E77759]"
                  >
                    <option value="Informações / Eventos / Atendimento">
                      Informações & Atendimento
                    </option>
                    <option value="Aniversários & Confraternizações">
                      Aniversários & Confraternizações
                    </option>
                    <option value="Sugestões ou Elogios">
                      Sugestões ou Elogios
                    </option>
                    <option value="Parcerias & Fornecedores">
                      Parcerias & Fornecedores
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.18em] font-semibold text-[#38271F] mb-1.5">
                  Mensagem *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formState.message}
                  onChange={(e) =>
                    setFormState({ ...formState, message: e.target.value })
                  }
                  placeholder="Conte-nos como podemos tornar seu momento especial..."
                  className="w-full px-4 py-3 rounded-xl bg-[#EFE5D5]/70 border border-[#CFB583]/50 text-sm text-[#211A17] focus:outline-none focus:border-[#E77759]"
                />
              </div>

              {status === "success" && (
                <div className="p-3.5 rounded-xl bg-emerald-900/10 border border-emerald-700/30 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-700" />
                  <span>
                    Mensagem recebida com sucesso! Nossa equipe responderá em breve.
                  </span>
                </div>
              )}

              {status === "error" && (
                <div className="p-3.5 rounded-xl bg-rose-900/10 border border-rose-700/30 text-rose-900 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-700" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#211A17] text-[#F8F4EC] text-xs uppercase tracking-[0.22em] font-semibold hover:bg-[#E77759] transition-colors disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {status === "submitting" ? "Enviando..." : "Enviar Mensagem"}
                </span>
              </button>
            </form>
          </div>
        </div>

        {/* Architectural Preparation for Upcoming Commercial Features (Honest Status, Not Fake Operational) */}
        <div className="p-8 sm:p-10 rounded-[2rem] bg-[#F8F4EC] border border-[#CFB583]/45 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#CFB583]/30 pb-5">
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] font-bold text-[#E77759]">
                <Sparkles className="w-3.5 h-3.5" />
                Ecossistema Digital Martita
              </span>
              <h3 className="font-serif-editorial text-2xl sm:text-3xl text-[#211A17] mt-1">
                Experiências & Serviços Digitais
              </h3>
            </div>
            <p className="text-xs text-[#38271F]/75 max-w-md">
              Estrutura preparada para expansão comercial. Enquanto os módulos de autoatendimento estiverem em ativação, nosso atendimento funciona diretamente via WhatsApp e presencialmente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {futureModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div
                  key={mod.title}
                  className="p-4 rounded-2xl bg-[#EFE5D5]/55 border border-[#CFB583]/35 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Icon className="w-5 h-5 text-[#E77759]" />
                      <span
                        className={`text-[9px] uppercase tracking-[0.18em] px-2.5 py-0.5 rounded-full font-bold ${
                          mod.enabled
                            ? "bg-emerald-800 text-white"
                            : "bg-[#CFB583]/35 text-[#38271F]"
                        }`}
                      >
                        {mod.enabled ? "Ativo via WhatsApp" : "Em Breve"}
                      </span>
                    </div>
                    <h4 className="font-serif-editorial italic text-lg font-semibold text-[#211A17]">
                      {mod.title}
                    </h4>
                    <p className="text-[11px] text-[#38271F]/75 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Brand Footer */}
        <div className="pt-8 border-t border-[#CFB583]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <MartitaLogo size="sm" />

          <p className="text-xs text-[#38271F]/75 text-center">
            © {new Date().getFullYear()} Martita — Café & Gastrobar. Todos os direitos reservados.
          </p>

          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#CFB583]/60 text-xs text-[#38271F] hover:border-[#E77759] hover:text-[#E77759] transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Painel Administrativo</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}

