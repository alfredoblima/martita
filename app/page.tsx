import React from "react";
import { prisma } from "@/lib/prisma";
import { HomeExperience } from "@/components/HomeExperience";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let config = await prisma.siteConfig.findUnique({
    where: { id: "singleton" },
  });

  if (!config) {
    config = await prisma.siteConfig.create({
      data: { id: "singleton" },
    });
  }

  const featuredProducts = await prisma.product.findMany({
    where: { isFeatured: true, isAvailable: true },
    include: {
      category: {
        select: { name: true, slug: true },
      },
    },
    orderBy: { order: "asc" },
  });

  const galleryItems = await prisma.galleryItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <HomeExperience
      config={config}
      featuredProducts={featuredProducts}
      galleryItems={galleryItems}
    />
  );
}

