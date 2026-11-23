import { Horizon } from "@/components/Horizon";
import { JsonLd } from "@/components/JsonLd";
import { GOALS } from "@/content/site";
import { breadcrumbs, graph, pageDescription, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({ path: "/next", title: "What's next", description: pageDescription("/next") });

export default function Next() {
  return (
    <section className="next" aria-labelledby="next-title">
      <h1 id="next-title" className="eyebrow rise">
        What I&rsquo;m striving for
      </h1>
      <div className="horizon">
        <Horizon goals={GOALS} />
      </div>
      {/* every goal in plain text too, for readers that do not run scripts or hover */}
      <ol className="sr-only">
        {GOALS.map((g) => (
          <li key={g.id}>
            {g.title} ({g.when}): {g.text}
          </li>
        ))}
      </ol>
      <JsonLd
        data={graph(
          breadcrumbs([
            { name: "Home", path: "/" },
            { name: "What's next", path: "/next" },
          ]),
        )}
      />
    </section>
  );
}
