interface Props {
  headline?: string;
  description?: string;
  datePublished?: string;
  slug?: string;
}

const SITE_URL = 'https://ziontechgroup.com';

export default function ArticleStructuredData({ headline, description, datePublished, slug }: Props) {
  if (!headline || !slug) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description: description || '',
    datePublished: datePublished || new Date().toISOString().split('T')[0],
    author: {
      '@type': 'Organization',
      name: 'Zion Tech Group',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Zion Tech Group',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
    url: `${SITE_URL}/blog/${slug}`,
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
