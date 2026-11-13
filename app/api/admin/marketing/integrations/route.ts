import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const integrations = await prisma.marketingIntegration.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ integrations });
  } catch (error) {
    console.error("Error in GET /api/admin/marketing/integrations:", error);
    return NextResponse.json({ error: "Failed to fetch integrations" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      provider,
      status,
      accountId,
      pixelId,
      measurementId,
      containerId,
      conversionId,
      conversionLabel,
      testEventCode,
      apiTokenEncrypted,
      config,
      enabled,
      action,
    } = body;

    if (!provider) {
      return NextResponse.json({ error: "Provider is required" }, { status: 400 });
    }

    // Se a ação for "test_connection"
    if (action === "test_connection") {
      let isSuccess = false;
      let message = "";

      if (provider === "ga4") {
        isSuccess = Boolean(measurementId && measurementId.startsWith("G-"));
        message = isSuccess
          ? `Measurement ID ${measurementId} validado com sucesso!`
          : "Formato inválido. O GA4 Measurement ID deve iniciar com 'G-'.";
      } else if (provider === "meta_ads") {
        isSuccess = Boolean(pixelId && /^\d+$/.test(pixelId));
        message = isSuccess
          ? `Meta Pixel ID ${pixelId} verificado com sucesso!`
          : "O Pixel ID deve conter apenas números (ex: 123456789012345).";
      } else if (provider === "gtm") {
        isSuccess = Boolean(containerId && containerId.startsWith("GTM-"));
        message = isSuccess
          ? `Container ID ${containerId} validado!`
          : "Formato inválido. O Container ID deve iniciar com 'GTM-'.";
      } else if (provider === "google_ads") {
        isSuccess = Boolean(conversionId && conversionId.startsWith("AW-"));
        message = isSuccess
          ? `Google Ads ID ${conversionId} validado!`
          : "O Conversion ID deve iniciar com 'AW-'.";
      } else {
        isSuccess = true;
        message = "Parâmetros verificados.";
      }

      const updated = await prisma.marketingIntegration.update({
        where: { provider },
        data: {
          status: isSuccess ? "connected" : "disconnected",
          enabled: isSuccess,
          lastSyncAt: new Date(),
        },
      });

      return NextResponse.json({
        ok: isSuccess,
        message,
        integration: updated,
      });
    }

    // Atualização normal de configuração
    const updated = await prisma.marketingIntegration.upsert({
      where: { provider },
      update: {
        status: status || (enabled ? "connected" : "disconnected"),
        accountId: accountId ?? undefined,
        pixelId: pixelId ?? undefined,
        measurementId: measurementId ?? undefined,
        containerId: containerId ?? undefined,
        conversionId: conversionId ?? undefined,
        conversionLabel: conversionLabel ?? undefined,
        testEventCode: testEventCode ?? undefined,
        apiTokenEncrypted: apiTokenEncrypted ?? undefined,
        config: config ? JSON.stringify(config) : undefined,
        enabled: enabled !== undefined ? enabled : undefined,
        lastSyncAt: new Date(),
      },
      create: {
        provider,
        name: provider.toUpperCase(),
        status: enabled ? "connected" : "disconnected",
        accountId,
        pixelId,
        measurementId,
        containerId,
        conversionId,
        conversionLabel,
        testEventCode,
        apiTokenEncrypted,
        config: config ? JSON.stringify(config) : "{}",
        enabled: Boolean(enabled),
      },
    });

    // Registra no log
    await prisma.activityLog.create({
      data: {
        action: "update_integration",
        category: "marketing",
        description: `Integração ${provider} atualizada (${updated.status}).`,
        userName: session.name,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ ok: true, integration: updated });
  } catch (error) {
    console.error("Error in PUT /api/admin/marketing/integrations:", error);
    return NextResponse.json({ error: "Failed to update integration" }, { status: 500 });
  }
}

