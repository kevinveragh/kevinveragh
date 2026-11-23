"use client";

import { useEffect, useRef, useState } from "react";

import { box } from "@/lib/sketch";
import { Ink } from "./Ink";

/**
 * The page's drawn border, in real pixels so the pen is the same weight on
 * every side. Redrawn when the window changes size.
 */
export function Border() {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize((s) => (s && Math.abs(s.w - r.width) < 1 && Math.abs(s.h - r.height) < 1 ? s : { w: r.width, h: r.height }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const pad = 2;
  return (
    <svg ref={ref} className="border" aria-hidden="true" viewBox={size ? `0 0 ${size.w} ${size.h}` : "0 0 1 1"}>
      {size
        ? box(pad, pad, size.w - pad * 2, size.h - pad * 2, 5, 0.6).map((d, i) => <Ink key={i} d={d} delay={i * 0.12} dur={0.6} />)
        : null}
    </svg>
  );
}
