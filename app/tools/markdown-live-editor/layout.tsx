import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Markdown Live Editor' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
