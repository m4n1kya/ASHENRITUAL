import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
    qualities: [25, 50, 75, 85, 100],
  },
  // Remove X-Powered-By header
  poweredByHeader: false,
};

export default nextConfig;
