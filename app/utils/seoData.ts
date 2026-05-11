import React from 'react';
export interface StructuredData {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  logo?: string;
  sameAs?: string[]}

export interface SEOData {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: StructuredData}

export const defaultSEOData: SEOData = {
  title: 'Zion Tech Group - AI & Technology Solutions',
  description: 'Leading provider of AI-powered solutions, 5G technology, and innovative software development services.',
  keywords: ['AI', 'Artificial Intelligence', '5G', 'Technology', 'Software Development', 'Machine Learning'],
  canonical: 'https://ziontechgroup.com',
  ogTitle: 'Zion Tech Group - AI & Technology Solutions',
  ogDescription: 'Leading provider of AI-powered solutions, 5G technology, and innovative software development services.',
  ogImage: '/og-image.jpg',
  ogUrl: 'https://ziontechgroup.com',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Zion Tech Group - AI & Technology Solutions',
  twitterDescription: 'Leading provider of AI-powered solutions, 5G technology, and innovative software development services.',
  twitterImage: '/twitter-image.jpg',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zion Tech Group',
    description: 'Leading provider of AI-powered solutions and technology services',
    url: 'https://ziontechgroup.com',
    logo: 'https://ziontechgroup.com/logo.png',
    sameAs: [
      'https://twitter.com/ziontechgroup',
      'https://linkedin.com/company/ziontechgroup'
    ]
  }
}
export const generateSEOData: React.FC = (customData: Partial<SEOData> = { /* empty */ }): SEOData => {
  return {
    ...defaultSEOData,
    ...customData,
    structuredData: {
      ...defaultSEOData.structuredData,
      ...customData.structuredData
    }
  }}