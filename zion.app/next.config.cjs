/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  output: 'export',
  basePath: '',
  assetPrefix: '/',
  // Ensure PostCSS assets are found at workspace root during export
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  generateBuildId: async () => {
    return 'zion-tech-group-v1';
  },
};
module.exports = nextConfig;