import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Proposal Generator',
  description: 'Generate a custom proposal in minutes.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
