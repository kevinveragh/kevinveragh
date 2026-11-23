import { OG_SIZE, OG_TYPE, ogCard } from "@/og/card";

export const alt = "Kevin Vera. Founder and CEO of Lithometric, building Cork, the Slack for AI coding agents.";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({ note: "hi, I'm", title: "Kevin Vera", sub: "Founder and CEO of Lithometric. Building Cork, the Slack for AI coding agents." });
}
