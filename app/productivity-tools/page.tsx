import React from 'react';
import Link from 'next/link';
import { Clock, ExternalLink } from 'lucide-react';

const productivityTools = [
  {
    name: 'Notion',
    href: 'https://www.notion.so/?ref=ziontech',
    desc: 'All-in-one workspace for notes, tasks, wikis, and databases.',
    category: 'Worskpace'
  },
  {
    name: 'Evernote',
    href: 'https://evernote.com/sign-up?ref=ziontech',
    desc: 'Note-taking and organization with free tier.',
    category: 'Worskpace'
  },
  {
    name: 'Toggl Track',
    href: 'https://toggl.com/track/free?ref=ziontech',
    desc: 'Time tracking for teams and individuals.',
    category: 'Time Tracking'
  },
  {
    name: 'RescueTime',
    href: 'https://www.rescuetime.com/create-account?ref=ziontech',
    desc: 'Automatic time management and productivity analytics.',
    category: 'Time Tracking'
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
    name: 'Discord',
    href: 'https://discord.com/?ref=ziontech',
    desc: 'Community and team chat platform.',
    category: 'Communication'
  },
];

const grouped = productivityTools.reduce((acc, tool) => {
  if (!acc[tool.category]) acc[tool.category] = [];
  acc[tool.category].push(tool);
  return acc;
}, {} as Record<string, typeof productivityTools>);

export const metadata = {
  title: 'Free Productivity Tools | Zion Tech Group',
  description: 'Discover free productivity tools. Referral links support our open-source work.',
};

export default function ProductivityToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Free Productivity Tools
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Curated list of free productivity tools for teams and individuals. 
            Every referral helps keep our open-source projects free.
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
          <h3 className="text-2xl font-bold text-white mb-4">Boost Your Team's Productivity</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Need help choosing the right tools? Book a free consultation.
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
