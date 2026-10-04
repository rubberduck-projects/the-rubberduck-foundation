import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: no server runtime, every route is prerendered to HTML at
  // build time into `out/`.
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
