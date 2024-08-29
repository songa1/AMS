/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  devIndicators: {
    buildActivity: true,
  },
  output: "standalone",
  productionBrowserSourceMaps: false,
};

export default nextConfig;
