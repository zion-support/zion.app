'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleServices = () => setIsServicesOpen(!isServicesOpen);

  const CATEGORIES = [
    { key: 'ai',        label: 'AI Services',        emoji: '🧠', color: 'from-purple-500 to-indigo-500' },
    { key: 'it',        label: 'IT Services',         emoji: '🖥️', color: 'from-blue-500 to-cyan-500' },
    { key: 'cloud',     label: 'Cloud Services',       emoji: '☁️', color: 'from-sky-400 to-blue-600' },
    { key: 'security',  label: 'Security Services',     emoji: '🔐', color: 'from-red-500 to-orange-500' },
    { key: 'data',      label: 'Data Analytics',        emoji: '📊', color: 'from-green-500 to-emerald-500' },
    { key: 'automation',label: 'Automation',            emoji: '🤖', color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-emerald-400">
              Zion Tech Group
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                href="/"
                className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>

              {/* Services Dropdown */}
              <div className="relative group">
                <button
                  onClick={toggleServices}
                  className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                >
                  Services
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>

                {/* Always show 6 categories on hover/focus; click also works */}
                <div
                  className="absolute left-0 mt-2 w-80 max-h-[80vh] overflow-y-auto bg-slate-800 rounded-md shadow-xl py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ring-1 ring-slate-700"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  {CATEGORIES.map(cat => (
                    <Link
                      key={cat.key}
                      href={`/services?category=${cat.key}`}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700/80 transition-colors"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <span className="flex-1">{cat.label}</span>
                      <span className="text-xs text-slate-500">→</span>
                    </Link>
                  ))}

                  <div className="border-t border-slate-700/60 my-1.5" />

                  {/* Tools & Pages */}
                  <Link
                    href="/services-explorer"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700/80 transition-colors"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    <span className="text-lg">🔍</span>
                    <span className="flex-1">Service Explorer</span>
                    <span className="text-xs text-slate-500">→</span>
                  </Link>
                  <Link
                    href="/service-comparison"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700/80 transition-colors"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    <span className="text-lg">⚖️</span>
                    <span className="flex-1">Compare Services</span>
                    <span className="text-xs text-slate-500">→</span>
                  </Link>
                  <Link
                    href="/configurator"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-300 hover:bg-emerald-500/10 font-medium transition-colors"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    <span className="text-lg">⚙️</span>
                    <span className="flex-1">Configurator</span>
                    <span className="text-xs text-emerald-400/80">Get Proposal →</span>
                  </Link>
                  <Link
                    href="/proposals"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700/80 transition-colors"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    <span className="text-lg">📄</span>
                    <span className="flex-1">Proposals</span>
                    <span className="text-xs text-slate-500">→</span>
                  </Link>
                  <Link
                    href="/services"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700/80 transition-colors"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    <span className="text-lg">🛠️</span>
                    <span className="flex-1">View All Services</span>
                    <span className="text-xs text-slate-500">→</span>
                  </Link>
                  <Link
                    href="/micro-saas"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-emerald-400 hover:bg-slate-700/80 transition-colors border-t border-slate-700/40 pt-2.5 mt-0.5"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    <span className="text-lg">🚀</span>
                    <span className="flex-1">View All Micro-SaaS</span>
                    <span className="text-xs text-slate-500">→</span>
                  </Link>
                </div>
              </div>

              <Link
                href="/contact"
                className="text-gray-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              href="/configurator"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-emerald-400 p-2 rounded-md"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800 rounded-md mt-2">
              <Link
                href="/"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                About
              </Link>
              {/* Mobile: 6 categories */}
              {CATEGORIES.map(cat => (
                <Link
                  key={cat.key}
                  href={`/services?category=${cat.key}`}
                  className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleMenu}
                >
                  {cat.emoji} {cat.label}
                </Link>
              ))}
              <Link
                href="/services-explorer"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                🔍 Service Explorer
              </Link>
              <Link
                href="/service-comparison"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                ⚖️ Compare Services
              </Link>
              <Link
                href="/configurator"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                ⚙️ Configurator
              </Link>
              <Link
                href="/proposals"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                📄 Proposals
              </Link>
              <Link
                href="/services"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                🛠️ All Services
              </Link>
              <Link
                href="/micro-saas"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                🚀 All Micro-SaaS
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-emerald-400 block px-3 py-2 rounded-md text-base font-medium"
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <Link
                href="/configurator"
                className="bg-emerald-600 hover:bg-emerald-700 text-white block px-3 py-2 rounded-md text-base font-medium mt-4"
                onClick={toggleMenu}
              >
                ⚡ Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;