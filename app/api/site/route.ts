import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    let config = await prisma.siteConfig.findUnique({
      where: { id: "singleton" },
    });
    if (!config) {
      config = await prisma.siteConfig.create({
        data: { id: "singleton" },
      });
    }
    return NextResponse.json(config);
  } catch (error) {
    console.error("Get SiteConfig error:", error);
    return NextResponse.json({ error: "Erro ao carregar configurações." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id: _id, updatedAt: _u, ...updateData } = body;

    const updated = await prisma.siteConfig.upsert({
      where: { id: "singleton" },
      update: updateData,
      create: { id: "singleton", ...updateData },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update SiteConfig error:", error);
    return NextResponse.json({ error: "Erro ao atualizar configurações." }, { status: 500 });
  }
}

