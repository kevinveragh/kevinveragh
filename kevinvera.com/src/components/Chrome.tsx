"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { PAGES } from "@/content/site";
import { burst, underline } from "@/lib/sketch";
import { Ink } from "./Ink";

const NAV = PAGES.filter((p) => p.path !== "/");

/** The mark and name, top left. */
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Kevin Vera, home">
      <svg viewBox="0 0 40 40" className="brand-mark" aria-hidden="true">
        {burst(20, 20, 17, 3, 0.4).map((d, i) => (
          <Ink key={i} d={d} delay={0.1 + i * 0.05} dur={0.4} />
        ))}
      </svg>
      <span>Kevin Vera</span>
    </Link>
  );
}

/** The nav, with a drawn underline under the page you are on. */
export function Nav() {
  const path = usePathname();
  return (
    <nav aria-label="Main" className="nav">
      {NAV.map((p, i) => {
        const on = path === p.path || path.startsWith(`${p.path}/`);
        return (
          <Link key={p.path} href={p.path} aria-current={on ? "page" : undefined} className="nav-link">
            {p.name}
            <svg viewBox="0 0 100 10" preserveAspectRatio="none" className="nav-line" aria-hidden="true">
              {on ? <Ink key={path} d={underline(2, 5, 96, 40 + i, 2.2)} dur={0.45} /> : null}
            </svg>
          </Link>
        );
      })}
    </nav>
  );
}

/** The time in San Francisco, where the work happens. */
export function Clock() {
  const [now, setNow] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", hour: "numeric", minute: "2-digit" });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="clock" aria-label={now ? `San Francisco time ${now}` : undefined}>
      SF {now || " "}
    </span>
  );
}

/**
 * A fine pen that follows the pointer and fades, so the whole page feels
 * like paper you can draw on. Only for a mouse or trackpad, and never when
 * reduced motion is asked for.
 */
export function InkTrail() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (!matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const LIFE = 700;
    const pts: { x: number; y: number; t: number }[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let ink = "";
    const readInk = () => {
      ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#0a0a0a";
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const frame = (now: number) => {
      while (pts.length && now - pts[0].t > LIFE) pts.shift();
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = ink;
      for (let i = 2; i < pts.length; i++) {
        const a = pts[i - 2];
        const b = pts[i - 1];
        const c = pts[i];
        const age = (now - c.t) / LIFE;
        ctx.globalAlpha = Math.max(0, 1 - age) * 0.5;
        ctx.lineWidth = 1.4 * (1 - age * 0.5);
        ctx.beginPath();
        ctx.moveTo((a.x + b.x) / 2, (a.y + b.y) / 2);
        ctx.quadraticCurveTo(b.x, b.y, (b.x + c.x) / 2, (b.y + c.y) / 2);
        ctx.stroke();
      }
      raf = pts.length ? requestAnimationFrame(frame) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      pts.push({ x: e.clientX, y: e.clientY, t: performance.now() });
      if (!raf) raf = requestAnimationFrame(frame);
    };
    const scheme = matchMedia("(prefers-color-scheme: dark)");
    readInk();
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    scheme.addEventListener("change", readInk);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      scheme.removeEventListener("change", readInk);
    };
  }, []);
  return <canvas ref={ref} className="trail" aria-hidden="true" />;
}
