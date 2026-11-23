"use client";

import Link from "next/link";
import { useState } from "react";

import type { Project } from "@/content/site";
import { at, pad } from "@/lib/style";
import { Drawing } from "./Drawing";
import { PenLink } from "./PenLink";

/** The list of everything, with the one you point at drawn beside it. */
export function WorkIndex({ projects }: { projects: Project[] }) {
  const [on, setOn] = useState(0);
  const p = projects[on];
  return (
    <>
      <div className="work-list">
        <div className="work-head rise">
          <h1 className="title">Work</h1>
          <span className="tag">{projects.length} projects</span>
        </div>
        <ol className="rows">
          {projects.map((x, i) => (
            <li key={x.slug} className="rise" style={at(0.08 + i * 0.03)}>
              <Link
                href={`/work/${x.slug}`}
                className="row"
                data-on={i === on}
                onPointerEnter={() => setOn(i)}
                onFocus={() => setOn(i)}
              >
                <span className="n">{pad(i + 1)}</span>
                <span className="name">
                  {x.name}
                  <span className="tagline">{x.tagline}</span>
                </span>
                <span className="tag">{x.kind}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
      <aside className="preview" aria-live="polite" aria-label={`${p.name}, in short`}>
        <div className="preview-art">
          <Drawing key={p.slug} kind={p.drawing} total={0.8} />
        </div>
        <p className="tag">
          {p.kind} · {p.role}
        </p>
        <p className="lede">{p.tagline}</p>
        <p className="copy">{p.summary}</p>
        <div>
          <PenLink key={p.slug} href={`/work/${p.slug}`} seed={on + 3}>
            Open {p.name}
          </PenLink>
        </div>
      </aside>
    </>
  );
}
