'use client';

import React, { useCallback, useEffect, memo } from 'react';

interface ConsolidatedSEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  className?: string;
}

const ConsolidatedSEO: React.FC<ConsolidatedSEOProps> = memo(({
  title = 'Zion Tech Group - Advanced AI & IT Solutions',
  description = 'Leading provider of AI-powered solutions, cybersecurity, and digital transformation services.',
  keywords = 'AI solutions, IT services, cybersecurity, cloud computing, digital transformation',
  image = '/og-image.jpg',
  url = 'https://ziontechgroup.com',
  type = 'website',
  className = ''
}) => {
  const addMetaTags = useCallback(() => {
    if (typeof window === 'undefined') return;

    const metaTags = [
      { name: 'description', content: description },
      { name: 'keywords', content: keywords },
      { name: 'author', content: 'Zion Tech Group' },
      { name: 'robots', content: '_index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'theme-color', content: '#3b82f6' },
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ];

    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      if (tag.name) {
        meta.setAttribute('name', tag.name);
      } else if (tag.property) {
        meta.setAttribute('property', tag.property);
      }
      meta.content = tag.content;
      document.head.appendChild(meta);
    });
  }, [title, description, keywords, image, url, type]);

  const addStructuredData = useCallback(() => {
    if (typeof window === 'undefined') return;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Zion Tech Group",
      "description": description,
      "url": url,
      "logo": "https://ziontechgroup.com/logo.png",
      "sameAs": [
        "https://twitter.com/ziontechgroup",
        "https://linkedin.com/company/ziontechgroup"
      ],
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "São Paulo",
        "addressRegion": "SP",
        "addressCountry": "BR"
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [description, url]);

  useEffect(() => {
    addMetaTags();
    addStructuredData();
  }, [addMetaTags, addStructuredData]);

  return (
    <div className={`consolidated-seo ${className}`}>
      {/* SEO optimization component */}
    </div>
  );
});

ConsolidatedSEO.displayName = 'ConsolidatedSEO';

export default ConsolidatedSEO;
