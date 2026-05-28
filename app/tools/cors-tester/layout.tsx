import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Cors Tester' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
