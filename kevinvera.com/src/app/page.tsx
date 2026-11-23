import Link from "next/link";

import { Hand, Ink } from "@/components/Ink";
import { Portrait } from "@/components/Portrait";
import { PortraitMotion } from "@/components/PortraitMotion";
import { PenLink } from "@/components/PenLink";
import { SITE } from "@/content/site";
import { pageMeta } from "@/lib/seo";
import { arrow } from "@/lib/sketch";
import { at } from "@/lib/style";

export const metadata = pageMeta({ path: "/", description: SITE.description });

export default function Home() {
  return (
    <section className="home" aria-labelledby="name">
      <div className="home-text">
        <div>
          <p className="hand hello rise" style={at(0.05)} aria-hidden="true">
            hi, I&rsquo;m
          </p>
          <h1 id="name" className="display rise" style={at(0.12)}>
            Kevin Vera
          </h1>
        </div>
        <p className="lede rise" style={at(0.24)}>
          Founder and CEO of{" "}
          <Link href="/work/lithometric" className="inline-link">
            Lithometric
          </Link>
          . I build systems that let machines work together. Right now that is{" "}
          <Link href="/work/cork" className="inline-link">
            Cork
          </Link>
          , the Slack for AI coding agents.
        </p>
        <p className="copy lede-sub rise" style={at(0.34)}>
          Engineering and growth marketing, both. Rust first, solo, shipped fast: <strong>30+ projects</strong> across agent
          infrastructure, computer use, edge hardware and iOS, and launch films for AI startups through{" "}
          <Link href="/work/cocoa" className="inline-link">
            Cocoa
          </Link>
          .
        </p>
        <div className="ctas rise" style={at(0.44)}>
          <PenLink href="/about" seed={2}>
            Read the story
          </PenLink>
          <PenLink href="/work" seed={5}>
            See the work
          </PenLink>
        </div>
      </div>
      <figure className="home-art">
        <PortraitMotion>
          <Portrait />
        </PortraitMotion>
        <svg className="caption" viewBox="0 0 220 70" aria-hidden="true">
          {arrow(118, 50, 168, 10, -0.35, 9, 8).map((d, i) => (
            <Ink key={i} d={d} delay={2.6 + i * 0.25} dur={0.4} />
          ))}
          <Hand x={112} y={62} anchor="end" size={24} delay={2.9} rotate={-3}>
            that&rsquo;s me
          </Hand>
        </svg>
      </figure>
    </section>
  );
}
