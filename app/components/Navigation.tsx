'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  PRIMARY_NAV_LINKS,
  SOLUTION_LINKS,
  RESOURCE_LINKS,
  FEATURED_AI_SERVICE_LINKS,
  type NavigationLink,
} from '@/constants/navigation';

const SITE_TITLE = 'Zion Tech Group';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href) ?? false;
  }

  function NavLink({ link }: { link: NavigationLink }) {
    const active = isActive(link.href);
    return (
      <Link
        href={link.href}
        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
          active
            ? 'text-purple-400 bg-purple-500/10'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
        }`}
        onClick={() => setMobileOpen(false)}
      >
        {link.name}
      </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main navigation">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0" aria-label="Zion Tech Group home">
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {SITE_TITLE}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Solutions dropdown */}
          <div className="relative group">
            <button
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1"
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              aria-expanded={solutionsOpen}
            >
              Solutions ▾
            </button>
            {solutionsOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 animate-in fade-in-0 zoom-in-95">
                {SOLUTION_LINKS.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800"
                    onClick={() => setSolutionsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <div className="border-t border-slate-800 my-1" />
                <Link href="/services" className="block px-3 py-2 rounded-lg text-sm text-purple-400 hover:text-purple-300" onClick={() => setSolutionsOpen(false)}>
                  All Services →
                </Link>
              </div>
            )}
          </div>

          {/* Services dropdown */}
          <div className="relative group">
            <button
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1"
              onClick={() => setServicesOpen(!servicesOpen)}
              aria-expanded={servicesOpen}
            >
              Services ▾
            </button>
            {servicesOpen && (
              <div className="absolute top-full right-0 mt-1 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 animate-in fade-in-0 zoom-in-95">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">Featured AI</div>
                {FEATURED_AI_SERVICE_LINKS.slice(0, 6).map((link, i) => (
                  <Link key={i} href={link.href} className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800" onClick={() => setServicesOpen(false)}>
                    {link.name}
                  </Link>
                ))}
                <div className="border-t border-slate-800 my-1" />
                <Link href="/services" className="block px-3 py-2 rounded-lg text-sm text-purple-400 hover:text-purple-300" onClick={() => setServicesOpen(false)}>
                  All (491, 235, 85)+ Services →
                </Link>
              </div>
            )}
          </div>

          {/* Primary nav links */}
          {PRIMARY_NAV_LINKS.filter(l => l.href !== '/' && l.href !== '/services' && l.href !== '/solutions').map((link, i) => (
            <NavLink key={i} link={link} />
          ))}

          {/* CTA */}
          <Link href="/contact" className="ml-2 px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-sm font-semibold text-white hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/25">
            Get Free Consultation
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen
              ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            }
          </svg>
        </button>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-3 animate-in fade-in-0 slide-in-from-top-2">
          <NavLink link={{ name: 'Home', href: '/' }} />
          <NavLink link={{ name: 'Services', href: '/services' }} />
          <NavLink link={{ name: 'Solutions', href: '/solutions' }} />
          <NavLink link={{ name: 'Pricing', href: '/pricing' }} />
          <NavLink link={{ name: 'Contact', href: '/contact' }} />
          <div className="border-t border-slate-800 pt-2">
            <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Featured AI</div>
            {FEATURED_AI_SERVICE_LINKS.slice(0, 4).map((link, i) => (
              <NavLink key={i} link={link} />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
