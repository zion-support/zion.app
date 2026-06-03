'use client';

import React from 'react';
import { usePathname} from 'next/navigation';
import JsonLd from '@/components/JsonLd';

export function useAutoJsonLdPage() {
  const pathname = usePathname();

  const siteUrl = 'https://ziontechgroup.com';
  const orgName = 'Zion Tech Group';
  const fullUrl = `${siteUrl}${pathname || '/'}`;

  const title =
    (typeof document !== 'undefined' ? document.title.replace(/\s*\|.*$/, '').trim() : '') || orgName;

  const description =
    (typeof document !== 'undefined'
      ? document.querySelector('meta[name="description"]')?.getAttribute('content')
      : null) ||
    `${orgName} service page.`;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: fullUrl,
    name: title,
    description,
  };

  return schema;
}

export function AutoJsonLd() {
  const schema = useAutoJsonLdPage();
  return React.createElement(JsonLd, { data: schema });
}
