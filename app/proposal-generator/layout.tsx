import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proposal Generator | Zion Tech Group',
  description: 'Generate a custom proposal in minutes.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
