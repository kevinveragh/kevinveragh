import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { sketchOf } from "@/components/Drawing";
import { PORTRAIT } from "@/content/portrait";
import type { Drawing } from "@/content/site";
import { box, burst } from "@/lib/sketch";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_TYPE = "image/png";

const INK = "#0a0a0a";
const MUTED = "#6b6b67";
const PAPER = "#fafaf8";

const font = (file: string) => readFile(join(process.cwd(), "src/og/fonts", file));

/**
 * A social card in the site's own hand: paper, a drawn border, the words on
 * the left and a drawing on the right. Rendered once at build time.
 */
export async function ogCard({ note, title, sub, drawing }: { note: string; title: string; sub: string; drawing?: Drawing }) {
  const [regular, semibold, mono, hand] = await Promise.all([
    font("Geist-Regular.ttf"),
    font("Geist-SemiBold.ttf"),
    font("GeistMono-Regular.ttf"),
    font("Caveat-Medium.ttf"),
  ]);
  const art = drawing ? sketchOf(drawing).strokes : null;
  const frame = box(18, 18, 1164, 594, 5, 0.6);
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: PAPER, color: INK, fontFamily: "Geist", position: "relative" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          {frame.map((d, i) => (
            <path key={i} d={d} fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" />
          ))}
        </svg>
        {art ? (
          <svg width="520" height="390" viewBox="0 0 400 300" style={{ position: "absolute", right: 50, top: 120 }}>
            {art.map((s, i) => (
              <path key={i} d={s.d} transform={s.transform} fill="none" stroke={s.faint ? "#a3a39e" : INK} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </svg>
        ) : (
          // no drawing given: Kevin himself, in ink
          <svg width="560" height="477" viewBox={`0 0 ${PORTRAIT.width} ${PORTRAIT.height}`} style={{ position: "absolute", right: 36, bottom: 24 }}>
            {PORTRAIT.shade.map((d, i) => (
              <path key={`s${i}`} d={d} fill="none" stroke={MUTED} strokeWidth={1.1} strokeLinecap="round" />
            ))}
            {PORTRAIT.ink.map((d, i) => (
              <path key={`i${i}`} d={d} fill="none" stroke={INK} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
            ))}
          </svg>
        )}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "70px 0 64px 80px", width: art ? 680 : 540 }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 28, fontWeight: 600, letterSpacing: "-0.02em" }}>
            <svg width="34" height="34" viewBox="0 0 40 40" style={{ marginRight: 14 }}>
              {burst(20, 20, 17, 3, 0.4).map((d, i) => (
                <path key={i} d={d} fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
              ))}
            </svg>
            Kevin Vera
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Caveat", fontSize: 44, color: MUTED, transform: "rotate(-3deg)", marginBottom: 10, marginLeft: 4 }}>{note}</div>
            <div style={{ fontSize: title.length > 18 ? 68 : 92, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 0.98 }}>{title}</div>
            <div style={{ fontSize: 30, color: MUTED, lineHeight: 1.3, marginTop: 22, letterSpacing: "-0.01em" }}>{sub}</div>
          </div>
          <div style={{ fontFamily: "Geist Mono", fontSize: 19, letterSpacing: "0.14em", color: MUTED }}>KEVINVERA.COM</div>
        </div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
        { name: "Caveat", data: hand, weight: 500, style: "normal" },
      ],
    },
  );
}
