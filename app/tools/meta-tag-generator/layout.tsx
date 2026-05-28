import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Meta Tag Generator' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
