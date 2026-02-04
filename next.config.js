/** @type {import('next').NextConfig} */
const nextConfig = {
 
  basePath: "/gig-worker",
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;