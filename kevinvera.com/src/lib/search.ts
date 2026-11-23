import { CHAPTERS, GOALS, PAGES, PROJECTS, SITE } from "@/content/site";
import { abs, ID, person, projectSchema } from "./seo";

/** One thing on the site an agent can be pointed at: a page, a project, a chapter or a goal. */
export type Entry = { url: string; name: string; description: string; text: string; schema: Record<string, unknown> };

export function entries(): Entry[] {
  const pages: Entry[] = PAGES.map((p) => ({
    url: abs(p.path),
    name: p.path === "/" ? SITE.name : p.name,
    description: p.description,
    text: p.description,
    schema:
      p.path === "/"
        ? { "@context": "https://schema.org", ...person() }
        : { "@context": "https://schema.org", "@type": "WebPage", url: abs(p.path), name: p.name, description: p.description, author: { "@id": ID.person } },
  }));
  const work: Entry[] = PROJECTS.map((p) => ({
    url: abs(`/work/${p.slug}`),
    name: p.name,
    description: `${p.tagline} ${p.summary}`,
    text: [p.name, p.kind, p.role, p.tagline, p.summary, ...p.body, ...p.stack].join(" "),
    schema: { "@context": "https://schema.org", ...projectSchema(p) },
  }));
  const story: Entry[] = CHAPTERS.map((c) => ({
    url: `${abs("/about")}#${c.id}`,
    name: `${c.era}: ${c.title}`,
    description: c.text,
    text: `${c.era} ${c.title} ${c.text}`,
    schema: { "@context": "https://schema.org", "@type": "WebPageElement", url: `${abs("/about")}#${c.id}`, name: c.title, text: c.text, isPartOf: abs("/about") },
  }));
  const goals: Entry[] = GOALS.map((g) => ({
    url: abs("/next"),
    name: g.title,
    description: `${g.when}. ${g.text}`,
    text: `${g.title} ${g.when} ${g.text}`,
    schema: { "@context": "https://schema.org", "@type": "WebPageElement", url: abs("/next"), name: g.title, text: g.text, isPartOf: abs("/next") },
  }));
  return [...pages, ...work, ...story, ...goals];
}

const words = (s: string): string[] => s.toLowerCase().match(/[a-z0-9.+#]+/g) ?? [];
const STOP = new Set(["the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "is", "what", "who", "does", "did", "how", "kevin", "vera", "his", "he", "about", "with", "me", "tell", "build", "built", "building", "make", "made", "do", "has", "have", "are", "was", "did", "kevin's", "work", "worked"]);

/** The entries that best match a question, best first, each with a score from 0 to 1. */
export function search(query: string, limit = 10) {
  const q = words(query).filter((w) => !STOP.has(w));
  if (!q.length) return entries().slice(0, limit).map((e) => ({ ...e, score: 0.1 }));
  return entries()
    .map((e) => {
      const name = words(e.name);
      const body = words(e.text);
      let s = 0;
      for (const w of q) {
        if (name.includes(w)) s += 3;
        else if (name.some((n) => n.startsWith(w))) s += 2;
        if (body.includes(w)) s += 1;
        else if (body.some((n) => n.startsWith(w))) s += 0.5;
      }
      // the projects are what people ask about most; they win a tie
      const weight = e.url.includes("/work/") ? 1.15 : 1;
      return { ...e, score: Math.min(1, (s * weight) / (q.length * 4)) };
    })
    .filter((e) => e.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
