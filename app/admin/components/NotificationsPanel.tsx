"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Info,
  Check,
  Trash2,
  ExternalLink,
} from "lucide-react";

export function NotificationsPanel() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/notifications");
      if (res.ok) {
        const json = await res.json();
        setNotifications(json.notifications || []);
      }
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    await fetch("/api/admin/notifications", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAllRead: true }),
    });
    loadNotifications();
  };

  const handleClearAll = async () => {
    if (!confirm("Deseja apagar todas as notificações?")) return;
    await fetch("/api/admin/notifications", { method: "DELETE" });
    loadNotifications();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#CFB583]/15">
        <div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-semibold text-[#211A17]">
            Central de Notificações &amp; Alertas
          </h2>
          <p className="text-xs sm:text-sm text-[#38271F]/70 mt-1">
            Alertas de picos de tráfego, novas mensagens, sincronização de APIs e saúde técnica de SEO.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            className="px-3.5 py-2 rounded-xl border border-[#CFB583]/30 text-xs font-medium text-[#211A17] hover:bg-[#F8F4EC] transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Marcar Todas como Lidas</span>
          </button>
          <button
            onClick={handleClearAll}
            className="px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpar Histórico</span>
          </button>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-[#CFB583]/25 shadow-sm space-y-4">
        <div className="divide-y divide-[#CFB583]/10">
          {notifications.map((n) => {
            const isSuccess = n.severity === "success";
            const isError = n.severity === "error";
            const isWarn = n.severity === "warning";
            const Icon = isSuccess ? CheckCircle2 : isError ? AlertCircle : isWarn ? AlertTriangle : Info;

            return (
              <div
                key={n.id}
                className={`py-4 flex items-start gap-4 transition-colors ${
                  n.read ? "opacity-60" : "bg-white"
                }`}
              >
                <div
                  className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    isSuccess
                      ? "bg-emerald-100 text-emerald-700"
                      : isError
                      ? "bg-red-100 text-red-700"
                      : isWarn
                      ? "bg-amber-100 text-amber-700"
                      : "bg-[#CFB583]/20 text-[#211A17]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-semibold text-[#211A17] flex items-center gap-2">
                      <span>{n.title}</span>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-[#E77759]" />
                      )}
                    </h4>
                    <span className="text-[10px] font-mono text-[#38271F]/50">
                      {new Date(n.createdAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-[#38271F]/75 leading-relaxed">{n.message}</p>
                </div>
              </div>
            );
          })}

          {notifications.length === 0 && (
            <p className="py-12 text-center text-xs text-[#38271F]/50 font-mono">
              Nenhuma notificação no momento. Tudo operando com 100% de estabilidade.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

