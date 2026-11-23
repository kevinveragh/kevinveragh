import { SITE } from "@/content/site";
import { search } from "@/lib/search";

/**
 * /ask: NLWeb's natural language endpoint (spec v0.55, and the flat form
 * NLWeb's reference server takes). Retrieval only: the answers are this
 * site's own pages, projects, chapters and goals as schema.org objects.
 * Nothing is generated, so the summarize and generate modes are refused.
 * `streaming=true` answers as Server Sent Events (start, one result per
 * item, complete); otherwise one JSON document.
 */
const VERSION = "0.55";
const MAX_QUERY = 500;
const CORS = { "access-control-allow-origin": "*", "access-control-allow-headers": "content-type", "access-control-allow-methods": "GET, POST, OPTIONS" };

type Ask = { query: string; streaming: boolean; limit: number; queryId: string; mode: string };

const truthy = (v: unknown) => v === true || (typeof v === "string" && /^(true|1|yes)$/i.test(v));

function read(params: URLSearchParams, body: unknown): Ask {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, any>;
  // v0.55 puts the text under query.text and preferences under prefer
  const structured = b.query && typeof b.query === "object";
  const query = String((structured ? b.query.text : b.query ?? b.q) ?? params.get("query") ?? params.get("q") ?? "").trim();
  const prefer = structured && b.prefer && typeof b.prefer === "object" ? b.prefer : b;
  const streaming = truthy(prefer.streaming ?? params.get("streaming"));
  const mode = String(prefer.mode ?? params.get("mode") ?? params.get("generate_mode") ?? "list");
  const limit = Math.max(1, Math.min(25, Number(b.max_results ?? params.get("max_results") ?? 10) || 10));
  const queryId = String(b.query_id ?? params.get("query_id") ?? crypto.randomUUID());
  return { query, streaming, limit, queryId, mode };
}

function fail(status: number, code: string, message: string) {
  return Response.json({ _meta: { version: VERSION, response_type: "failure" }, error: { code, message } }, { status, headers: CORS });
}

async function answer(request: Request, body: unknown) {
  const ask = read(new URL(request.url).searchParams, body);
  if (!ask.query) return fail(400, "missing_query", "Ask something: ?query=what is Cork");
  if (ask.query.length > MAX_QUERY) return fail(400, "query_too_long", `Keep the question under ${MAX_QUERY} characters.`);
  if (/^(summarize|generate)$/i.test(ask.mode)) return fail(400, "unsupported_mode", "This endpoint lists matching pages; it does not generate text.");
  const results = search(ask.query, ask.limit).map((e) => ({
    url: e.url,
    name: e.name,
    site: SITE.host,
    score: Math.round(e.score * 1000) / 1000,
    description: e.description,
    schema_object: e.schema,
  }));
  const meta = { version: VERSION, response_type: "answer", query_id: ask.queryId, site: SITE.host };
  if (!ask.streaming) return Response.json({ _meta: meta, query_id: ask.queryId, results }, { headers: CORS });
  const enc = new TextEncoder();
  const event = (name: string, data: unknown) => enc.encode(`event: ${name}\ndata: ${JSON.stringify(data)}\n\n`);
  const stream = new ReadableStream({
    start(c) {
      c.enqueue(event("start", { _meta: meta, message_type: "begin-nlweb-response", query: ask.query }));
      for (const r of results) c.enqueue(event("result", { _meta: meta, message_type: "result", content: [r] }));
      c.enqueue(event("complete", { _meta: meta, message_type: "end-nlweb-response", count: results.length }));
      c.close();
    },
  });
  return new Response(stream, { headers: { ...CORS, "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-cache" } });
}

export function GET(request: Request) {
  return answer(request, null);
}

export async function POST(request: Request) {
  const text = await request.text();
  if (text.length > 16 * 1024) return fail(413, "body_too_large", "Keep the request under 16 KB.");
  let body: unknown = null;
  const type = request.headers.get("content-type") ?? "";
  try {
    body = type.includes("application/x-www-form-urlencoded") ? Object.fromEntries(new URLSearchParams(text)) : text ? JSON.parse(text) : null;
  } catch {
    return fail(400, "bad_json", "The body is not valid JSON.");
  }
  return answer(request, body);
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}
