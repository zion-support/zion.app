import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Code Complexity Analyzer' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
