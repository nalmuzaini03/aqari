import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wcgzthkgxguuwcgvyovx.supabase.co",
      },
    ],
  },
};

export default nextConfig;
