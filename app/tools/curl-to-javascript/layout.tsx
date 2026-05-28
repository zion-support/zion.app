import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Curl To Javascript' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
