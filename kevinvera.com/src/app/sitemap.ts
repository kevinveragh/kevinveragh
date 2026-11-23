import type { MetadataRoute } from "next";

import { PAGES, PROJECTS, SITE } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const at = new Date(SITE.updated);
  return [
    ...PAGES.map((p) => ({
      url: p.path === "/" ? SITE.url : `${SITE.url}${p.path}`,
      lastModified: at,
      changeFrequency: "monthly" as const,
      priority: p.path === "/" ? 1 : 0.8,
    })),
    ...PROJECTS.map((p) => ({
      url: `${SITE.url}/work/${p.slug}`,
      lastModified: at,
      changeFrequency: "monthly" as const,
      priority: p.kind === "Earlier" ? 0.5 : 0.7,
    })),
  ];
}
