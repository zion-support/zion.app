import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools Analytics',
  description: 'Usage analytics for Zion Tech Group tools and services.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
