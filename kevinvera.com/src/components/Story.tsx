"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import type { Chapter } from "@/content/site";
import { arrow, line } from "@/lib/sketch";
import { pad } from "@/lib/style";
import { Drawing } from "./Drawing";
import { Ink } from "./Ink";

/**
 * The story, one chapter at a time on a drawn timeline. Arrow keys, the
 * arrows, the ticks, or a swipe move through it. Every chapter is in the
 * page from the start, so search engines and agents read all of it.
 */
export function Story({ chapters }: { chapters: Chapter[] }) {
  const [i, setI] = useState(0);
  const last = chapters.length - 1;
  const go = useCallback((n: number) => setI(Math.max(0, Math.min(last, n))), [last]);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea")) return;
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [i, go]);

  return (
    <div
      className="story"
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse") touch.current = e.clientX;
      }}
      onPointerUp={(e) => {
        if (touch.current === null) return;
        const dx = e.clientX - touch.current;
        touch.current = null;
        if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="story-window">
        <div className="story-track" style={{ transform: `translateX(${-i * 100}%)` }}>
          {chapters.map((c, j) => (
            <section key={c.id} id={c.id} className="chapter" aria-labelledby={`${c.id}-title`} inert={j !== i} aria-roledescription="chapter">
              <div className="chapter-text">
                <p className="tag">
                  {pad(j + 1)} · {c.era}
                </p>
                <h2 id={`${c.id}-title`} className="title">
                  {c.title}
                </h2>
                <p className="lede">{c.text}</p>
              </div>
              <div className="chapter-art">{j === i ? <Drawing key={c.id} kind={c.drawing} start={0.25} total={1} /> : null}</div>
            </section>
          ))}
        </div>
      </div>
      <div className="timeline">
        <button type="button" className="step-btn" onClick={() => go(i - 1)} disabled={i === 0} aria-label="Previous chapter">
          <svg viewBox="0 0 30 18" aria-hidden="true">
            {arrow(28, 9, 2, 9, 0.1, 71, 7).map((d, k) => (
              <Ink key={k} d={d} delay={0.3 + k * 0.2} dur={0.3} />
            ))}
          </svg>
        </button>
        <div className="ticks">
          <svg className="rule" viewBox="0 0 1000 44" preserveAspectRatio="none" aria-hidden="true">
            <Ink d={line(4, 19, 996, 19, 81, 0.4)} delay={0.1} dur={1} />
          </svg>
          {chapters.map((c, j) => (
            <button
              key={c.id}
              type="button"
              className="tick"
              onClick={() => go(j)}
              aria-current={j === i ? "step" : undefined}
              aria-label={`Chapter ${j + 1}: ${c.era}`}
            >
              <span className="mark" />
              <span className="label">{c.era}</span>
            </button>
          ))}
        </div>
        <button type="button" className="step-btn" onClick={() => go(i + 1)} disabled={i === last} aria-label="Next chapter">
          <svg viewBox="0 0 30 18" aria-hidden="true">
            {arrow(2, 9, 28, 9, -0.1, 72, 7).map((d, k) => (
              <Ink key={k} d={d} delay={0.3 + k * 0.2} dur={0.3} />
            ))}
          </svg>
        </button>
      </div>
    </div>
  );
}
