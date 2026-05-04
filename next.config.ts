import type { NextConfig } from "next";

// Belt-and-suspenders: Disable TLS cert chain verification at process level.
// Supabase's connection pooler uses a self-signed intermediate certificate that
// Node.js rejects by default. This only affects the server process, not clients.
// Remove this line if you add Supabase's CA cert to your Node trust store instead.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'nkxomdwkcqxjmwkzrfzz.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'www.bing.com',
      },
      {
        protocol: 'https',
        hostname: 'th.bing.com',
      },
      {
        protocol: 'https',
        hostname: 'imgv3.fotor.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
      },
    ],
  },
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
