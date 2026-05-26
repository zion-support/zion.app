import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Comparison',
  description: 'Compare AI, IT, cloud, and automation services side by side.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
