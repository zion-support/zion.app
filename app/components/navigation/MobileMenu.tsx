'use client';

import Link from 'next/link';
import { FEATURED_AI_SERVICE_LINKS } from '@/constants/navigation';
import { NavLink } from './NavLinkItem';
import type { MobileMenuProps } from './types';

const PHONE = '+1 302 464 0950';
const EMAIL = 'kleber@ziontechgroup.com';

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  if (!open) return null;

  const featuredCount = FEATURED_AI_SERVICE_LINKS.length;
  const featuredSlice = FEATURED_AI_SERVICE_LINKS.slice(0, Math.min(6, featuredCount));

  return (
    <div className="lg:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-xl px-4 py-5 space-y-1 animate-in fade-in-0 slide-in-from-top-2 max-h-[85vh] overflow-y-auto">
      {/* Primary nav */}
      <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2 mt-1">Menu</div>
      <NavLink link={{ name: 'Home', href: '/' }} onNavigate={onClose} />
      <NavLink link={{ name: 'Services', href: '/services/' }} onNavigate={onClose} />
      <NavLink link={{ name: 'AI Services Hub', href: '/ai-services/' }} onNavigate={onClose} />
      <NavLink link={{ name: 'Industry Solutions', href: '/industry-solutions/' }} onNavigate={onClose} />
      <NavLink link={{ name: 'Blog', href: '/blog/' }} onNavigate={onClose} />
      <NavLink link={{ name: 'Pricing', href: '/pricing/' }} onNavigate={onClose} />
      <NavLink link={{ name: 'Tools', href: '/tools/' }} onNavigate={onClose} />
      <NavLink link={{ name: 'Partners', href: '/partners/' }} onNavigate={onClose} />
      <NavLink link={{ name: 'Contact', href: '/contact/' }} onNavigate={onClose} />

      <div className="border-t border-slate-800 my-3" />

      {/* Featured AI */}
      <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Popular Services</div>
      {featuredSlice.map((link, i) => (
        <NavLink key={i} link={link} onNavigate={onClose} />
      ))}

      <div className="border-t border-slate-800 my-3" />
      <NavLink link={{ name: 'Client Portal', href: '/portal/' }} onNavigate={onClose} />
      <NavLink link={{ name: 'Search', href: '/search/' }} onNavigate={onClose} />
      <NavLink link={{ name: 'System Status', href: '/status/' }} onNavigate={onClose} />

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
          onClick={onClose}
        >
          Get Free Consultation →
        </Link>
      </div>
    </div>
  );
}