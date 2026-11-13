"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Users,
  Shield,
  History,
  Save,
  CheckCircle2,
  Lock,
  Key,
} from "lucide-react";

interface SettingsAndLogsProps {
  initialSubTab?: string;
  siteConfig?: any;
  onSaveSiteConfig?: (updated: any) => Promise<void>;
  adminUser?: any;
}

export function SettingsAndLogs({
  initialSubTab = "general",
  siteConfig,
  onSaveSiteConfig,
  adminUser,
}: SettingsAndLogsProps) {
  const [activeTab, setActiveTab] = useState<string>(initialSubTab);

  useEffect(() => {
    setActiveTab(initialSubTab);
  }, [initialSubTab]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Config form state
  const [configForm, setConfigForm] = useState<any>(siteConfig || {});

  // Password change state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (siteConfig) {
      setConfigForm(siteConfig);
    }
  }, [siteConfig]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/logs?limit=50");
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs || []);
      }
    } catch (err) {
      console.error("Error loading logs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "logs") {
      loadLogs();
    }
  }, [activeTab]);

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveSiteConfig) {
      await onSaveSiteConfig(configForm);
      showToast("Configurações gerais salvas com sucesso!");
    }
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
            Configurações, Segurança &amp; Auditoria
          </h2>
          <p className="text-xs sm:text-sm text-[#38271F]/70 mt-1">
            Dados cadastrais do estabelecimento, credenciais de acesso e registro completo de ações administrativas.
          </p>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "general", label: "Gerais & Contato", icon: Settings },
            { id: "users", label: "Usuários & Acesso", icon: Users },
            { id: "logs", label: "Logs de Atividades", icon: History },
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

      {/* TAB 1: GERAIS */}
      {activeTab === "general" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm">
          <form onSubmit={handleSaveConfig} className="space-y-6">
            <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
              Informações Oficiais do Gastrobar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Nome da Marca
                </label>
                <input
                  type="text"
                  value={configForm.brandName || ""}
                  onChange={(e) => setConfigForm({ ...configForm, brandName: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Assinatura / Slogan
                </label>
                <input
                  type="text"
                  value={configForm.brandTagline || ""}
                  onChange={(e) => setConfigForm({ ...configForm, brandTagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Número de WhatsApp Oficial
                </label>
                <input
                  type="text"
                  placeholder="5554999999999"
                  value={configForm.whatsapp || ""}
                  onChange={(e) => setConfigForm({ ...configForm, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Telefone Fixo / Comercial
                </label>
                <input
                  type="text"
                  value={configForm.phone || ""}
                  onChange={(e) => setConfigForm({ ...configForm, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  E-mail Oficial
                </label>
                <input
                  type="email"
                  value={configForm.email || ""}
                  onChange={(e) => setConfigForm({ ...configForm, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Link do Instagram
                </label>
                <input
                  type="text"
                  value={configForm.instagram || ""}
                  onChange={(e) => setConfigForm({ ...configForm, instagram: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Endereço Físico Completo
                </label>
                <input
                  type="text"
                  value={configForm.address || ""}
                  onChange={(e) => setConfigForm({ ...configForm, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#211A17] mb-1">
                  Cidade — UF
                </label>
                <input
                  type="text"
                  value={configForm.cityState || ""}
                  onChange={(e) => setConfigForm({ ...configForm, cityState: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#CFB583]/30 bg-[#F8F4EC]/40 focus:border-[#CFB583] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#211A17] hover:bg-[#38271F] text-[#CFB583] font-semibold text-xs flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 2: USUÁRIOS & ACESSO */}
      {activeTab === "users" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-6">
          <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
            Usuário Administrador Conectado
          </h3>

          <div className="p-4 rounded-2xl bg-[#F8F4EC]/60 border border-[#CFB583]/20 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#211A17]">
                {adminUser?.name || "Curadoria Martita"}
              </p>
              <p className="text-xs font-mono text-[#38271F]/60">
                {adminUser?.email || "admin@martita.com.br"}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-emerald-100 text-emerald-800 font-semibold border border-emerald-300">
              Acesso Master
            </span>
          </div>
        </div>
      )}

      {/* TAB 3: LOGS DE ATIVIDADE */}
      {activeTab === "logs" && (
        <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-[#CFB583]/15">
            <div>
              <h3 className="font-serif-editorial text-xl font-semibold text-[#211A17]">
                Trilha de Auditoria &amp; Logs do Sistema
              </h3>
              <p className="text-xs text-[#38271F]/60">
                Histórico imutável de ações administrativas para segurança e governança.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#CFB583]/20 text-[#38271F]/60 uppercase font-mono text-[10px]">
                  <th className="pb-3">Data/Hora</th>
                  <th className="pb-3">Ação</th>
                  <th className="pb-3">Categoria</th>
                  <th className="pb-3">Descrição</th>
                  <th className="pb-3 text-right">Usuário</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#CFB583]/10 font-sans">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#F8F4EC]/50 transition-colors">
                    <td className="py-3 font-mono text-[#38271F]/60 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="py-3 font-mono text-[#211A17] font-semibold">{log.action}</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#CFB583]/20 text-[#38271F] uppercase font-bold">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-3 text-[#38271F]/80">{log.description}</td>
                    <td className="py-3 text-right font-mono text-[#38271F]/60">{log.userName}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#38271F]/50 font-mono">
                      Nenhum registro de log encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

