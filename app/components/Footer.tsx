import React, { memo } from 'react';
import Link from 'next/link';
import MonetizationBar from './MonetizationBar';
import { ArrowRight, Phone, MapPin, Sparkles, Mail, Link as LinkIcon, X, GitBranch } from 'lucide-react';
import {
  AI_SERVICE_LINKS,
  FEATURED_PRODUCT_LINKS,
  RESOURCE_LINKS,
} from '../constants/navigation';
import { CONTACT_INFO, SOCIAL_LINKS } from '../utils/seoConstants';

interface FooterProps {
  className?: string;
  children?: React.ReactNode;
}

const footerLinkClass =
  'inline-block text-sm text-gray-400 transition duration-200 hover:translate-x-1 hover:text-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

const footerChipLinkClass =
  'rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-purple-400 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

const Footer: React.FC<FooterProps> = memo(({ className = '', children }) => {
  const currentYear = new Date().getFullYear();
  const aiServices = AI_SERVICE_LINKS.slice(0, 8);
  const featuredProducts = FEATURED_PRODUCT_LINKS.slice(0, 6);

  const itServices = [
    { name: 'Cybersecurity Audit', href: '/it-services/cybersecurity-audit' },
  ];

  // Use RESOURCE_LINKS from navigation constants (single source of truth)
  const resourceLinks = [
    ...RESOURCE_LINKS,
    { name: 'Solutions', href: '/solutions' },
    { name: 'Services', href: '/services' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Digital Products', href: '/digital-products' },
  ].filter((link, idx, arr) => arr.findIndex((l) => l.href === link.href) === idx);

  return (
    <footer
      id="site-footer"
      aria-label="Site footer"
      className={`relative border-t border-purple-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-purple-900/5 to-transparent" />

      {children || (
        <>
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="relative mb-14 overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-900/40 via-fuchsia-900/30 to-pink-900/40 p-7 sm:p-10">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(168,85,247,0.12),transparent_60%)]" aria-hidden="true" />
              <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-200">
                    Plan your next release
                  </p>
                  <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                    Need a practical AI roadmap for your team?
                  </h3>
                  <p className="mt-3 max-w-2xl text-sm text-slate-100 leading-relaxed">
                    Work with Zion specialists to scope priorities, align architecture, and launch
                    measurable outcomes faster.
                  </p>
                </div>
                <a
                  href="/contact"
                  data-cta-event="cta_discovery"
                  data-cta-label="footer_book_call"
                  className="inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-lg transition hover:bg-slate-100 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                >
                  Book Discovery Call
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">
              <div className="space-y-5 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 blur-sm opacity-75" />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                      <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <h2
                    id="footer-brand-heading"
                    className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-xl font-bold text-transparent"
                  >
                    Zion Tech Group
                  </h2>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Leading provider of AI-powered solutions and IT services for modern businesses.
                  Transform your operations with cutting-edge technology.
                </p>
                <div className="flex flex-wrap gap-2" aria-label="Quick links">
                  {resourceLinks.slice(0, 3).map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className={footerChipLinkClass}
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-3 pt-1" aria-label="Social media links">
                  <a
                    href={SOCIAL_LINKS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 text-gray-400 transition hover:border-purple-400 hover:text-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    aria-label="LinkedIn"
                  >
                    <aIcon className="h-4 w-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 text-gray-400 transition hover:border-purple-400 hover:text-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    aria-label="X (Twitter)"
                  >
                    <X className="h-4 w-4" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-slate-900/70 text-gray-400 transition hover:border-purple-400 hover:text-purple-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                    aria-label="GitHub"
                  >
                    <GitBranch className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <nav className="space-y-4" aria-labelledby="footer-ai-services-heading">
                <h3 id="footer-ai-services-heading" className="text-lg font-semibold text-white">
                  AI Services
                </h3>
                <ul className="space-y-2.5">
                  {aiServices.map((service) => (
                    <li key={service.href}>
                      <a href={service.href} className={footerLinkClass}>
                        {service.name}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="/ai-services" className={`${footerLinkClass} font-medium text-purple-300`}>
                      View all AI services →
                    </a>
                  </li>
                </ul>
              </nav>

              <nav className="space-y-4" aria-labelledby="footer-products-heading">
                <h3 id="footer-products-heading" className="text-lg font-semibold text-white">
                  Products
                </h3>
                <ul className="space-y-2.5">
                  {featuredProducts.map((product) => (
                    <li key={product.href}>
                      <a href={product.href} className={footerLinkClass}>
                        {product.name}
                      </a>
                    </li>
                  ))}
                  <li>
                    <a href="/products" className={`${footerLinkClass} font-medium text-purple-300`}>
                      View all products →
                    </a>
                  </li>
                </ul>
              </nav>

              <nav className="space-y-4" aria-labelledby="footer-company-heading">
                <h3 id="footer-company-heading" className="text-lg font-semibold text-white">
                  Company & Resources
                </h3>
                <ul className="space-y-2.5">
                  {resourceLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} className={footerLinkClass}>
                        {link.name}
                      </a>
                    </li>
                  ))}
                  {itServices.map((service) => (
                    <li key={service.href}>
                      <a href={service.href} className={footerLinkClass}>
                        {service.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="space-y-4">
                <h3 id="footer-contact-heading" className="text-lg font-semibold text-white">
                  Contact
                </h3>
                <address className="space-y-3 not-italic" aria-labelledby="footer-contact-heading">
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\D/g, '')}`}
                    className="group flex items-start space-x-3 text-sm text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    <Phone
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400 transition-colors group-hover:text-purple-300"
                      aria-hidden="true"
                    />
                    <span className="group-hover:text-gray-300 transition-colors">{CONTACT_INFO.phone}</span>
                  </a>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="group flex items-start space-x-3 text-sm text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    <Mail
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400 transition-colors group-hover:text-purple-300"
                      aria-hidden="true"
                    />
                    <span className="group-hover:text-gray-300 transition-colors break-all">{CONTACT_INFO.email}</span>
                  </a>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${CONTACT_INFO.address.street}, ${CONTACT_INFO.address.city}, ${CONTACT_INFO.address.state} ${CONTACT_INFO.address.zipCode}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start space-x-3 text-sm text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
                  >
                    <MapPin
                      className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400 transition-colors group-hover:text-purple-300"
                      aria-hidden="true"
                    />
                    <span className="group-hover:text-gray-300 transition-colors">
                      {CONTACT_INFO.address.street}, {CONTACT_INFO.address.city}, {CONTACT_INFO.address.state}{' '}
                      {CONTACT_INFO.address.zipCode}
                    </span>
                  </a>
                </address>
              </div>
            </div>

            <div className="mt-12 border-t border-purple-500/20 pt-8">
      <MonetizationBar />
              <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                <p className="text-gray-400 text-sm">
                  © {currentYear} Zion Tech Group. All rights reserved.
                </p>
                <nav className="flex space-x-6 text-sm" aria-label="Legal">
                  <a href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
                    Terms of Service
                  </a>
                  <a href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
                    Privacy Policy
                  </a>
                  <a href="#main-content" className="text-gray-400 hover:text-purple-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
                    Back to content
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </>
      )}
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;