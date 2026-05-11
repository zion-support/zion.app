'use client';
import React, { useCallback, useState, useEffect } from 'react';
import Head from 'next/head';

interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  structuredData: Record<string, unknown>;
}

interface AdvancedSEOEnhancerProps {
  seoData: SEOData;
  enableAutoOptimization?: boolean;
}

const AdvancedSEOEnhancer: React.FC<AdvancedSEOEnhancerProps> = ({
  seoData,
  enableAutoOptimization = true
}) => {
  const [isOptimized, setIsOptimized] = useState(false);
  const [optimizationMetrics, setOptimizationMetrics] = useState({
    metaTagsAdded: 0,
    structuredDataAdded: 0,
    imagesOptimized: 0,
    totalOptimizations: 0
  });

  const addMetaTags = useCallback(() => {
    if (!enableAutoOptimization || typeof window === 'undefined') return;

    try {
      const metaTags = [
        { name: 'description', content: seoData.description },
        { name: 'keywords', content: seoData.keywords.join(', ') },
        { name: 'author', content: 'Zion Tech Group' },
        { name: 'robots', content: 'index, follow' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
      ];

      let addedCount = 0;
      metaTags.forEach(tag => {
        if (!document.querySelector(`meta[name="${tag.name}"]`)) {
          const meta = document.createElement('meta');
          meta.setAttribute('name', tag.name);
          meta.setAttribute('content', tag.content);
          document.head.appendChild(meta);
          addedCount++;
        }
      });

      setOptimizationMetrics(prev => ({
        ...prev,
        metaTagsAdded: prev.metaTagsAdded + addedCount
      }));
    } catch (error) {
      console.error('Meta tags optimization error:', error);
    }
  }, [enableAutoOptimization, seoData]);

  const addStructuredData = useCallback(() => {
    if (!enableAutoOptimization || typeof window === 'undefined') return;

    try {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": seoData.title,
        "description": seoData.description,
        "url": seoData.canonicalUrl,
        "image": seoData.ogImage,
        ...seoData.structuredData
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);

      setOptimizationMetrics(prev => ({
        ...prev,
        structuredDataAdded: prev.structuredDataAdded + 1
      }));
    } catch (error) {
      console.error('Structured data optimization error:', error);
    }
  }, [enableAutoOptimization, seoData]);

  const optimizeImages = useCallback(() => {
    if (!enableAutoOptimization || typeof window === 'undefined') return;

    try {
      const images = document.querySelectorAll('img');
      let optimizedCount = 0;

      images.forEach((img) => {
        if (!img.hasAttribute('alt')) {
          img.setAttribute('alt', seoData.title);
          optimizedCount++;
        }
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
          optimizedCount++;
        }
      });

      setOptimizationMetrics(prev => ({
        ...prev,
        imagesOptimized: prev.imagesOptimized + optimizedCount
      }));
    } catch (error) {
      console.error('Image optimization error:', error);
    }
  }, [enableAutoOptimization, seoData]);

  const runOptimizations = useCallback(() => {
    if (!enableAutoOptimization) return;

    addMetaTags();
    addStructuredData();
    optimizeImages();

    setOptimizationMetrics(prev => ({
      ...prev,
      totalOptimizations: prev.metaTagsAdded + prev.structuredDataAdded + prev.imagesOptimized
    }));

    setIsOptimized(true);
  }, [enableAutoOptimization, addMetaTags, addStructuredData, optimizeImages]);

  useEffect(() => {
    if (enableAutoOptimization) {
      runOptimizations();
    }
  }, [runOptimizations, enableAutoOptimization]);

  return (
    <Head>
      <title>{seoData.title}</title>
      <meta name="description" content={seoData.description} />
      <meta name="keywords" content={seoData.keywords.join(', ')} />
      <link rel="canonical" href={seoData.canonicalUrl} />
      <meta property="og:title" content={seoData.title} />
      <meta property="og:description" content={seoData.description} />
      <meta property="og:image" content={seoData.ogImage} />
      <meta property="og:type" content={seoData.ogType} />
      <meta property="og:url" content={seoData.canonicalUrl} />
      <meta name="twitter:card" content={seoData.twitterCard} />
      <meta name="twitter:title" content={seoData.title} />
      <meta name="twitter:description" content={seoData.description} />
      <meta name="twitter:image" content={seoData.ogImage} />
      {enableAutoOptimization && (
        <div className="seo-optimization-status">
          <h3>SEO Optimization Status</h3>
          <p>Optimized: {isOptimized ? 'Yes' : 'No'}</p>
          <div className="metrics">
            <p>Meta Tags: {optimizationMetrics.metaTagsAdded}</p>
            <p>Structured Data: {optimizationMetrics.structuredDataAdded}</p>
            <p>Images: {optimizationMetrics.imagesOptimized}</p>
            <p>Total: {optimizationMetrics.totalOptimizations}</p>
          </div>
        </div>
      )}
    </Head>
  );
};

AdvancedSEOEnhancer.displayName = 'AdvancedSEOEnhancer';

export default AdvancedSEOEnhancer;