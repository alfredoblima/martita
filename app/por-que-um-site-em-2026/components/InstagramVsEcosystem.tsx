"use client";

import React from "react";
import {
  Instagram,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

export function InstagramVsEcosystem() {
  return (
    <section id="instagram-vs-site" className="py-24 lg:py-32 bg-[#F8F4EC] text-[#211A17] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EFE5D5] border border-[#CFB583]/60 shadow-sm">
            <Instagram className="w-3.5 h-3.5 text-[#E77759]" />
            <span className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#38271F]">
              Estratégia de Canais
            </span>
          </div>

          <h2 className="font-serif-editorial text-3xl sm:text-5xl lg:text-6xl font-normal text-[#211A17] leading-[1.08]">
            Seu negócio merece mais do que{" "}
            <span className="italic font-semibold text-[#E77759]">
              depender exclusivamente
            </span>{" "}
            de uma rede social.
          </h2>

          <p className="text-sm sm:text-base text-[#38271F]/80 leading-relaxed max-w-2xl mx-auto">
            O Instagram é uma ferramenta incrível para inspirar e gerar conexão visual.
            Mas quando o cliente decide conhecer o cardápio e visitar o local, ele precisa de respostas imediatas.
          </p>
        </div>

        {/* Central Core Concept Banner */}
        <div className="max-w-4xl mx-auto rounded-[2rem] bg-gradient-to-r from-[#211A17] via-[#38271F] to-[#211A17] p-8 sm:p-10 text-center text-[#F8F4EC] border border-[#CFB583]/50 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#CFB583]">
              A Complementaridade Perfeita
            </span>
            <p className="font-serif-editorial italic text-2xl sm:text-4xl text-white font-normal leading-snug">
              “O Instagram desperta o desejo. O site organiza a informação, fortalece a confiança e facilita a decisão.”
            </p>
            <p className="text-xs sm:text-sm text-[#F8F4EC]/75 max-w-xl mx-auto">
              Não se trata de substituir o Instagram, mas de potencializá-lo com um destino seguro e profissional onde o consumidor encontra tudo em segundos.
            </p>
          </div>
        </div>

        {/* Side-by-Side Comparison Matrix */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Dependência Exclusiva do Instagram */}
          <div className="bg-[#EFE5D5]/60 rounded-[2rem] p-7 sm:p-9 border border-[#CFB583]/45 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#CFB583]/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-editorial text-xl font-bold text-[#211A17]">
                      Apenas Instagram Isolado
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-[#38271F]/60">
                      Cenário de Dependência
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full">
                  Vulnerável
                </span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-[#38271F]/85 leading-relaxed pt-2">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Algoritmo de terceiros:</strong> O alcance orgânico oscila constantemente e pode mudar sem aviso prévio.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Informações fragmentadas:</strong> Cardápio, horários e endereço ficam perdidos entre dezenas de stories e posts antigos.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Fricção no atendimento:</strong> Dependência de responder no Direct se tem croissant, qual o preço ou se está aberto. O cliente costuma desistir se a resposta demora.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Invisível no Google:</strong> Turistas e pessoas pesquisando "onde tomar café da manhã em Canasvieiras" não encontram os posts do Instagram na busca orgânica.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Sem controle de dados:</strong> A Martita não é dona da plataforma nem possui métricas completas de conversão e comportamento.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
              <span className="font-semibold">Resultado:</span> Mais esforço operacional manual e perda de clientes impacientes.
            </div>
          </div>

          {/* Card 2: Ecossistema Digital Estruturado */}
          <div className="bg-[#F8F4EC] rounded-[2rem] p-7 sm:p-9 border-2 border-[#E77759]/60 shadow-[0_16px_50px_rgba(231,119,89,0.12)] flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#CFB583]/30 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E77759]/15 flex items-center justify-center text-[#E77759]">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif-editorial text-xl font-bold text-[#211A17]">
                      Ecossistema Digital Completo
                    </h3>
                    <p className="text-[10px] uppercase tracking-wider text-[#E77759] font-bold">
                      Instagram + Site + Google + WhatsApp
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-white bg-[#E77759] px-2.5 py-1 rounded-full shadow-sm">
                  Recomendado
                </span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-[#38271F]/85 leading-relaxed pt-2">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#E77759] shrink-0 mt-0.5" />
                  <span>
                    <strong>Canal 100% próprio e perene:</strong> Domínio oficial da Martita, sob controle total da marca, sem medo de mudanças de algoritmo.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#E77759] shrink-0 mt-0.5" />
                  <span>
                    <strong>Cardápio claro e instantâneo:</strong> O visitante abre no celular, filtra por croissants, risotos, drinks ou cafés e vê fotos, ingredientes e preços em 3 segundos.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#E77759] shrink-0 mt-0.5" />
                  <span>
                    <strong>Conversão ágil via WhatsApp:</strong> Botão com mensagem pronta para reservar ou tirar dúvidas, conectado diretamente ao time.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#E77759] shrink-0 mt-0.5" />
                  <span>
                    <strong>Descoberta no Google &amp; Maps:</strong> Quem pesquisa na web ou pergunta a uma IA encontra a Martita pronta com rotas e horários.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-[#E77759] shrink-0 mt-0.5" />
                  <span>
                    <strong>Autoridade e credibilidade:</strong> Transmite o mesmo cuidado artesanal e refinamento que o cliente vivencia ao vivo no salão.
                  </span>
                </li>
              </ul>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <span className="font-semibold">Resultado:</span> Marca valorizada, mais autonomia e conversão de novos clientes 24h por dia.
            </div>
          </div>
        </div>

        {/* Integration Architecture Flow */}
        <div className="bg-[#EFE5D5]/50 rounded-[2rem] p-7 border border-[#CFB583]/40">
          <div className="text-center max-w-xl mx-auto space-y-1 mb-8">
            <span className="text-[10px] uppercase tracking-[0.26em] font-bold text-[#E77759]">
              Arquitetura de Integração
            </span>
            <h4 className="font-serif-editorial text-2xl sm:text-3xl font-normal text-[#211A17]">
              Como os Canais Conectam e Convertem Juntos
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-2xl border border-[#CFB583]/40 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
                <Instagram className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-[#211A17]">1. Desejo &amp; Atração</h5>
              <p className="text-[11px] text-[#38271F]/75">Fotos no feed e reels despertam vontade visual de viver a experiência.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-2xl border border-[#CFB583]/40 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <Search className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-[#211A17]">2. Busca Ativa</h5>
              <p className="text-[11px] text-[#38271F]/75">Quem não segue a Martita pesquisa no Google por café ou brunch na região.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#211A17] text-white p-5 rounded-2xl border border-[#CFB583]/60 text-center space-y-2 shadow-lg">
              <div className="w-10 h-10 rounded-full bg-[#E77759] text-white mx-auto flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-[#CFB583]">3. Site Oficial</h5>
              <p className="text-[11px] text-[#F8F4EC]/80">Centraliza cardápio, horários, fotos reais do salão e elimina dúvidas.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-2xl border border-[#CFB583]/40 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h5 className="font-bold text-xs uppercase tracking-wider text-[#211A17]">4. Conversão &amp; Visita</h5>
              <p className="text-[11px] text-[#38271F]/75">Cliente clica para WhatsApp, traça a rota no Maps e visita o estabelecimento.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

