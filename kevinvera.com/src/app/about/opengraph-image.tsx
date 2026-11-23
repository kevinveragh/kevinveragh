import { OG_SIZE, OG_TYPE, ogCard } from "@/og/card";

export const alt = "About Kevin Vera: the story so far.";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({ note: "the story so far", title: "About Kevin Vera", sub: "From Union, New Jersey and early AI research to Amazon, Lithometric, Vital Element and Cork.", drawing: "cube" });
}
