import type { Drawing as Kind } from "@/content/site";
import { arrow, box, burst, curve, ellipse, line, wave, type P } from "@/lib/sketch";
import { Hand, Ink } from "./Ink";

type Stroke = { d: string; faint?: boolean; transform?: string };
type Label = { x: number; y: number; text: string; size?: number; anchor?: "start" | "middle" | "end"; rotate?: number };
type Sketch = { strokes: Stroke[]; labels: Label[]; title: string };

const s = (d: string | string[], faint = false, transform?: string): Stroke[] =>
  (Array.isArray(d) ? d : [d]).map((x) => ({ d: x, faint, transform }));

const PIN = "translate(200 156) rotate(28)";

const poly = (pts: P[]) => pts.map((p, i) => `${i ? "L" : "M"}${p[0]} ${p[1]}`).join("");

/** Every drawing lives in a 400 by 300 box. */
const SKETCHES: Record<Kind, () => Sketch> = {
  cork: () => ({
    title: "Four coding agents connected to one pushpin",
    strokes: [
      ...s(box(28, 34, 96, 46, 11)),
      ...s(box(276, 34, 96, 46, 21)),
      ...s(box(28, 220, 96, 46, 31)),
      ...s(box(276, 220, 96, 46, 41)),
      ...s(line(124, 74, 176, 128, 51)),
      ...s(line(276, 74, 224, 128, 52)),
      ...s(line(124, 226, 176, 172, 53)),
      ...s(line(276, 226, 224, 172, 54)),
      // a thumbtack in outline, tilted like Cork's mark: cap, waist, flat base, needle
      ...s(curve([[-17, -30], [-16, -41], [0, -45], [16, -41], [17, -30]]), false, PIN),
      ...s(line(-17, -30, 17, -30, 62, 0.5), false, PIN),
      ...s(line(-8, -30, -6, -9, 63, 0.5), false, PIN),
      ...s(line(8, -30, 6, -9, 64, 0.5), false, PIN),
      ...s(ellipse(0, -6, 21, 5, 65, 0.5), false, PIN),
      ...s(line(0, -1, 0, 34, 66, 0.4), false, PIN),
    ],
    labels: [
      { x: 76, y: 63, text: "claude", anchor: "middle" },
      { x: 324, y: 63, text: "codex", anchor: "middle" },
      { x: 76, y: 249, text: "cursor", anchor: "middle" },
      { x: 324, y: 249, text: "hermes", anchor: "middle" },
    ],
  }),
  burst: () => ({
    title: "The Lithometric mark, eight lines around an empty center",
    strokes: s(burst(200, 150, 118, 7, 0.5)),
    labels: [],
  }),
  chamber: () => ({
    title: "A wellness chamber reading the body with no wearables",
    strokes: [
      ...s(line(124, 262, 124, 112, 71)),
      ...s(curve([[124, 112], [150, 70], [200, 56], [250, 70], [276, 112]])),
      ...s(line(276, 112, 276, 262, 72)),
      ...s(line(84, 262, 316, 262, 73)),
      ...s(ellipse(200, 150, 14, 14, 74)),
      ...s(line(200, 166, 200, 214, 75)),
      ...s(curve([[176, 236], [190, 214], [200, 212], [212, 214], [224, 236]])),
      ...s(wave(140, 118, 120, 6, 2.5, 76), true),
      ...s(arrow(330, 70, 266, 116, -0.25, 77)),
    ],
    labels: [{ x: 334, y: 58, text: "zero wearables", anchor: "middle", rotate: -4 }],
  }),
  cocoa: () => ({
    title: "Two cacao beans inside a film frame",
    strokes: [
      ...s(box(52, 52, 296, 196, 81), true),
      ...[0, 1, 2, 3, 4, 5].flatMap((i) => s(box(72 + i * 46, 62, 14, 10, 90 + i), true)),
      ...[0, 1, 2, 3, 4, 5].flatMap((i) => s(box(72 + i * 46, 228, 14, 10, 100 + i), true)),
      ...s(ellipse(0, 0, 30, 48, 82), false, "translate(168 150) rotate(-24)"),
      ...s(curve([[0, -40], [7, -12], [5, 14], [0, 40]]), false, "translate(168 150) rotate(-24)"),
      ...s(ellipse(0, 0, 30, 48, 83), false, "translate(234 150) rotate(22)"),
      ...s(curve([[0, -40], [-7, -12], [-5, 14], [0, 40]]), false, "translate(234 150) rotate(22)"),
    ],
    labels: [],
  }),
  cursor: () => ({
    title: "A cursor working inside a desktop on its own",
    strokes: [
      ...s(box(56, 40, 288, 186, 111)),
      ...s(line(176, 226, 166, 262, 112)),
      ...s(line(224, 226, 234, 262, 113)),
      ...s(line(140, 262, 260, 262, 114)),
      ...s(box(84, 70, 126, 84, 115), true),
      ...s(box(238, 166, 76, 32, 116)),
      ...s(arrow(152, 112, 250, 166, -0.3, 117)),
      ...s(poly([[262, 160], [262, 198], [271, 189], [279, 205], [286, 202], [278, 186], [291, 186], [262, 160]])),
    ],
    labels: [],
  }),
  processes: () => ({
    title: "Processes sharing one state through an elected leader",
    strokes: [
      ...s(ellipse(200, 162, 40, 40, 121)),
      ...s(box(34, 40, 92, 44, 122)),
      ...s(box(154, 22, 92, 44, 123)),
      ...s(box(274, 40, 92, 44, 124)),
      ...s(box(64, 236, 92, 44, 125)),
      ...s(box(244, 236, 92, 44, 126)),
      ...s(line(110, 84, 172, 132, 127)),
      ...s(line(200, 66, 200, 122, 128)),
      ...s(line(290, 84, 228, 132, 129)),
      ...s(line(130, 236, 176, 194, 130)),
      ...s(line(270, 236, 224, 194, 131)),
    ],
    labels: [
      { x: 200, y: 168, text: "state", anchor: "middle" },
      { x: 80, y: 68, text: "electron", anchor: "middle" },
      { x: 200, y: 50, text: "leader", anchor: "middle" },
      { x: 320, y: 68, text: "electron", anchor: "middle" },
      { x: 110, y: 264, text: "node", anchor: "middle" },
      { x: 290, y: 264, text: "node", anchor: "middle" },
    ],
  }),
  browser: () => ({
    title: "A browser window, its accessibility tree, and three verdicts",
    strokes: [
      ...s(box(40, 34, 320, 232, 141)),
      ...s(line(40, 70, 360, 70, 142)),
      ...s(box(52, 42, 74, 28, 143), true),
      ...s(ellipse(110, 112, 12, 12, 144)),
      ...s(line(102, 122, 80, 162, 145)),
      ...s(line(118, 122, 140, 162, 146)),
      ...s(ellipse(76, 172, 10, 10, 147)),
      ...s(ellipse(144, 172, 10, 10, 148)),
      ...s(line(140, 182, 124, 218, 149)),
      ...s(line(150, 182, 166, 218, 150)),
      ...s(ellipse(122, 228, 9, 9, 151)),
      ...s(ellipse(168, 228, 9, 9, 152)),
      ...s(box(222, 104, 18, 18, 153)),
      ...s(box(222, 152, 18, 18, 154)),
      ...s(box(222, 200, 18, 18, 155)),
      ...s(ellipse(296, 209, 62, 20, 156)),
    ],
    labels: [
      { x: 250, y: 120, text: "PASS" },
      { x: 250, y: 168, text: "FAIL" },
      { x: 250, y: 216, text: "UNKNOWN" },
    ],
  }),
  film: () => ({
    title: "A film strip with one frame approved",
    strokes: [
      ...s(line(30, 84, 370, 84, 161)),
      ...s(line(30, 216, 370, 216, 162)),
      ...s(line(30, 60, 370, 60, 163), true),
      ...s(line(30, 240, 370, 240, 164), true),
      ...s(line(116, 84, 116, 216, 165)),
      ...s(line(200, 84, 200, 216, 166)),
      ...s(line(284, 84, 284, 216, 167)),
      ...[0, 1, 2, 3, 4, 5, 6, 7].flatMap((i) => s(box(42 + i * 42, 66, 12, 10, 170 + i), true)),
      ...[0, 1, 2, 3, 4, 5, 6, 7].flatMap((i) => s(box(42 + i * 42, 224, 12, 10, 180 + i), true)),
      ...s(curve([[222, 152], [236, 170], [262, 124]])),
    ],
    labels: [{ x: 242, y: 284, text: "approved by me", anchor: "middle", rotate: -3 }],
  }),
  cube: () => ({
    title: "A cube drawn in perspective",
    strokes: [
      ...s(line(200, 54, 292, 104, 191)),
      ...s(line(292, 104, 200, 154, 192)),
      ...s(line(200, 154, 108, 104, 193)),
      ...s(line(108, 104, 200, 54, 194)),
      ...s(line(108, 104, 108, 206, 195)),
      ...s(line(200, 154, 200, 256, 196)),
      ...s(line(292, 104, 292, 206, 197)),
      ...s(line(108, 206, 200, 256, 198)),
      ...s(line(200, 256, 292, 206, 199)),
    ],
    labels: [],
  }),
  heal: () => {
    const nodes: P[] = [[54, 170], [126, 120], [198, 170], [270, 120], [342, 170]];
    return {
      title: "A network routing around a broken link",
      strokes: [
        ...nodes.flatMap((n, i) => s(ellipse(n[0], n[1], 15, 15, 201 + i))),
        ...s(line(66, 160, 114, 130, 211)),
        ...s(line(138, 130, 186, 160, 212)),
        ...s(line(210, 160, 226, 150, 213)),
        ...s(line(244, 139, 258, 130, 214)),
        ...s(line(282, 130, 330, 160, 215)),
        ...s(arrow(198, 194, 336, 190, -0.32, 216)),
      ],
      labels: [{ x: 268, y: 262, text: "heals", anchor: "middle", rotate: -3 }],
    };
  },
  letter: () => ({
    title: "An envelope with the Lithometric mark as its stamp",
    strokes: [
      ...s(box(52, 70, 296, 180, 231)),
      ...s(line(52, 72, 200, 172, 232)),
      ...s(line(348, 72, 200, 172, 233)),
      ...s(line(52, 250, 160, 150, 234), true),
      ...s(line(348, 250, 240, 150, 235), true),
      ...s(box(282, 84, 50, 50, 236), true),
      ...s(burst(307, 109, 19, 9, 0.4)),
    ],
    labels: [{ x: 120, y: 290, text: "kevin@lithometric.com", anchor: "start", rotate: -2 }],
  }),
  chain: () => ({
    title: "Three linked blocks",
    strokes: [
      ...s(box(34, 112, 92, 76, 221)),
      ...s(box(154, 112, 92, 76, 222)),
      ...s(box(274, 112, 92, 76, 223)),
      ...s(line(126, 150, 154, 150, 224)),
      ...s(line(246, 150, 274, 150, 225)),
    ],
    labels: [
      { x: 80, y: 156, text: "#a1", anchor: "middle" },
      { x: 200, y: 156, text: "#b2", anchor: "middle" },
      { x: 320, y: 156, text: "#c3", anchor: "middle" },
    ],
  }),
};

/** The raw strokes of a drawing, for places that cannot animate (social cards). */
export function sketchOf(kind: Kind) {
  return SKETCHES[kind]();
}

/** A project's drawing, drawing itself stroke by stroke. */
export function Drawing({ kind, className, start = 0, total = 1.3 }: { kind: Kind; className?: string; start?: number; total?: number }) {
  const { strokes, labels, title } = SKETCHES[kind]();
  const step = Math.min(0.09, total / Math.max(strokes.length, 1));
  const end = start + step * strokes.length;
  return (
    <svg viewBox="0 0 400 300" className={className} role="img" aria-label={title}>
      {strokes.map((st, i) => (
        <Ink key={i} d={st.d} faint={st.faint} transform={st.transform} delay={start + i * step} dur={0.55} />
      ))}
      {labels
        .filter((l) => l.text)
        .map((l, i) => (
          <Hand key={i} x={l.x} y={l.y} size={l.size ?? 21} anchor={l.anchor} rotate={l.rotate} delay={end * 0.7 + i * 0.05}>
            {l.text}
          </Hand>
        ))}
    </svg>
  );
}
