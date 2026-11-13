import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const featured = searchParams.get("featured");

    const where: Record<string, unknown> = {};
    if (categoryId) where.categoryId = categoryId;
    if (featured === "true") where.isFeatured = true;

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json({ error: "Erro ao buscar produtos." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      name,
      slug,
      description,
      ingredients,
      price,
      image,
      badge,
      isFeatured,
      isAvailable,
      isDemo,
      order,
      categoryId,
    } = body;

    if (!name || !categoryId) {
      return NextResponse.json(
        { error: "Nome e categoria são obrigatórios." },
        { status: 400 }
      );
    }

    const generatedSlug =
      slug ||
      `${String(name)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}-${Date.now().toString().slice(-4)}`;

    const parsedPrice =
      price === "" || price === null || price === undefined
        ? null
        : Number(price);

    const created = await prisma.product.create({
      data: {
        name,
        slug: generatedSlug,
        description: description || "",
        ingredients: ingredients || null,
        price: Number.isNaN(parsedPrice) ? null : parsedPrice,
        image: image || "/images/martita/cafe-croissant-salgado.jpg",
        badge: badge || null,
        isFeatured: Boolean(isFeatured),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        isDemo: Boolean(isDemo),
        order: Number(order) || 0,
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json({ error: "Erro ao criar produto." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      id,
      name,
      description,
      ingredients,
      price,
      image,
      badge,
      isFeatured,
      isAvailable,
      isDemo,
      order,
      categoryId,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID do produto é obrigatório." }, { status: 400 });
    }

    const parsedPrice =
      price === "" || price === null || price === undefined
        ? null
        : Number(price);

    const updated = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        ingredients: ingredients || null,
        price: Number.isNaN(parsedPrice) ? null : parsedPrice,
        image,
        badge: badge || null,
        isFeatured: Boolean(isFeatured),
        isAvailable: Boolean(isAvailable),
        isDemo: Boolean(isDemo),
        order: Number(order) || 0,
        categoryId,
      },
      include: { category: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Erro ao atualizar produto." }, { status: 500 });
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

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Erro ao excluir produto." }, { status: 500 });
  }
}

