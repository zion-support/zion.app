export default function ArticleStructuredData({ 
  headline, 
  description, 
  datePublished, 
  slug 
}: { 
  headline: string; 
  description: string; 
  datePublished: string; 
  slug: string 
}) {
  return (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: headline,
        description: description,
        datePublished: datePublished,
        dateModified: datePublished,
        author: {
          "@type": "Person",
          name: "Zion Tech Group"
        },
        publisher: {
          "@type": "Organization",
          name: "Zion Tech Group",
          logo: {
            "@type": "ImageObject",
            url: "/logo.png"
          }
        },
        image: "/logo.png",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `https://ziontechgroup.com/blog/${slug}`
        }
      })}
    </script>
  );
}