import { PROJECTS, project } from "@/content/site";
import { OG_SIZE, OG_TYPE, ogCard } from "@/og/card";

export const alt = "A project by Kevin Vera";
export const size = OG_SIZE;
export const contentType = OG_TYPE;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = project((await params).slug) ?? PROJECTS[0];
  return ogCard({ note: `${p.kind.toLowerCase()} · ${p.role.toLowerCase()}`, title: p.name, sub: p.tagline, drawing: p.drawing });
}
