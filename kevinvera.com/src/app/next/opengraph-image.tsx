import { OG_SIZE, OG_TYPE, ogCard } from "@/og/card";

export const alt = "What Kevin Vera is striving for.";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({ note: "what I'm striving for", title: "What's next", sub: "Cork on every team, Cocoa for every launch, a code host for agents, quantum computing.", drawing: "chain" });
}
