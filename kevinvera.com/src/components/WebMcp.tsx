"use client";

import { useEffect } from "react";

import { PAGES, PROJECTS, SITE, SOCIALS } from "@/content/site";

/**
 * WebMCP: tools this page offers to an agent running in the browser (a
 * draft web standard, https://webmachinelearning.github.io/webmcp/). Five
 * read the site; one moves the tab to a page; one opens an email to Kevin,
 * which the person still reads and sends themselves. A browser without
 * WebMCP has no modelContext, so nothing runs, and every call is guarded so
 * a changing draft never breaks the page.
 */
type Tool = {
  name: string;
  title: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint?: boolean; consequentialHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<unknown>;
};

type ModelContext = {
  registerTool?: (tool: Tool, options?: { signal?: AbortSignal }) => unknown;
  unregisterTool?: (name: string) => unknown;
};

const text = (body: string) => ({ content: [{ type: "text", text: body }] });
const read = async (path: string) => text(await (await fetch(path)).text());
const goTo = (url: string) => window.setTimeout(() => window.location.assign(url), 250);

const SLUGS = PROJECTS.map((p) => p.slug);
const PATHS = PAGES.map((p) => p.path);

const TOOLS: Tool[] = [
  {
    name: "get_profile",
    title: "Who Kevin Vera is",
    description: "A short profile of Kevin Vera: what he does, what he is building, and where to find him.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => read("/index.md"),
  },
  {
    name: "get_story",
    title: "Kevin Vera's story",
    description: "Kevin Vera's story, chapter by chapter, from Union, New Jersey to Cork.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: () => read("/about.md"),
  },
  {
    name: "list_projects",
    title: "Kevin Vera's work",
    description: "Every project on the site with its slug, kind and one line summary.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => text(PROJECTS.map((p) => `${p.slug}: ${p.name} (${p.kind}). ${p.tagline} ${SITE.url}/work/${p.slug}`).join("\n")),
  },
  {
    name: "get_project",
    title: "One project in full",
    description: "One project in full, by its slug (see list_projects).",
    inputSchema: { type: "object", properties: { slug: { type: "string", enum: SLUGS } }, required: ["slug"] },
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      const slug = String(input.slug ?? "");
      return SLUGS.includes(slug) ? read(`/work/${slug}.md`) : text(`No project "${slug}". Try one of: ${SLUGS.join(", ")}.`);
    },
  },
  {
    name: "search_site",
    title: "Search kevinvera.com",
    description: "Searches the site's pages, projects, story and goals for a topic and returns the best matches with links.",
    inputSchema: { type: "object", properties: { query: { type: "string", description: "What to look for, e.g. 'Rust' or 'Vital Element'" } }, required: ["query"] },
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      const res = await (await fetch(`/ask?query=${encodeURIComponent(String(input.query ?? ""))}&max_results=6`)).json();
      const lines = (res.results ?? []).map((r: { name: string; url: string; description: string }) => `${r.name}: ${r.description} ${r.url}`);
      return text(lines.length ? lines.join("\n") : "Nothing matched. Start at /llms.txt.");
    },
  },
  {
    name: "open_page",
    title: "Open a page",
    description: "Moves this tab to one of the site's pages.",
    inputSchema: { type: "object", properties: { path: { type: "string", enum: [...PATHS, ...SLUGS.map((s) => `/work/${s}`)] } }, required: ["path"] },
    annotations: {},
    execute: async (input) => {
      const path = String(input.path ?? "/");
      goTo(path);
      return text(`Opening ${SITE.url}${path}.`);
    },
  },
  {
    name: "email_kevin",
    title: "Write to Kevin",
    description: `Opens an email to ${SITE.email} in the person's mail app with a subject and message filled in. Nothing is sent until the person sends it. Other ways to reach him: ${SOCIALS.map((s) => `${s.label} ${s.handle}`).join(", ")}.`,
    inputSchema: {
      type: "object",
      properties: { subject: { type: "string" }, message: { type: "string" } },
      required: ["subject"],
    },
    annotations: { consequentialHint: true },
    execute: async (input) => {
      const q = new URLSearchParams({ subject: String(input.subject ?? ""), body: String(input.message ?? "") });
      goTo(`mailto:${SITE.email}?${q.toString().replace(/\+/g, "%20")}`);
      return text(`Opening an email to ${SITE.email}. The person reviews it and sends it from their own mail app.`);
    },
  },
];

export function WebMcp() {
  useEffect(() => {
    const doc = (document as unknown as { modelContext?: ModelContext }).modelContext;
    const nav = (navigator as unknown as { modelContext?: ModelContext }).modelContext;
    const context = doc?.registerTool ? doc : nav;
    if (!context?.registerTool) return;
    const controller = new AbortController();
    const done: string[] = [];
    for (const tool of TOOLS) {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: controller.signal })).catch(() => {});
        done.push(tool.name);
      } catch {
        /* a draft API that changed: skip this tool */
      }
    }
    return () => {
      controller.abort();
      for (const name of done) {
        try {
          context.unregisterTool?.(name);
        } catch {
          /* nothing to undo */
        }
      }
    };
  }, []);
  return null;
}
