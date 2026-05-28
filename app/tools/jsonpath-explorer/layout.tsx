import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Jsonpath Explorer' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
