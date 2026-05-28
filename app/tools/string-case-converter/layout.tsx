import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'String Case Converter' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
