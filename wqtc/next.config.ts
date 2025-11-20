import type { NextConfig } from "next";

// In Docker, the backend is available at 'http://backend:8000' (service name).
// Locally, it is 'http://localhost:8000'.
const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://localhost:8000';

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "wordforwordquran.com",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      // Allow images from the backend
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "backend",
        port: "8000",
        pathname: "/**",
      }
    ],
  },
  async rewrites() {
    return [
      {
        // API Calls
        source: '/api/:path*',
        destination: `${BACKEND_URL}/api/v1/:path*`, 
      },
      {
        // Static Files (General)
        source: '/static/:path*',
        destination: `${BACKEND_URL}/static/:path*`,
      },
      {
        // Cover Images
        source: '/coverpages/:path*',
        destination: `${BACKEND_URL}/static/coverpages/:path*`,
      },
      {
        // PDFs
        source: '/pdfs/:path*',
        destination: `${BACKEND_URL}/static/pdfs/:path*`,
      },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

export default nextConfig;
