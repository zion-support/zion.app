// app/components/LocalBusinessStructuredData.tsx
// Reusable LocalBusiness JSON-LD component for structured data across pages
'use client';

import { CONTACT_INFO, SITE_URL } from '@/utils/seoConstants';

const PHONE = CONTACT_INFO.phone;
const EMAIL = CONTACT_INFO.email;
const { street, city, state, zipCode, country } = CONTACT_INFO.address;

export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Zion Tech Group',
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    image: `${SITE_URL}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: street,
      addressLocality: city,
      addressRegion: state,
      postalCode: zipCode,
      addressCountry: country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '39.4498',
      longitude: '-75.7140',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: PHONE,
        contactType: 'customer service',
        email: EMAIL,
        availableLanguage: ['English', 'Portuguese'],
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/ziontechgroup',
      'https://twitter.com/ziontechgroup',
      'https://github.com/ziontechgroup',
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
