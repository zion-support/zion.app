/**
 * SEO Auto-Optimizer Component
 * Automatically generates and updates meta tags for better search rankings
 * Priority: HIGH
 */

import Metadata from 'next';

type SEOConfig = {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
};

const DEFAULT_SEO: SEOConfig = {
  title: 'Zion Tech Group | AI & IT Solutions',
  description: 'Transform your business with cutting-edge AI solutions. 50+ AI products, custom development, consulting, and enterprise automation services.',
  keywords: [
    'AI solutions',
    'artificial intelligence',
    'machine learning',
    'business automation',
    'AI development',
    'enterprise AI',
    'IT consulting',
    'digital transformation'
  ],
  ogImage: '/og-image.png'
};

export function generateAutoSEO(config: Partial<SEOConfig> = {}): Metadata {
  const seo = { ...DEFAULT_SEO, ...config };
  
  return {
    metadataBase: new URL('https://ziontechgroup.com'),
    title: {
      default: seo.title,
      template: `%s | ${seo.title}`
    },
    description: seo.description,
    keywords: seo.keywords,
    authors: [{ name: 'Zion Tech Group' }],
    creator: 'Zion Tech Group',
    publisher: 'Zion Tech Group',
    formatDetection: {
      email: true,
      address: true,
      telephone: true
    },
    robots: {
      index: seo.noIndex ? false : true,
      follow: seo.noIndex ? false : true,
      googleBot: {
        index: seo.noIndex ? false : true,
        follow: seo.noIndex ? false : true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1
      }
    },
    alternates: {
      canonical: seo.canonical || 'https://ziontechgroup.com',
      languages: {
        'en': 'https://ziontechgroup.com'
      }
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: seo.canonical || 'https://ziontechgroup.com',
      siteName: 'Zion Tech Group',
      title: seo.title,
      description: seo.description,
      images: [
        {
          url: seo.ogImage || '/og-image.png',
          width: 1200,
          height: 630,
          alt: seo.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage || '/og-image.png'],
      creator: '@ziontechgroup'
    },
    verification: {
      google: 'google-site-verification-code',
      yandex: 'yandex-verification-code'
    }
  };
}

// SEO Score Calculator
export function calculateSEOScore(pageData: {
  hasTitle: boolean;
  hasDescription: boolean;
  hasOGTags: boolean;
  hasCanonical: boolean;
  hasH1: boolean;
  hasAltText: boolean;
  contentLength: number;
}): number {
  let score = 0;
  
  // Basic SEO (40 points)
  if (pageData.hasTitle) score += 15;
  if (pageData.hasDescription) score += 15;
  if (pageData.hasCanonical) score += 10;
  
  // Advanced SEO (40 points)
  if (pageData.hasOGTags) score += 15;
  if (pageData.hasH1) score += 10;
  if (pageData.hasAltText) score += 10;
  if (pageData.hasOGTags) score += 5;
  
  // Content (20 points)
  if (pageData.contentLength > 300) score += 10;
  if (pageData.contentLength > 500) score += 10;
  
  return Math.min(100, score);
}

// JSON-LD Structured Data Generator
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zion Tech Group',
    url: 'https://ziontechgroup.com',
    logo: 'https://ziontechgroup.com/logo.png',
    description: 'Leading provider of AI solutions and IT services',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US',
      addressRegion: 'CA'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-ZION-AI',
      contactType: 'customer service',
      email: 'contact@ziontechgroup.com',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://twitter.com/ziontechgroup',
      'https://linkedin.com/company/ziontechgroup',
      'https://github.com/Zion-support'
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ziontechgroup.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };
}

export function generateProductSchema(products: Array<{
  name: string;
  description: string;
  url: string;
  price?: string;
  category?: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: product.name,
        description: product.description,
        url: product.url,
        ...(product.price && {
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          }
        }),
        ...(product.category && {
          category: product.category
        })
      }
    }))
  };
}

export function generateServiceSchema(services: Array<{
  name: string;
  description: string;
  provider: string;
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services.map((service, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: service.name,
        description: service.description,
        provider: {
          '@type': 'Organization',
          name: service.provider
        }
      }
    }))
  };
}
