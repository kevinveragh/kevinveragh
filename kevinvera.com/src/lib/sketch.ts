/**
 * Hand drawn geometry. Every shape is a few slightly imperfect strokes,
 * seeded so the server and the browser draw exactly the same wobble.
 * Each function returns path data (one string per stroke), so a stroke
 * can be animated on its own with `pathLength="1"` and a dash offset.
 */

export type P = readonly [number, number];

/** mulberry32: small, fast and deterministic */
export function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const f = (n: number) => (Math.round(n * 10) / 10).toString();

/** A smooth curve through points (Catmull Rom as cubic Béziers). */
export function curve(pts: readonly P[]): string {
  if (pts.length < 2) return "";
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

/** A pen line: a slight bow, a little jitter at each end. */
export function line(x1: number, y1: number, x2: number, y2: number, seed = 1, rough = 1): string {
  const rand = rng(seed);
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const jit = Math.min(len * 0.02, 2.2) * rough;
  const bow = (rand() - 0.5) * len * 0.035 * rough;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const j = () => (rand() - 0.5) * jit;
  const a: P = [x1 + j(), y1 + j()];
  const m: P = [(x1 + x2) / 2 + nx * bow, (y1 + y2) / 2 + ny * bow];
  const b: P = [x2 + j(), y2 + j()];
  return curve([a, m, b]);
}

/** A box drawn as four strokes that overshoot their corners a little. */
export function box(x: number, y: number, w: number, h: number, seed = 1, rough = 1): string[] {
  const rand = rng(seed);
  const o = () => (2 + rand() * 4) * rough;
  return [
    line(x - o(), y, x + w + o(), y, seed + 1, rough),
    line(x + w, y - o(), x + w, y + h + o(), seed + 2, rough),
    line(x + w + o(), y + h, x - o(), y + h, seed + 3, rough),
    line(x, y + h + o(), x, y - o(), seed + 4, rough),
  ];
}

/** An ellipse that does not quite close, the way a pen circles something. */
export function ellipse(cx: number, cy: number, rx: number, ry: number, seed = 1, rough = 1): string {
  const rand = rng(seed);
  const n = 16;
  const start = rand() * Math.PI * 2;
  const sweep = Math.PI * 2 + 0.35 + rand() * 0.3;
  const pts: P[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = start + sweep * t;
    const k = 1 + (rand() - 0.5) * 0.06 * rough - t * 0.04 * rough;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return curve(pts);
}

/** An arrow: a bent shaft and a two stroke head. */
export function arrow(x1: number, y1: number, x2: number, y2: number, bend = 0.2, seed = 1, head = 9): string[] {
  const rand = rng(seed);
  const len = Math.hypot(x2 - x1, y2 - y1) || 1;
  const nx = -(y2 - y1) / len;
  const ny = (x2 - x1) / len;
  const m: P = [(x1 + x2) / 2 + nx * len * bend, (y1 + y2) / 2 + ny * len * bend];
  const shaft = curve([[x1, y1], m, [x2, y2]]);
  // the head follows the shaft's last direction
  const ang = Math.atan2(y2 - m[1], x2 - m[0]);
  const spread = 0.5 + rand() * 0.15;
  const l: P = [x2 - Math.cos(ang - spread) * head, y2 - Math.sin(ang - spread) * head];
  const r: P = [x2 - Math.cos(ang + spread) * head * 0.9, y2 - Math.sin(ang + spread) * head * 0.9];
  return [shaft, `M${f(l[0])} ${f(l[1])}L${f(x2)} ${f(y2)}L${f(r[0])} ${f(r[1])}`];
}

/** A loose underline under a word. */
export function underline(x: number, y: number, w: number, seed = 1, wave = 1.6): string {
  const rand = rng(seed);
  const pts: P[] = [];
  const n = 5;
  for (let i = 0; i <= n; i++) {
    pts.push([x + (w * i) / n, y + (rand() - 0.5) * wave * 2 + (i / n) * wave]);
  }
  return curve(pts);
}

/** A wave, for signals and readings. */
export function wave(x: number, y: number, w: number, amp: number, cycles: number, seed = 1): string {
  const rand = rng(seed);
  const pts: P[] = [];
  const n = Math.max(8, Math.round(cycles * 8));
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    pts.push([x + w * t, y + Math.sin(t * cycles * Math.PI * 2) * amp * (0.85 + rand() * 0.3)]);
  }
  return curve(pts);
}

/**
 * The Lithometric mark: eight lines around an empty center. Long lines on
 * the axes, short ones on the diagonals.
 */
export function burst(cx: number, cy: number, r: number, seed = 1, rough = 0.6, twist = 0): string[] {
  const out: string[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4 + twist;
    const inner = r * 0.27;
    const outer = r * (i % 2 ? 0.69 : 1);
    out.push(
      line(
        cx + Math.sin(a) * inner,
        cy - Math.cos(a) * inner,
        cx + Math.sin(a) * outer,
        cy - Math.cos(a) * outer,
        seed + i * 7,
        rough,
      ),
    );
  }
  return out;
}
