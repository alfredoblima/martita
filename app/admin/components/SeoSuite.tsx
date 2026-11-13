"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  FileText,
  FileCode,
  Code2,
  ArrowRightLeft,
  Bot,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  RefreshCw,
  ExternalLink,
  Save,
  Plus,
  Trash2,
  Globe,
  Eye,
  ChevronRight,
} from "lucide-react";

interface SeoSuiteProps {
  initialSubTab?: string;
}

export function SeoSuite({ initialSubTab = "dashboard" }: SeoSuiteProps) {
  const [activeTab, setActiveTab] = useState<string>(initialSubTab);

  useEffect(() => {
    setActiveTab(initialSubTab);
  }, [initialSubTab]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const [seoData, setSeoData] = useState<any>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [selectedPage, setSelectedPage] = useState<any | null>(null);
  const [redirects, setRedirects] = useState<any[]>([]);

  // Robots state
  const [robotsText, setRobotsText] = useState<string>("");

  // Redirect form
  const [redirectForm, setRedirectForm] = useState({
    sourcePath: "",
    targetPath: "",
    statusCode: 301,
    notes: "",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [seoRes, redirRes] = await Promise.all([
        fetch("/api/admin/seo"),
        fetch("/api/admin/seo/redirects"),
      ]);

      if (seoRes.ok) {
        const json = await seoRes.json();
        setSeoData(json);
        setPages(json.pages || []);
        if (json.pages && json.pages.length > 0 && !selectedPage) {
          setSelectedPage(json.pages[0]);
        }
        setRobotsText(json.settings?.robotsTxt || "");
      }

      if (redirRes.ok) {
        const json = await redirRes.json();
        setRedirects(json.redirects || []);
      }
    } catch (err) {
      console.error("Failed to load SEO data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "run_audit" }),
      });
      const json = await res.json();
      showToast(json.message || "Auditoria concluída!");
      loadData();
    } catch {
      alert("Erro ao executar auditoria.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePageSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPage) return;

    try {
      const res = await fetch("/api/admin/seo/pages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedPage),
      });
      if (res.ok) {
        showToast("SEO da página atualizado com sucesso!");
        loadData();
      }
    } catch {
      alert("Erro ao salvar dados de SEO.");
    }
  };

  const handleSaveRobots = async () => {
    try {
      const res = await fetch("/api/admin/seo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ robotsTxt: robotsText }),
      });
      if (res.ok) {
        showToast("Arquivo robots.txt atualizado.");
        loadData();
      }
    } catch {
      alert("Erro ao salvar robots.txt.");
    }
  };

  const handleAddRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/seo/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(redirectForm),
      });
      if (res.ok) {
        showToast("Redirecionamento criado com sucesso!");
        setRedirectForm({ sourcePath: "", targetPath: "", statusCode: 301, notes: "" });
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || "Erro ao criar redirecionamento.");
      }
    } catch {
      alert("Erro ao conectar.");
    }
  };

  const handleDeleteRedirect = async (id: string) => {
    if (!confirm("Remover este redirecionamento?")) return;
    await fetch(`/api/admin/seo/redirects?id=${id}`, { method: "DELETE" });
    showToast("Redirecionamento excluído.");
    loadData();
  };

  const healthScore = seoData?.healthScore ?? 94;

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
            Gerenciador Técnico de SEO &amp; Indexação Orgânica
          </h2>
          <p className="text-xs sm:text-sm text-[#38271F]/70 mt-1">
            Controle títulos, meta descriptions, sitemap.xml, robots.txt, redirecionamentos 301 e dados estruturados Schema.org.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "dashboard", label: "Dashboard SEO", icon: Search },
            { id: "pages", label: "SEO por Página", icon: FileText },
            { id: "sitemap", label: "Sitemap XML", icon: FileCode },
            { id: "robots", label: "Robots.txt", icon: Code2 },
            { id: "redirects", label: "Redirecionamentos", icon: ArrowRightLeft },
            { id: "schema", label: "Dados Estruturados", icon: Bot },
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

      {/* TAB 1: DASHBOARD SEO & AUDITORIA */}
      {activeTab === "dashboard" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Score Card (Col 4) */}
            <div className="lg:col-span-4 p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm text-center space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#38271F]/60">
                Saúde Técnica do Site
              </span>

              {/* Score circle */}
              <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    stroke="#F4ECE0"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="transparent"
                    stroke={healthScore >= 90 ? "#10B981" : healthScore >= 75 ? "#CFB583" : "#E77759"}
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * healthScore) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif-editorial text-4xl font-bold text-[#211A17]">
                    {healthScore}%
                  </span>
                  <span className="text-[10px] font-mono text-[#38271F]/60 uppercase">Excelente</span>
                </div>
              </div>

              <p className="text-xs text-[#38271F]/70 leading-relaxed">
                Calculado a partir de verificações reais de títulos, meta descriptions, hierarquia de cabeçalhos, imagens e arquivos canônicos.
              </p>

              <button
                onClick={handleRunAudit}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] text-xs font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                <span>{loading ? "Executando Auditoria..." : "Executar Auditoria Técnica Agora"}</span>
              </button>
            </div>

            {/* Audit Issues Checklist (Col 8) */}
            <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#CFB583]/15">
                <div>
                  <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
                    Checklist de Auditoria Técnica
                  </h3>
                  <p className="text-xs text-[#38271F]/60">
                    Apontamentos identificados para otimização nos mecanismos de busca
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-700 font-bold">
                    {seoData?.summary?.errors || 0} Erros
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 font-bold">
                    {seoData?.summary?.warnings || 0} Avisos
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {(seoData?.issues || []).map((issue: any) => {
                  const isErr = issue.severity === "error";
                  const isWarn = issue.severity === "warning";
                  const Icon = isErr ? AlertCircle : isWarn ? AlertTriangle : CheckCircle2;

                  return (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        issue.resolved
                          ? "bg-[#F8F4EC]/40 border-emerald-200 opacity-60"
                          : isErr
                          ? "bg-red-50/50 border-red-200"
                          : isWarn
                          ? "bg-amber-50/50 border-amber-200"
                          : "bg-blue-50/50 border-blue-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            issue.resolved
                              ? "text-emerald-500"
                              : isErr
                              ? "text-red-500"
                              : isWarn
                              ? "text-amber-500"
                              : "text-blue-500"
                          }`}
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-semibold text-[#211A17]">{issue.title}</h4>
                            <span className="text-[10px] font-mono text-[#38271F]/60 px-2 py-0.5 rounded bg-white/80 border border-[#CFB583]/20">
                              {issue.page}
                            </span>
                          </div>
                          <p className="text-xs text-[#38271F]/75">{issue.explanation}</p>
                          <p className="text-xs text-[#E77759] font-medium pt-1">
                            <strong>Recomendação:</strong> {issue.recommendation}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SEO POR PÁGINA */}
      {activeTab === "pages" && selectedPage && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Page Picker (Col 4) */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
            <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
              Selecione a Página
            </h3>
            <div className="space-y-2">
              {pages.map((p) => (
                <button
                  key={p.route}
                  onClick={() => setSelectedPage(p)}
                  className={`w-full text-left p-3.5 rounded-xl text-xs font-sans transition-all flex items-center justify-between ${
                    selectedPage.route === p.route
                      ? "bg-[#211A17] text-[#CFB583] font-semibold shadow-sm"
                      : "bg-[#F8F4EC]/60 hover:bg-[#F8F4EC] text-[#211A17] border border-[#CFB583]/20"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{p.pageName}</p>
                    <p className="text-[11px] font-mono opacity-60">{p.route}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </div>
          </div>

          {/* Page Editor (Col 8) */}
          <div className="lg:col-span-8 p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#CFB583]/15">
              <div>
                <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
                  Editando SEO: {selectedPage.pageName}
                </h3>
                <p className="text-xs text-[#38271F]/60">URL canônica: {selectedPage.route}</p>
              </div>
            </div>

            {/* Live Google Snippet Preview */}
            <div className="p-4 rounded-2xl bg-[#F8F4EC]/80 border border-[#CFB583]/30 space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#38271F]/50 block">
                Prévia de Exibição no Google (SERP Preview)
              </span>
              <div className="space-y-0.5">
                <span className="text-xs text-[#38271F]/60 font-sans block truncate">
                  https://martita.com.br{selectedPage.route === "/" ? "" : selectedPage.route}
                </span>
                <h4 className="text-base text-[#1a0dab] hover:underline font-sans font-medium cursor-pointer line-clamp-1">
                  {selectedPage.title || "Título da Página — Martita"}
                </h4>
                <p className="text-xs text-[#4d5156] font-sans line-clamp-2">
                  {selectedPage.description || "Descrição de apresentação nos resultados de busca do Google."}
                </p>
              </div>
            </div>

            <form onSubmit={handleSavePageSeo} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#211A17]">
                    SEO Title (Título da Aba &amp; Google) *
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      (selectedPage.title?.length || 0) >= 45 && (selectedPage.title?.length || 0) <= 65
                        ? "text-emerald-600 font-semibold"
                        : "text-[#38271F]/50"
                    }`}
                  >
                    {selectedPage.title?.length || 0}/60 caracteres
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={selectedPage.title || ""}
                  onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-[#211A17]">
                    Meta Description (Descrição nos Resultados) *
                  </label>
                  <span
                    className={`text-[11px] font-mono ${
                      (selectedPage.description?.length || 0) >= 120 && (selectedPage.description?.length || 0) <= 160
                        ? "text-emerald-600 font-semibold"
                        : "text-[#38271F]/50"
                    }`}
                  >
                    {selectedPage.description?.length || 0}/160 caracteres
                  </span>
                </div>
                <textarea
                  rows={3}
                  required
                  value={selectedPage.description || ""}
                  onChange={(e) => setSelectedPage({ ...selectedPage, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Palavra-Chave Foco Principal
                  </label>
                  <input
                    type="text"
                    value={selectedPage.focusKeyword || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, focusKeyword: e.target.value })}
                    placeholder="Ex: café especial bento gonçalves"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Palavras-Chave Secundárias
                  </label>
                  <input
                    type="text"
                    value={selectedPage.secondaryKeywords || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, secondaryKeywords: e.target.value })}
                    placeholder="brunch, doces franceses, gastrobar"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    value={selectedPage.canonicalUrl || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, canonicalUrl: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211A17] mb-1">
                    Meta Robots
                  </label>
                  <select
                    value={selectedPage.metaRobots || "index, follow"}
                    onChange={(e) => setSelectedPage({ ...selectedPage, metaRobots: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                  >
                    <option value="index, follow">index, follow (Padrão Indexável)</option>
                    <option value="noindex, follow">noindex, follow (Ocultar do Google)</option>
                    <option value="noindex, nofollow">noindex, nofollow (Privado Total)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] font-semibold text-xs flex items-center gap-2 transition-colors shadow-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Metadados da Página</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: SITEMAP XML */}
      {activeTab === "sitemap" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#CFB583]/15">
            <div>
              <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
                Sitemap XML Automatizado
              </h3>
              <p className="text-xs text-[#38271F]/60">
                Gera dinamicamente o mapa de URLs indexáveis para o Googlebot e mecanismos de busca.
              </p>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-[#CFB583]/20 hover:bg-[#CFB583]/30 text-[#211A17] text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <span>Abrir /sitemap.xml</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-[#211A17] text-white space-y-2">
            <span className="text-[11px] font-mono text-[#CFB583] uppercase tracking-wider block">
              URL Oficial do Sitemap:
            </span>
            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value="https://martita.com.br/sitemap.xml"
                className="flex-1 bg-white/10 text-xs font-mono text-[#F8F4EC] px-3 py-2 rounded-lg border border-white/15 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#38271F]/80 leading-relaxed">
            <p>
              ✔ <strong>Atualização Dinâmica:</strong> Todas as páginas ativas e os pratos disponíveis do cardápio são incluídos automaticamente.
            </p>
            <p>
              ✔ <strong>Segurança:</strong> Rotas administrativas como <code>/admin</code> e rotas internas de API são estritamente excluídas.
            </p>
            <p>
              ✔ <strong>Pronto para Google Search Console:</strong> Basta copiar a URL acima e colar na aba de Sitemaps da sua conta Google.
            </p>
          </div>
        </div>
      )}

      {/* TAB 4: ROBOTS.TXT */}
      {activeTab === "robots" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#CFB583]/15">
            <div>
              <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
                Editor do Arquivo Robots.txt
              </h3>
              <p className="text-xs text-[#38271F]/60">
                Diretrizes de rastreamento para robôs de busca servido publicamente em <code>/robots.txt</code>.
              </p>
            </div>
            <a
              href="/robots.txt"
              target="_blank"
              className="px-4 py-2 rounded-xl bg-[#CFB583]/20 hover:bg-[#CFB583]/30 text-[#211A17] text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <span>Ver ao Vivo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            <textarea
              rows={8}
              value={robotsText}
              onChange={(e) => setRobotsText(e.target.value)}
              className="w-full px-4 py-3 text-xs font-mono rounded-2xl border border-[#CFB583]/30 bg-[#211A17] text-[#CFB583] focus:border-[#CFB583] focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setRobotsText(
                  "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://martita.com.br/sitemap.xml"
                )
              }
              className="px-4 py-2 rounded-xl border border-[#CFB583]/30 text-xs font-medium hover:bg-[#F8F4EC] transition-colors"
            >
              Restaurar Padrão Seguro
            </button>
            <button
              type="button"
              onClick={handleSaveRobots}
              className="px-6 py-2.5 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] font-semibold text-xs flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Robots.txt</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: REDIRECIONAMENTOS 301 */}
      {activeTab === "redirects" && (
        <div className="space-y-8">
          {/* Add Redirect Form */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-6">
            <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
              Adicionar Redirecionamento 301/302
            </h3>
            <p className="text-xs text-[#38271F]/60">
              Redirecione URLs antigas ou links de campanhas para novas páginas evitando erros 404 e preservando o tráfego orgânico.
            </p>

            <form onSubmit={handleAddRedirect} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  URL Antiga / Origem *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/cardapio-antigo"
                  value={redirectForm.sourcePath}
                  onChange={(e) => setRedirectForm({ ...redirectForm, sourcePath: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  URL Nova / Destino *
                </label>
                <input
                  type="text"
                  required
                  placeholder="/cardapio"
                  value={redirectForm.targetPath}
                  onChange={(e) => setRedirectForm({ ...redirectForm, targetPath: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Tipo de Redirecionamento
                </label>
                <select
                  value={redirectForm.statusCode}
                  onChange={(e) => setRedirectForm({ ...redirectForm, statusCode: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                >
                  <option value={301}>301 - Permanente (Recomendado para SEO)</option>
                  <option value={302}>302 - Temporário</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Rota</span>
                </button>
              </div>
            </form>
          </div>

          {/* Redirects Table */}
          <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
            <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
              Redirecionamentos Ativos
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#CFB583]/20 text-[#38271F]/60 uppercase font-mono text-[10px]">
                    <th className="pb-3">URL Antiga</th>
                    <th className="pb-3">URL Destino</th>
                    <th className="pb-3 text-center">Status</th>
                    <th className="pb-3 text-right">Acessos</th>
                    <th className="pb-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#CFB583]/10 font-sans">
                  {redirects.map((r) => (
                    <tr key={r.id} className="hover:bg-[#F8F4EC]/50 transition-colors">
                      <td className="py-3 font-mono font-medium text-[#211A17]">{r.sourcePath}</td>
                      <td className="py-3 font-mono text-[#E77759]">{r.targetPath}</td>
                      <td className="py-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#CFB583]/20 text-[#211A17] font-bold">
                          {r.statusCode}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-[#38271F]/70">{r.hits}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteRedirect(r.id)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {redirects.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#38271F]/50 font-mono">
                        Nenhum redirecionamento customizado cadastrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DADOS ESTRUTURADOS (SCHEMA.ORG) */}
      {activeTab === "schema" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#CFB583]/15">
            <div>
              <h3 className="font-serif-editorial text-2xl font-semibold text-[#211A17]">
                Dados Estruturados Schema.org / JSON-LD
              </h3>
              <p className="text-xs text-[#38271F]/60">
                Marcação semântica oficial para respostas de inteligência artificial (ChatGPT, Gemini, Perplexity) e snippets do Google.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <span className="text-xs font-semibold text-[#211A17] block">
              Esquema de Restaurante / Gastronomia Configurado:
            </span>
            <pre className="p-4 rounded-2xl bg-[#211A17] text-[#CFB583] text-xs font-mono overflow-x-auto">
{JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "Martita Café & Gastrobar",
    servesCuisine: ["Café Especial", "Brunch", "Croissants Franceses", "Gastrobar", "Drinks Autorais"],
    url: "https://martita.com.br",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bento Gonçalves",
      addressRegion: "RS",
      addressCountry: "BR",
    },
  },
  null,
  2
)}
            </pre>
            <p className="text-xs text-[#38271F]/70">
              Este objeto JSON-LD informa diretamente aos motores de busca a especialidade, faixas de preço e localização da Martita.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
