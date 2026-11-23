import { JsonLd } from "@/components/JsonLd";
import { WorkIndex } from "@/components/WorkIndex";
import { PROJECTS } from "@/content/site";
import { breadcrumbs, graph, pageDescription, pageMeta, workCollection } from "@/lib/seo";

export const metadata = pageMeta({ path: "/work", title: "Work", description: pageDescription("/work") });

export default function Work() {
  return (
    <section className="work" aria-label="Work">
      <WorkIndex projects={PROJECTS} />
      <JsonLd
        data={graph(
          workCollection(),
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
          ]),
        )}
      />
    </section>
  );
}
