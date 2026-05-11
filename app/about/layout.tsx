import React from 'react';
// import { Metadata} from 'next';

export const metadata = {
  title: 'Layout | Zion Tech Group',
  description: 'Layout services and solutions from Zion Tech Group.',
  canonical: 'https://ziontechgroup.com/layout',
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}