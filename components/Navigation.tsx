'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, Phone, Mail, Sparkles } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const CATEGORIES = [
    { key: 'ai',        label: 'AI Services',           emoji: '🧠', count: '550+' },
    { key: 'it',        label: 'IT Services',            emoji: '🖥️', count: '180+' },
    { key: 'cloud',     label: 'Cloud Services',          emoji: '☁️', count: '90+' },
    { key: 'security',  label: 'Security Services',        emoji: '🔐', count: '95+' },
    { key: 'data',      label: 'Data Analytics',           emoji: '📊', count: '70+' },
    { key: 'automation',label: 'Automation & DevOps',      emoji: '🤖', count: '55+' },
    { key: 'micro-saas',label: 'Micro-SaaS Solutions',     emoji: '🚀', count: '65+' },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50 shadow-lg shadow-slate-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Zion Tech Group
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <Sparkles className="h-3 w-3" /> 1049 Services
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/" className="text-gray-300 hover:text-emerald-400 hover:bg-slate-800/50 px-3 py-2 rounded-lg text-sm font-medium transition-all">
              Home
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-emerald-400 hover:bg-slate-800/50 px-3 py-2 rounded-lg text-sm font-medium transition-all">
              About
            </Link>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="text-gray-300 hover:text-emerald-400 hover:bg-slate-800/50 px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1">
                Services
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>

              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-[480px] max-h-[80vh] overflow-y-auto bg-slate-800/95 backdrop-blur-md rounded-xl shadow-2xl shadow-black/40 py-3 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ring-1 ring-slate-700/50">
                <div className="px-3 pb-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">Service Categories</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
                    {CATEGORIES.map(cat => (
                      <Link
                        key={cat.key}
                        href={`/services?category=${cat.key}`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700/50 transition-all"
                      >
                        <span className="text-lg">{cat.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <span className="block truncate font-medium">{cat.label}</span>
                          <span className="text-xs text-slate-500">{cat.count}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="border-t border-slate-700/50 my-1.5" />
                <div className="px-3">
                  <Link href="/services-explorer" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700/50 transition-all">
                    <span>🔍</span> Service Explorer
                  </Link>
                  <Link href="/service-comparison" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700/50 transition-all">
                    <span>⚖️</span> Compare Services
                  </Link>
                  <Link href="/pricing" className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700/50 transition-all">
                    <span>💰</span> Pricing Plans
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/blog" className="text-gray-300 hover:text-emerald-400 hover:bg-slate-800/50 px-3 py-2 rounded-lg text-sm font-medium transition-all">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-300 hover:text-emerald-400 hover:bg-slate-800/50 px-3 py-2 rounded-lg text-sm font-medium transition-all">
              Contact
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:+130****0950" className="text-slate-400 hover:text-emerald-400 transition-colors"><Phone className="h-4 w-4" /></a>
            <a href="mailto:kleber@ziontechgroup.com" className="text-slate-400 hover:text-emerald-400 transition-colors"><Mail className="h-4 w-4" /></a>
            <Link href="/configurator" className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-emerald-500/20">
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={toggleMenu} className="lg:hidden text-gray-300 hover:text-emerald-400 p-2 rounded-lg hover:bg-slate-800/50 transition-all">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden pb-4">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800/80 backdrop-blur-sm rounded-xl mt-2 border border-slate-700/50">
              <Link href="/" className="text-gray-300 hover:text-emerald-400 block px-4 py-2.5 rounded-lg text-base font-medium hover:bg-slate-700/50" onClick={toggleMenu}>🏠 Home</Link>
              <Link href="/about" className="text-gray-300 hover:text-emerald-400 block px-4 py-2.5 rounded-lg text-base font-medium hover:bg-slate-700/50" onClick={toggleMenu}>ℹ️ About</Link>
              <div className="border-t border-slate-700/50 my-2" />
              <p className="px-4 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</p>
              {CATEGORIES.map(cat => (
                <Link key={cat.key} href={`/services?category=${cat.key}`} className="text-gray-300 hover:text-emerald-400 block px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700/50" onClick={toggleMenu}>
                  {cat.emoji} {cat.label} <span className="text-slate-500 text-xs">({cat.count})</span>
                </Link>
              ))}
              <div className="border-t border-slate-700/50 my-2" />
              <Link href="/blog" className="text-gray-300 hover:text-emerald-400 block px-4 py-2.5 rounded-lg text-base font-medium hover:bg-slate-700/50" onClick={toggleMenu}>📝 Blog</Link>
              <Link href="/contact" className="text-gray-300 hover:text-emerald-400 block px-4 py-2.5 rounded-lg text-base font-medium hover:bg-slate-700/50" onClick={toggleMenu}>📞 Contact</Link>
              <div className="pt-3 px-2">
                <Link href="/configurator" className="bg-gradient-to-r from-emerald-600 to-cyan-600 text-white block px-4 py-3 rounded-lg text-base font-semibold text-center" onClick={toggleMenu}>⚡ Get Started Free</Link>
                <div className="flex items-center justify-center gap-4 mt-3 text-sm text-slate-400">
                  <a href="tel:+13024640950" className="flex items-center gap-1 hover:text-emerald-400"><Phone className="h-3.5 w-3.5" /> +1 302 464 0950</a>
                  <a href="mailto:kleber@ziontechgroup.com" className="flex items-center gap-1 hover:text-emerald-400"><Mail className="h-3.5 w-3.5" /> Email</a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
