import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  experimental: {
    optimizePackageImports: [
      'recharts',
      'lucide-react',
      'date-fns',
      '@radix-ui/react-icons',
    ],
  },
  serverExternalPackages: [],
  allowedDevOrigins: [
    '.space-z.ai',
  ],
};

export default nextConfig;
