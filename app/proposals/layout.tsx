import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proposals | Zion Tech Group',
  description: 'View your custom service proposals from Zion Tech Group.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
