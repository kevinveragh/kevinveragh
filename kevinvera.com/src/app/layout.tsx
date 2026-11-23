import type { Metadata, Viewport } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";

import { Brand, Clock, InkTrail, Nav } from "@/components/Chrome";
import { JsonLd } from "@/components/JsonLd";
import { Border } from "@/components/Live";
import { WebMcp } from "@/components/WebMcp";
import { SITE, SOCIALS } from "@/content/site";
import { graph, organizations, person, website } from "@/lib/seo";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
const hand = Caveat({ subsets: ["latin"], variable: "--font-hand", weight: ["500"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: ["Kevin Vera", "Lithometric", "Cork", "corkcli", "AI coding agents", "Rust", "founder", "systems engineering", "Cocoa", "Vital Element"],
  category: "technology",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  formatDetection: { telephone: false, address: false, email: false },
  other: { "llms-txt": `${SITE.url}/llms.txt` },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf8" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${hand.variable}`}>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
      </head>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <InkTrail />
        <Border />
        <div className="shell">
          <header className="top">
            <Brand />
            <Nav />
          </header>
          <main id="main" className="main">
            {children}
          </main>
          <footer className="bottom">
            <p className="where">
              <span>Union, NJ</span>
              <span aria-hidden="true">→</span>
              <span>La Jolla, CA</span>
              <Clock />
            </p>
            <ul className="socials" aria-label="Elsewhere">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a href={s.url} rel="me noopener" target="_blank" aria-label={`${s.label}: ${s.handle}`}>
                    <span className="long">{s.label}</span>
                    <span className="short" aria-hidden="true">
                      {s.short}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </footer>
        </div>
        <JsonLd data={graph(person(), website(), ...organizations())} />
        <WebMcp />
      </body>
    </html>
  );
}
