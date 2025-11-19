import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    // Enable experimental features if needed
  },
  // Configure image domains if you use next/image with external sources
  images: {
    unoptimized: true // Set to false if you want Next.js image optimization
  }
};

export default nextConfig;
