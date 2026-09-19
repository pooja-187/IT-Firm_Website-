import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "travinno.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "www.travinno.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "manziostudio.com",
        pathname: "/media/**",
      },
      {
        protocol: "https",
        hostname: "www.manziostudio.com",
        pathname: "/media/**",
      },
    ],
  },
};

export default nextConfig;

