import { NextResponse, type NextRequest } from "next/server";

/**
 * What machines read. Browsers asking for HTML pass straight through.
 *
 * - `/about.md` (any page plus `.md`, the homepage's is /index.md): its Markdown twin.
 * - `?mode=agent` on any page: the twin.
 * - `Accept: text/markdown` ahead of text/html: the twin.
 * - A known AI crawler on a page: the twin, even when it asked for HTML.
 */
const AI_BOTS =
  /GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-User|Claude-SearchBot|anthropic-ai|PerplexityBot|Perplexity-User|Google-Extended|Applebot-Extended|ora-agent|DeepSeekBot|CCBot|Meta-ExternalAgent|DuckAssistBot/i;

const PAGE = /^\/(?:work(?:\/[a-z0-9-]+)?|about|next|contact)?$/;

const toTwin = (request: NextRequest, page: string) => {
  const url = request.nextUrl.clone();
  url.pathname = page === "/" ? "/md/index" : `/md${page}`;
  url.search = "";
  return NextResponse.rewrite(url);
};

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (path.endsWith(".md")) {
    const page = path === "/index.md" ? "/" : path.slice(0, -3);
    return toTwin(request, page);
  }
  const page = path.length > 1 ? path.replace(/\/+$/, "") : path;
  if (!PAGE.test(page)) return NextResponse.next();
  if (request.nextUrl.searchParams.get("mode") === "agent") return toTwin(request, page);
  const accept = request.headers.get("accept") ?? "";
  const md = accept.indexOf("text/markdown");
  const html = accept.indexOf("text/html");
  if (md >= 0 && (html < 0 || md < html)) return toTwin(request, page);
  if (AI_BOTS.test(request.headers.get("user-agent") ?? "")) return toTwin(request, page);
  return NextResponse.next();
}

export const config = {
  // pages and .md twins only: never Next's own files, the API style routes or other static files
  matcher: ["/((?!_next/|md/|ask|feeds/|\\.well-known/|.*\\.(?:txt|xml|jsonl|json|png|svg|ico|webmanifest|ttf|woff2?)$).*)"],
};
