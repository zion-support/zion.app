'use client';
import React, { memo } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown>;
}

/** Sanitize JSON for safe injection into script tags */
function sanitizeJsonForScript(data: unknown): string {
  const json = JSON.stringify(data);
  // Prevent XSS by escaping closing script tags
  return json.replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

const SEOHead: React.FC<SEOHeadProps> = memo(({
  title = 'Zion Tech Group - Advanced AI & IT Solutions',
  description = 'Leading provider of AI-powered solutions, cybersecurity, and digital transformation services. Transform your business with cutting-edge technology.',
  keywords = 'AI solutions, cybersecurity, cloud computing, digital transformation, IT services, artificial intelligence, machine learning, data analytics',
  canonical,
  ogImage = '/icon.svg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  noindex = false,
  structuredData,
}) => {
  const fullTitle = title.includes('Zion Tech Group') ? title : `${title} | Zion Tech Group`;
  const canonicalUrl = canonical || '';

  const defaultStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zion Tech Group',
    description,
    url: canonicalUrl || 'https://ziontechgroup.com',
    logo: 'https://ziontechgroup.com/logo.png',
    sameAs: [
      'https://twitter.com/ziontechgroup',
      'https://linkedin.com/company/ziontechgroup',
      'https://github.com/Zion-support',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-123-4567',
      contactType: 'customer service',
      availableLanguage: 'en',
    },
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: sanitizeJsonForScript(structuredData || defaultStructuredData),
        }}
      />
    </>
  );
});

SEOHead.displayName = 'SEOHead';

export default SEOHead;
