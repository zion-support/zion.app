import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Service Explorer',
  description: 'Browse and filter enterprise AI and IT services by category, industry, and keyword.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
