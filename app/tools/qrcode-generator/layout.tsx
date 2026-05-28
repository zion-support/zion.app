import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'QR Code Generator' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}