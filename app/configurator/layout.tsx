import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solution Configurator',
  description: 'Answer a few questions, get a custom itemized proposal in minutes.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
