// Tells Bing, Yandex and the other IndexNow engines which pages exist, after a deploy:
//   npm run indexnow
// The key is public by design; the engines check it at https://kevinvera.com/<key>.txt.
const HOST = "kevinvera.com";
const KEY = "63afd0f91e02ca1f5080ea34e594ee55";

const sitemap = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} for ${urlList.length} URLs`);
