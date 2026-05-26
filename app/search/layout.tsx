import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search our catalog of services, solutions, and industry offerings at Zion Tech Group.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
