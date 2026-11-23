import { SITE } from "@/content/site";

/** /.well-known/api-catalog (RFC 9727): the machine endpoints this site offers, as a linkset. */
export const dynamic = "force-static";

export function GET() {
  const linkset = {
    linkset: [
      {
        anchor: `${SITE.url}/ask`,
        "service-doc": [{ href: `${SITE.url}/llms.txt`, type: "text/plain", title: "NLWeb /ask: natural language search over kevinvera.com" }],
      },
      {
        anchor: `${SITE.url}/feeds/pages.jsonl`,
        describedby: [{ href: `${SITE.url}/schemamap.xml`, type: "application/xml", title: "Schema Map" }],
      },
      {
        anchor: `${SITE.url}/llms.txt`,
        alternate: [{ href: `${SITE.url}/llms-full.txt`, type: "text/plain", title: "The whole site as text" }],
      },
    ],
  };
  return new Response(JSON.stringify(linkset, null, 2), { headers: { "content-type": "application/linkset+json; charset=utf-8" } });
}
