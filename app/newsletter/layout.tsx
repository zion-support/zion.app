import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Newsletter | Zion Tech Group' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}