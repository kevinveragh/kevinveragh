import { JsonLd } from "@/components/JsonLd";
import { Story } from "@/components/Story";
import { CHAPTERS } from "@/content/site";
import { breadcrumbs, graph, pageDescription, pageMeta, profilePage } from "@/lib/seo";

export const metadata = pageMeta({ path: "/about", title: "About", description: pageDescription("/about") });

export default function About() {
  return (
    <section className="about" aria-labelledby="about-title">
      <h1 id="about-title" className="eyebrow rise">
        About Kevin Vera · the story so far
      </h1>
      <Story chapters={CHAPTERS} />
      <JsonLd
        data={graph(
          profilePage(),
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        )}
      />
    </section>
  );
}
