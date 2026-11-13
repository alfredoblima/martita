import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const seoSettings = await prisma.seoSettings.findUnique({
      where: { id: "singleton" },
    });

    const robotsContent =
      seoSettings?.robotsTxt ||
      `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://martita.com.br/sitemap.xml`;

    return new NextResponse(robotsContent, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59",
      },
    });
  } catch (err) {
    console.error("Error generating robots.txt:", err);
    return new NextResponse("User-agent: *\nAllow: /", {
      headers: { "Content-Type": "text/plain" },
    });
  }
}

