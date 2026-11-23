import { Ink } from "@/components/Ink";
import { JsonLd } from "@/components/JsonLd";
import { SITE, SOCIALS } from "@/content/site";
import { breadcrumbs, graph, ID, pageDescription, pageMeta } from "@/lib/seo";
import type { CSSProperties } from "react";
import { box, line, underline } from "@/lib/sketch";
import { at } from "@/lib/style";

export const metadata = pageMeta({ path: "/contact", title: "Contact", description: pageDescription("/contact") });

export default function Contact() {
  return (
    <section className="contact" aria-labelledby="contact-title">
      <div className="contact-text">
        <p className="tag rise" style={at(0.04)}>
          Contact
        </p>
        <h1 id="contact-title" className="title rise" style={at(0.1)}>
          Say hello.
        </h1>
        <p className="lede rise" style={at(0.18)}>
          Building with agents, launching something, or just curious. Email is the fastest way to reach me.
        </p>
        <div className="email-wrap rise" style={at(0.26)}>
          <a href={`mailto:${SITE.email}`} className="email">
            {SITE.email}
          </a>
          <svg viewBox="0 0 400 14" preserveAspectRatio="none" aria-hidden="true">
            <Ink d={underline(4, 7, 392, 12, 3)} delay={0.7} dur={0.6} />
          </svg>
        </div>
        <ul className="handles rise" style={at(0.34)}>
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="me noopener">
                <span className="tag">{s.label}</span>
                <span className="h">{s.handle}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="copy rise" style={at(0.42)}>
          Home base is {SITE.home}. In {SITE.now} for the year, working San Francisco hours.
        </p>
      </div>
      <div className="contact-art">
        <figure className="photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kevin.jpg" alt="Kevin Vera, in black and white, his fist at his chin" width={900} height={900} />
          <svg viewBox="0 0 108 108" preserveAspectRatio="none" aria-hidden="true">
            {box(4, 4, 100, 100, 17, 0.4).map((d, i) => (
              <Ink key={i} d={d} delay={0.9 + i * 0.12} dur={0.5} />
            ))}
            <path d={line(-2, 10, 18, -2, 41, 0.3)} pathLength={1} className="ink tape" style={{ "--d": "1.5s" } as CSSProperties} />
            <path d={line(90, -2, 110, 12, 42, 0.3)} pathLength={1} className="ink tape" style={{ "--d": "1.6s" } as CSSProperties} />
          </svg>
          <figcaption className="hand rise" style={at(1.8)}>
            the real one
          </figcaption>
        </figure>
      </div>
      <JsonLd
        data={graph(
          {
            "@type": "ContactPage",
            "@id": `${SITE.url}/contact#page`,
            url: `${SITE.url}/contact`,
            name: "Contact Kevin Vera",
            mainEntity: { "@id": ID.person },
          },
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Contact", path: "/contact" },
          ]),
        )}
      />
    </section>
  );
}
