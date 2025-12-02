import withPWAInit from "@ducanh2912/next-pwa";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: !isDev,
  aggressiveFrontEndNavCaching: !isDev,
  reloadOnOnline: !isDev,
  disable: isDev,
  workboxOptions: {
    disableDevLogs: true,
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  reactCompiler: true,
  allowedDevOrigins: ['192.168.1.40'],
  images: {
    unoptimized: true, // Required for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  trailingSlash: true,
};

export default withPWA(nextConfig);
