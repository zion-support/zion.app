import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform Health Check | Zion Tech Group',
  description: 'Check the health of your Zion Tech Group services and APIs.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
