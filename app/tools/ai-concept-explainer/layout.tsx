import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Ai Concept Explainer' };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
