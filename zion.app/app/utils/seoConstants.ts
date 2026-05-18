// app/utils/seoConstants.ts
export const SITE_URL = 'https://ziontechgroup.com';

export const STRUCTURED_DATA = {
  ORGANIZATION: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zion Tech Group',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Enterprise AI services, IT solutions, and Micro SAAS platforms.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '364 E Main St STE 1008',
      addressLocality: 'Middletown',
      addressRegion: 'DE',
      postalCode: '19709',
      addressCountry: 'US',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-302-464-0950',
      contactType: 'customer service',
      email: 'kleber@ziontechgroup.com',
    },
    sameAs: [],
  },
  WEBSITE: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Zion Tech Group',
    url: SITE_URL,
    description: 'Enterprise AI services, IT solutions, and Micro SAAS platforms.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      queryInput: 'required name=search_term_string',
    },
  },
};
