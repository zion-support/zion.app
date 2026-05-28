import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Jwt Encoder' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
