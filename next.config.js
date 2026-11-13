/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure fast build and serverless optimization on Vercel
  poweredByHeader: false,
};

module.exports = nextConfig;
