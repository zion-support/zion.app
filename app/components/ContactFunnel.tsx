'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const SITE_URL   = 'https://ziontechgroup.com';
const PHONE      = '+1 302 464 0950';
const EMAIL      = 'kleber@ziontechgroup.com';
const ADDRESS    = '364 E Main St STE 1008, Middletown, DE 19709, USA';
const MAPS_URL   = 'https://maps.google.com/?q=364+E+Main+St+STE+1008+Middletown+DE+19709';

/* ── Schema.org ContactPoint + Place JSON-LD ─────────── */
function ContactSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Zion Tech Group',
    url: SITE_URL,
    telephone: PHONE,
    email: EMAIL,
    address: {
      '@type': 'PostalAddress',
      streetAddress: '364 E Main St STE 1008',
      addressLocality: 'Middletown',
      addressRegion: 'DE',
      postalCode: '19709',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '39.4498',
      longitude: '-75.7140',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: PHONE,
        contactType: 'customer service',
        email: EMAIL,
        availableLanguage: ['English', 'Portuguese'],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ── Animated CTA Button ───────────────────────────────── */
function PulsingCTA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex items-center gap-2 bg-blue-600 text-white px-7 py-3.5
                 rounded-xl font-semibold text-base
                 shadow-lg shadow-blue-600/25
                 hover:bg-blue-500 hover:shadow-blue-500/35
                 active:scale-[0.97]
                 transition-all duration-200"
    >
      <span className="absolute inset-0 rounded-xl bg-blue-400 opacity-0 group-hover:opacity-10 blur-xl transition-opacity" />
      {children}
      <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none"
           stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

/* ── Click-to-call / email / maps button ───────────────── */
function DirectAction({
  href, icon, label, sub,
}: { href: string; icon: React.ReactNode; label: string; sub: string }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-3 p-4 rounded-xl bg-slate-800/50 border border-slate-700/60
                 hover:bg-slate-800/80 hover:border-blue-500/30
                 transition-all"
    >
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors">{label}</p>
        <p className="text-slate-500 text-xs">{sub}</p>
      </div>
    </a>
  );
}

/* ── Main component ────────────────────────────────────── */
export default function ContactFunnel() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Fade-in on scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) setVisible(true); },
      { threshold: 0.08 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`py-16 md:py-20 border-t border-slate-800/50 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <ContactSchema />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">

        {/* ── Heading ─────────────────────────────── */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            Let&apos;s Build Something Great
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Ready to transform your business? Reach out directly — no forms, no wait, no hype.
          </p>
        </div>

        {/* ── Primary CTA ─────────────────────────── */}
        <div className="text-center mb-10">
          <PulsingCTA href="/contact/">
            🚀 Book a Free 30-Min Consultation
          </PulsingCTA>
          <p className="mt-3 text-slate-600 text-xs">No commitment required — we&apos;ll map your roadmap together.</p>
        </div>

        {/* ── Direct action buttons (4-column grid) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

          <DirectAction
            href={`tel:${PHONE.replace(/\s+/g, '')}`}
            icon={<span>📞</span>}
            label={PHONE}
            sub="Click to call"
          />

          <DirectAction
            href={`mailto:${EMAIL}?subject=Zion%20Tech%20Group%20Inquiry&body=Hi%20Kleber,%0A%0AI%27m%20interested%20in%20learning%20more%20about%20your%20services.%0A%0A`}
            icon={<span>✉️</span>}
            label={EMAIL}
            sub="Pre-filled email"
          />

          <DirectAction
            href={MAPS_URL}
            icon={<span>📍</span>}
            label="Office Location"
            sub="Middletown, DE 19709"
          />

          <DirectAction
            href="/status/"
            icon={<span>📊</span>}
            label="System Status"
            sub="24/7 uptime monitoring"
          />
        </div>

        {/* ── Office address + hours ───────────────── */}
        <div className="text-center text-slate-500 text-sm max-w-md mx-auto space-y-1">
          <p>🏢 {ADDRESS}</p>
          <p>🕐 Mon – Fri, 8 AM – 6 PM EST</p>
        </div>

      </div>
    </section>
  );
}
