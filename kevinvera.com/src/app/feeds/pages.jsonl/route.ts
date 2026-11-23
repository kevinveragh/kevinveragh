import { entries } from "@/lib/search";

/** /feeds/pages.jsonl: a Schema Feed of everything /ask can answer with, one schema.org object per line. */
export const dynamic = "force-static";

export function GET() {
  const lines = entries().map((e) => JSON.stringify(e.schema));
  return new Response(`${lines.join("\n")}\n`, { headers: { "content-type": "application/x-jsonlines; charset=utf-8" } });
}
