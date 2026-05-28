import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Link Preview' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}