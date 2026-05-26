import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Lab',
  description:
    'Explore Zion\'s AI Lab — interactive playgrounds, autonomous AI demos, solutions configurator, and architecture planning tools. All browser-side, no sign-up required.',
  openGraph: {
    title: 'AI Lab',
    description:
      'Interactive AI playgrounds and autonomous demo tools from Zion Tech Group.',
  },
};

export default function AILabLayout({ children }: { children: React.ReactNode }) {
  return children;
}