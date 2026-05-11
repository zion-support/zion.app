import React from 'react';
import Link from 'next/link';
import { Palette, Image, ExternalLink } from 'lucide-react';

const designResources = [
  {
    name: 'Unsplash',
    href: 'https://unsplash.com/?utm_source=ziontech&utm_medium=referral',
    desc: 'High‑resolution free stock photos (no attribution required).',
    category: 'Stock Photos'
  },
  {
    name: 'Pexels',
    href: 'https://www.pexels.com/?utm_source=ziontech&utm_medium=referral',
    desc: 'Free stock photos & videos shared by creators worldwide.',
    category: 'Stock Photos'
  },
  {
    name: 'unDraw',
    href: 'https://undraw.co/?utm_source=ziontech',
    desc: 'Open‑source illustrations for any idea (customizable).',
    category: 'Illustrations'
  },
  {
    name: 'unDraw (via Stockio)',
    href: 'https://stockio.com/undraw?utm_source=ziontech',
    desc: 'Browse unDraw illustrations organized by category.',
    category: 'Illustrations'
  },
  {
    name: 'Heroicons',
    href: 'https://heroicons.com/?ref=ziontech',
    desc: 'Free, open‑source icons for your next project.',
    category: 'Icons'
  },
  {
    name: 'Feather Icons',
    href: 'https://feathericons.com/?ref=ziontech',
    desc: 'Simply beautiful open‑source icons.',
    category: 'Icons'
  },
  {
    name: 'Google Fonts',
    href: 'https://fonts.google.com/?ref=ziontech',
    desc: 'Free, open‑source font directory.',
    category: 'Fonts'
  },
  {
    name: 'Font Awesome Free',
    href: 'https://fontawesome.com/?ref=ziontech',
    desc: 'Icon library with free tier (v6).',
    category: 'Icons'
  },
];

// Group by category
const grouped = designResources.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {} as Record<string, typeof designResources>);

export const metadata = {
  title: 'Free Design Resources | Zion Tech Group',
  description: 'Curated free design assets – photos, icons, fonts, and illustrations. Referral links support our work.',
};

export default function DesignResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-lg">
            <Palette className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Free Design Resources
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Curated collection of free design assets. Every referral link helps keep our open‑source projects free.
          </p>
        </div>

        {/* Grouped Resources */}
        <div className="space-y-16">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-2xl font-bold text-white mb-8">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-purple-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                      {item.desc}
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

        {/* CTA */}
        <div className="mt-20 p-8 bg-slate-800/30 border border-slate-700 rounded-3xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need Custom Design?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Contact us for AI‑powered design automation services.
          </p>
          <a
            href="/consulting"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
          >
            Book Free Consultation
          </a>
        </div>

        {/* Back to Support */}
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
