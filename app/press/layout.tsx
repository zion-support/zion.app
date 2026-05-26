import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Press & News',
  description: 'Press releases, media coverage, and news about Zion Tech Group.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
