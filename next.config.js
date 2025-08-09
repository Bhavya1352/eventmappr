/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // keep static export
  images: {
    unoptimized: true, // disable image optimization for static builds
  },
};

module.exports = nextConfig;
