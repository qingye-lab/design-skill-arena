import type { MetadataRoute } from "next"

import { showcases } from "@/data/showcases"

const siteUrl = "https://arena.xflux.cn"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const staticRoutes = ["", "/skills", "/methodology"]

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.5,
    })),
    ...showcases.map((item) => ({
      url: `${siteUrl}${item.demoUrl}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ]
}
