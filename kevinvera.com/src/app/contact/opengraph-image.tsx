import { OG_SIZE, OG_TYPE, ogCard } from "@/og/card";

export const alt = "Contact Kevin Vera.";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export default function Image() {
  return ogCard({ note: "say hello", title: "Contact", sub: "kevin@lithometric.com", drawing: "letter" });
}
