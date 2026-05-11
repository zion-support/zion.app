import { ImageLoader } from 'next/image';

export const imageLoader: ImageLoader = ({ src, width, quality }) => {
  const params = new URLSearchParams();
  params.set('w', width.toString());
  if (quality) {
    params.set('q', quality.toString());
  }
  return `${src}?${params.toString()}`;
};

export const imageOptimizationConfig = {
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  formats: ['image/webp', 'image/avif'],
  minimumCacheTTL: 60,
  dangerouslyAllowSVG: true,
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
};