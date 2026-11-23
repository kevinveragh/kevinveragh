import type { Metadata } from "next";

import { CHAPTERS, KNOWS_ABOUT, PAGES, PROJECTS, SITE, SOCIALS, type Project } from "@/content/site";

const abs = (path: string) => (path === "/" ? SITE.url : `${SITE.url}${path}`);

/** Where a page's Markdown twin lives: /index.md for the homepage. */
export const twinPath = (path: string) => (path === "/" ? "/index.md" : `${path}.md`);

/** One page's metadata: title, description, canonical, its Markdown twin, social cards. */
export function pageMeta({ path, title, description }: { path: string; title?: string; description: string }): Metadata {
  return {
    title: title ?? { absolute: SITE.title },
    description,
    alternates: { canonical: path, types: { "text/markdown": twinPath(path) } },
    openGraph: {
      type: path === "/about" ? "profile" : "website",
      url: path,
      siteName: SITE.name,
      locale: "en_US",
      title: title ? `${title} · ${SITE.name}` : SITE.title,
      description,
    },
    twitter: { card: "summary_large_image", creator: "@kevinvera", title: title ? `${title} · ${SITE.name}` : SITE.title, description },
  };
}

export const pageDescription = (path: string) => PAGES.find((p) => p.path === path)?.description ?? SITE.description;

// JSON-LD. Everything links back to these ids.
export const ID = {
  person: `${SITE.url}/#kevin`,
  site: `${SITE.url}/#site`,
  lithometric: `${SITE.url}/#lithometric`,
  cork: `${SITE.url}/#cork`,
  cocoa: `${SITE.url}/#cocoa`,
};

export function person() {
  return {
    "@type": "Person",
    "@id": ID.person,
    name: SITE.name,
    givenName: "Kevin",
    familyName: "Vera",
    url: SITE.url,
    image: { "@type": "ImageObject", url: `${SITE.url}/kevin.jpg`, width: 900, height: 900, caption: "Kevin Vera" },
    email: `mailto:${SITE.email}`,
    jobTitle: "Founder and CEO",
    description: SITE.description,
    worksFor: [{ "@id": ID.lithometric }, { "@id": ID.cork }, { "@id": ID.cocoa }],
    homeLocation: { "@type": "Place", name: SITE.home },
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Union College of Union County" },
      { "@type": "CollegeOrUniversity", name: "Rowan University" },
    ],
    hasCredential: { "@type": "EducationalOccupationalCredential", name: "Google IT certifications", credentialCategory: "certificate" },
    knowsAbout: KNOWS_ABOUT,
    sameAs: SOCIALS.map((s) => s.url),
  };
}

export function organizations() {
  return [
    {
      "@type": "Organization",
      "@id": ID.lithometric,
      name: "Lithometric",
      legalName: "Lithometric Inc.",
      url: "https://lithometric.com",
      description: "A principal systems engineering and AI firm.",
      founder: { "@id": ID.person },
      sameAs: ["https://github.com/lithometric"],
    },
    {
      "@type": "Organization",
      "@id": ID.cork,
      name: "Cork",
      alternateName: ["corkcli", "Collide"],
      url: "https://corkcli.com",
      description: "The Slack for AI coding agents.",
      founder: { "@id": ID.person },
      sameAs: ["https://github.com/corkcli", "https://x.com/corkcli"],
    },
    {
      "@type": "Organization",
      "@id": ID.cocoa,
      name: "Cocoa",
      url: "https://cocoafolk.com",
      description: "Launch films, content and ads for AI startups.",
      founder: { "@id": ID.person },
      sameAs: ["https://github.com/cocoafolk", "https://x.com/cocoafolk"],
    },
  ];
}

export function website() {
  return {
    "@type": "WebSite",
    "@id": ID.site,
    url: SITE.url,
    name: SITE.name,
    description: SITE.description,
    inLanguage: "en-US",
    author: { "@id": ID.person },
    publisher: { "@id": ID.person },
  };
}

/** A project as schema.org: code where there is a repository, a creative work otherwise. */
export function projectSchema(p: Project) {
  const url = abs(`/work/${p.slug}`);
  const links = p.links.map((l) => l.url).filter((u) => u.startsWith("http"));
  return {
    "@type": p.repo ? "SoftwareSourceCode" : "CreativeWork",
    "@id": `${url}#work`,
    name: p.name,
    url,
    headline: p.tagline,
    description: p.summary,
    abstract: p.body.join(" "),
    keywords: p.stack.join(", "),
    creator: { "@id": ID.person },
    ...(p.repo ? { codeRepository: p.repo } : {}),
    ...(links.length ? { sameAs: links } : {}),
    dateModified: SITE.updated,
  };
}

export function breadcrumbs(items: Array<{ name: string; path: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function workCollection() {
  return {
    "@type": "CollectionPage",
    "@id": `${abs("/work")}#page`,
    url: abs("/work"),
    name: "Work",
    description: pageDescription("/work"),
    isPartOf: { "@id": ID.site },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PROJECTS.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/work/${p.slug}`), name: p.name })),
    },
  };
}

export function profilePage() {
  return {
    "@type": "ProfilePage",
    "@id": `${abs("/about")}#page`,
    url: abs("/about"),
    name: "About Kevin Vera",
    description: CHAPTERS.map((c) => c.text).join(" "),
    mainEntity: { "@id": ID.person },
    isPartOf: { "@id": ID.site },
    dateModified: SITE.updated,
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

export { abs };
