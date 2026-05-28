import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enterprise AI & IT Services | Zion Tech Group',
  description: 'Browse AI, IT, cloud, security, data, and automation services.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
