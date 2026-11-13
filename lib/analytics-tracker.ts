import { prisma } from "@/lib/prisma";

export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  const botKeywords = [
    "bot", "crawl", "spider", "mediapartners", "headlesschrome", "lighthouse",
    "google-inspectiontool", "yandex", "baiduspider", "curl", "wget", "python",
    "node-fetch", "ahrefs", "semrush", "pingdom", "facebookexternalhit"
  ];
  return botKeywords.some((keyword) => ua.includes(keyword));
}

export function detectDeviceType(userAgent: string | null): "desktop" | "mobile" | "tablet" {
  if (!userAgent) return "desktop";
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/.test(ua)) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|android.*mobile|blackberry|phone|opera mini/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

export function detectBrowser(userAgent: string | null): string {
  if (!userAgent) return "Outro";
  const ua = userAgent.toLowerCase();
  if (ua.includes("edg/")) return "Edge";
  if (ua.includes("chrome") && !ua.includes("edg/")) return "Chrome";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("opera") || ua.includes("opr/")) return "Opera";
  return "Outro";
}

export function detectOS(userAgent: string | null): string {
  if (!userAgent) return "Outro";
  const ua = userAgent.toLowerCase();
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("macintosh") || ua.includes("mac os")) return "macOS";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ios")) return "iOS";
  if (ua.includes("android")) return "Android";
  if (ua.includes("linux")) return "Linux";
  return "Outro";
}

export interface ChannelDetectionInput {
  referrer?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  gclid?: string | null;
  fbclid?: string | null;
}

export function classifyTrafficChannel(input: ChannelDetectionInput): string {
  const { referrer, utmSource, utmMedium, utmCampaign, gclid, fbclid } = input;

  const source = (utmSource || "").toLowerCase().trim();
  const medium = (utmMedium || "").toLowerCase().trim();
  const ref = (referrer || "").toLowerCase().trim();

  // 1. Google Ads (gclid or explicit utm)
  if (gclid || source === "google_ads" || (source === "google" && medium === "cpc")) {
    return "google_ads";
  }

  // 2. Facebook / Meta Ads
  if (fbclid || source.includes("facebook") || source.includes("meta") || ref.includes("facebook.com")) {
    if (medium === "cpc" || medium === "paid") {
      return "facebook";
    }
    return "facebook";
  }

  // 3. Instagram
  if (source.includes("instagram") || ref.includes("instagram.com")) {
    return "instagram";
  }

  // 4. WhatsApp
  if (source.includes("whatsapp") || ref.includes("whatsapp") || ref.includes("wa.me")) {
    return "whatsapp";
  }

  // 5. Google Orgânico
  if (ref.includes("google.") && !medium.includes("cpc")) {
    return "google_organic";
  }

  // 6. Outros Buscadores
  if (ref.includes("bing.") || ref.includes("yahoo.") || ref.includes("duckduckgo.") || ref.includes("ecosia.")) {
    return "other_search";
  }

  // 7. Campanhas UTM customizadas
  if (utmCampaign || (source && source !== "direct")) {
    return "campaign";
  }

  // 8. Referências externas
  if (ref && !ref.includes("martita.com.br") && !ref.includes("localhost")) {
    return "external";
  }

  // 9. Acesso direto (sem referrer ou referrer interno)
  return "direct";
}

