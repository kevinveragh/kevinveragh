# kevinvera.com

Kevin Vera's personal site. Next.js 16, one fixed sheet per page, everything drawn by hand in SVG.

```console
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

The drawing of Kevin on the home page is `src/content/portrait.ts`, made from his profile photo (`public/kevin.jpg`) by `scripts/portrait.py`: traced silhouette and hatching, with the face placed by hand. Rerun it with OpenCV and NumPy installed to redraw.

All copy lives in `src/content/site.ts`. The pages, Markdown twins, llms.txt, JSON-LD, the Schema Feed and `/ask` are built from it, so a change there lands everywhere.

## Deploy on Railway

Create a service from this repo with **Root Directory** `/kevinvera.com` and **Config File** `/kevinvera.com/railway.json`. The config builds the Dockerfile (a standalone Next server) and turns on Serverless, so the app sleeps when idle and wakes on the next request. Point kevinvera.com at the service, then run `npm run indexnow` once the site is live.

## For search engines and agents

| What | Where |
| :-- | :-- |
| Sitemap and robots, with AI crawlers allowed by name | `/sitemap.xml`, `/robots.txt` |
| llms.txt and the whole site as text | `/llms.txt`, `/llms-full.txt` |
| Markdown twin of every page | `/about.md`, `/work/cork.md`, `/index.md`, or `Accept: text/markdown`, or `?mode=agent`; known AI crawlers get it automatically |
| JSON-LD | Person, Organization, WebSite, ProfilePage, CollectionPage, SoftwareSourceCode, BreadcrumbList |
| NLWeb search | `/ask?query=...` (JSON, or Server Sent Events with `streaming=true`) |
| Schema Feeds | `/schemamap.xml`, `/feeds/pages.jsonl` |
| API catalog (RFC 9727) | `/.well-known/api-catalog` |
| WebMCP tools in the browser | `src/components/WebMcp.tsx` |
| IndexNow key | `/63afd0f91e02ca1f5080ea34e594ee55.txt` |
| Social cards | an `opengraph-image` for every page, drawn in the site's own style |
