import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '**.firebasestorage.app',
      },
    ],
  },
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: {
    resolveAlias: {
      'tw-animate-css': './node_modules/tw-animate-css/dist/tw-animate.css',
    },
  },
};

export default nextConfig;
