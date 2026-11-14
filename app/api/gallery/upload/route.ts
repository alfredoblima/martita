import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { processAndSaveImage, MAX_UPLOAD_SIZE } from "@/lib/image-processor";

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || undefined;

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo de imagem foi enviado." },
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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await processAndSaveImage(buffer, file.name, title);

    return NextResponse.json({
      ok: true,
      message: "Imagem otimizada e convertida para WebP com sucesso.",
      data: result,
    });
  } catch (error: any) {
    console.error("Gallery upload error:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao processar e salvar a imagem." },
      { status: 500 }
    );
  }
}

