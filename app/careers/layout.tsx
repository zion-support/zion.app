import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join Zion Tech Group and build the future of enterprise technology.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
