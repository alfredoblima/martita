import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { CardapioClient } from "./CardapioClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Cardápio Digital Completo | Martita Café & Gastrobar",
  description:
    "Explore todos os pratos, croissants folhados, cafés especiais, massas artesanais, petiscos do mar e drinks autorais da Martita Café & Gastrobar em Canasvieiras, Florianópolis.",
  openGraph: {
    title: "Cardápio Digital | Martita Café & Gastrobar",
    description:
      "Do primeiro café da manhã ao último drink da noite. Conheça nossos pratos, preços e ingredientes.",
    images: ["/images/martita/produtos/croissant-presunto-queijo-mesa.jpg"],
  },
};

export default async function CardapioPage() {
  let config = await prisma.siteConfig.findUnique({
    where: { id: "singleton" },
  });

  if (!config) {
    config = await prisma.siteConfig.create({
      data: { id: "singleton" },
    });
  }

  const categories = await prisma.category.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    include: {
      products: {
        where: { isAvailable: true },
        orderBy: { order: "asc" },
      },
    },
  });

  return <CardapioClient categories={categories} config={config} />;
}

