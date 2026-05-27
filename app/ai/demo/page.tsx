import type { Metadata } from 'next';
import DemoSandboxClient from './DemoSandboxClient';

export const metadata: Metadata = {
  title: 'AI Service Demo Sandbox',
  description:
    'Try Zion\'s AI service matching tool live — no sign-up, no API key, 100% browser-side. Type a use case and get ranked service recommendations instantly.',
  alternates: { canonical: '/ai/demo' },};

export default function AIDemoPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-[-6rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full bg-purple-600/10 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-6rem] h-[24rem] w-[24rem] rounded-full bg-blue-600/08 blur-3xl" />
      </div>
      <DemoSandboxClient />
    </div>
  );
}
