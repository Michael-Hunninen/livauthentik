/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'], // Add any image domains you need
  },
};

module.exports = nextConfig;
