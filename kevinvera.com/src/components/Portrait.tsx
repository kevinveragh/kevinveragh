import type { CSSProperties } from "react";

import { PORTRAIT } from "@/content/portrait";

/**
 * Kevin, in ink: traced from his profile photo by scripts/portrait.py, with
 * the face drawn by hand. The lines go down first, top to bottom, then the
 * hatching, so it draws the way a person would.
 */
export function Portrait({ start = 0.3 }: { start?: number }) {
  const inkStep = 1.5 / PORTRAIT.ink.length;
  const shadeStart = start + 1.1;
  const shadeStep = 1.5 / PORTRAIT.shade.length;
  return (
    <svg viewBox={`0 0 ${PORTRAIT.width} ${PORTRAIT.height}`} role="img" aria-label="A pen drawing of Kevin Vera: curly hair, earphones in, his fist at his chin.">
      {PORTRAIT.ink.map((d, i) => (
        <path key={`i${i}`} d={d} pathLength={1} className="ink" style={{ "--d": `${(start + i * inkStep).toFixed(3)}s`, "--dur": "0.55s" } as CSSProperties} />
      ))}
      {PORTRAIT.shade.map((d, i) => (
        <path key={`s${i}`} d={d} pathLength={1} className="ink shade" style={{ "--d": `${(shadeStart + i * shadeStep).toFixed(3)}s`, "--dur": "0.35s" } as CSSProperties} />
      ))}
    </svg>
  );
}
