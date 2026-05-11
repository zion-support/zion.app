const fs = require('fs');

// Fix SkipLink
const skipLinkContent = `'use client';

import React, { useState, useEffect } from 'react';

const SkipLink: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        setIsVisible(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        setIsVisible(true);
      }
    };

    const handleClick = () => {
      setIsVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  const handleSkipToMain = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSkipToNav = () => {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.focus();
      nav.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="skip-links">
      <button
        onClick={handleSkipToMain}
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </button>
      <button
        onClick={handleSkipToNav}
        className="skip-link"
        aria-label="Skip to navigation"
      >
        Skip to navigation
      </button>
    </div>
  );
};

export default SkipLink;
`;

// Fix ConsolidatedAccessibility
const consolidatedAccessibilityContent = `'use client';

import React, { useCallback, useEffect, memo } from 'react';

interface ConsolidatedAccessibilityProps {
  className?: string;
}

const ConsolidatedAccessibility: React.FC<ConsolidatedAccessibilityProps> = memo(({ className = '' }) => {
  const addSkipLinks = useCallback(() => {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = 'position: absolute; top: -40px; left: 6px; z-index: 1000; background: #000; color: #fff; padding: 8px; text-decoration: none;';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }, []);

  const addFocusManagement = useCallback(() => {
    const trapFocus = (element: HTMLElement) => {
      const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      });
    };

    document.querySelectorAll('[role="dialog"]').forEach(modal => {
      trapFocus(modal as HTMLElement);
    });
  }, []);

  const enhanceARIA = useCallback(() => {
    document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(button => {
      if (!button.textContent?.trim()) {
        button.setAttribute('aria-label', 'Button');
      }
    });

    document.querySelectorAll('img:not([alt])').forEach(img => {
      img.setAttribute('alt', '');
    });

    document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])').forEach(input => {
      const label = document.querySelector(\`label[for="\${input.id}"]\`);
      if (!label) {
        input.setAttribute('aria-label', 'Input field');
      }
    });
  }, []);

  useEffect(() => {
    addSkipLinks();
    addFocusManagement();
    enhanceARIA();
  }, [addSkipLinks, addFocusManagement, enhanceARIA]);

  return (
    <div className={\`consolidated-accessibility \${className}\`}>
      {/* Accessibility enhancements */}
    </div>
  );
});

ConsolidatedAccessibility.displayName = 'ConsolidatedAccessibility';

export default ConsolidatedAccessibility;
`;

// Fix ConsolidatedPerformance
const consolidatedPerformanceContent = `'use client';

import React, { useCallback, useState, useEffect, memo } from 'react';

interface ConsolidatedPerformanceProps {
  className?: string;
}

const ConsolidatedPerformance: React.FC<ConsolidatedPerformanceProps> = memo(({
  className = ''
}) => {
  const [metrics, setMetrics] = useState({
    fcp: null as number | null,
    lcp: null as number | null,
    fid: null as number | null,
    cls: null as number | null,
    ttfb: null as number | null
  });

  const measurePerformance = useCallback(() => {
    if (typeof window === 'undefined') return;

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        } else if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
        } else if (entry.entryType === 'first-input') {
          const fidEntry = entry as any;
          setMetrics(prev => ({ ...prev, fid: fidEntry.processingStart - fidEntry.startTime }));
        } else if (entry.entryType === 'layout-shift') {
          const clsEntry = entry as any;
          if (!clsEntry.hadRecentInput) {
            setMetrics(prev => ({ ...prev, cls: (prev.cls || 0) + clsEntry.value }));
          }
        } else if (entry.entryType === 'navigation') {
          const navEntry = entry as any;
          setMetrics(prev => ({ ...prev, ttfb: navEntry.responseStart - navEntry.requestStart }));
        }
      }
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift', 'navigation'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanup = measurePerformance();
    return cleanup;
  }, [measurePerformance]);

  return (
    <div className={\`consolidated-performance \${className}\`}>
      <h3>Performance Metrics</h3>
      <div className="metrics-grid">
        <div className="metric">
          <span>FCP: {metrics.fcp?.toFixed(2)}ms</span>
        </div>
        <div className="metric">
          <span>LCP: {metrics.lcp?.toFixed(2)}ms</span>
        </div>
        <div className="metric">
          <span>FID: {metrics.fid?.toFixed(2)}ms</span>
        </div>
        <div className="metric">
          <span>CLS: {metrics.cls?.toFixed(4)}</span>
        </div>
        <div className="metric">
          <span>TTFB: {metrics.ttfb?.toFixed(2)}ms</span>
        </div>
      </div>
    </div>
  );
});

ConsolidatedPerformance.displayName = 'ConsolidatedPerformance';

export default ConsolidatedPerformance;
`;

// Fix ConsolidatedSEO
const consolidatedSEOContent = `'use client';

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
        "streetAddress": "123 Tech Street",
        "addressLocality": "San Francisco",
        "addressRegion": "CA",
        "postalCode": "94105",
        "addressCountry": "US"
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
    <div className={\`consolidated-seo \${className}\`}>
      {/* SEO optimization component */}
    </div>
  );
});

ConsolidatedSEO.displayName = 'ConsolidatedSEO';

export default ConsolidatedSEO;
`;

// Write all files
const files = [
  { path: '/workspace/app/components/SkipLink.tsx', content: skipLinkContent },
  { path: '/workspace/app/components/consolidated/ConsolidatedAccessibility.tsx', content: consolidatedAccessibilityContent },
  { path: '/workspace/app/components/consolidated/ConsolidatedPerformance.tsx', content: consolidatedPerformanceContent },
  { path: '/workspace/app/components/consolidated/ConsolidatedSEO.tsx', content: consolidatedSEOContent }
];

files.forEach(({ path, content }) => {
  fs.writeFileSync(path, content, 'utf8');
  console.log(`Fixed: ${path}`);
});

console.log(`\nFixed ${files.length} files`);