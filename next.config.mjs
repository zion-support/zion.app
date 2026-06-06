/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  output: 'export',
  outputFileTracingRoot: process.cwd(),
  images: { unoptimized: true, remotePatterns: [{ protocol: 'https', hostname: '**' }] },
  generateBuildId: async () => 'zion-tech-group-v1',
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  compiler: { removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false },
  experimental: { optimizePackageImports: ['lucide-react'] },
  async redirects() {
    return [{ source: '/consultation', destination: '/contact', permanent: true }];
  },
};
export default nextConfig;
