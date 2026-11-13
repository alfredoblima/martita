import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number | null | undefined): string {
  if (value === null || value === undefined) return "Sob consulta";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function buildWhatsAppLink(phone: string | null | undefined, message: string): string {
  const cleanPhone = (phone || "").replace(/\D/g, "");
  const encoded = encodeURIComponent(message);
  if (!cleanPhone) {
    return `https://api.whatsapp.com/send?text=${encoded}`;
  }
  const fullPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;
  return `https://wa.me/${fullPhone}?text=${encoded}`;
}

