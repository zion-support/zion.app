/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: output:'export' removed — causes "npx next export" to fail on dynamic routes
  // Deployment is via PM2 + next start (standard Node.js server mode)
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  generateBuildId: async () => 'zion-tech-group-v1',
};

export default nextConfig;
