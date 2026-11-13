import type { Metadata } from "next";
import { Suspense } from "react";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";
import { TrackingProvider } from "@/components/analytics/TrackingProvider";
import Script from "next/script";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: "singleton" },
    });

    const title =
      config?.seoTitle ||
      "Martita — Café, Brunch & Gastrobar | Experiência Gastronômica";
    const description =
      config?.seoDescription ||
      "Do primeiro café da manhã ao último drink da noite. Descubra uma experiência que combina sabores, encontros e bons momentos na Martita Café & Gastrobar.";

    return {
      metadataBase: new URL("http://localhost:3055"),
      title,
      description,
      keywords: config?.seoKeywords || "Martita, Café, Gastrobar, Brunch, Drinks",
      openGraph: {
        title,
        description,
        type: "website",
        locale: "pt_BR",
        images: [
          {
            url: config?.heroImage || "/images/martita/mesa-brunch-compartilhada.jpg",
            width: 1200,
            height: 630,
            alt: "Martita Café & Gastrobar",
          },
        ],
      },
    };
  } catch {
    return {
      title: "Martita — Café, Brunch & Gastrobar",
      description: "Um lugar para saborear cada momento.",
    };
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let trackingScripts: { id: string; code: string; location: string }[] = [];
  try {
    trackingScripts = await prisma.trackingScript.findMany({
      where: { enabled: true },
      select: { id: true, code: true, location: true },
    });
  } catch {
    // safe fallback if tables initializing
  }

  const headScripts = trackingScripts.filter((s) => s.location === "head");
  const bodyScripts = trackingScripts.filter((s) => s.location !== "head");

  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${jakarta.variable}`}>
      <head>
        {headScripts.map((s) => (
          <script
            key={s.id}
            dangerouslySetInnerHTML={{ __html: s.code }}
          />
        ))}
      </head>
      <body className="font-sans-editorial antialiased selection:bg-[#E77759] selection:text-white">
        <Suspense fallback={null}>
          <TrackingProvider>{children}</TrackingProvider>
        </Suspense>
        {bodyScripts.map((s) => (
          <div
            key={s.id}
            dangerouslySetInnerHTML={{ __html: s.code }}
          />
        ))}
      </body>
    </html>
  );
}
