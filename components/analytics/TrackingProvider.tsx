"use client";

import React, { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  const key = "martita_session_id";
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPathRef = useRef<string>("");

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    const currentFull = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
    if (lastTrackedPathRef.current === currentFull) return;
    lastTrackedPathRef.current = currentFull;

    const sessionId = getOrCreateSessionId();

    const payload = {
      sessionId,
      page: pathname,
      referrer: document.referrer || null,
      utmSource: searchParams?.get("utm_source") || null,
      utmMedium: searchParams?.get("utm_medium") || null,
      utmCampaign: searchParams?.get("utm_campaign") || null,
      utmContent: searchParams?.get("utm_content") || null,
      utmTerm: searchParams?.get("utm_term") || null,
      gclid: searchParams?.get("gclid") || null,
      fbclid: searchParams?.get("fbclid") || null,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
    };

    // Use sendBeacon if available, otherwise fetch with keepalive
    const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track/pageview", blob);
    } else {
      fetch("/api/track/pageview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  }, [pathname, searchParams]);

  // Global listener for automatic high-intent CTA conversion tracking
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a");
      if (!target || !target.href) return;

      const href = target.href.toLowerCase();
      const sessionId = getOrCreateSessionId();

      let conversionType: string | null = null;
      let conversionName: string | null = null;

      if (href.includes("wa.me") || href.includes("whatsapp")) {
        conversionType = "whatsapp_click";
        conversionName = "Clique no WhatsApp";
      } else if (href.startsWith("tel:")) {
        conversionType = "phone_click";
        conversionName = "Ligação Telefônica";
      } else if (href.includes("instagram.com")) {
        conversionType = "instagram_click";
        conversionName = "Acesso ao Instagram";
      } else if (href.includes("/cardapio") && window.location.pathname !== "/cardapio") {
        conversionType = "menu_view";
        conversionName = "Explorou Cardápio Oficial";
      }

      if (conversionType && conversionName) {
        const payload = {
          sessionId,
          type: conversionType,
          name: conversionName,
          page: window.location.pathname,
          metadata: { href: target.href, text: target.innerText?.trim()?.slice(0, 50) },
        };

        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        if (navigator.sendBeacon) {
          navigator.sendBeacon("/api/track/event", blob);
        } else {
          fetch("/api/track/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            keepalive: true,
          }).catch(() => {});
        }
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", handleGlobalClick, { capture: true });
  }, []);

  return <>{children}</>;
}

