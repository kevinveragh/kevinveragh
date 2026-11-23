import Link from "next/link";
import { notFound } from "next/navigation";

import { Drawing } from "@/components/Drawing";
import { JsonLd } from "@/components/JsonLd";
import { PROJECTS, project } from "@/content/site";
import { breadcrumbs, graph, pageMeta, projectSchema } from "@/lib/seo";
import { at, pad } from "@/lib/style";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const p = project((await params).slug);
  if (!p) return {};
  return pageMeta({ path: `/work/${p.slug}`, title: `${p.name}: ${p.tagline.replace(/\.$/, "")}`, description: p.summary });
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = project((await params).slug);
  if (!p) notFound();
  const i = PROJECTS.indexOf(p);
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  return (
    <article className="project">
      <div className="project-text">
        <p className="tag rise" style={at(0.04)}>
          <Link href="/work">Work</Link> / {pad(i + 1)} · {p.kind} · {p.role}
        </p>
        <h1 className="title rise" style={at(0.1)}>
          {p.name}
        </h1>
        <p className="lede rise" style={at(0.18)}>
          {p.tagline}
        </p>
        <div className="copy project-body rise" style={at(0.26)}>
          <p>{p.summary}</p>
          {p.body.map((b) => (
            <p key={b} style={{ marginTop: 10 }}>
              {b}
            </p>
          ))}
        </div>
        <dl className="facts rise" style={at(0.34)}>
          <dt>Stack</dt>
          <dd>{p.stack.join(", ")}</dd>
          {p.links.length ? (
            <>
              <dt>Links</dt>
              <dd>
                {p.links.map((l) => (
                  <a key={l.url} href={l.url} className="inline-link" target="_blank" rel="noopener">
                    {l.label}
                  </a>
                ))}
              </dd>
            </>
          ) : null}
        </dl>
      </div>
      <div className="project-art">
        <Drawing kind={p.drawing} start={0.2} />
      </div>
      <nav className="pager" aria-label="More work">
        <Link href={`/work/${prev.slug}`} rel="prev">
          ← {prev.name}
        </Link>
        <span className="tag">
          {pad(i + 1)} / {pad(PROJECTS.length)}
        </span>
        <Link href={`/work/${next.slug}`} rel="next">
          {next.name} →
        </Link>
      </nav>
      <JsonLd
        data={graph(
          projectSchema(p),
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: p.name, path: `/work/${p.slug}` },
          ]),
        )}
      />
    </article>
  );
}
