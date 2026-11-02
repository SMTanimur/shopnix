import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@shopnix/types',
    '@shopnix/schemas',
    '@shopnix/utils',
    '@shopnix/api-client',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
