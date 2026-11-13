import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const seoSettings = await prisma.seoSettings.findUnique({
      where: { id: "singleton" },
    });

    if (seoSettings && !seoSettings.sitemapEnabled) {
      return new NextResponse("Sitemap disabled", { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://martita.com.br";
    const now = new Date().toISOString();

    const staticRoutes = [
      { path: "/", priority: "1.0", changefreq: "weekly" },
      { path: "/cardapio", priority: "0.9", changefreq: "daily" },
    ];

    const products = await prisma.product.findMany({
      where: { isAvailable: true },
      select: { slug: true, updatedAt: true },
    });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static routes
    for (const r of staticRoutes) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}${r.path}</loc>\n`;
      xml += `    <lastmod>${now}</lastmod>\n`;
      xml += `    <changefreq>${r.changefreq}</changefreq>\n`;
      xml += `    <priority>${r.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    // Dynamic products or menu items
    for (const p of products) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/cardapio#${p.slug}</loc>\n`;
      xml += `    <lastmod>${p.updatedAt.toISOString()}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }

    xml += `</urlset>`;

    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (err) {
    console.error("Error generating sitemap.xml:", err);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}

