import React from 'react';
/* eslint-disable */
import Metadata from 'next';

export const metadata = {
  title: 'Search | Zion Tech Group',
  description:
    'Search pages, AI services, products, and resources across Zion Tech Group. Find solutions, services, industry solutions, and product pages.',
  alternates: { canonical: '/search' },
  robots: {
    index: true,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
