const fs = require('fs');

// Fix SEOOptimization
const seoOptimizationContent = `'use client';

import React, { useCallback, useEffect, memo } from 'react';

interface SEOOptimizationProps {
  className?: string;
}

const SEOOptimization: React.FC<SEOOptimizationProps> = memo(({ className = '' }) => {
  const addStructuredData = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Zion Tech Group",
      "description": "Advanced AI and technology solutions for modern businesses",
      "url": "https://ziontechgroup.com",
      "logo": "https://ziontechgroup.com/logo.png",
      "sameAs": [
        "https://twitter.com/ziontechgroup",
        "https://linkedin.com/company/ziontechgroup"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1 302 464 0950",
        "contactType": "customer service"
      }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, []);

  const addMetaTags = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const metaTags = [
      { name: 'description', content: 'Advanced AI and technology solutions for modern businesses' },
      { name: 'keywords', content: 'AI, technology, automation, business solutions, software development' },
      { property: 'og:title', content: 'Zion Tech Group - Advanced AI Solutions' },
      { property: 'og:description', content: 'Advanced AI and technology solutions for modern businesses' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: window.location.href },
      { property: 'og:image', content: window.location.origin + '/og-image.jpg' }
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
  }, []);

  const addBreadcrumbData = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    const breadcrumbData = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        }
      ]
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(breadcrumbData);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    addStructuredData();
    addMetaTags();
    addBreadcrumbData();
  }, [addStructuredData, addMetaTags, addBreadcrumbData]);

  return (
    <div className={\`seo-optimization \${className}\`}>
      {/* SEO optimization component */}
    </div>
  );
});

SEOOptimization.displayName = 'SEOOptimization';

export default SEOOptimization;
`;

// Fix SecurityEnhancement
const securityEnhancementContent = `'use client';

import React, { useCallback, useState, useEffect, memo } from 'react';

interface SecurityEnhancementProps {
  className?: string;
}

const SecurityEnhancement: React.FC<SecurityEnhancementProps> = memo(({
  className = ''
}) => {
  const [securityStatus, setSecurityStatus] = useState({
    cspEnabled: false,
    hstsEnabled: false,
    xssProtection: false,
    clickjackingProtection: false
  });

  const checkSecurityHeaders = useCallback(() => {
    if (typeof window === 'undefined') return;

    const cspEnabled = document.querySelector('meta[http-equiv="Content-Security-Policy"]') !== null;
    const hstsEnabled = document.querySelector('meta[http-equiv="Strict-Transport-Security"]') !== null;
    const xssProtection = document.querySelector('meta[http-equiv="X-XSS-Protection"]') !== null;
    const clickjackingProtection = document.querySelector('meta[name="X-Frame-Options"]') !== null;

    setSecurityStatus({
      cspEnabled,
      hstsEnabled,
      xssProtection,
      clickjackingProtection
    });
  }, []);

  const applySecurityEnhancements = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const securityHeaders = [
        { name: 'Content-Security-Policy', content: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" },
        { name: 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'X-Frame-Options', content: 'DENY' },
        { name: 'X-XSS-Protection', content: '1; mode=block' }
      ];

      securityHeaders.forEach(header => {
        if (!document.querySelector(\`meta[http-equiv="\${header.name}"]\`)) {
          const meta = document.createElement('meta');
          meta.setAttribute('http-equiv', header.name);
          meta.setAttribute('content', header.content);
          document.head.appendChild(meta);
        }
      });

      // console.log('Security enhancements applied');
    } catch (error) {
      // console.warn('Security enhancement error:', error);
    }
  }, []);

  useEffect(() => {
    checkSecurityHeaders();
    applySecurityEnhancements();
  }, [checkSecurityHeaders, applySecurityEnhancements]);

  return (
    <div className={\`security-enhancement \${className}\`}>
      <div className="security-status">
        <h3>Security Status</h3>
        <div className="security-item">
          <span>CSP Enabled: {securityStatus.cspEnabled ? 'Yes' : 'No'}</span>
        </div>
        <div className="security-item">
          <span>HSTS Enabled: {securityStatus.hstsEnabled ? 'Yes' : 'No'}</span>
        </div>
        <div className="security-item">
          <span>XSS Protection: {securityStatus.xssProtection ? 'Yes' : 'No'}</span>
        </div>
        <div className="security-item">
          <span>Clickjacking Protection: {securityStatus.clickjackingProtection ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>
  );
});

SecurityEnhancement.displayName = 'SecurityEnhancement';

export default SecurityEnhancement;
`;

// Fix ServiceWorkerRegistration
const serviceWorkerRegistrationContent = `'use client';

import React, { memo, useEffect } from 'react';

const ServiceWorkerRegistration: React.FC = memo(() => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(() => {
          // console.log('Service Worker registered successfully');
        })
        .catch(() => {
          // console.warn('Service Worker registration failed');
        });
    }
  }, []);

  return null;
});

ServiceWorkerRegistration.displayName = 'ServiceWorkerRegistration';

export default ServiceWorkerRegistration;
`;

// Fix Navigation
const navigationContent = `'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Menu, X } from 'lucide-react';

interface NavigationProps {
  className?: string;
  children?: React.ReactNode;
}

const aiServices = [
  { name: 'AI-Powered DevOps', href: '/ai-powered-devops' },
  { name: 'AI Email Analyzer', href: '/ai-powered-email-analyzer' },
  { name: 'Property Management AI', href: '/property-management-ai' },
  { name: 'Supply Chain Optimizer', href: '/supply-chain-optimizer' },
  { name: 'Online Learning Platform', href: '/online-learning-platform' },
  { name: 'Medical Records Manager', href: '/medical-records-manager' },
  { name: 'Zion AI API Tester', href: '/zion-ai-api-tester' },
  { name: 'Zion AI Database Optimizer', href: '/zion-ai-database-optimizer' }
];

const Navigation: React.FC<NavigationProps> = ({ className = '', children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  return (
    <nav className={\`bg-white shadow-lg \${className}\`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-600">Zion Tech Group</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <div className="relative">
              <button
                onClick={() => toggleDropdown('ai')}
                className="flex items-center text-gray-700 hover:text-blue-600"
              >
                AI Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {openDropdown === 'ai' && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-md shadow-lg z-50">
                  <div className="py-1">
                    {aiServices.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <div className="px-3 py-2">
                <button
                  onClick={() => toggleDropdown('ai-mobile')}
                  className="flex items-center text-gray-700 hover:text-blue-600"
                >
                  AI Services
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {openDropdown === 'ai-mobile' && (
                  <div className="ml-4 mt-2 space-y-1">
                    {aiServices.map((service) => (
                      <Link
                        key={service.href}
                        href={service.href}
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600"
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                About
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
      {children}
    </nav>
  );
};

export default Navigation;
`;

// Write all files
const files = [
  { path: '/workspace/app/components/SEOOptimization.tsx', content: seoOptimizationContent },
  { path: '/workspace/app/components/SecurityEnhancement.tsx', content: securityEnhancementContent },
  { path: '/workspace/app/components/ServiceWorkerRegistration.tsx', content: serviceWorkerRegistrationContent },
  { path: '/workspace/app/components/Navigation.tsx', content: navigationContent }
];

files.forEach(({ path, content }) => {
  fs.writeFileSync(path, content, 'utf8');
  console.log(`Fixed: ${path}`);
});

console.log(`\nFixed ${files.length} files`);