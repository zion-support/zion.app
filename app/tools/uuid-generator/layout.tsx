import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Free UUID Generator' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}