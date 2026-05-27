import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solutions Configurator',
  description: 'Configure your custom AI & IT solutions',
  alternates: { canonical: '/ai/solutions-configurator' },};

export default function SolutionsConfiguratorPage() {
  return (
    <main className="min-h-screen bg-slate-950 py-20">
      <div className="container-page text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Solutions Configurator</h1>
        <p className="text-slate-400">Custom AI & IT solutions configuration coming soon.</p>
        <p className="text-slate-500 text-sm mt-4">Use /configurator for the active configurator.</p>
      </div>
    </main>
  );
}
