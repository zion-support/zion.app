import Head from 'next/head';

interface ArticleStructuredDataProps {
  headline: string;
  description: string;
  datePublished: string;
  slug: string;
}

export default function ArticleStructuredData({
  headline,
  description,
  datePublished,
  slug,
}: ArticleStructuredDataProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    datePublished,
    url: `https://ziontechgroup.com/blog/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Zion Tech Group',
      logo: {
        '@type': 'ImageObject',
        url: 'https://ziontechgroup.com/icon.svg',
      },
    },
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </Head>
  );
}