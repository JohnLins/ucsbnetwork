import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: []
  },
  async redirects() {
    return [{ source: "/office-hours", destination: "/officehours", permanent: true }];
  }
};

export default nextConfig;
