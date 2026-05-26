import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SSL Certificate Checker',
  description: 'Free SSL/TLS certificate checker for any domain.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
