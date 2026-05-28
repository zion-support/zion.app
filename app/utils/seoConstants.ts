// app/utils/seoConstants.ts
export const SITE_URL = 'https://ziontechgroup.com';

export const CONTACT_INFO = {
  email: 'kleber@ziontechgroup.com',
  phone: '+1 302 464 0950',
  address: {
    street: '364 E Main St STE 1008',
    city: 'Middletown',
    state: 'DE',
    zipCode: '19709',
    country: 'US',
  },
};

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/company/ziontechgroup',
  twitter: 'https://twitter.com/ziontechgroup',
  github: 'https://github.com/ziontechgroup',
};

export const STRUCTURED_DATA = {
  ORGANIZATION: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zion Tech Group',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
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
    sameAs: [
    'https://www.linkedin.com/company/ziontechgroup',
    'https://twitter.com/ziontechgroup',
    'https://github.com/ziontechgroup',
  ],
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
        urlTemplate: `${SITE_URL}/search/?q={search_term_string}`,
      },
      queryInput: 'required name=search_term_string',
    },
  },
};
