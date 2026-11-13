"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Lock,
  LogOut,
  Bell,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Utensils,
  BarChart2,
  Compass,
  FileCode,
  Globe,
  Settings,
} from "lucide-react";
import { MartitaLogo } from "@/components/ui/MartitaLogo";
import { AdminSidebar, type AdminViewKey } from "./components/AdminSidebar";
import { OverviewDashboard } from "./components/OverviewDashboard";
import { SiteContentManager } from "./components/SiteContentManager";
import { MarketingCenter } from "./components/MarketingCenter";
import { SeoSuite } from "./components/SeoSuite";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { SettingsAndLogs } from "./components/SettingsAndLogs";

export default function AdminPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

  // Login Form
  const [loginEmail, setLoginEmail] = useState("admin@martita.com.br");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active View
  const [currentView, setCurrentView] = useState<AdminViewKey>("dashboard");
  const [toast, setToast] = useState<string | null>(null);

  // Global Data
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState<number>(0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAllData = useCallback(async () => {
    try {
      const [catRes, prodRes, galRes, siteRes, msgRes, notifRes] = await Promise.all([
        fetch("/api/categories"),
        fetch("/api/products"),
        fetch("/api/gallery"),
        fetch("/api/site"),
        fetch("/api/contact"),
        fetch("/api/admin/notifications"),
      ]);

      if (catRes.ok) setCategories(await catRes.json());
      if (prodRes.ok) setProducts(await prodRes.json());
      if (galRes.ok) setGallery(await galRes.json());
      if (siteRes.ok) setSiteConfig(await siteRes.json());
      if (msgRes.ok) setMessages(await msgRes.json());
      if (notifRes.ok) {
        const notifJson = await notifRes.json();
        setUnreadNotificationsCount(notifJson.unreadCount || 0);
      }
    } catch (err) {
      console.error("Failed to load initial admin data:", err);
    }
  }, []);

  useEffect(() => {
    fetch("/api/admin/auth")
      .then((res) => {
        if (res.ok) {
          return res.json().then((d) => {
            setAuthenticated(true);
            setAdminUser(d.user);
            fetchAllData();
          });
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, [fetchAllData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || "Credenciais inválidas.");
        setIsLoggingIn(false);
        return;
      }
      setAuthenticated(true);
      setAdminUser(data.user);
      fetchAllData();
    } catch {
      setLoginError("Erro de comunicação com o servidor.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setAuthenticated(false);
    setAdminUser(null);
  };

  const handleSaveSiteConfig = async (updated: any) => {
    const res = await fetch("/api/site", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const json = await res.json();
      setSiteConfig(json);
      showToast("Configurações atualizadas.");
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[#1A1412] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#CFB583] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-mono uppercase tracking-widest text-[#CFB583]">
            Inicializando Painel Seguro...
          </p>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1A1412] via-[#211A17] to-[#140F0E] flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-[#CFB583]/30 backdrop-blur-xl shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-[#CFB583]/30 to-[#E77759]/30 border border-[#CFB583]/50 flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6 text-[#CFB583]" />
            </div>
            <h1 className="font-serif-editorial text-3xl font-semibold text-[#F8F4EC]">
              Martita Café &amp; Gastrobar
            </h1>
            <p className="text-xs font-mono text-[#CFB583]/80 uppercase tracking-widest">
              Painel de Inteligência &amp; Gestão 2026
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#CFB583] mb-1.5">
                E-mail Administrativo
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@martita.com.br"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:border-[#CFB583] focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[#CFB583] mb-1.5">
                Senha de Acesso
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/15 text-white text-sm focus:border-[#CFB583] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#CFB583] to-[#E77759] hover:brightness-110 text-[#211A17] font-semibold text-sm transition-all duration-300 shadow-lg shadow-[#CFB583]/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? "Verificando Credenciais..." : "Acessar Central Administrativa"}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center">
            <Link
              href="/"
              className="text-xs text-white/50 hover:text-[#CFB583] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Voltar ao Site Público</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const viewTitles: Record<AdminViewKey, string> = {
    dashboard: "Dashboard Principal",
    performance: "Resumo de Desempenho",
    notifications: "Central de Notificações",
    content_products: "Cardápio & Pratos",
    content_categories: "Categorias do Cardápio",
    content_gallery: "Galeria de Fotos",
    content_forms: "Mensagens & Formulários",
    content_pages: "Textos da Marca",
    marketing_analytics: "Analytics & Acessos",
    marketing_sources: "Origem do Tráfego",
    marketing_campaigns: "Gerador de Links UTM",
    marketing_meta: "Meta Ads & Pixel",
    marketing_google_ads: "Google Ads & Conversões",
    marketing_scripts: "Pixels & Scripts Customizados",
    marketing_conversions: "Métricas de Conversão",
    seo_dashboard: "Dashboard SEO & Saúde Técnica",
    seo_pages: "SEO por Página",
    seo_sitemap: "Sitemap XML",
    seo_robots: "Robots.txt",
    seo_redirects: "Redirecionamentos 301/302",
    seo_schema: "Dados Estruturados Schema.org",
    seo_audit: "Auditoria Técnica SEO",
    integrations_hub: "Central de Integrações",
    settings_general: "Configurações Gerais & Contato",
    settings_users: "Usuários & Permissões",
    settings_security: "Segurança de Acesso",
    settings_logs: "Trilha de Auditoria & Logs",
  };

  // RENDER CORRESPONDING VIEW
  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
      case "performance":
        return <OverviewDashboard key={currentView} onNavigateToTab={(v) => setCurrentView(v as any)} />;

      case "notifications":
        return <NotificationsPanel key={currentView} />;

      case "content_products":
        return (
          <SiteContentManager
            key="content_products"
            initialSubTab="products"
            categories={categories}
            products={products}
            gallery={gallery}
            messages={messages}
            siteConfig={siteConfig}
            onRefreshData={fetchAllData}
            onShowNotice={showToast}
          />
        );

      case "content_categories":
        return (
          <SiteContentManager
            key="content_categories"
            initialSubTab="categories"
            categories={categories}
            products={products}
            gallery={gallery}
            messages={messages}
            siteConfig={siteConfig}
            onRefreshData={fetchAllData}
            onShowNotice={showToast}
          />
        );

      case "content_gallery":
        return (
          <SiteContentManager
            key="content_gallery"
            initialSubTab="gallery"
            categories={categories}
            products={products}
            gallery={gallery}
            messages={messages}
            siteConfig={siteConfig}
            onRefreshData={fetchAllData}
            onShowNotice={showToast}
          />
        );

      case "content_forms":
        return (
          <SiteContentManager
            key="content_forms"
            initialSubTab="forms"
            categories={categories}
            products={products}
            gallery={gallery}
            messages={messages}
            siteConfig={siteConfig}
            onRefreshData={fetchAllData}
            onShowNotice={showToast}
          />
        );

      case "content_pages":
        return (
          <SiteContentManager
            key="content_pages"
            initialSubTab="pages"
            categories={categories}
            products={products}
            gallery={gallery}
            messages={messages}
            siteConfig={siteConfig}
            onRefreshData={fetchAllData}
            onShowNotice={showToast}
          />
        );

      case "marketing_analytics":
      case "marketing_sources":
        return <MarketingCenter key="marketing_sources" initialSubTab="sources" />;

      case "marketing_campaigns":
        return <MarketingCenter key="marketing_campaigns" initialSubTab="campaigns" />;

      case "marketing_meta":
      case "marketing_google_ads":
      case "integrations_hub":
        return <MarketingCenter key="marketing_integrations" initialSubTab="integrations" />;

      case "marketing_scripts":
        return <MarketingCenter key="marketing_scripts" initialSubTab="scripts" />;

      case "marketing_conversions":
        return <MarketingCenter key="marketing_conversions" initialSubTab="conversions" />;

      case "seo_dashboard":
      case "seo_audit":
        return <SeoSuite key="seo_dashboard" initialSubTab="dashboard" />;

      case "seo_pages":
        return <SeoSuite key="seo_pages" initialSubTab="pages" />;

      case "seo_sitemap":
        return <SeoSuite key="seo_sitemap" initialSubTab="sitemap" />;

      case "seo_robots":
        return <SeoSuite key="seo_robots" initialSubTab="robots" />;

      case "seo_redirects":
        return <SeoSuite key="seo_redirects" initialSubTab="redirects" />;

      case "seo_schema":
        return <SeoSuite key="seo_schema" initialSubTab="schema" />;

      case "settings_general":
        return (
          <SettingsAndLogs
            key="settings_general"
            initialSubTab="general"
            siteConfig={siteConfig}
            onSaveSiteConfig={handleSaveSiteConfig}
            adminUser={adminUser}
          />
        );

      case "settings_users":
      case "settings_security":
        return (
          <SettingsAndLogs
            key="settings_users"
            initialSubTab="users"
            siteConfig={siteConfig}
            onSaveSiteConfig={handleSaveSiteConfig}
            adminUser={adminUser}
          />
        );

      case "settings_logs":
        return (
          <SettingsAndLogs
            key="settings_logs"
            initialSubTab="logs"
            siteConfig={siteConfig}
            onSaveSiteConfig={handleSaveSiteConfig}
            adminUser={adminUser}
          />
        );

      default:
        return <OverviewDashboard key="default" onNavigateToTab={(v) => setCurrentView(v as any)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F4ECE0]/50 text-[#211A17] flex">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#211A17] text-[#CFB583] border border-[#CFB583]/40 px-5 py-3 rounded-2xl shadow-2xl text-xs font-mono flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Modern SaaS Collapsible Sidebar */}
      <AdminSidebar
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        unreadNotificationsCount={unreadNotificationsCount}
        unreadMessagesCount={messages.filter((m) => !m.read).length}
        onLogout={handleLogout}
        adminName={adminUser?.name || "Curadoria Martita"}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#CFB583]/20 px-6 py-4 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="font-serif-editorial text-lg font-bold text-[#211A17]">
              Painel Central
            </span>
            <span className="text-xs text-[#38271F]/40">•</span>
            <span className="text-xs font-mono uppercase tracking-wider text-[#CFB583] bg-[#211A17] px-2.5 py-0.5 rounded-full">
              {viewTitles[currentView] || currentView}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#CFB583]/30 text-xs font-medium text-[#211A17] hover:bg-[#F8F4EC] transition-colors"
            >
              <span>Ver Site Público</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#E77759]" />
            </Link>

            <button
              onClick={() => setCurrentView("notifications")}
              className="relative p-2 rounded-xl border border-[#CFB583]/30 hover:bg-[#F8F4EC] text-[#211A17] transition-colors"
              title="Notificações"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E77759] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
              title="Encerrar Sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Dynamic View Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto" key={currentView}>
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}
