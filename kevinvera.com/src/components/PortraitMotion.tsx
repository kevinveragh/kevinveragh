"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The drawing on the home page, alive: it turns a little toward the pointer,
 * and a click or tap draws it again from the first line.
 */
export function PortraitMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / window.innerWidth));
        const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / window.innerHeight));
        el.style.transform = `translate(${(x * 10).toFixed(1)}px, ${(y * 8).toFixed(1)}px) rotate(${(x * 1.6).toFixed(2)}deg)`;
      });
    };
    const onLeave = () => {
      el.style.transform = "";
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="portrait"
      data-run={run % 2}
      onClick={() => setRun((n) => n + 1)}
      title="Draw it again"
    >
      {children}
    </div>
  );
}
