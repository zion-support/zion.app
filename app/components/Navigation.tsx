'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import {
  PRIMARY_NAV_LINKS,
  SOLUTION_LINKS,
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

  // featured services rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex(prev => (prev + 1) % FEATURED_AI_SERVICE_LINKS.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

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
              <div className="absolute top-full right-0 mt-2 w-[500px] rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-purple-500/10 p-4 animate-in fade-in-0 zoom-in-95 backdrop-blur-md">
                <div className="grid grid-cols-2 gap-2">
                  {/* Industry cards */}
                  {[
                    { name:'Healthcare & Life Sciences', emoji:'🏥', desc:'HIPAA-compliant AI, diagnostics, patient engagement', href:'/industry-solutions/' },
                    { name:'Financial Services & FinTech', emoji:'💳', desc:'RegTech, fraud detection, trading bots, KYC', href:'/industry-solutions/' },
                    { name:'Manufacturing & Industrial', emoji:'🏗️', desc:'Predictive maintenance, supply chain, quality AI', href:'/industry-solutions/' },
                    { name:'Retail & E-Commerce', emoji:'🛒', desc:'Recommendation engines, inventory AI, dynamic pricing', href:'/industry-solutions/' },
                    { name:'Technology & SaaS', emoji:'🏭', desc:'Dev tools, platform engineering, micro-SaaS', href:'/industry-solutions/' },
                    { name:'Logistics & Supply Chain', emoji:'🚚', desc:'Route optimization, warehouse automation, tracking', href:'/industry-solutions/' },
                  ].map((ind, i) => (
                    <Link key={i} href={ind.href} onClick={() => setSolutionsOpen(false)}
                      className="block px-3 py-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 hover:border-purple-500/30 hover:bg-slate-800/70 transition-all group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{ind.emoji}</span>
                        <span className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{ind.name}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 ml-8">{ind.desc}</p>
                    </Link>
                  ))}
                  {/* Category quick-links */}
                  <Link href="/services/?category=ai" onClick={() => setSolutionsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-purple-400 bg-purple-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors"
                  >🧠 AI Services</Link>
                  <Link href="/services/?category=it" onClick={() => setSolutionsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors"
                  >🖥️ IT Services</Link>
                  <Link href="/services/?category=cloud" onClick={() => setSolutionsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 hover:border-sky-500/40 transition-colors"
                  >☁️ Cloud Services</Link>
                  <Link href="/services/?category=security" onClick={() => setSolutionsOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 hover:border-orange-500/40 transition-colors"
                  >🔐 Security</Link>
                </div>
                <div className="border-t border-slate-800 mt-3 pt-3 flex items-center gap-2">
                  <Link href="/services/" onClick={() => setSolutionsOpen(false)}
                    className="flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors border border-purple-500/20"
                  >All Services →</Link>
                  <Link href="/industry-solutions/" onClick={() => setSolutionsOpen(false)}
                    className="flex-1 text-center px-3 py-1.5 rounded-lg text-xs font-semibold text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors border border-purple-500/20"
                  >All Industries →</Link>
                </div>
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
              <div className="absolute top-full right-0 mt-2 w-[700px] rounded-xl bg-slate-900/95 border border-slate-700/80 shadow-2xl shadow-purple-500/10 p-4 animate-in fade-in-0 zoom-in-95 backdrop-blur-md max-h-[85vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                  {/* AI & Automation */}
                  <div>
                    <Link href="/services/?category=ai" onClick={() => setServicesOpen(false)}
                      className="block px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 hover:border-purple-500/40 transition-colors">
                      <div className="text-xs font-bold uppercase tracking-wider text-purple-400">🧠 AI & Automation</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">ML, NLP, CV, RPA, agents</div>
                    </Link>
                  </div>
                  {/* IT & Infrastructure */}
                  <div>
                    <Link href="/services/?category=it" onClick={() => setServicesOpen(false)}
                      className="block px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-colors">
                      <div className="text-xs font-bold uppercase tracking-wider text-blue-400">🖥️ IT & Infrastructure</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">DevOps, SRE, networking, security</div>
                    </Link>
                  </div>
                  {/* Cloud & DevOps */}
                  <div>
                    <Link href="/services/?category=cloud" onClick={() => setServicesOpen(false)}
                      className="block px-3 py-2 rounded-lg bg-gradient-to-r from-sky-500/10 to-blue-500/10 border border-sky-500/20 hover:border-sky-500/40 transition-colors">
                      <div className="text-xs font-bold uppercase tracking-wider text-sky-400">☁️ Cloud & DevOps</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Kubernetes, CI/CD, migrations</div>
                    </Link>
                  </div>
                  {/* Security */}
                  <div>
                    <Link href="/services/?category=security" onClick={() => setServicesOpen(false)}
                      className="block px-3 py-2 rounded-lg bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 hover:border-red-500/40 transition-colors">
                      <div className="text-xs font-bold uppercase tracking-wider text-red-400">🔐 Security & Compliance</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Penetration testing, IAM, SIEM</div>
                    </Link>
                  </div>
                  {/* Data */}
                  <div>
                    <Link href="/services/?category=data" onClick={() => setServicesOpen(false)}
                      className="block px-3 py-2 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition-colors">
                      <div className="text-xs font-bold uppercase tracking-wider text-green-400">📊 Data & Analytics</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">ETL, BI, data lakes, streaming</div>
                    </Link>
                  </div>
                  {/* Automation */}
                  <div>
                    <Link href="/services/?category=automation" onClick={() => setServicesOpen(false)}
                      className="block px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 hover:border-pink-500/40 transition-colors">
                      <div className="text-xs font-bold uppercase tracking-wider text-pink-400">🤖 Automation</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Workflows, RPA, process mining</div>
                    </Link>
                  </div>
                </div>

                {/* Featured actions */}
                <div className="border-t border-slate-800 my-3 pt-3 flex items-center gap-2">
                  <Link href="/services/" onClick={() => setServicesOpen(false)}
                    className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors border border-purple-500/20">
                    Browse All Services →
                  </Link>
                  <Link href="/ai-services/" onClick={() => setServicesOpen(false)}
                    className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition-colors border border-pink-500/20">
                    AI Services Hub →
                  </Link>
                  <Link href="/tools/" onClick={() => setServicesOpen(false)}
                    className="flex-1 text-center px-3 py-2 rounded-lg text-sm font-medium text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors border border-purple-500/20">
                    Free Tools →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Primary nav links */}
          {/* Hardcoded primary links (Home already in logo area) */}
          <NavLink
            key="blog"
            link={{ name: 'Blog', href: '/blog/' }}
          />

          {/* Remaining primary links from constants */}
          {PRIMARY_NAV_LINKS.filter(l => l.href !== '/' && l.href !== '/services' && l.href !== '/solutions').map((link, i) => (
            <NavLink key={i} link={link} />
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
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-xl px-4 py-5 space-y-1 animate-in fade-in-0 slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
          {/* Primary nav */}
          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2 mt-1">Menu</div>
          <NavLink link={{ name: 'Home', href: '/' }} />
          <NavLink link={{ name: 'Services', href: '/services/' }} />
          <NavLink link={{ name: 'AI Services Hub', href: '/ai-services/' }} />
          <NavLink link={{ name: 'Industry Solutions', href: '/industry-solutions/' }} />
          <NavLink link={{ name: 'Blog', href: '/blog/' }} />
          <NavLink link={{ name: 'Pricing', href: '/pricing/' }} />
          <NavLink link={{ name: 'Tools', href: '/tools/' }} />
          <NavLink link={{ name: 'Partners', href: '/partners/' }} />
          <NavLink link={{ name: 'Contact', href: '/contact/' }} />

          <div className="border-t border-slate-800 my-3" />

          {/* Featured AI */}
          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Popular Services</div>
          {FEATURED_AI_SERVICE_LINKS.slice(featuredIndex, featuredIndex + 6).map((link, i) => (
            <NavLink key={i} link={link} />
          ))}

          <div className="border-t border-slate-800 my-3" />
          <NavLink link={{ name: 'Client Portal', href: '/portal/' }} />
          <NavLink link={{ name: 'Search', href: '/search/' }} />
          <NavLink link={{ name: 'System Status', href: '/status/' }} />

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
              href="/contact/"
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