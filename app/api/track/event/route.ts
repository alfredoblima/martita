import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isBot, detectDeviceType } from "@/lib/analytics-tracker";

export async function POST(req: NextRequest) {
  try {
    const userAgent = req.headers.get("user-agent") || "";
    if (isBot(userAgent)) {
      return NextResponse.json({ ignored: true, reason: "bot" });
    }

    const body = await req.json().catch(() => ({}));
    const {
      sessionId = null,
      type = "custom",
      name = "Evento",
      page = "/",
      metadata = {},
      value = 0,
    } = body;

    const deviceType = detectDeviceType(userAgent);

    // Identifica o canal da sessão atual se o sessionId existir
    let channel = "direct";
    if (sessionId) {
      const session = await prisma.analyticsSession.findUnique({
        where: { sessionId },
        select: { channel: true, utmCampaign: true },
      });
      if (session?.channel) {
        channel = session.channel;
      }
      if (session?.utmCampaign) {
        await prisma.marketingCampaign.updateMany({
          where: { utmCampaign: session.utmCampaign },
          data: { conversionsCount: { increment: 1 } },
        });
      }
    }

    // Cria o evento de conversão
    const conversion = await prisma.conversionEvent.create({
      data: {
        sessionId,
        type,
        name,
        page,
        channel,
        deviceType,
        value: Number(value) || 0,
        metadata: JSON.stringify(metadata),
      },
    });

    // Se for clique no WhatsApp ou formulário de contato, gera uma notificação se configurado
    if (type === "whatsapp_click" || type === "contact_submit") {
      await prisma.adminNotification.create({
        data: {
          type: "contact_lead",
          severity: "info",
          title: type === "whatsapp_click" ? "Novo Clique no WhatsApp" : "Novo Contato Enviado",
          message: `Um visitante (${channel}, ${deviceType}) interagiu na página ${page}.`,
          actionUrl: "/admin",
          read: false,
        },
      });
    }

    return NextResponse.json({ ok: true, conversionId: conversion.id });
  } catch (error) {
    console.error("Error in /api/track/event:", error);
    return NextResponse.json({ error: "Failed to track conversion event" }, { status: 500 });
  }
}

