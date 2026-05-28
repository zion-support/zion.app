// Default SEO component for pages
// Usage: Import and use <DefaultSEO /> in any page

import { Metadata } from 'next';

interface DefaultSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  noIndex?: boolean;
}

export default function DefaultSEO({ 
  title: _title,
  description: _description,
  keywords: _keywords,
  noIndex: _noIndex
}: DefaultSEOProps) {
  return null;
}

export const metadata: Metadata = {
  title: 'Zion Tech Group',
  description: 'AI applications, secure engineering, and scalable delivery for modern teams.',
};