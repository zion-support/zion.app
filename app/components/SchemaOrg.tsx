'use client';
import { usePathname } from 'next/navigation';

type SchemaOrgFaqQuestion = { question: string; answer: string };

interface SchemaOrgProps {
  type?: 'Organization' | 'WebSite' | 'WebPage' | 'Article' | 'Product' | 'FAQPage';
  data?: Record<string, unknown> & {
    name?: string;
    description?: string;
    price?: string;
    questions?: SchemaOrgFaqQuestion[];
  };
}

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Zion Tech Group",
  "url": "https://ziontechgroup.com",
  "logo": "https://ziontechgroup.com/logo.png",
  "description": "Leading AI solutions provider offering 200+ artificial intelligence services",
  "founder": {
    "@type": "Person",
    "name": "Zion Tech Team"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "US"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "sales",
    "availableLanguage": "English"
  },
  "sameAs": [
    "https://twitter.com/ziontechgroup",
    "https://linkedin.com/company/ziontechgroup",
    "https://github.com/Zion-support"
  ],
  "offers": {
    "@type": "AggregateOffer",
    "lowPrice": "499",
    "highPrice": "2499",
    "priceCurrency": "USD",
    "offerCount": "200"
  }
};

const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Zion Tech Group - AI Solutions",
  "url": "https://ziontechgroup.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ziontechgroup.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function SchemaOrg({ type = 'Organization', data }: SchemaOrgProps) {
  const pathname = usePathname();
  
  const getSchema = () => {
    switch (type) {
      case 'WebSite':
        return { ...WEBSITE_SCHEMA, url: `https://ziontechgroup.com${pathname}` };
      case 'WebPage':
        return {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "url": `https://ziontechgroup.com${pathname}`,
          "name": data?.name || 'Zion Tech Group',
          "description": data?.description || 'AI Solutions'
        };
      case 'Product':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data?.name,
          "description": data?.description,
          "offers": {
            "@type": "Offer",
            "price": data?.price || "499",
            "priceCurrency": "USD"
          }
        };
      case 'FAQPage':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": (data?.questions ?? []).map((q) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          }))
        };
      default:
        return ORGANIZATION_SCHEMA;
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(getSchema()).replace(/</g, '\\u003c') }}
    />
  );
}
