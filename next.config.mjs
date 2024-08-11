/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"],
  },
  devIndicators: {
    buildActivity: false,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
