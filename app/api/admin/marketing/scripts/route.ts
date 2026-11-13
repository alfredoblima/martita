import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const scripts = await prisma.trackingScript.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ scripts });
  } catch (error) {
    console.error("Error in GET /api/admin/marketing/scripts:", error);
    return NextResponse.json({ error: "Failed to fetch scripts" }, { status: 500 });
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
      type = "custom",
      code,
      location = "head",
      enabled = true,
      consentCategory = "analytics",
      environment = "production",
    } = body;

    if (!name || !code) {
      return NextResponse.json({ error: "Nome e código do script são obrigatórios." }, { status: 400 });
    }

    const script = await prisma.trackingScript.create({
      data: {
        name: name.trim(),
        type,
        code: code.trim(),
        location,
        enabled: Boolean(enabled),
        consentCategory,
        environment,
      },
    });

    await prisma.activityLog.create({
      data: {
        action: "create_tracking_script",
        category: "marketing",
        description: `Script '${script.name}' (${script.location}) adicionado ao site.`,
        userName: session.name,
        userEmail: session.email,
      },
    });

    return NextResponse.json({ ok: true, script });
  } catch (error) {
    console.error("Error in POST /api/admin/marketing/scripts:", error);
    return NextResponse.json({ error: "Failed to create script" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, code, location, enabled, consentCategory, environment } = body;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const updated = await prisma.trackingScript.update({
      where: { id },
      data: {
        name: name?.trim(),
        code: code?.trim(),
        location,
        enabled: enabled !== undefined ? Boolean(enabled) : undefined,
        consentCategory,
        environment,
      },
    });

    return NextResponse.json({ ok: true, script: updated });
  } catch (error) {
    console.error("Error in PUT /api/admin/marketing/scripts:", error);
    return NextResponse.json({ error: "Failed to update script" }, { status: 500 });
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

    await prisma.trackingScript.delete({ where: { id } });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error in DELETE /api/admin/marketing/scripts:", error);
    return NextResponse.json({ error: "Failed to delete script" }, { status: 500 });
  }
}

