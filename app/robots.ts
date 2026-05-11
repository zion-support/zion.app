import { MetadataRoute } from 'next'

export const dynamic = 'force-static'
export const revalidate = false

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/test', '/test-jsx', '/test-simple', '/test-errorboundary']
    },
    sitemap: 'https://ziontechgroup.com/sitemap.xml'
  };
}