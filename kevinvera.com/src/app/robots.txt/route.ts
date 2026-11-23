import { SITE } from "@/content/site";

/** /robots.txt. A route rather than app/robots.ts so Schemamap (the Schema
 * Feeds spec) can stand on its own line beside Sitemap. Everything is
 * public and meant to be read and cited, by search and answer engines alike. */
export const dynamic = "force-static";

const AI_AGENTS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot", "Claude-User", "anthropic-ai",
  "Google-Extended", "PerplexityBot", "Perplexity-User", "Applebot-Extended", "CCBot", "Meta-ExternalAgent", "DuckAssistBot",
];

export function GET() {
  const body = [
    "User-Agent: *",
    "Allow: /",
    "",
    ...AI_AGENTS.map((a) => `User-Agent: ${a}`),
    "Allow: /",
    "",
    `Sitemap: ${SITE.url}/sitemap.xml`,
    `Schemamap: ${SITE.url}/schemamap.xml`,
    "",
  ].join("\n");
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
