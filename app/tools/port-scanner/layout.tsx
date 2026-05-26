import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Port Scanner Tool',
  description: 'Free network port scanner — check open ports and security posture.',
};

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return children;
}
