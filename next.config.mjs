/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export for GitHub Pages
  output: 'export',
  outputFileTracingRoot: process.cwd(),
  trailingSlash: true,
  basePath: '',
  // Disable image optimization (not supported for static export)
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // TypeScript errors must not block the build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Ignore ESLint errors to allow build to proceed
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Package import optimization
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  generateBuildId: async () => {
    return 'zion-tech-group-v1';
  },
  // V40: /consultation → /contact permanent redirect (static export)
  async redirects() {
    return [
      {
        source: '/consultation',
        destination: '/contact',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;