/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  typescript: { ignoreBuildErrors: true },
  compiler: {
    removeConsole: false,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = config.context;
    return config;
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
    workerThreads: false,
  },
};

export default nextConfig;
