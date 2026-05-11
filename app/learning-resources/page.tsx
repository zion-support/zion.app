import React from 'react';
import Link from 'next/link';
import { GraduationCap, ExternalLink } from 'lucide-react';

const learningResources = [
  {
    name: 'freeCodeCamp',
    href: 'https://www.freecodecamp.org/?ref=ziontech',
    desc: 'Free coding bootcamp with certifications.',
    category: 'Coding'
  },
  {
    name: 'Udemy Free Courses',
    href: 'https://www.udemy.com/courses/free/?ref=ziontech',
    desc: 'Thousands of free courses on development, business, and more.',
    category: 'Courses'
  },
  {
    name: 'Coursera Audi',
    href: 'https://www.coursera.org/audit?ref=ziontech',
    desc: 'Audit courses for free (no certificate).',
    category: 'Courses'
  },
  {
    name: 'YouTube Developers',
    href: 'https://www.youtube.com/c/GoogleDevelopers?ref=ziontech',
    desc: 'Free video tutorials from Google Developers.',
    category: 'Video'
  },
  {
    name: 'MDN Web Docs',
    href: 'https://developer.mozilla.org/?ref=ziontech',
    desc: 'The gold standard for web documentation (free).',
    category: 'Documentation'
  },
  {
    name: 'Google Developers Codelabs',
    href: 'https://codelabs.developers.google.com/?ref=ziontech',
    desc: 'Hands-on coding tutorials (free).',
    category: 'Tutorials'
  },
  {
    name: 'GitHub Learning Lab',
    href: 'https://lab.github.com/?ref=ziontech',
    desc: 'Learn Git and GitHub interactively (free).',
    category: 'Git & GitHub'
  },
  {
    name: 'Stack Overflow',
    href: 'https://stackoverflow.com/?ref=ziontech',
    desc: 'Community Q&A for developers (free).',
    category: 'Community'
  },
];

// Group by category
const grouped = learningResources.reduce((acc, item) => {
  if (!acc[item.category]) acc[item.category] = [];
  acc[item.category].push(item);
  return acc;
}, {} as Record<string, typeof learningResources>);

export const metadata = {
  title: 'Free Learning Resources | Zion Tech Group',
  description: 'Curated free learning platforms for developers. Referral links support our open-source work.',
};

export default function LearningResourcesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-lg">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-4">
            Free Learning Resources
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Curated collection of free learning platforms for developers and tech professionals. 
            Every referral helps keep our open-source projects free.
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
          <h3 className="text-2xl font-bold text-white mb-4">Want Personalized Guidance?</h3>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Book a free consultation to discuss learning paths for your team.
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
