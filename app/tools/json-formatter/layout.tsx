import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'JSON Formatter' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}