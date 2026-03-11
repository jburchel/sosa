import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: process.env.DEPLOY_TARGET === 'ghpages' ? 'export' : 'standalone',
  basePath: process.env.DEPLOY_TARGET === 'ghpages' ? '/sosa' : '',
  images: {
    unoptimized: process.env.DEPLOY_TARGET === 'ghpages',
  },
};

export default nextConfig;
