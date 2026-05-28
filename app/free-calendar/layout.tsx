import type { Metadata } from 'next';
export const metadata: Metadata = { title: 'Free Calendar Invite' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}