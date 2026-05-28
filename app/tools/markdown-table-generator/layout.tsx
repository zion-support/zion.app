import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Markdown Table Generator' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
