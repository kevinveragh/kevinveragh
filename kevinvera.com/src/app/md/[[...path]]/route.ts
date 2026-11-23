import { SITE } from "@/content/site";
import { twins } from "@/lib/markdown";

/**
 * Every page's Markdown twin. proxy.ts sends /about.md, `Accept:
 * text/markdown`, `?mode=agent` and known AI crawlers here; the twin names
 * its HTML page as canonical so search engines keep ranking the page.
 */
export const dynamic = "force-static";

const keyOf = (path?: string[]) => (!path?.length || (path.length === 1 && path[0] === "index") ? "/" : `/${path.join("/")}`);

export function generateStaticParams() {
  return Object.keys(twins()).map((k) => ({ path: k === "/" ? ["index"] : k.slice(1).split("/") }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const key = keyOf((await params).path);
  const body = twins()[key];
  const canonical = key === "/" ? SITE.url : `${SITE.url}${key}`;
  if (!body) {
    return new Response(`# Not found\n\nThere is no page at ${key}. Start at ${SITE.url}/llms.txt.\n`, {
      status: 404,
      headers: { "content-type": "text/markdown; charset=utf-8" },
    });
  }
  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      link: `<${canonical}>; rel="canonical"`,
      vary: "Accept, User-Agent",
    },
  });
}
