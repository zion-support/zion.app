import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Industry Solutions',
  description: 'Industry-specific AI, IT, and Micro-SaaS solutions for enterprise.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
