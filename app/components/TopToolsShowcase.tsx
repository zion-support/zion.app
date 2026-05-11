"use client";

import React, { useState } from 'react';
import TrackedLink from './TrackedLink';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  href: string;
  icon: string;
  isSponsored?: boolean;
  referralCount?: number;
}

const topTools: Tool[] = [
  {
    id: 'cookie-decoder',
    name: 'Cookie Decoder',
    description: 'Parse Set-Cookie headers with full attribute breakdown',
    category: 'Developer Tools',
    href: '/tools/cookie-decoder',
    icon: '🍪',
    referralCount: 1420
  },
  {
    id: 'json-generator',
    name: 'JSON Schema Generator',
    description: 'Instant JSON Schema and TypeScript interface generator',
    category: 'Developer Tools',
    href: '/tools/json-schema-generator',
    icon: '📋',
    referralCount: 1280
  },
  {
    id: 'free-email',
    name: 'Free Email Services',
    description: 'Gmail, Outlook, ProtonMail with privacy features',
    category: 'Communication',
    href: '/free-email',
    icon: '📧',
    referralCount: 1150
  },
  {
    id: 'free-cms',
    name: 'Free CMS Platforms',
    description: 'WordPress, Strapi, Sanity with developer-friendly APIs',
    category: 'Content Management',
    href: '/free-cms',
    icon: '📝',
    referralCount: 980
  },
  {
    id: 'free-automation',
    name: 'Automation Tools',
    description: 'Zapier, Make, GitHub Actions for workflow automation',
    category: 'Productivity',
    href: '/free-automation-tools',
    icon: '⚡',
    referralCount: 890
  },
  {
    id: 'free-cdn',
    name: 'CDN Services',
    description: 'Cloudflare, Netlify, Vercel for global content delivery',
    category: 'Infrastructure',
    href: '/free-cdn',
    icon: '🌐',
    referralCount: 760
  },
  {
    id: 'free-analytics',
    name: 'Analytics Tools',
    description: 'Google Analytics, Plausible, Fathom for insights',
    category: 'Analytics',
    href: '/free-analytics',
    icon: '📊',
    referralCount: 640
  },
  {
    id: 'free-design',
    name: 'Design Resources',
    description: 'Figma, Canva, Unsplash for creative work',
    category: 'Design',
    href: '/free-design-resources',
    icon: '🎨',
    referralCount: 520
  },
  {
    id: 'free-storage',
    name: 'Cloud Storage',
    description: 'Google Drive, Dropbox, pCloud with free tiers',
    category: 'Storage',
    href: '/free-storage',
    icon: '💾',
    referralCount: 480
  },
  {
    id: 'free-ai',
    name: 'AI Tools',
    description: 'OpenAI, Hugging Face, Anthropic for development',
    category: 'AI',
    href: '/free-ai',
    icon: '🤖',
    referralCount: 380
  }
];

export default function TopToolsShowcase() {
  const [showMore, setShowMore] = useState(false);

  const displayedTools = showMore ? topTools : topTools.slice(0, 6);

  return (
    <section className="mt-12 p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold">Top 10 Free Tools</h3>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {['🔥', '⭐', '💎'].map((badge, idx) => (
              <span key={idx} className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">
                {badge}
              </span>
            ))}
          </div>
          <button
            onClick={() => setShowMore(!showMore)}
            className="text-sm bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
          >
            {showMore ? 'Show Less' : 'View All'}
          </button>
        </div>
      </div>
      
      <p className="mb-6 max-w-2xl">
        Discover the most popular free tools, ranked by community usage and referral impact.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedTools.map((tool, index) => (
          <div
            key={tool.id}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-all border border-white/20"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{tool.icon}</div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{index + 1}. {tool.name}</h4>
                    <p className="text-sm text-blue-100 mt-1">{tool.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                    {tool.category}
                  </span>
                  <span className="text-xs text-blue-200">
                    {tool.referralCount} referrals
                  </span>
                </div>
                <TrackedLink
                  href={tool.href}
                  utmParams={{utm_source: 'ziontechgroup.com', utm_medium: 'referral', utm_campaign: 'top10'}}
                  className="mt-3 inline-flex items-center gap-1 text-sm text-blue-100 hover:text-white"
                >
                  Explore →
                </TrackedLink>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showMore && topTools.length > 6 && (
        <div className="mt-6 text-center">
          <p className="text-sm text-blue-200">
            Plus {topTools.length - 6} more tools available
          </p>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <TrackedLink
          href="/free-tools-directory"
          utmParams={{utm_source: 'ziontechgroup.com', utm_medium: 'referral', utm_campaign: 'directory'}}
          className="inline-flex items-center gap-2 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-full font-medium text-white transition"
        >
          View Complete Directory
        </TrackedLink>
      </div>
    </section>
  );
}