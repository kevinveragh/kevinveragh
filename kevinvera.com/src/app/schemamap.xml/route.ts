import { SITE } from "@/content/site";

/** /schemamap.xml: the Schema Map robots.txt points at (Schema Feeds 0.1): the site's structured data feeds. */
export const dynamic = "force-static";

export function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:sf="http://schema.org/schemas/schemafeed/0.1">
  <url>
    <loc>${SITE.url}/feeds/pages.jsonl</loc>
    <lastmod>${SITE.updated}</lastmod>
    <sf:contentType>structuredData/schema.org</sf:contentType>
  </url>
</urlset>
`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8" } });
}
