import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const redirects = await prisma.seoRedirect.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ redirects });
  } catch (error) {
    console.error("Error in GET /api/admin/seo/redirects:", error);
    return NextResponse.json({ error: "Failed to fetch redirects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    let { sourcePath, targetPath, statusCode = 301, active = true, notes } = body;

    if (!sourcePath || !targetPath) {
      return NextResponse.json({ error: "URL antiga e URL de destino são obrigatórias." }, { status: 400 });
    }

    sourcePath = sourcePath.trim();
    targetPath = targetPath.trim();

    if (!sourcePath.startsWith("/")) sourcePath = "/" + sourcePath;
    if (!targetPath.startsWith("/") && !targetPath.startsWith("http")) targetPath = "/" + targetPath;

    if (sourcePath === targetPath) {
      return NextResponse.json({ error: "A URL de origem e destino não podem ser iguais (evita loop infinito)." }, { status: 400 });
    }

    const redirect = await prisma.seoRedirect.upsert({
      where: { sourcePath },
      update: {
        targetPath,
        statusCode: Number(statusCode) || 301,
        active: Boolean(active),
        notes,
      },
      create: {
        sourcePath,
        targetPath,
        statusCode: Number(statusCode) || 301,
        active: Boolean(active),
        notes,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "create_redirect",
        category: "seo",
        description: `Redirecionamento ${redirect.statusCode}: '${redirect.sourcePath}' -> '${redirect.targetPath}'.`,
        userName: session.name,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ ok: true, redirect });
  } catch (error) {
    console.error("Error in POST /api/admin/seo/redirects:", error);
    return NextResponse.json({ error: "Failed to save redirect" }, { status: 500 });
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

    await prisma.seoRedirect.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/seo/redirects:", error);
    return NextResponse.json({ error: "Failed to delete redirect" }, { status: 500 });
  }
}

