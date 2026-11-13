import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    return NextResponse.json({ error: "Erro ao listar mensagens." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Por favor, preencha nome, e-mail e mensagem." },
        { status: 400 }
      );
    }

    const saved = await prisma.contactMessage.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim(),
        phone: phone ? String(phone).trim() : null,
        subject: subject ? String(subject).trim() : "Contato pelo site Martita",
        message: String(message).trim(),
      },
    });

    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (error) {
    console.error("Save contact message error:", error);
    return NextResponse.json(
      { error: "Não foi possível enviar sua mensagem no momento." },
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
    const body = await request.json();
    const { id, read } = body;
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { read: Boolean(read) },
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update message error:", error);
    return NextResponse.json({ error: "Erro ao atualizar mensagem." }, { status: 500 });
  }
}

