/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["mui-tel-input"],
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
