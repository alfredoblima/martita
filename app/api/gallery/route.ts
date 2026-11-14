import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";
import {
  processAndSaveImage,
  deleteUploadedImage,
  MAX_UPLOAD_SIZE,
} from "@/lib/image-processor";

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
    const contentType = request.headers.get("content-type") || "";

    // 1. Multipart Form Data (direct file upload + metadata)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const title = (formData.get("title") as string)?.trim();
      const caption = (formData.get("caption") as string)?.trim() || null;
      const category = (formData.get("category") as string)?.trim() || "Gastronomia";
      const aspect = (formData.get("aspect") as string)?.trim() || "portrait";
      const order = Number(formData.get("order")) || 0;
      const active = formData.get("active") !== "false";

      if (!title || !category) {
        return NextResponse.json(
          { error: "Título e categoria são obrigatórios." },
          { status: 400 }
        );
      }

      if (!file) {
        return NextResponse.json(
          { error: "É obrigatório selecionar uma imagem para envio." },
          { status: 400 }
        );
      }

      if (file.size > MAX_UPLOAD_SIZE) {
        return NextResponse.json(
          {
            error: `O arquivo enviado excede o limite máximo de 15 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
          },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const processed = await processAndSaveImage(buffer, file.name, title);

      const created = await prisma.galleryItem.create({
        data: {
          title,
          caption,
          category,
          image: processed.url,
          aspect,
          fileName: processed.fileName,
          originalSize: processed.originalSize,
          finalSize: processed.finalSize,
          width: processed.width,
          height: processed.height,
          mimeType: processed.mimeType,
          order,
          active,
        },
      });

      return NextResponse.json(created, { status: 201 });
    }

    // 2. JSON Body (already uploaded or external image)
    const body = await request.json();
    const {
      title,
      caption,
      category,
      image,
      aspect,
      order,
      active,
      fileName,
      originalSize,
      finalSize,
      width,
      height,
      mimeType,
    } = body;

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
        fileName: fileName || null,
        originalSize: originalSize ? Number(originalSize) : null,
        finalSize: finalSize ? Number(finalSize) : null,
        width: width ? Number(width) : null,
        height: height ? Number(height) : null,
        mimeType: mimeType || "image/webp",
        order: Number(order) || 0,
        active: active !== undefined ? Boolean(active) : true,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    console.error("Create gallery item error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao adicionar item na galeria." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const contentType = request.headers.get("content-type") || "";

    // 1. Multipart Form Data (file replacement or metadata edit)
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const id = formData.get("id") as string;
      if (!id) {
        return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
      }

      const existing = await prisma.galleryItem.findUnique({ where: { id } });
      if (!existing) {
        return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });
      }

      const file = formData.get("file") as File | null;
      const title = (formData.get("title") as string)?.trim() || existing.title;
      const caption =
        formData.has("caption") ? (formData.get("caption") as string)?.trim() || null : existing.caption;
      const category = (formData.get("category") as string)?.trim() || existing.category;
      const aspect = (formData.get("aspect") as string)?.trim() || existing.aspect;
      const order = formData.has("order") ? Number(formData.get("order")) : existing.order;
      const active = formData.has("active") ? formData.get("active") !== "false" : existing.active;

      let imageUpdate: {
        image?: string;
        fileName?: string;
        originalSize?: number;
        finalSize?: number;
        width?: number;
        height?: number;
        mimeType?: string;
      } = {};

      if (file && file.size > 0) {
        if (file.size > MAX_UPLOAD_SIZE) {
          return NextResponse.json(
            {
              error: `O arquivo enviado excede o limite máximo de 15 MB (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
            },
            { status: 400 }
          );
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const processed = await processAndSaveImage(buffer, file.name, title);

        // Remove old image file from disk if it was stored in uploads
        await deleteUploadedImage(existing.image);

        imageUpdate = {
          image: processed.url,
          fileName: processed.fileName,
          originalSize: processed.originalSize,
          finalSize: processed.finalSize,
          width: processed.width,
          height: processed.height,
          mimeType: processed.mimeType,
        };
      }

      const updated = await prisma.galleryItem.update({
        where: { id },
        data: {
          title,
          caption,
          category,
          aspect,
          order,
          active,
          ...imageUpdate,
        },
      });

      return NextResponse.json(updated);
    }

    // 2. JSON Body
    const body = await request.json();
    const {
      id,
      title,
      caption,
      category,
      image,
      aspect,
      order,
      active,
      fileName,
      originalSize,
      finalSize,
      width,
      height,
      mimeType,
    } = body;

    if (!id) {
      return NextResponse.json({ error: "ID é obrigatório." }, { status: 400 });
    }

    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });
    }

    // If image URL changed and old image was local upload, clean up
    if (image && image !== existing.image) {
      await deleteUploadedImage(existing.image);
    }

    const updated = await prisma.galleryItem.update({
      where: { id },
      data: {
        title,
        caption: caption !== undefined ? caption : existing.caption,
        category,
        image: image || existing.image,
        aspect: aspect || existing.aspect,
        fileName: fileName !== undefined ? fileName : existing.fileName,
        originalSize: originalSize !== undefined ? (originalSize ? Number(originalSize) : null) : existing.originalSize,
        finalSize: finalSize !== undefined ? (finalSize ? Number(finalSize) : null) : existing.finalSize,
        width: width !== undefined ? (width ? Number(width) : null) : existing.width,
        height: height !== undefined ? (height ? Number(height) : null) : existing.height,
        mimeType: mimeType || existing.mimeType || "image/webp",
        order: Number(order) || 0,
        active: Boolean(active),
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Update gallery item error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao atualizar item da galeria." },
      { status: 500 }
    );
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

    const existing = await prisma.galleryItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Item não encontrado." }, { status: 404 });
    }

    // Delete record from database
    await prisma.galleryItem.delete({ where: { id } });

    // Clean up local uploaded file
    await deleteUploadedImage(existing.image);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Delete gallery item error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao remover item da galeria." },
      { status: 500 }
    );
  }
}
