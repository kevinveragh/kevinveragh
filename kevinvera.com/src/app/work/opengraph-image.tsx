import { OG_SIZE, OG_TYPE, ogCard } from "@/og/card";

export const alt = "The work of Kevin Vera.";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({ note: "everything I've built", title: "Work", sub: "Cork, Lithometric, Vital Element, Cocoa, Bongo, bellstate and more.", drawing: "cork" });
}
