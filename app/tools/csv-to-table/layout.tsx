import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'CSV to Table' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}