import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Comparison Tool | Zion Tech Group',
  description: 'Compare Zion Tech Group services side by side.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
