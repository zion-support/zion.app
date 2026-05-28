import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Json Diff Viewer' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
