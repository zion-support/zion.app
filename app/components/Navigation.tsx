'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  PRIMARY_NAV_LINKS,
  FEATURED_AI_SERVICE_LINKS,
  type NavigationLink,
} from '@/constants/navigation';
import { NavLink } from './navigation/NavLinkItem';
import { MobileMenu } from './navigation/MobileMenu';
import { ServiceDropdown } from './navigation/ServiceDropdown';
import { SolutionsDropdown } from './navigation/SolutionsDropdown';

const SITE_TITLE = 'Zion Tech Group';
const PHONE = '+1 302 464 0950';
const EMAIL = 'kleber@ziontechgroup.com';

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const solutionsRef = useRef<HTMLDivElement>(null);
  const [featuredIndex, setFeaturedIndex] = useState(0);

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

  // Featured services rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % FEATURED_AI_SERVICE_LINKS.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  function closeAll() {
    setMobileOpen(false);
    setServicesOpen(false);
    setSolutionsOpen(false);
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
            <SolutionsDropdown
              open={solutionsOpen}
              onClose={() => { setSolutionsOpen(false); setMobileOpen(false); }}
            />
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
            <ServiceDropdown
              open={servicesOpen}
              onClose={() => { setServicesOpen(false); setMobileOpen(false); }}
            />
          </div>

          {/* Primary nav links */}
          {PRIMARY_NAV_LINKS.map((link: NavigationLink, i: number) => (
            <NavLink key={i} link={link} onNavigate={closeAll} />
          ))}

          {/* Search button */}
          <Link
            href="/search/"
            className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            aria-label="Search services"
          >
            <svg className="w-4 h-4 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>

          {/* Desktop CTA */}
          <a
            href={`mailto:${EMAIL}`}
            className="lg:inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 transition-colors"
          >
            ✉ Get Free Consultation
          </a>

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
      <MobileMenu open={mobileOpen} onClose={closeAll} />
    </header>
  );
}