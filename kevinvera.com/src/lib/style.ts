import type { CSSProperties } from "react";

/** A delay for an entrance animation, as the CSS variable the animations read. */
export const at = (seconds: number) => ({ "--d": `${seconds.toFixed(2)}s` }) as CSSProperties;

export const pad = (n: number) => String(n).padStart(2, "0");
