import React from 'react';
import Link from 'next/link';
import { Folder, ExternalLink } from 'lucide-react';

const freeToolsCategories = [
  {
    name: 'Email Services',
    href: '/free-email',
    desc: 'Secure email providers with zero-cost plans.',
    category: 'Communication'
  },
  {
    name: 'CMS Solutions',
    href: '/free-cms',
    desc: 'Content management tools that cost nothing to host.',
    category: 'Content'
  },
  {
    name: 'Analytics Platforms',
    href: '/free-analytics',
    desc: 'Free web traffic tracking with privacy focus.',
    category: 'Analytics'
  },
  {
    name: 'Automation Tools',
    href: '/free-automation-tools',
    desc: 'Streamline workflows using free automation platforms.',
    category: 'Productivity'
  },
  {
    name: 'AI Development Kits',
    href: '/free-ai-tools',
    desc: 'Open-source AI models and developer tools.',
    category: 'AI'
  },
  {
    name: 'CDN Networks',
    href: '/free-cdn',
    desc: 'Free content delivery networks for faster websites.',
    category: 'Infrastructure'
  }
];

const grouped = freeToolsCategories.reduce((acc, category) => {
  if (!acc[category.category]) acc[category.category] = [];
  acc[category.category].push(category);
  return acc;
}, {} as Record<string, typeof freeToolsCategories>);

export const metadata = {
  title: 'Free Tools Directory | Zion Tech Group',
  description: 'A centralized hub for over 20+ free tools to power your projects without cost.',
};

export default function FreeToolsDirectory() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-lg">
            <Folder className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Free Tools Directory
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Explore 20+ zero-cost tools across email, CMS, analytics, automation, AI, and infrastructure.
            Affiliate links may exist to support our open-source mission.
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
          <h3 className="text-2xl font-bold text-white mb-4">Want a Tool Added?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Share your favorite free tools with us to help others discover them.
          </p>
          <a
            href="/contribute"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Submit a Tool
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