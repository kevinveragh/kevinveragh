import type { CSSProperties, ReactNode } from "react";

/** One stroke that draws itself: its own dash offset runs from 1 to 0. */
export function Ink({
  d,
  delay = 0,
  dur = 0.7,
  faint = false,
  transform,
}: {
  d: string;
  delay?: number;
  dur?: number;
  faint?: boolean;
  transform?: string;
}) {
  const style = { "--d": `${delay.toFixed(2)}s`, "--dur": `${dur}s` } as CSSProperties;
  return <path d={d} pathLength={1} className={faint ? "ink faint" : "ink"} style={style} transform={transform} />;
}

/** Strokes drawn one after another. */
export function Strokes({ paths, start = 0, step = 0.08, dur, faint }: { paths: string[]; start?: number; step?: number; dur?: number; faint?: boolean }) {
  return (
    <>
      {paths.map((d, i) => (
        <Ink key={i} d={d} delay={start + i * step} dur={dur} faint={faint} />
      ))}
    </>
  );
}

/** Handwriting that fades in once the lines around it are drawn. */
export function Hand({
  x,
  y,
  children,
  size = 20,
  delay = 0.6,
  anchor = "start",
  rotate = 0,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  delay?: number;
  anchor?: "start" | "middle" | "end";
  rotate?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      className="hand-svg"
      fontSize={size}
      textAnchor={anchor}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      style={{ "--d": `${delay.toFixed(2)}s` } as CSSProperties}
    >
      {children}
    </text>
  );
}
