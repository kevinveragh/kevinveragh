import { CHAPTERS, GOALS, PAGES, PROJECTS, SITE, SOCIALS, STACK, type Project } from "@/content/site";
import { abs, twinPath } from "./seo";

/**
 * The Markdown twin of every page, for agents and answer engines. Each one
 * opens with its H1 (no front matter above it), then a one line summary,
 * then the page in plain prose. Built from the same content as the pages.
 */

const links = (p: Project) => p.links.map((l) => `[${l.label}](${l.url})`).join(" · ");

function projectMd(p: Project) {
  return [
    `# ${p.name}`,
    "",
    `> ${p.tagline} ${p.summary}`,
    "",
    ...p.body.flatMap((b) => [b, ""]),
    `- Kind: ${p.kind}`,
    `- Kevin's role: ${p.role}`,
    `- Stack: ${p.stack.join(", ")}`,
    ...(p.links.length ? [`- Links: ${links(p)}`] : []),
    "",
    `Page: ${abs(`/work/${p.slug}`)} · All work: ${abs("/work")}`,
  ].join("\n");
}

const socialsMd = () => SOCIALS.map((s) => `- ${s.label}: [${s.handle}](${s.url})`).join("\n");

export function twins(): Record<string, string> {
  const out: Record<string, string> = {
    "/": [
      "# Kevin Vera",
      "",
      `> ${SITE.description}`,
      "",
      "I build systems that let machines work together. Right now that is Cork, the Slack for AI coding agents.",
      "",
      "Engineering and growth marketing, both. Rust first, solo, shipped fast: 30+ projects across agent infrastructure, computer use, edge hardware and iOS, and launch films for AI startups through Cocoa.",
      "",
      "## Pages",
      "",
      ...PAGES.filter((p) => p.path !== "/").map((p) => `- [${p.name}](${abs(p.path)}): ${p.description}`),
      "",
      "## Elsewhere",
      "",
      socialsMd(),
      `- Email: ${SITE.email}`,
    ].join("\n"),
    "/work": [
      "# Work",
      "",
      `> ${PAGES.find((p) => p.path === "/work")!.description}`,
      "",
      ...PROJECTS.map((p, i) => `${i + 1}. [${p.name}](${abs(`/work/${p.slug}`)}) (${p.kind}): ${p.tagline} ${p.summary}`),
    ].join("\n"),
    "/about": [
      "# About Kevin Vera",
      "",
      `> ${PAGES.find((p) => p.path === "/about")!.description}`,
      "",
      ...CHAPTERS.flatMap((c, i) => [`## ${String(i + 1).padStart(2, "0")}. ${c.era}: ${c.title}`, "", c.text, ""]),
      `Stack: ${STACK.join(", ")}.`,
    ].join("\n"),
    "/next": [
      "# What's next",
      "",
      `> ${PAGES.find((p) => p.path === "/next")!.description}`,
      "",
      ...GOALS.flatMap((g) => [`## ${g.title}`, "", `When: ${g.when}. ${g.text}`, ""]),
    ].join("\n"),
    "/contact": [
      "# Contact",
      "",
      "> The fastest way to reach Kevin Vera is email.",
      "",
      `- Email: [${SITE.email}](mailto:${SITE.email})`,
      socialsMd(),
      "",
      `Home base is ${SITE.home}. In ${SITE.now} for the year, working San Francisco hours.`,
    ].join("\n"),
  };
  for (const p of PROJECTS) out[`/work/${p.slug}`] = projectMd(p);
  for (const k of Object.keys(out)) out[k] = `${out[k].trim()}\n`;
  return out;
}

export function llmsTxt() {
  return [
    `# ${SITE.name}`,
    "",
    `> ${SITE.description}`,
    "",
    "Every page has a Markdown twin: add .md to its path (the homepage's is /index.md), or ask for text/markdown. The full site in one file is /llms-full.txt. A natural language search over the site answers at /ask (NLWeb).",
    "",
    "## Pages",
    "",
    ...PAGES.map((p) => `- [${p.name}](${abs(twinPath(p.path))}): ${p.description}`),
    "",
    "## Work",
    "",
    ...PROJECTS.map((p) => `- [${p.name}](${abs(twinPath(`/work/${p.slug}`))}): ${p.tagline}`),
    "",
    "## Elsewhere",
    "",
    ...SOCIALS.map((s) => `- [${s.label}](${s.url}): ${s.handle}`),
    `- [Email](mailto:${SITE.email}): ${SITE.email}`,
    "- [Lithometric](https://lithometric.com): the firm",
    "- [Cork](https://corkcli.com): the Slack for AI coding agents",
    "- [Cocoa](https://cocoafolk.com): launch films, content and ads",
    "",
    "## Optional",
    "",
    `- [Everything in one file](${abs("/llms-full.txt")})`,
    `- [Schema Feed](${abs("/feeds/pages.jsonl")}): every page as schema.org JSON Lines`,
    "",
  ].join("\n");
}

export function llmsFullTxt() {
  const all = twins();
  const order = ["/", "/about", "/work", ...PROJECTS.map((p) => `/work/${p.slug}`), "/next", "/contact"];
  return `${order.map((path) => `${all[path].trim()}\n\nSource: ${abs(path)}`).join("\n\n* * *\n\n")}\n`;
}
