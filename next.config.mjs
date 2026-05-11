/** @type {import('next').NextConfig} */
// Production build uses `next build --webpack` (see package.json) to avoid Turbopack ENOENT
// issues with static export (output: 'export'). Dev server can still use Turbopack.
const resolvedBuildCpus = (() => {
  const raw = process.env.NEXT_BUILD_CPUS;
  if (!raw) return 2;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 2;
})();

const nextConfig = {
  // Static export configuration
  output: 'export',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  // Trailing slashes for better static hosting
  trailingSlash: true,
  reactStrictMode: true,
  // Enable gzip compression at the Next.js layer
  compress: true,
  // Remove the X-Powered-By header for minor security hardening
  poweredByHeader: false,
  // Avoid shipping client source maps in production by default
  productionBrowserSourceMaps: false,
  // Disable TypeScript type checking during builds (we run it separately)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Strip console.* in production builds to reduce bundle noise; keep error/warn
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    // Reduce memory usage during build
    workerThreads: false,
    // Parallelize page data collection to reduce wall-clock time; allow override.
    cpus: resolvedBuildCpus,
  },
  // NOTE: output: 'export' does not apply custom headers from next.config.
  // Configure security and cache headers at the hosting/CDN layer.
};

export default nextConfig;
