import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }],
  },
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
    enablePrerenderSourceMaps: false,
  },
};

export default nextConfig;
