/** @type {import('next').NextConfig } */
const nextConfig = {
  trailingSlash: true,
  output: 'export',
  outputFileTracingRoot: __dirname,
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  generateBuildId: async () => {
    return 'zion-tech-group-v1';
  },
};
module.exports = nextConfig;