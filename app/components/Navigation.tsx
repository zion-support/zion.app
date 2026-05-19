'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  PRIMARY_NAV_LINKS,
  SOLUTION_LINKS,
  RESOURCE_LINKS,
  FEATURED_AI_SERVICE_LINKS,
  type NavigationLink,
} from '@/constants/navigation';

const SITE_TITLE = 'Zion Tech Group';
const PHONE = '+1 302 464 0950';
const EMAIL = 'kleber@ziontechgroup.com';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) setServicesOpen(false);
      if (solutionsRef.current && !solutionsRef.current.contains(e.target as Node)) setSolutionsOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function isActive(href: string): boolean {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
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
        onClick={() => { setMobileOpen(false); setServicesOpen(false); setSolutionsOpen(false); }}
      >
        {link.name}
      </Link>
    );
  }

  function DropdownItem({ link }: { link: NavigationLink }) {
    const active = isActive(link.href);
    return (
      <Link
        href={link.href}
        onClick={() => { setMobileOpen(false); setServicesOpen(false); setSolutionsOpen(false); }}
        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
          active
            ? 'text-purple-400 bg-purple-500/10'
            : 'text-slate-300 hover:text-white hover:bg-slate-800'
        }`}
      >
        {link.name}
      </Link>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-slate-950/90 backdrop-blur-xl">
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main navigation">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 shrink-0"
          aria-label="Zion Tech Group home"
          onClick={() => setMobileOpen(false)}
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            {SITE_TITLE}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Solutions dropdown */}
          <div className="relative" ref={solutionsRef}>
            <button
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1"
              onClick={() => { setSolutionsOpen(!solutionsOpen); setServicesOpen(false); }}
              aria-expanded={solutionsOpen}
            >
              Solutions {solutionsOpen ? '▴' : '▾'}
            </button>
            {solutionsOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-purple-500/10 p-2 animate-in fade-in-0 zoom-in-95 backdrop-blur-md">
                {SOLUTION_LINKS.map((link, i) => (
                  <DropdownItem key={i} link={link} />
                ))}
                <div className="border-t border-slate-800 my-1" />
                <Link
                  href="/services"
                  className="block px-3 py-2 rounded-lg text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors font-medium"
                  onClick={() => setSolutionsOpen(false)}
                >
                  All Services →
                </Link>
                <Link
                  href="/industry-solutions"
                  className="block px-3 py-2 rounded-lg text-sm text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                  onClick={() => setSolutionsOpen(false)}
                >
                  Industry Solutions →
                </Link>
              </div>
            )}
          </div>

          {/* Services dropdown */}
          <div className="relative" ref={servicesRef}>
            <button
              className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1"
              onClick={() => { setServicesOpen(!servicesOpen); setSolutionsOpen(false); }}
              aria-expanded={servicesOpen}
            >
              Services {servicesOpen ? '▴' : '▾'}
            </button>
            {servicesOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-purple-500/10 p-2 animate-in fade-in-0 zoom-in-95 backdrop-blur-md max-h-[70vh] overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  AI & Automation
                </div>
                {FEATURED_AI_SERVICE_LINKS.slice(0, 6).map((link, i) => (
                  <DropdownItem key={i} link={link} />
                ))}
                <div className="border-t border-slate-800 my-1" />
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  More
                </div>
                <Link
                  href="/services"
                  className="block px-3 py-2 rounded-lg text-sm text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors font-medium"
                  onClick={() => setServicesOpen(false)}
                >
                  Browse All 626+ →
                </Link>
                <Link
                  href="/ai-services"
                  className="block px-3 py-2 rounded-lg text-sm text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition-colors"
                  onClick={() => setServicesOpen(false)}
                >
                  AI Services Hub →
                </Link>
              </div>
            )}
          </div>

          {/* Primary nav links */}
          {PRIMARY_NAV_LINKS.filter(l => l.href !== '/' && l.href !== '/services' && l.href !== '/solutions').map((link, i) => (
            <NavLink key={i} link={link} />
          ))}

          <div className="w-px h-6 bg-slate-700 mx-1" />
          <a
            href={`tel:${PHONE.replace(/\s/g, '')}`}
            className="text-sm text-slate-400 hover:text-purple-400 transition-colors px-2"
          >
            ☎ {PHONE}
          </a>
        </div>

        {/* Mobile hamburger + CTA */}
        <div className="flex items-center gap-2">
          <a
            href={`tel:${PHONE.replace(/\s/g, '')}`}
            className="sm:hidden text-sm text-purple-400 font-medium"
          >
            ☎
          </a>
          <button
            className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-xl px-4 py-5 space-y-1 animate-in fade-in-0 slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
          {/* Primary nav */}
          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2 mt-1">Menu</div>
          <NavLink link={{ name: 'Home', href: '/' }} />
          <NavLink link={{ name: 'Services', href: '/services' }} />
          <NavLink link={{ name: 'AI Services Hub', href: '/ai-services' }} />
          <NavLink link={{ name: 'Solutions', href: '/solutions' }} />
          <NavLink link={{ name: 'Industry Solutions', href: '/industry-solutions' }} />
          <NavLink link={{ name: 'Pricing', href: '/pricing' }} />
          <NavLink link={{ name: 'Tools', href: '/tools' }} />
          <NavLink link={{ name: 'Contact', href: '/contact' }} />

          <div className="border-t border-slate-800 my-3" />

          {/* Featured AI */}
          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Popular Services</div>
          {FEATURED_AI_SERVICE_LINKS.slice(0, 8).map((link, i) => (
            <NavLink key={i} link={link} />
          ))}

          <div className="border-t border-slate-800 my-3" />
          <NavLink link={{ name: 'Client Portal', href: '/portal' }} />
          <NavLink link={{ name: 'Search', href: '/search' }} />
          <NavLink link={{ name: 'System Status', href: '/status' }} />

          <div className="border-t border-slate-800 my-3" />
          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Get In Touch</div>
          <a
            href={`tel:${PHONE.replace(/\s/g, '')}`}
            className="block px-3 py-2.5 rounded-lg text-sm text-purple-400 hover:bg-purple-500/10 transition-colors"
          >
            ☎ {PHONE}
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="block px-3 py-2.5 rounded-lg text-sm text-pink-400 hover:bg-pink-500/10 transition-colors"
          >
            ✉ {EMAIL}
          </a>
          <div className="pt-2">
            <Link
              href="/contact"
              className="block w-full text-center bg-gradient-to-r from-purple-600 to-pink-600 px-5 py-3 rounded-lg text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Get Free Consultation →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
