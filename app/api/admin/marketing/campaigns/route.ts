import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const campaigns = await prisma.marketingCampaign.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ campaigns });
  } catch (error) {
    console.error("Error in GET /api/admin/marketing/campaigns:", error);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      destinationUrl = "/",
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      notes,
    } = body;

    if (!name || !utmSource || !utmMedium || !utmCampaign) {
      return NextResponse.json(
        { error: "Nome, Origem (utm_source), Mídia (utm_medium) e Campanha (utm_campaign) são obrigatórios." },
        { status: 400 }
      );
    }

    // Monta a URL completa
    const baseUrl = destinationUrl.startsWith("http")
      ? destinationUrl
      : `https://martita.com.br${destinationUrl.startsWith("/") ? destinationUrl : "/" + destinationUrl}`;

    const urlObj = new URL(baseUrl);
    urlObj.searchParams.set("utm_source", utmSource.trim().toLowerCase());
    urlObj.searchParams.set("utm_medium", utmMedium.trim().toLowerCase());
    urlObj.searchParams.set("utm_campaign", utmCampaign.trim().toLowerCase());
    if (utmContent) urlObj.searchParams.set("utm_content", utmContent.trim());
    if (utmTerm) urlObj.searchParams.set("utm_term", utmTerm.trim());

    const generatedUrl = urlObj.toString();

    const campaign = await prisma.marketingCampaign.create({
      data: {
        name: name.trim(),
        destinationUrl,
        utmSource: utmSource.trim().toLowerCase(),
        utmMedium: utmMedium.trim().toLowerCase(),
        utmCampaign: utmCampaign.trim().toLowerCase(),
        utmContent: utmContent?.trim() || null,
        utmTerm: utmTerm?.trim() || null,
        generatedUrl,
        notes: notes?.trim() || null,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "create_campaign",
        category: "marketing",
        description: `Nova campanha UTM '${campaign.name}' gerada para ${campaign.utmSource}/${campaign.utmCampaign}.`,
        userName: session.name,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ ok: true, campaign });
  } catch (error) {
    console.error("Error in POST /api/admin/marketing/campaigns:", error);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.marketingCampaign.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/marketing/campaigns:", error);
    return NextResponse.json({ error: "Failed to delete campaign" }, { status: 500 });
  }
}

