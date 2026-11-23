import type { NextConfig } from "next";

const config: NextConfig = {
  // a self contained server for the Docker image: smaller, and quicker to wake
  output: "standalone",
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
  async redirects() {
    return [{ source: "/story", destination: "/about", permanent: true }];
  },
};

export default config;
