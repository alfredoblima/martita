import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ApresentacaoClient } from "./ApresentacaoClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Por que sua empresa precisa de um site em 2026? | Martita Café & Gastrobar",
  description:
    "Apresentação estratégica de presença digital para o Martita Café & Gastrobar. Descubra como um site profissional amplia a descoberta no Google e inteligência artificial, valoriza o posicionamento da marca e gera resultados comerciais previsíveis.",
  openGraph: {
    title: "Por que sua empresa precisa de um site em 2026? | Martita",
    description:
      "Apresentação comercial executiva: a nova jornada do consumidor, SEO local na Serra Gaúcha, busca conversacional por IA e simulação de retorno sobre o investimento.",
    url: "/por-que-um-site-em-2026",
    siteName: "Martita Café & Gastrobar",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/martita/IMG_6214.jpeg",
        width: 1200,
        height: 630,
        alt: "Martita Café e Gastrobar Apresentação Estratégica 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Por que sua empresa precisa de um site em 2026? | Martita",
    description:
      "Estratégia comercial e presença digital para o Martita Café & Gastrobar em Bento Gonçalves.",
    images: ["/images/martita/IMG_6214.jpeg"],
  },
};

export default async function PorQueUmSiteEm2026Page() {
  let config = await prisma.siteConfig.findUnique({
    where: { id: "singleton" },
  });

  if (!config) {
    config = await prisma.siteConfig.create({
      data: { id: "singleton" },
    });
  }

  return <ApresentacaoClient config={config} />;
}

