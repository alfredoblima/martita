"use client";

import React, { useState, useEffect } from "react";
import {
  Compass,
  Link2,
  Share2,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Zap,
  Globe,
  Settings,
  Search,
  MessageCircle,
  Phone,
  BarChart2,
  UtensilsCrossed,
} from "lucide-react";

interface MarketingCenterProps {
  initialSubTab?: string;
}

export function MarketingCenter({ initialSubTab = "sources" }: MarketingCenterProps) {
  const [activeTab, setActiveTab] = useState<string>(initialSubTab);

  useEffect(() => {
    setActiveTab(initialSubTab);
  }, [initialSubTab]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Data states
  const [integrations, setIntegrations] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [scripts, setScripts] = useState<any[]>([]);
  const [sourcesData, setSourcesData] = useState<any>(null);

  // UTM Builder Form
  const [campaignForm, setCampaignForm] = useState({
    name: "",
    destinationUrl: "/",
    utmSource: "instagram",
    utmMedium: "bio",
    utmCampaign: "cardapio_primavera",
    utmContent: "",
    utmTerm: "",
    notes: "",
  });
  const [generatedUtmUrl, setGeneratedUtmUrl] = useState<string>("");
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  // Script Form
  const [scriptForm, setScriptForm] = useState({
    name: "",
    type: "clarity",
    code: "",
    location: "head",
    enabled: true,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [intRes, campRes, scrRes, srcRes] = await Promise.all([
        fetch("/api/admin/marketing/integrations"),
        fetch("/api/admin/marketing/campaigns"),
        fetch("/api/admin/marketing/scripts"),
        fetch("/api/admin/analytics?period=30d"),
      ]);

      if (intRes.ok) {
        const json = await intRes.json();
        setIntegrations(json.integrations || []);
      }
      if (campRes.ok) {
        const json = await campRes.json();
        setCampaigns(json.campaigns || []);
      }
      if (scrRes.ok) {
        const json = await scrRes.json();
        setScripts(json.scripts || []);
      }
      if (srcRes.ok) {
        const json = await srcRes.json();
        setSourcesData(json);
      }
    } catch (err) {
      console.error("Failed to load marketing data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Update dynamic preview of generated UTM
  useEffect(() => {
    const base = campaignForm.destinationUrl.startsWith("http")
      ? campaignForm.destinationUrl
      : `https://martita.com.br${campaignForm.destinationUrl.startsWith("/") ? campaignForm.destinationUrl : "/" + campaignForm.destinationUrl}`;
    try {
      const u = new URL(base);
      if (campaignForm.utmSource) u.searchParams.set("utm_source", campaignForm.utmSource.toLowerCase().trim());
      if (campaignForm.utmMedium) u.searchParams.set("utm_medium", campaignForm.utmMedium.toLowerCase().trim());
      if (campaignForm.utmCampaign) u.searchParams.set("utm_campaign", campaignForm.utmCampaign.toLowerCase().trim());
      if (campaignForm.utmContent) u.searchParams.set("utm_content", campaignForm.utmContent.trim());
      if (campaignForm.utmTerm) u.searchParams.set("utm_term", campaignForm.utmTerm.trim());
      setGeneratedUtmUrl(u.toString());
    } catch {
      setGeneratedUtmUrl("");
    }
  }, [campaignForm]);

  const handleCopyUrl = (urlToCopy = generatedUtmUrl) => {
    if (!urlToCopy) return;
    navigator.clipboard.writeText(urlToCopy);
    setCopiedUrl(true);
    showToast("Link com parâmetros UTM copiado para a área de transferência!");
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/marketing/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(campaignForm),
      });
      if (res.ok) {
        showToast("Campanha UTM salva com sucesso!");
        setCampaignForm({
          name: "",
          destinationUrl: "/",
          utmSource: "instagram",
          utmMedium: "bio",
          utmCampaign: "",
          utmContent: "",
          utmTerm: "",
          notes: "",
        });
        loadAll();
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao salvar campanha.");
      }
    } catch {
      alert("Erro ao conectar com o servidor.");
    }
  };

  const handleDeleteCampaign = async (id: string) => {
    if (!confirm("Deseja realmente remover esta campanha UTM?")) return;
    try {
      await fetch(`/api/admin/marketing/campaigns?id=${id}`, { method: "DELETE" });
      showToast("Campanha excluída.");
      loadAll();
    } catch {
      alert("Erro ao excluir campanha.");
    }
  };

  const handleUpdateIntegration = async (provider: string, fields: any) => {
    try {
      const res = await fetch("/api/admin/marketing/integrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, ...fields }),
      });
      if (res.ok) {
        showToast(`Configurações de ${provider.toUpperCase()} atualizadas.`);
        loadAll();
      }
    } catch {
      alert("Erro ao salvar integração.");
    }
  };

  const handleTestIntegration = async (provider: string, fields: any) => {
    try {
      const res = await fetch("/api/admin/marketing/integrations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, ...fields, action: "test_connection" }),
      });
      const json = await res.json();
      if (json.ok) {
        showToast(json.message);
      } else {
        alert(json.message);
      }
      loadAll();
    } catch {
      alert("Erro ao testar integração.");
    }
  };

  const handleAddScript = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/marketing/scripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scriptForm),
      });
      if (res.ok) {
        showToast("Script de rastreamento adicionado com sucesso!");
        setScriptForm({
          name: "",
          type: "custom",
          code: "",
          location: "head",
          enabled: true,
        });
        loadAll();
      }
    } catch {
      alert("Erro ao cadastrar script.");
    }
  };

  const handleDeleteScript = async (id: string) => {
    if (!confirm("Remover este script de rastreamento?")) return;
    await fetch(`/api/admin/marketing/scripts?id=${id}`, { method: "DELETE" });
    showToast("Script removido.");
    loadAll();
  };

  const handleToggleScript = async (id: string, currentEnabled: boolean) => {
    await fetch("/api/admin/marketing/scripts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enabled: !currentEnabled }),
    });
    showToast("Status do script atualizado.");
    loadAll();
  };

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211A17] text-[#CFB583] border border-[#CFB583]/40 px-5 py-3 rounded-2xl shadow-2xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#CFB583]/15">
        <div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#211A17]">
            Central de Marketing, Tráfego &amp; Rastreamento
          </h2>
          <p className="text-xs sm:text-sm text-[#38271F]/70 mt-1">
            Gestão de origens, gerador de campanhas UTM, integração com Meta Pixel, Google Analytics e pixels externos.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "sources", label: "Origem do Tráfego", icon: Compass },
            { id: "campaigns", label: "Gerador de Links UTM", icon: Link2 },
            { id: "integrations", label: "Integrações & Anúncios", icon: Share2 },
            { id: "scripts", label: "Pixels & Scripts", icon: Code2 },
            { id: "conversions", label: "Conversões", icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-sans font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-[#211A17] text-[#CFB583] shadow-sm font-semibold"
                    : "bg-white/80 hover:bg-white text-[#38271F]/70 border border-[#CFB583]/20"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#CFB583]" : "text-[#38271F]/50"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: ORIGEM DO TRÁFEGO */}
      {activeTab === "sources" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm md:col-span-2">
              <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17] mb-2">
                Classificação Automática de Canais
              </h3>
              <p className="text-xs text-[#38271F]/60 mb-6">
                Separamos acessos orgânicos do Google, Instagram, links de WhatsApp e acessos diretos através do HTTP Referrer e parâmetros UTM.
              </p>

              <div className="space-y-4">
                {(sourcesData?.channelDistribution || []).map((ch: any) => (
                  <div key={ch.channel} className="p-4 rounded-xl bg-[#F8F4EC]/60 border border-[#CFB583]/20 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#211A17]">{ch.label}</p>
                      <p className="text-xs text-[#38271F]/60 font-mono">Canal técnico: {ch.channel}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-mono font-bold text-[#211A17]">{ch.count} acessos</p>
                      <p className="text-xs text-[#E77759] font-mono">{ch.percentage}% do total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
              <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
                Regras de Atribuição
              </h3>
              <div className="text-xs text-[#38271F]/70 space-y-3 leading-relaxed">
                <p>
                  <strong>Prioridade UTM:</strong> Quando um visitante clica em uma URL com <code className="bg-[#CFB583]/20 px-1 py-0.5 rounded">utm_source</code>, esse canal tem precedência sobre o referrer.
                </p>
                <p>
                  <strong>Instagram In-App:</strong> O navegador interno do Instagram adiciona referrers como <em>l.instagram.com</em>, devidamente isolados do tráfego direto.
                </p>
                <p>
                  <strong>Google Orgânico:</strong> Consultas da busca tradicional e Google Maps são computadas separadamente de campanhas de anúncios (CPC/Google Ads).
                </p>
                <p>
                  <strong>Anonimização LGPD:</strong> Nenhum dado pessoal identificável ou endereço IP completo é gravado na tabela analítica.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GERADOR DE LINKS UTM & HISTÓRICO */}
      {activeTab === "campaigns" && (
        <div className="space-y-8">
          {/* UTM Builder Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-[#CFB583]/20 text-[#211A17]">
                <Link2 className="w-5 h-5 text-[#E77759]" />
              </div>
              <div>
                <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
                  Gerador Profissional de URLs Rastreadas (UTM)
                </h3>
                <p className="text-xs text-[#38271F]/60">
                  Crie links personalizados para Instagram, Bio, Stories, WhatsApp, Facebook Ads e Google Ads para mensurar o retorno de cada canal.
                </p>
              </div>
            </div>

            <form onSubmit={handleCreateCampaign} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Nome da Campanha (Interno) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Bio do Instagram Oficial"
                    value={campaignForm.name}
                    onChange={(e) => setCampaignForm({ ...campaignForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Página de Destino *
                  </label>
                  <select
                    value={campaignForm.destinationUrl}
                    onChange={(e) => setCampaignForm({ ...campaignForm, destinationUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  >
                    <option value="/">Página Inicial (/)</option>
                    <option value="/cardapio">Cardápio Digital (/cardapio)</option>
                    <option value="/por-que-um-site-em-2026">Apresentação Estratégica (/por-que-um-site-em-2026)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Origem (utm_source) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="instagram, whatsapp, facebook, google"
                    value={campaignForm.utmSource}
                    onChange={(e) => setCampaignForm({ ...campaignForm, utmSource: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Mídia / Meio (utm_medium) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="bio, stories, post, cpc, newsletter"
                    value={campaignForm.utmMedium}
                    onChange={(e) => setCampaignForm({ ...campaignForm, utmMedium: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Nome da Campanha (utm_campaign) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="brunch_outono, cardapio_link, festival_inverno"
                    value={campaignForm.utmCampaign}
                    onChange={(e) => setCampaignForm({ ...campaignForm, utmCampaign: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Conteúdo (utm_content)
                  </label>
                  <input
                    type="text"
                    placeholder="botao_verde, foto_croissant, carrossel"
                    value={campaignForm.utmContent}
                    onChange={(e) => setCampaignForm({ ...campaignForm, utmContent: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Observações / Anotações
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Link colocado na bio do perfil principal no dia 15/04"
                    value={campaignForm.notes}
                    onChange={(e) => setCampaignForm({ ...campaignForm, notes: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Generated URL Box */}
              <div className="p-4 rounded-2xl bg-[#211A17] text-white space-y-2">
                <span className="text-[11px] font-mono text-[#CFB583] uppercase tracking-wider block">
                  URL Rastreada em Tempo Real:
                </span>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    readOnly
                    value={generatedUtmUrl}
                    className="flex-1 bg-white/10 text-xs font-mono text-[#F8F4EC] px-3 py-2 rounded-lg border border-white/15 focus:outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyUrl()}
                    className="px-4 py-2 rounded-lg bg-[#CFB583] text-[#211A17] font-semibold text-xs flex items-center gap-2 hover:bg-[#CFB583]/90 transition-colors shrink-0"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? "Copiado!" : "Copiar Link"}</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E77759] hover:bg-[#E77759]/90 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Salvar Campanha no Histórico</span>
                </button>
              </div>
            </form>
          </div>

          {/* Saved Campaigns Table */}
          <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm">
            <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17] mb-2">
              Campanhas Salvas &amp; Desempenho
            </h3>
            <p className="text-xs text-[#38271F]/60 mb-6">
              Cliques e conversões capturados por cada link divulgado.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#CFB583]/20 text-[#38271F]/60 uppercase font-mono text-[10px]">
                    <th className="pb-3">Nome da Campanha</th>
                    <th className="pb-3">Origem / Meio</th>
                    <th className="pb-3">utm_campaign</th>
                    <th className="pb-3 text-right">Cliques</th>
                    <th className="pb-3 text-right">Conversões</th>
                    <th className="pb-3 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CFB583]/10 font-sans">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F8F4EC]/50 transition-colors">
                      <td className="py-3 font-medium text-[#211A17]">
                        {c.name}
                        {c.notes && <p className="text-[11px] text-[#38271F]/50">{c.notes}</p>}
                      </td>
                      <td className="py-3 font-mono text-[#38271F]/70">
                        {c.utmSource} / {c.utmMedium}
                      </td>
                      <td className="py-3 font-mono text-[#E77759] font-medium">{c.utmCampaign}</td>
                      <td className="py-3 text-right font-mono font-bold text-[#211A17]">{c.clicksCount}</td>
                      <td className="py-3 text-right font-mono font-bold text-emerald-600">
                        {c.conversionsCount}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleCopyUrl(c.generatedUrl)}
                            title="Copiar URL desta campanha"
                            className="p-1.5 rounded-lg text-[#38271F]/60 hover:text-[#211A17] hover:bg-[#CFB583]/20 transition-colors"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(c.id)}
                            title="Excluir campanha"
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {campaigns.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#38271F]/50 font-mono">
                        Nenhuma campanha UTM salva ainda. Crie seu primeiro link acima!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTEGRAÇÕES & ANÚNCIOS */}
      {activeTab === "integrations" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Meta Pixel & Conversions API (CAPI) */}
            {(() => {
              const meta = integrations.find((i) => i.provider === "meta_ads") || {};
              return (
                <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold">
                        f
                      </div>
                      <div>
                        <h4 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
                          Meta Pixel &amp; Conversions API
                        </h4>
                        <p className="text-xs text-[#38271F]/60">Facebook &amp; Instagram Ads</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                        meta.status === "connected"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {meta.status === "connected" ? "Conectado" : "Pendente"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#211A17] mb-1">
                        Meta Pixel ID *
                      </label>
                      <input
                        type="text"
                        defaultValue={meta.pixelId || ""}
                        placeholder="Ex: 123456789012345"
                        id="meta_pixel_id"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#211A17] mb-1">
                        Access Token (Conversions API - CAPI)
                      </label>
                      <input
                        type="password"
                        defaultValue={meta.apiTokenEncrypted || ""}
                        placeholder="EAAB..."
                        id="meta_capi_token"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none font-mono"
                      />
                      <p className="text-[10px] text-[#38271F]/50 mt-0.5">
                        Armazenado de forma segura no servidor para deduplicação com event_id.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const pixelId = (document.getElementById("meta_pixel_id") as HTMLInputElement)?.value;
                          const apiTokenEncrypted = (document.getElementById("meta_capi_token") as HTMLInputElement)?.value;
                          handleUpdateIntegration("meta_ads", { pixelId, apiTokenEncrypted, enabled: Boolean(pixelId) });
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] text-xs font-semibold transition-colors"
                      >
                        Salvar Configuração
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const pixelId = (document.getElementById("meta_pixel_id") as HTMLInputElement)?.value;
                          handleTestIntegration("meta_ads", { pixelId });
                        }}
                        className="py-2 px-3 rounded-xl border border-[#CFB583]/30 hover:bg-[#F8F4EC] text-xs font-medium text-[#211A17] transition-colors"
                      >
                        Testar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Google Analytics 4 */}
            {(() => {
              const ga = integrations.find((i) => i.provider === "ga4") || {};
              return (
                <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold">
                        G
                      </div>
                      <div>
                        <h4 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
                          Google Analytics 4 (GA4)
                        </h4>
                        <p className="text-xs text-[#38271F]/60">Métricas Oficiais do Google</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                        ga.status === "connected"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {ga.status === "connected" ? "Conectado" : "Pendente"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#211A17] mb-1">
                        Measurement ID (G-XXXXXXXXXX) *
                      </label>
                      <input
                        type="text"
                        defaultValue={ga.measurementId || ""}
                        placeholder="G-ABC123XYZ"
                        id="ga4_measurement_id"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="p-3 rounded-xl bg-[#F8F4EC]/60 border border-[#CFB583]/20 text-[11px] text-[#38271F]/70 leading-relaxed">
                      Ao salvar um ID válido, a tag gtag.js será carregada de forma assíncrona sem afetar a nota de velocidade (PageSpeed) do site.
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const measurementId = (document.getElementById("ga4_measurement_id") as HTMLInputElement)?.value;
                          handleUpdateIntegration("ga4", { measurementId, enabled: Boolean(measurementId) });
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] text-xs font-semibold transition-colors"
                      >
                        Salvar GA4
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const measurementId = (document.getElementById("ga4_measurement_id") as HTMLInputElement)?.value;
                          handleTestIntegration("ga4", { measurementId });
                        }}
                        className="py-2 px-3 rounded-xl border border-[#CFB583]/30 hover:bg-[#F8F4EC] text-xs font-medium text-[#211A17] transition-colors"
                      >
                        Validar Formato
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Google Tag Manager (GTM) */}
            {(() => {
              const gtm = integrations.find((i) => i.provider === "gtm") || {};
              return (
                <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-500 font-bold">
                        GTM
                      </div>
                      <div>
                        <h4 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
                          Google Tag Manager
                        </h4>
                        <p className="text-xs text-[#38271F]/60">Container Unificado de Tags</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                        gtm.status === "connected"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-slate-100 text-slate-800 border border-slate-300"
                      }`}
                    >
                      {gtm.status === "connected" ? "Ativo" : "Desconectado"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#211A17] mb-1">
                        Container ID (GTM-XXXXXXX)
                      </label>
                      <input
                        type="text"
                        defaultValue={gtm.containerId || ""}
                        placeholder="GTM-5ABCD89"
                        id="gtm_container_id"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const containerId = (document.getElementById("gtm_container_id") as HTMLInputElement)?.value;
                          handleUpdateIntegration("gtm", { containerId, enabled: Boolean(containerId) });
                        }}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] text-xs font-semibold transition-colors"
                      >
                        Salvar GTM
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const containerId = (document.getElementById("gtm_container_id") as HTMLInputElement)?.value;
                          handleTestIntegration("gtm", { containerId });
                        }}
                        className="py-2 px-3 rounded-xl border border-[#CFB583]/30 hover:bg-[#F8F4EC] text-xs font-medium text-[#211A17] transition-colors"
                      >
                        Validar
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Google Search Console */}
            {(() => {
              const gsc = integrations.find((i) => i.provider === "search_console") || {};
              return (
                <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold">
                        GSC
                      </div>
                      <div>
                        <h4 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
                          Google Search Console
                        </h4>
                        <p className="text-xs text-[#38271F]/60">Indexação e Palavras-Chave</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-mono font-semibold ${
                        gsc.status === "connected"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-blue-100 text-blue-800 border border-blue-300"
                      }`}
                    >
                      {gsc.status === "connected" ? "Verificado" : "Pronto para Verificação"}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#211A17] mb-1">
                        Domínio da Propriedade
                      </label>
                      <input
                        type="text"
                        defaultValue={gsc.accountId || "martita.com.br"}
                        id="gsc_account_id"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none font-mono"
                      />
                    </div>
                    <div className="p-3 rounded-xl bg-[#F8F4EC]/60 border border-[#CFB583]/20 text-[11px] text-[#38271F]/70">
                      Sitemap automático disponível em <code className="font-mono text-[#E77759]">/sitemap.xml</code> pronto para envio direto no painel do Google.
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                      <a
                        href="https://search.google.com/search-console"
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 px-3 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                      >
                        <span>Abrir Search Console</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* TAB 4: SCRIPTS & PIXELS CUSTOMIZADOS */}
      {activeTab === "scripts" && (
        <div className="space-y-8">
          {/* Add Script Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm">
            <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17] mb-2">
              Adicionar Script / Tag Personalizada
            </h3>
            <p className="text-xs text-[#38271F]/60 mb-6">
              Insira scripts de mapa de calor (Microsoft Clarity, Hotjar), pixels de redes (TikTok, Pinterest) ou snippets HTML sem editar o código-fonte.
            </p>

            <form onSubmit={handleAddScript} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Nome da Ferramenta *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Microsoft Clarity"
                    value={scriptForm.name}
                    onChange={(e) => setScriptForm({ ...scriptForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Tipo de Ferramenta
                  </label>
                  <select
                    value={scriptForm.type}
                    onChange={(e) => setScriptForm({ ...scriptForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  >
                    <option value="clarity">Microsoft Clarity (Heatmap)</option>
                    <option value="hotjar">Hotjar</option>
                    <option value="tiktok">TikTok Pixel</option>
                    <option value="pinterest">Pinterest Tag</option>
                    <option value="custom">Snippet Personalizado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Local de Injeção
                  </label>
                  <select
                    value={scriptForm.location}
                    onChange={(e) => setScriptForm({ ...scriptForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  >
                    <option value="head">&lt;head&gt; (Padrão para Pixels e Analytics)</option>
                    <option value="body_end">Fim do &lt;body&gt; (Não-bloqueante)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Código do Script (JavaScript ou HTML) *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="<script>...</script>"
                  value={scriptForm.code}
                  onChange={(e) => setScriptForm({ ...scriptForm, code: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] font-semibold text-xs transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Script</span>
                </button>
              </div>
            </form>
          </div>

          {/* Scripts List */}
          <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
            <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
              Scripts Ativos no Site
            </h3>

            <div className="divide-y divide-[#CFB583]/15">
              {scripts.map((s) => (
                <div key={s.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h5 className="text-sm font-semibold text-[#211A17]">{s.name}</h5>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#CFB583]/20 text-[#38271F]">
                        {s.location}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                          s.enabled ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {s.enabled ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                    <p className="text-xs text-[#38271F]/50 font-mono mt-1 truncate max-w-xl">
                      {s.code.slice(0, 100)}...
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleScript(s.id, s.enabled)}
                      className="px-3 py-1.5 rounded-lg border border-[#CFB583]/30 text-xs font-medium hover:bg-[#F8F4EC] transition-colors"
                    >
                      {s.enabled ? "Desativar" : "Ativar"}
                    </button>
                    <button
                      onClick={() => handleDeleteScript(s.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {scripts.length === 0 && (
                <p className="py-6 text-center text-xs text-[#38271F]/50 font-mono">
                  Nenhum script externo personalizado ativo no momento.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONVERSÕES */}
      {activeTab === "conversions" && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
            <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
              Métricas de Conversão Direta
            </h3>
            <p className="text-xs text-[#38271F]/60">
              Registramos automaticamente toda interação comercial de alta intenção realizada pelos visitantes no site.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200">
                <div className="flex items-center gap-2 text-emerald-800 mb-2 font-medium text-xs">
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp de Reservas</span>
                </div>
                <p className="text-3xl font-serif-editorial font-bold text-emerald-900">
                  {sourcesData?.summary?.whatsappClicks || 0}
                </p>
                <p className="text-[11px] text-emerald-700 mt-1">Cliques no botão de conversa</p>
              </div>

              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200">
                <div className="flex items-center gap-2 text-amber-800 mb-2 font-medium text-xs">
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Navegação no Cardápio</span>
                </div>
                <p className="text-3xl font-serif-editorial font-bold text-amber-900">
                  {sourcesData?.summary?.menuViews || 0}
                </p>
                <p className="text-[11px] text-amber-700 mt-1">Acessos à página dedicada</p>
              </div>

              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800 mb-2 font-medium text-xs">
                  <Phone className="w-4 h-4" />
                  <span>Ligações Telefônicas</span>
                </div>
                <p className="text-3xl font-serif-editorial font-bold text-blue-900">
                  {sourcesData?.summary?.phoneClicks || 0}
                </p>
                <p className="text-[11px] text-blue-700 mt-1">Toques no número de telefone</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
