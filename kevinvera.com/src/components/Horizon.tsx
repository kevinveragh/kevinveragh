"use client";

import { useState, type CSSProperties } from "react";

import type { Goal } from "@/content/site";
import { arrow, curve, type P } from "@/lib/sketch";
import { pad } from "@/lib/style";
import { Ink } from "./Ink";

/** Where each goal sits on the climb, in a 1000 by 600 box: now at the bottom left, later at the top right. */
const SPOTS: P[] = [
  [80, 530],
  [196, 474],
  [312, 420],
  [424, 362],
  [536, 300],
  [650, 236],
  [770, 168],
  [900, 92],
];

/** The climb from now to later, with a pin for each goal. */
export function Horizon({ goals }: { goals: Goal[] }) {
  const [on, setOn] = useState(0);
  const g = goals[on];
  const path = curve([[24, 572], ...SPOTS.slice(0, goals.length), [968, 34]]);
  const tip = arrow(940, 58, 976, 26, 0, 91, 14)[1];
  return (
    <>
      <div className="horizon-map">
        <svg viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <Ink d={path} dur={1.6} delay={0.1} />
          <Ink d={tip} delay={1.6} dur={0.3} />
        </svg>
        <span className="hand map-label rise" style={{ left: "5%", bottom: "1%", "--d": "1.2s" } as CSSProperties} aria-hidden="true">
          now
        </span>
        <span className="hand map-label rise" style={{ right: "6%", top: "-5%", "--d": "1.7s" } as CSSProperties} aria-hidden="true">
          later
        </span>
        {goals.map((x, i) => {
          const [px, py] = SPOTS[i];
          return (
            <button
              key={x.id}
              type="button"
              className={`goal-pin fade-in${px > 640 ? " left" : ""}`}
              style={{ left: `${px / 10}%`, top: `${py / 6}%`, "--d": `${(0.5 + i * 0.18).toFixed(2)}s` } as CSSProperties}
              aria-pressed={i === on}
              onClick={() => setOn(i)}
              onPointerEnter={() => setOn(i)}
              onFocus={() => setOn(i)}
            >
              <span className="ring" />
              <span className="text">{x.title}</span>
            </button>
          );
        })}
      </div>
      <aside className="goal-card" aria-live="polite">
        <p className="tag">
          {pad(on + 1)} / {pad(goals.length)} · {g.when}
        </p>
        <h2 key={g.id} className="title rise">
          {g.title}
        </h2>
        <p key={`${g.id}-text`} className="lede rise" style={{ "--d": "0.08s" } as CSSProperties}>
          {g.text}
        </p>
      </aside>
    </>
  );
}
