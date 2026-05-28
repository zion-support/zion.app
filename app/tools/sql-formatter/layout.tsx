import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sql Formatter' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
