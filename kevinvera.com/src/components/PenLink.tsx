import Link from "next/link";
import type { ReactNode } from "react";

import { arrow } from "@/lib/sketch";
import { Ink } from "./Ink";

/** A link with a small drawn arrow after it. */
export function PenLink({ href, children, seed = 1, back = false }: { href: string; children: ReactNode; seed?: number; back?: boolean }) {
  const strokes = back ? arrow(28, 7, 2, 7, 0.12, seed, 7) : arrow(2, 7, 28, 7, -0.12, seed, 7);
  const art = (
    <svg viewBox="0 0 30 14" aria-hidden="true">
      {strokes.map((d, i) => (
        <Ink key={i} d={d} delay={0.5 + i * 0.25} dur={0.35} />
      ))}
    </svg>
  );
  return (
    <Link href={href} className="pen-link">
      {back ? art : null}
      <span>{children}</span>
      {back ? null : art}
    </Link>
  );
}
