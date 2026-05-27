interface BlogPostStructuredDataProps {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  image?: string;
  url: string;
}

export default function BlogPostStructuredData({
  title,
  description,
  datePublished,
  dateModified,
  author,
  image,
  url,
}: BlogPostStructuredDataProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    author: author
      ? {
          '@type': 'Person',
          name: author,
        }
      : {
          '@type': 'Organization',
          name: 'Zion Tech Group',
        },
    ...(image && { image }),
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}