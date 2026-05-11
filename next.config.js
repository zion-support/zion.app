/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for GitHub Pages
  output: 'export',
  // Base path for GitHub Pages project site
  basePath: '/zion.app',
  // Ensure trailing slashes for static files
  trailingSlash: true,
  // Disable image optimization (not supported for static export)
  images: {
    unoptimized: true,
  },
  // Compression and optimization
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Ignore TypeScript errors during build for faster feedback
  typescript: {
    ignoreBuildErrors: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  // Package import optimization
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;// trigger rebuild
