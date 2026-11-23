import { ImageResponse } from "next/og";

import { burst } from "@/lib/sketch";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fafaf8" }}>
        <svg width="130" height="130" viewBox="0 0 400 400">
          {burst(200, 200, 180, 3, 0.4).map((d, i) => (
            <path key={i} d={d} fill="none" stroke="#0a0a0a" strokeWidth={22} strokeLinecap="round" />
          ))}
        </svg>
      </div>
    ),
    size,
  );
}
