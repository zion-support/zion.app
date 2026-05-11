'use client';

import Link from 'next/link';
import React from 'react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Functional breadcrumb with BreadcrumbList JSON-LD for SEO.
 * Renders Home > Parent > Current with aria-current on the last item.
 */
const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = '' }) => {
  if (items.length === 0) return null;

  const baseUrl = 'https://ziontechgroup.com';
  const breadcrumbListSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href && { item: `${baseUrl}${item.href}` }),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbListSchema).replace(/</g, '\\u003c') }}
      />
      <nav
        aria-label="Breadcrumb"
        className={`flex flex-wrap items-center gap-1 text-sm text-slate-400 ${className}`}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className="mx-1 text-slate-500" aria-hidden="true">
                  /
                </span>
              )}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="transition hover:text-purple-300"
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'font-medium text-slate-200' : ''}
                >
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </>
  );
};

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
