import React from 'react';
import Link from 'next/link';
import { Zap, ExternalLink } from 'lucide-react';

const automationTools = [
  {
    name: 'n8n',
    href: 'https://n8n.io/?ref=ziontech',
    desc: 'Open-source workflow automation with 200+ integrations.',
    category: 'Self-Hosted'
  },
  {
    name: 'Zapier Free',
    href: 'https://zapier.com/?ref=ziontech',
    desc: '5 Zaps, 100 tasks/month free.',
    category: 'Cloud'
  },
  {
    name: 'Make (Integromat)',
    href: 'https://www.make.com/?ref=ziontech',
    desc: '1,000 operations/month on free plan.',
    category: 'Cloud'
  },
  {
    name: 'IFTTT',
    href: 'https://ifttt.com/?ref=ziontech',
    desc: '5 applets, 3 iOS/Android actions free.',
    category: 'Cloud'
  },
  {
    name: 'Tray.io',
    href: 'https://tray.ai/?ref=ziontech',
    desc: 'Free tier for basic automation workflows.',
    category: 'Cloud'
  },
];

const grouped = automationTools.reduce((acc, tool) => {
  if (!acc[tool.category]) acc[tool.category] = [];
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, typeof automationTools>);

export const metadata = {
  title: 'Free Automation Tools | Zion Tech Group',
  description: 'Automate workflows without spending a dime. Curated free automation platforms.',
};

export default function FreeAutomationToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-lg">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Free Automation Tools
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Streamline repetitive tasks with these zero-cost automation platforms.
            Referral links support our open-source work.
          </p>
        </div>
        <div className="space-y-16">
          {Object.entries(grouped).map(([category, tools]) => (
            <section key={category}>
              <h2 className="text-2xl font-bold text-white mb-8">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-purple-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      {tool.desc}
                    </p>
                    <div className="mt-4 flex items-center text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Visit <ExternalLink className="ml-1 h-3 w-3" />
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-20 p-8 bg-slate-800/30 border border-slate-700 rounded-3xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need Custom Automation?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Let us build tailored automation workflows for your business.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Get a Free Quote
          </a>
        </div>
        <div className="mt-12 text-center">
          <a 
            href="/support"
            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to Support Page
          </a>
        </div>
      </div>
    </div>
  );
}
