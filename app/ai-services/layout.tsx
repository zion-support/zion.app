import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Services',
  description: 'Enterprise AI services — chatbots, RAG, computer vision, predictive analytics, and more.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
