import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Hash Identifier' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
