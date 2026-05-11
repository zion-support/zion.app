/**
 * Article JSON-LD structured data for blog posts.
 * Use in static blog pages for SEO.
 */
type ArticleStructuredDataProps = {
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  slug: string;
};

export default function ArticleStructuredData({
  headline,
  description,
  datePublished,
  dateModified,
  slug,
}: ArticleStructuredDataProps) {
  const baseUrl = 'https://ziontechgroup.com';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      '@type': 'Organization',
      name: 'Zion Tech Group',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Zion Tech Group',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${slug}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
