"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  TrendingUp,
  Bell,
  Utensils,
  Layers,
  Image as ImageIcon,
  Mail,
  FileText,
  BarChart2,
  Compass,
  Link2,
  Share2,
  Code2,
  CheckCircle2,
  Search,
  FileCode,
  ArrowRightLeft,
  Bot,
  Settings,
  Users,
  Shield,
  History,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  ExternalLink,
  LogOut,
  Sparkles,
} from "lucide-react";
import { MartitaLogo } from "@/components/ui/MartitaLogo";

export type AdminViewKey =
  | "dashboard"
  | "performance"
  | "notifications"
  | "content_products"
  | "content_categories"
  | "content_gallery"
  | "content_forms"
  | "content_pages"
  | "marketing_analytics"
  | "marketing_sources"
  | "marketing_campaigns"
  | "marketing_meta"
  | "marketing_google_ads"
  | "marketing_scripts"
  | "marketing_conversions"
  | "seo_dashboard"
  | "seo_pages"
  | "seo_sitemap"
  | "seo_robots"
  | "seo_redirects"
  | "seo_schema"
  | "seo_audit"
  | "integrations_hub"
  | "settings_general"
  | "settings_users"
  | "settings_security"
  | "settings_logs";

interface NavItem {
  id: AdminViewKey;
  label: string;
  icon: any;
  badge?: number | string;
}

interface NavCategory {
  id: string;
  label: string;
  items: NavItem[];
}

interface AdminSidebarProps {
  currentView: AdminViewKey;
  onSelectView: (view: AdminViewKey) => void;
  unreadNotificationsCount?: number;
  unreadMessagesCount?: number;
  onLogout: () => void;
  adminName?: string;
}

export function AdminSidebar({
  currentView,
  onSelectView,
  unreadNotificationsCount = 0,
  unreadMessagesCount = 0,
  onLogout,
  adminName = "Administrador",
}: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    overview: true,
    site: true,
    marketing: true,
    seo: true,
    integrations: true,
    settings: false,
  });

  // Restore collapsed preference
  useEffect(() => {
    const saved = localStorage.getItem("martita_admin_sidebar_collapsed");
    if (saved !== null) {
      setCollapsed(saved === "true");
    }
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem("martita_admin_sidebar_collapsed", String(next));
  };

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const categories: NavCategory[] = [
    {
      id: "overview",
      label: "VISÃO GERAL",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "performance", label: "Resumo de Desempenho", icon: TrendingUp },
        {
          id: "notifications",
          label: "Notificações",
          icon: Bell,
          badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
        },
      ],
    },
    {
      id: "site",
      label: "SITE & CONTEÚDO",
      items: [
        { id: "content_products", label: "Cardápio & Pratos", icon: Utensils },
        { id: "content_categories", label: "Categorias", icon: Layers },
        { id: "content_gallery", label: "Galeria & Mídia", icon: ImageIcon },
        {
          id: "content_forms",
          label: "Mensagens & Contatos",
          icon: Mail,
          badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
        },
        { id: "content_pages", label: "Identidade & Textos", icon: FileText },
      ],
    },
    {
      id: "marketing",
      label: "MARKETING & TRÁFEGO",
      items: [
        { id: "marketing_analytics", label: "Analytics & Acessos", icon: BarChart2 },
        { id: "marketing_sources", label: "Origem do Tráfego", icon: Compass },
        { id: "marketing_campaigns", label: "Campanhas & UTMs", icon: Link2 },
        { id: "marketing_meta", label: "Meta Ads & Pixel", icon: Share2 },
        { id: "marketing_scripts", label: "Pixels & Scripts", icon: Code2 },
        { id: "marketing_conversions", label: "Conversões", icon: CheckCircle2 },
      ],
    },
    {
      id: "seo",
      label: "SEO ORGÂNICO",
      items: [
        { id: "seo_dashboard", label: "Dashboard SEO", icon: Search },
        { id: "seo_pages", label: "SEO por Página", icon: FileText },
        { id: "seo_sitemap", label: "Sitemap XML", icon: FileCode },
        { id: "seo_robots", label: "Robots.txt", icon: Code2 },
        { id: "seo_redirects", label: "Redirecionamentos 301", icon: ArrowRightLeft },
        { id: "seo_schema", label: "Dados Estruturados", icon: Bot },
        { id: "seo_audit", label: "Auditoria Técnica", icon: Sparkles },
      ],
    },
    {
      id: "integrations",
      label: "INTEGRAÇÕES",
      items: [
        { id: "integrations_hub", label: "Central de Integrações", icon: Share2 },
      ],
    },
    {
      id: "settings",
      label: "CONFIGURAÇÕES",
      items: [
        { id: "settings_general", label: "Configurações Gerais", icon: Settings },
        { id: "settings_users", label: "Usuários & Acesso", icon: Users },
        { id: "settings_logs", label: "Logs de Atividades", icon: History },
      ],
    },
  ];

  const handleItemClick = (id: AdminViewKey) => {
    onSelectView(id);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Header Trigger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1A1412] text-white px-4 py-3 flex items-center justify-between border-b border-[#CFB583]/20 shadow-md">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-[#CFB583] transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <span className="font-serif-editorial text-lg text-[#F8F4EC]">
          Martita <span className="text-[#CFB583] text-xs font-sans">CMS SaaS</span>
        </span>
        <Link
          href="/"
          target="_blank"
          className="text-xs text-[#CFB583] hover:underline flex items-center gap-1"
        >
          <span>Ver Site</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-[#1A1412] border-r border-[#CFB583]/20 transition-all duration-300 shadow-2xl ${
          collapsed ? "w-20" : "w-72"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#CFB583]/15 flex items-center justify-between">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#CFB583]/30 to-[#E77759]/30 border border-[#CFB583]/40 flex items-center justify-center shrink-0 shadow-inner">
                <span className="font-serif-editorial text-lg text-[#CFB583] font-bold">M</span>
              </div>
              <div>
                <h1 className="font-serif-editorial text-lg font-semibold text-[#F8F4EC] leading-tight tracking-wide">
                  Martita
                </h1>
                <p className="text-[10px] uppercase font-mono tracking-wider text-[#CFB583]/80">
                  Digital Intelligence
                </p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-xl bg-gradient-to-br from-[#CFB583]/30 to-[#E77759]/30 border border-[#CFB583]/40 flex items-center justify-center shadow-inner">
              <span className="font-serif-editorial text-xl text-[#CFB583] font-bold">M</span>
            </div>
          )}

          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            className="hidden lg:flex p-1.5 rounded-lg text-white/50 hover:text-[#CFB583] hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 -rotate-90" />}
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {categories.map((category) => {
            const isOpen = openCategories[category.id] !== false;

            return (
              <div key={category.id} className="space-y-1">
                {!collapsed ? (
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#CFB583]/70 hover:text-[#CFB583] transition-colors"
                  >
                    <span>{category.label}</span>
                    <ChevronDown
                      className={`w-3 h-3 transition-transform ${
                        isOpen ? "" : "-rotate-90 text-white/30"
                      }`}
                    />
                  </button>
                ) : (
                  <div className="w-full h-px bg-white/10 my-2" />
                )}

                {(isOpen || collapsed) && (
                  <div className="space-y-0.5">
                    {category.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentView === item.id;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id)}
                          title={collapsed ? item.label : undefined}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-sans transition-all duration-200 group relative ${
                            isActive
                              ? "bg-gradient-to-r from-[#CFB583]/25 to-[#E77759]/15 text-[#F8F4EC] font-semibold border border-[#CFB583]/40 shadow-sm"
                              : "text-[#F8F4EC]/70 hover:text-[#F8F4EC] hover:bg-white/[0.06]"
                          } ${collapsed ? "justify-center px-0" : ""}`}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#CFB583] rounded-r-full" />
                          )}

                          <Icon
                            className={`w-4 h-4 shrink-0 transition-colors ${
                              isActive
                                ? "text-[#CFB583]"
                                : "text-white/50 group-hover:text-[#CFB583]"
                            }`}
                          />

                          {!collapsed && (
                            <span className="truncate flex-1 text-left">{item.label}</span>
                          )}

                          {!collapsed && item.badge !== undefined && (
                            <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded-full bg-[#E77759] text-white">
                              {item.badge}
                            </span>
                          )}

                          {collapsed && item.badge !== undefined && (
                            <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#E77759]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Info & Footer Actions */}
        <div className="p-3 border-t border-[#CFB583]/15 bg-[#140F0E]">
          {!collapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] border border-white/5">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-lg bg-[#CFB583]/20 border border-[#CFB583]/30 flex items-center justify-center shrink-0">
                  <span className="font-mono text-xs text-[#CFB583] font-bold">
                    {adminName.slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-medium text-[#F8F4EC] truncate">{adminName}</p>
                  <p className="text-[10px] text-white/40 truncate">admin@martita.com.br</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  target="_blank"
                  title="Abrir site público em nova aba"
                  className="p-1.5 rounded-lg text-white/50 hover:text-[#CFB583] hover:bg-white/10 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={onLogout}
                  title="Encerrar sessão"
                  className="p-1.5 rounded-lg text-white/50 hover:text-red-400 hover:bg-white/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Link
                href="/"
                target="_blank"
                title="Abrir site público"
                className="p-2 rounded-lg text-white/50 hover:text-[#CFB583] hover:bg-white/10 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={onLogout}
                title="Sair"
                className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

