'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, Zap } from 'lucide-react';

type MegaNavCategory = { title: string; items: string[] };

type MegaNavItem =
  | { label: string; href: string; mega?: false }
  | { label: string; href: string; mega: true; categories: MegaNavCategory[] };

const NAV_ITEMS: MegaNavItem[] = [
  {
    label: 'AI Solutions',
    href: '/ai',
    mega: true,
    categories: [
      { title: 'Core AI', items: ['Machine Learning', 'Natural Language', 'Computer Vision', 'Speech AI'] },
      { title: 'Enterprise', items: ['AI Consulting', 'Custom Development', 'Integration', 'Support'] },
      { title: 'Tools', items: ['AI Chat', 'Voice Assistant', 'Document Analyzer', 'ROI Calculator'] }
    ]
  },
  { label: 'Industries', href: '/industries' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Resources', href: '/resources' },
  { label: 'Company', href: '/about' }
];

export default function MegaNav() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Zion</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.mega && setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <a
                  href={item.href}
                  className="flex items-center gap-1 px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  {item.label}
                  {item.mega && <ChevronDown className="w-4 h-4" />}
                </a>

                <AnimatePresence>
                  {item.mega && activeMenu === item.label && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 w-[600px] bg-slate-800 rounded-xl shadow-2xl border border-slate-700 p-6"
                    >
                      <div className="grid grid-cols-3 gap-6">
                        {item.mega &&
                          item.categories.map((cat) => (
                          <div key={cat.title}>
                            <h4 className="text-white font-semibold mb-3">{cat.title}</h4>
                            <ul className="space-y-2">
                              {cat.items.map((subItem) => (
                                <li key={subItem}>
                                  <a href={`/ai/${subItem.toLowerCase().replace(/\s+/g, '-')}`} className="text-slate-400 hover:text-violet-400 text-sm transition-colors">
                                    {subItem}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* CTA + Mobile Toggle */}
          <div className="flex items-center gap-3">
            <a href="/contact" className="hidden sm:flex px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium transition-colors">
              Get Started
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white">
              {mobileOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-t border-slate-800"
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                >
                  {item.label}
                </a>
              ))}
              <a href="/contact" className="block px-4 py-3 bg-violet-600 text-white text-center rounded-lg font-medium">
                Get Started
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
