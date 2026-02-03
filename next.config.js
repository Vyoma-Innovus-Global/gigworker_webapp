/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "/gig-worker",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
