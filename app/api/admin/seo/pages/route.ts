import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pages = await prisma.pageSeo.findMany({
      orderBy: { route: "asc" },
    });

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error in GET /api/admin/seo/pages:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
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
      id,
      route,
      pageName,
      title,
      description,
      focusKeyword,
      secondaryKeywords,
      canonicalUrl,
      metaRobots,
      ogTitle,
      ogDescription,
      ogImage,
      twitterCard,
      structuredDataType,
    } = body;

    if (!route) {
      return NextResponse.json({ error: "Route is required" }, { status: 400 });
    }

    const updated = await prisma.pageSeo.upsert({
      where: { route },
      update: {
        pageName: pageName ?? undefined,
        title: title?.trim(),
        description: description?.trim(),
        focusKeyword: focusKeyword?.trim(),
        secondaryKeywords: secondaryKeywords?.trim(),
        canonicalUrl: canonicalUrl?.trim(),
        metaRobots: metaRobots?.trim() || "index, follow",
        ogTitle: ogTitle?.trim(),
        ogDescription: ogDescription?.trim(),
        ogImage: ogImage?.trim(),
        twitterCard: twitterCard || "summary_large_image",
        structuredDataType: structuredDataType || "Restaurant",
      },
      create: {
        route,
        pageName: pageName || route,
        title: title?.trim() || "",
        description: description?.trim() || "",
        focusKeyword: focusKeyword?.trim() || "",
        secondaryKeywords: secondaryKeywords?.trim() || "",
        canonicalUrl: canonicalUrl?.trim() || "",
        metaRobots: metaRobots?.trim() || "index, follow",
        ogTitle: ogTitle?.trim() || "",
        ogDescription: ogDescription?.trim() || "",
        ogImage: ogImage?.trim() || "",
        twitterCard: twitterCard || "summary_large_image",
        structuredDataType: structuredDataType || "Restaurant",
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "update_page_seo",
        category: "seo",
        description: `Metadados de SEO da página '${updated.pageName}' (${updated.route}) atualizados.`,
        userName: session.name,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ ok: true, page: updated });
  } catch (error) {
    console.error("Error in PUT /api/admin/seo/pages:", error);
    return NextResponse.json({ error: "Failed to update page SEO" }, { status: 500 });
  }
}

