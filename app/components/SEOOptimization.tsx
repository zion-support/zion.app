'use client';
import React, { memo, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { CONTACT_INFO, SOCIAL_LINKS } from '../utils/seoConstants';

interface SEOOptimizationProps {
  className?: string;
}

const SEOOptimization: React.FC<SEOOptimizationProps> = memo(({ className = '' }) => {
  const pathname = usePathname();

  const addStructuredData = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Zion Tech Group",
      "description": "Leading provider of AI-powered solutions, cybersecurity, and digital transformation services",
      "url": window.location.origin,
      "logo": window.location.origin + "/images/logo.png",
      "sameAs": [SOCIAL_LINKS.linkedin, SOCIAL_LINKS.twitter],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": CONTACT_INFO.phone,
        "email": CONTACT_INFO.email,
        "contactType": "customer service"
      }
    };

    const id = 'zion-schema-org-jsonld';
    if (document.getElementById(id)) return;
    const script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, []);

  const addMetaTags = useCallback(() => {
    if (typeof window === 'undefined') return;

    const metaTags = [
      { name: 'robots', content: 'index, follow' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'bingbot', content: 'index, follow' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Zion Tech Group' },
      { name: 'twitter:site', content: '@ziontechgroup' }
    ];

    metaTags.forEach(tag => {
      const selector = tag.name
        ? `meta[name="${tag.name}"]`
        : tag.property
          ? `meta[property="${tag.property}"]`
          : null;
      if (!selector) return;
      const existingTag = document.querySelector(selector);
      if (!existingTag) {
        const meta = document.createElement('meta');
        if (tag.name) meta.setAttribute('name', tag.name);
        if (tag.property) meta.setAttribute('property', tag.property);
        meta.setAttribute('content', tag.content);
        document.head.appendChild(meta);
      }
    });
  }, []);

  const addBreadcrumbData = useCallback(() => {
    if (typeof window === 'undefined') return;

    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) {
      document.getElementById('zion-seo-breadcrumb-jsonld')?.remove();
      return;
    }

    const breadcrumbItems = pathSegments.map((segment, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      "item": window.location.origin + '/' + pathSegments.slice(0, index + 1).join('/')
    }));

    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        ...breadcrumbItems
      ]
    };
    
    document.getElementById('zion-seo-breadcrumb-jsonld')?.remove();
    const script = document.createElement('script');
    script.id = 'zion-seo-breadcrumb-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbData);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    addStructuredData();
    addMetaTags();
    addBreadcrumbData();
  }, [addStructuredData, addMetaTags, addBreadcrumbData, pathname]);

  return (
    <div className={`seo-optimization ${className}`}>
      {/* SEO optimization component */}
    </div>
  );
});

SEOOptimization.displayName = 'SEOOptimization';

export default SEOOptimization;