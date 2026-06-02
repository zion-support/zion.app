'use client';

import Link from 'next/link';
import { useState } from 'react';

const DOCK_ITEMS = [
  {
    id: 'search',
    href: '#',
    emoji: '🔍',
    label: 'Search',
    action: 'search',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'testimonials',
    href: '/#testimonials',
    emoji: '⭐',
    label: 'What Clients Say',
    action: 'anchor',
    color: 'from-amber-500 to-yellow-500',
  },
  {
    id: 'configurator',
    href: '/configurator',
    emoji: '⚙️',
    label: 'Get Your Proposal',
    action: 'nav',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'services',
    href: '/services',
    emoji: '🛠️',
    label: 'All Services',
    action: 'nav',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'health-check',
    href: '/health-dashboard/',
    emoji: '🏥',
    label: 'Service Statistics',
    action: 'nav',
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 'contact',
    href: '/contact',
    emoji: '✉️',
    label: 'Contact Us',
    action: 'nav',
    color: 'from-red-500 to-orange-500',
  },
];

export default function FloatingActionDock() {
  const [expanded, setExpanded] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Detect if homepage — hide internal anchors on other pages
  const isHome = typeof window !== 'undefined' && window.location.pathname === '/';

  const doAction = (item: typeof DOCK_ITEMS[0]) => {
    if (item.action === 'search') {
      setSearchOpen(!searchOpen);
      setExpanded(false);
      return;
    }
    if (item.action === 'nav') {
      setExpanded(false);
      return;
    }
    setExpanded(false);
  };

  return (
    <>
      {/* Skip link for keyboard nav */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-lg">
        Skip to main content
      </a>

      {/* Floating dock container */}
      <div
        className="fixed right-4 top-1/2 z-50 -translate-y-1/2 flex flex-col items-end gap-2"
        aria-label="Quick actions"
      >
        {/* Action buttons */}
        <div className={`flex flex-col gap-2 transition-all duration-300 origin-right ${expanded ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 -translate-x-4 pointer-events-none'}`}>
          {DOCK_ITEMS.map((item) => {
            if (item.action === 'anchor' && !isHome) return null;
            if (item.action === 'search') {
              return searchOpen ? (
                <div key={item.id} className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl w-72 backdrop-blur-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{item.emoji}</span>
                    <span className="text-sm font-medium text-white">{item.label}</span>
                  </div>
                  <input
                    type="search"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none focus:border-purple-500"
                    autoFocus
                  />
                  {searchQuery && (
                    <div className="mt-2 text-xs text-slate-400">
                      Press <kbd className="bg-slate-700 px-1 rounded text-slate-200">Esc</kbd> to close
                    </div>
                  )}
                </div>
              ) : null;
            }
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => doAction(item)}
                className="group flex items-center gap-3 bg-slate-900/90 border border-slate-700/70 rounded-2xl px-4 py-2.5 shadow-xl hover:border-purple-500/50 transition-all duration-200 max-w-[260px] backdrop-blur-xl"
              >
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-base shrink-0`}>
                  {item.emoji}
                </div>
                <span className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors whitespace-nowrap">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Expand / collapse toggle */}
        <button
          onClick={() => { setExpanded(!expanded); setSearchOpen(false); }}
          className={`w-12 h-12 rounded-full border border-slate-700/70 flex items-center justify-center shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-purple-500/50 ${expanded ? 'bg-slate-800' : 'bg-gradient-to-br from-purple-600 to-pink-600'}`}
          aria-label={expanded ? 'Hide quick actions' : 'Show quick actions'}
          aria-expanded={expanded}
        >
          <span className={`text-xl transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`}>
            {expanded ? '✕' : '⚡'}
          </span>
        </button>
      </div>
    </>
  );
}
