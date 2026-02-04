/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Add this line
  basePath: "/gig-worker",
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;