/**
 * Everything the site says, in one place. The pages, the Markdown twins,
 * llms.txt, the JSON-LD, the Schema Feed and /ask are all built from this
 * file, so a fact changes once and changes everywhere.
 *
 * House style: no dashes of any kind in copy, and no hyphenated phrasing.
 */

export const SITE = {
  url: "https://kevinvera.com",
  host: "kevinvera.com",
  name: "Kevin Vera",
  title: "Kevin Vera: founder of Lithometric, building Cork",
  description:
    "Kevin Vera is the founder and CEO of Lithometric, a principal systems engineering and AI firm. He is building Cork, the Slack for AI coding agents, and runs Cocoa, a studio for launch films, content and ads for AI startups.",
  email: "kevin@lithometric.com",
  home: "Union, New Jersey",
  now: "La Jolla, California",
  /** the day the copy last changed; sitemap and feeds report it */
  updated: "2026-11-23",
} as const;

export type Social = { label: string; short: string; handle: string; url: string };

export const SOCIALS: Social[] = [
  { label: "X", short: "X", handle: "@kevinvera", url: "https://x.com/kevinvera" },
  { label: "LinkedIn", short: "In", handle: "kevinverali", url: "https://www.linkedin.com/in/kevinverali" },
  { label: "YouTube", short: "YT", handle: "@kevinverayt", url: "https://www.youtube.com/@kevinverayt" },
  { label: "TikTok", short: "TT", handle: "@kevinveratt", url: "https://www.tiktok.com/@kevinveratt" },
  { label: "Instagram", short: "IG", handle: "@kevinveraig", url: "https://www.instagram.com/kevinveraig" },
  { label: "GitHub", short: "GH", handle: "kevinveragh", url: "https://github.com/kevinveragh" },
];

export type Drawing =
  | "cork"
  | "burst"
  | "chamber"
  | "cocoa"
  | "cursor"
  | "processes"
  | "browser"
  | "film"
  | "cube"
  | "heal"
  | "chain"
  | "letter";

export type Link = { label: string; url: string };

export type Project = {
  slug: string;
  name: string;
  /** what it is to me, shown as a small label */
  kind: string;
  role: string;
  tagline: string;
  summary: string;
  body: string[];
  stack: string[];
  links: Link[];
  drawing: Drawing;
  /** a code repository, for SoftwareSourceCode in the JSON-LD */
  repo?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "cork",
    name: "Cork",
    kind: "Company",
    role: "Founder and CEO",
    tagline: "The Slack for AI coding agents.",
    summary:
      "Cork coordinates AI agents working in one codebase at the same time, so they stop overwriting each other and stop burning tokens rediscovering context.",
    body: [
      "Git catches two agents on the same line. Cork catches two agents on the same idea. Hooks, a live listener and an MCP server keep Claude Code, Codex, Cursor, Hermes and any MCP client aware of what every other agent is changing, while it changes.",
      "Underneath is a Rust engine: tree sitter parsing, a symbol level Merkle tree store, a typed edit algebra, and symbol anchored memory with content hash staleness detection. Cork never stores your code.",
      "In published benchmarks, 12 agents used 53% fewer tokens together, and each agent used 5.3x fewer.",
    ],
    stack: ["Rust", "tree sitter", "MCP", "Merkle trees", "Embeddings"],
    links: [
      { label: "corkcli.com", url: "https://corkcli.com" },
      { label: "github.com/corkcli", url: "https://github.com/corkcli" },
      { label: "npx corkcli", url: "https://corkcli.com/install" },
    ],
    drawing: "cork",
    repo: "https://github.com/corkcli/cork",
  },
  {
    slug: "lithometric",
    name: "Lithometric",
    kind: "Company",
    role: "Founder and CEO",
    tagline: "Principal systems engineering and AI.",
    summary:
      "Lithometric Inc. is the firm behind everything here. It started as WebRend, became Stone Platforms, and has shipped more than 30 projects.",
    body: [
      "Lithometric takes an idea from the first conversation to production: websites, mobile apps, software and firmware, with AI wherever it earns its place.",
      "It is also home to the longer bets, from agent infrastructure today to quantum computing around 2029 to 2030.",
    ],
    stack: ["Rust", "TypeScript", "Next.js", "Swift", "Python", "Firmware"],
    links: [
      { label: "lithometric.com", url: "https://lithometric.com" },
      { label: "github.com/lithometric", url: "https://github.com/lithometric" },
    ],
    drawing: "burst",
  },
  {
    slug: "vital-element",
    name: "Vital Element",
    kind: "Venture",
    role: "Principal systems engineer",
    tagline: "One chamber. Every modality. Zero wearables.",
    summary:
      "Over about a year and a half I designed and built the whole system behind Vital Element's wellness chamber: VitalOS.",
    body: [
      "The goal is to capture as many readings from the body as possible without asking anyone to wear anything.",
      "VitalOS runs on a Raspberry Pi edge control system, talks to a FastAPI server and Firebase, and comes with a native iOS app.",
    ],
    stack: ["Raspberry Pi", "FastAPI", "Firebase", "Swift", "Python"],
    links: [{ label: "vitalelement.co", url: "https://vitalelement.co" }],
    drawing: "chamber",
  },
  {
    slug: "cocoa",
    name: "Cocoa",
    kind: "Studio",
    role: "Founder",
    tagline: "Launch films, content and ads for AI startups.",
    summary:
      "Cocoa is my studio for the marketing side of a launch: launch films, founder content and ads, for AI startups in New York and San Francisco.",
    body: [
      "Great engineering still has to be seen. Cocoa writes, shoots and cuts launch films for the feed they will live in, then turns the footage into founder clips, product demos and paid ads that get tested and scaled.",
      "Every edit is tuned for short attention spans: each gap where nobody is speaking gets cut. Built to be #1.",
    ],
    stack: ["Launch films", "Founder content", "Paid ads", "Growth marketing"],
    links: [
      { label: "cocoafolk.com", url: "https://cocoafolk.com" },
      { label: "github.com/cocoafolk", url: "https://github.com/cocoafolk" },
    ],
    drawing: "cocoa",
  },
  {
    slug: "bongo",
    name: "Bongo",
    kind: "Side project",
    role: "Builder",
    tagline: "Computer use for your whole Mac.",
    summary:
      "A computer control agent that runs on your own Mac, acts through the sessions you are already signed in to, and works in the background while you keep using the machine.",
    body: [
      "A Gemini Flash planner breaks goals into bounded subtasks. Laya, a fast decision model on ONNX, picks each click from a legal menu, and a ghost cursor acts in background windows.",
      "Every action lands in a hash chained ledger, and anything that sends, posts, pays or connects waits for approval.",
    ],
    stack: ["Rust", "Swift", "Next.js", "ONNX", "Gemini Flash"],
    links: [{ label: "kevinveragh/bongo", url: "https://github.com/kevinveragh/bongo" }],
    drawing: "cursor",
    repo: "https://github.com/kevinveragh/bongo",
  },
  {
    slug: "bellstate",
    name: "bellstate",
    kind: "Open source",
    role: "Author",
    tagline: "Global state for Electron and Node.",
    summary:
      "A global state manager that stays synchronous across processes, and across separate Electron apps, through a Unix socket leader election pattern.",
    body: [
      "A small Rust daemon and a Node client, MIT licensed. Processes and whole apps elect a leader over a Unix socket and read and write one shared state as if it were local.",
    ],
    stack: ["Rust", "Node", "Electron", "Unix sockets"],
    links: [{ label: "kevinveragh/bellstate", url: "https://github.com/kevinveragh/bellstate" }],
    drawing: "processes",
    repo: "https://github.com/kevinveragh/bellstate",
  },
  {
    slug: "browser-agent",
    name: "Browser agent",
    kind: "Side project",
    role: "Builder",
    tagline: "An agent that knows when it does not know.",
    summary:
      "Headed Chrome under Xvfb, observed through the accessibility tree over CDP, with every step checked against a three valued PASS, FAIL or UNKNOWN contract.",
    body: [
      "Self hosted Steel runs the browsers. Playwright and raw CDP drive them, and the accessibility tree is the observation layer instead of screenshots.",
      "UNKNOWN is a real answer: the agent says so instead of guessing that a step worked.",
    ],
    stack: ["Chrome", "CDP", "Playwright", "Steel", "Xvfb"],
    links: [],
    drawing: "browser",
  },
  {
    slug: "juice",
    name: "Juice",
    kind: "In progress",
    role: "Builder",
    tagline: "Edits content against a brand book.",
    summary:
      "An engine that edits my content to match a brand book. I approve every edit, and it never posts on its own.",
    body: [
      "Built in Rust, with a browser based editor that any model can attach to over MCP to make fast, accurate cuts.",
    ],
    stack: ["Rust", "MCP", "Video"],
    links: [],
    drawing: "film",
  },
  {
    slug: "blenderbin",
    name: "BlenderBin",
    kind: "Earlier",
    role: "Founder",
    tagline: "A platform for Blender add ons.",
    summary: "BlenderBin is a platform for distributing Blender add ons, with its own site and its own client.",
    body: ["One of my first products, shipped end to end: the site, the platform and the client."],
    stack: ["Next.js", "Python", "Blender"],
    links: [{ label: "blenderbin.com", url: "https://www.blenderbin.com" }],
    drawing: "cube",
  },
  {
    slug: "shp",
    name: "SHP",
    kind: "Earlier",
    role: "Author",
    tagline: "A self healing protocol.",
    summary: "SHP is a self healing protocol module, written for the Jero blockchain alongside its peer to peer layer.",
    body: ["Built so a network can recover from failure on its own, without someone stepping in."],
    stack: ["Protocols", "Peer to peer"],
    links: [{ label: "lithometric/jeroshp", url: "https://github.com/lithometric/jeroshp" }],
    drawing: "heal",
    repo: "https://github.com/lithometric/jeroshp",
  },
  {
    slug: "retro",
    name: "Retro",
    kind: "Earlier",
    role: "Founder",
    tagline: "A blockchain, since retired.",
    summary: "Retro was a blockchain I designed and built, and later chose to discontinue.",
    body: [],
    stack: ["Blockchain", "Protocols"],
    links: [],
    drawing: "chain",
  },
];

export type Chapter = { id: string; era: string; title: string; text: string; drawing: Drawing };

export const CHAPTERS: Chapter[] = [
  {
    id: "union",
    era: "Union, New Jersey",
    title: "Where it starts",
    text: "Union, New Jersey is home base. I studied at Union College of Union County and went on to Rowan University through UCC, and earned Google IT certifications along the way.",
    drawing: "cube",
  },
  {
    id: "research",
    era: "Research",
    title: "Teaching machines to see",
    text: "As a student researcher I worked on early AI vision and lip syncing models. It was my first look at what a model could understand about the world, and I never stopped looking.",
    drawing: "browser",
  },
  {
    id: "industry",
    era: "Industry",
    title: "Systems at scale",
    text: "I worked at Amazon and shipped production work for Tata Technologies. Real users, real load, and no room for a demo that only works once.",
    drawing: "processes",
  },
  {
    id: "first-builds",
    era: "First builds",
    title: "Shipping my own",
    text: "On my own I built BlenderBin, a platform for Blender add ons, Retro, a blockchain, and SHP, a self healing protocol. Each one went from an idea to something people could use.",
    drawing: "chain",
  },
  {
    id: "lithometric",
    era: "Lithometric",
    title: "A firm for hard systems",
    text: "The company started as WebRend, became Stone Platforms, and is now Lithometric Inc., a principal systems engineering and AI firm. More than 30 projects shipped, from websites to firmware.",
    drawing: "burst",
  },
  {
    id: "vital-element",
    era: "Vital Element",
    title: "The body, without wearables",
    text: "For about a year and a half I was the principal systems engineer at Vital Element, designing and building VitalOS end to end: edge hardware, servers, cloud and an iOS app.",
    drawing: "chamber",
  },
  {
    id: "cork",
    era: "Cork",
    title: "Agents that see each other",
    text: "Running many coding agents at once, I watched them overwrite each other and burn tokens rediscovering the same context. So I built Cork, first called Collide: the Slack for AI coding agents.",
    drawing: "cork",
  },
  {
    id: "cocoa",
    era: "Cocoa",
    title: "Engineering that gets seen",
    text: "I do engineering and growth marketing, so I also run Cocoa, a studio for launch films, content and ads for AI startups in New York and San Francisco. Every cut is made for short attention spans.",
    drawing: "cocoa",
  },
  {
    id: "now",
    era: "Now",
    title: "Building, every day",
    text: "Living in La Jolla for a year, working San Francisco hours, writing Rust and shipping fast. Solo on engineering, all in on Cork.",
    drawing: "cursor",
  },
];

export type Goal = { id: string; when: string; title: string; text: string };

export const GOALS: Goal[] = [
  {
    id: "cork-everywhere",
    when: "Now",
    title: "Cork on every team running agents",
    text: "Every team that runs AI agents in parallel should be able to watch them coordinate instead of collide.",
  },
  {
    id: "cocoa",
    when: "Now",
    title: "Cocoa, the studio AI startups launch with",
    text: "Launch films, content and ads for the AI startups worth watching, in New York and San Francisco. Built to be #1.",
  },
  {
    id: "growth-engines",
    when: "Next",
    title: "Engines for growth marketing",
    text: "Juice edits content against a brand book and Paste turns it into variants for every account. I approve every edit, and nothing posts on its own.",
  },
  {
    id: "code-host",
    when: "Next",
    title: "A code host built for agents",
    text: "A home for code designed from the start for agents working alongside people, not bolted on afterwards.",
  },
  {
    id: "latent-compression",
    when: "Next",
    title: "Latent compression",
    text: "Research and development on latent compression, so an agent can carry more of what it knows for less.",
  },
  {
    id: "quantum",
    when: "2029 to 2030",
    title: "Quantum computing",
    text: "Quantum computing as Lithometric's next frontier, around 2029 to 2030.",
  },
  {
    id: "connectomics",
    when: "Long term",
    title: "Connectomics and brain emulation",
    text: "Mapping the wiring of the brain, and one day emulating it.",
  },
  {
    id: "ieee",
    when: "Career",
    title: "IEEE Fellow",
    text: "Work that moves the field far enough to earn it.",
  },
];

export const KNOWS_ABOUT = [
  "Rust",
  "AI coding agents",
  "Multi agent coordination",
  "Model Context Protocol",
  "Computer use agents",
  "Browser automation",
  "Systems engineering",
  "Edge computing",
  "Next.js",
  "TypeScript",
  "Swift",
  "Python",
  "Growth marketing",
  "Launch films",
  "Video ads",
];

export const STACK = ["Rust", "TypeScript", "Node", "Next.js", "Python", "FastAPI", "Swift", "Railway", "Vercel", "Cloudflare"];

/** The pages, in nav order, with what each one is for. */
export const PAGES = [
  { path: "/", name: "Home", description: SITE.description },
  {
    path: "/work",
    name: "Work",
    description: "Everything Kevin Vera has built: Cork, Lithometric, Vital Element, Cocoa, Bongo, bellstate and more, across engineering and marketing.",
  },
  {
    path: "/about",
    name: "About",
    description:
      "The story of Kevin Vera, from Union, New Jersey and early AI research to Amazon, Lithometric, Vital Element and Cork.",
  },
  {
    path: "/next",
    name: "Next",
    description:
      "What Kevin Vera is striving for: Cork on every team, Cocoa as the studio AI startups launch with, engines for growth marketing, a code host built for agents, latent compression, quantum computing and connectomics.",
  },
  { path: "/contact", name: "Contact", description: "How to reach Kevin Vera: email and every social profile." },
] as const;

export const project = (slug: string) => PROJECTS.find((p) => p.slug === slug);
