import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Recommender | Zion Tech Group',
  description: 'Answer 3 quick questions — our AI finds the best-matched services.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
