import React from 'react';
import Link from 'next/link';
import { Briefcase, ExternalLink } from 'lucide-react';

const businessTools = [
  {
    name: 'HubSpot CRM',
    href: 'https://www.hubspot.com/products/get-started?ref=ziontech',
    desc: 'Free CRM with marketing, sales, and service tools.',
    category: 'CRM & Sales'
  },
  {
    name: 'Mailchimp Free',
    href: 'https://mailchimp.com/pricing/free/?ref=ziontech',
    desc: 'Email marketing free tier (up to 500 contacts).',
    category: 'Marketing'
  },
  {
    name: 'Trello',
    href: 'https://trello.com/en-US/signup?ref=ziontech',
    desc: 'Visual project management with free tier.',
    category: 'Project Management'
  },
  {
    name: 'Asana',
    href: 'https://asana.com/pricing?ref=ziontech',
    desc: 'Work management platform with free tier.',
    category: 'Project Management'
  },
  {
    name: 'Slack Free',
    href: 'https://slack.com/get-started?ref=ziontech',
    desc: 'Team communication with free plan.',
    category: 'Communication'
  },
  {
    name: 'Zoom Free',
    href: 'https://zoom.us/signup?ref=ziontech',
    desc: 'Video conferencing with free tier.',
    category: 'Communication'
  },
  {
    name: 'Google Workspace Free Trial',
    href: 'https://workspace.google.com/signup?ref=ziontech',
    desc: 'Business email, docs, and storage (14‑day trial).',
    category: 'Productivity'
  },
  {
    name: 'Canva Free',
    href: 'https://www.canva.com/signup?ref=ziontech',
    desc: 'Design platform with free tier.',
    category: 'Design'
  },
];

// Group by category
const grouped = businessTools.reduce((acc, tool) => {
  if (!acc[tool.category]) acc[tool.category] = [];
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, typeof businessTools>);

export const metadata = {
  title: 'Free Business Tools | Zion Tech Group',
  description: 'Discover free‑tier business software. Referral links support our open‑source work.',
};

export default function FreeBusinessToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-lg">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Free Business Tools
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Curated list of free‑tier business software. Every referral helps keep our open‑source projects free.
          </p>
        </div>

        {/* Grouped Tools */}
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

        {/* CTA */}
        <div className="mt-20 p-8 bg-slate-800/30 border border-slate-700 rounded-3xl text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Need Help Choosing?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Contact us for a free consultation on which tools fit your business needs.
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
