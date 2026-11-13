import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error("Get gallery error:", error);
    return NextResponse.json({ error: "Erro ao buscar galeria." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, caption, category, image, aspect, order, active } = body;

    if (!title || !image || !category) {
      return NextResponse.json(
        { error: "Título, categoria e imagem são obrigatórios." },
        { status: 400 }
      );
    }

    const created = await prisma.galleryItem.create({
      data: {
        title,
        caption: caption || null,
        category,
        image,
        aspect: aspect || "portrait",
        order: Number(order) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Create gallery item error:", error);
    return NextResponse.json({ error: "Erro ao adicionar item na galeria." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, caption, category, image, aspect, order, active } = body;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
    }

    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        title,
        caption: caption || null,
        category,
        image,
        aspect: aspect || "portrait",
        order: Number(order) || 0,
        active: Boolean(active),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update gallery item error:", error);
    return NextResponse.json({ error: "Erro ao atualizar item da galeria." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID não informado." }, { status: 400 });
    }

    await prisma.galleryItem.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete gallery item error:", error);
    return NextResponse.json({ error: "Erro ao remover item da galeria." }, { status: 500 });
  }
}

