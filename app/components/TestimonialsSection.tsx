'use client';

import { useEffect, useRef, useState } from 'react';
import { testimonials, type Testimonial } from '@/data/testimonials';

const SITE_URL = 'https://ziontechgroup.com';

/* ── AggregateRating + Review JSON-LD ─────────────────── */
function TestimonialSchema({ t }: { t: Testimonial }) {
  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    reviewRating: { '@type': 'Rating', ratingValue: t.rating, bestRating: '5' },
    author: {
      '@type': 'Person',
      name: t.client_name,
      jobTitle: t.role,
      worksFor: { '@type': 'Organization', name: t.company },
    },
    reviewBody: t.review_text,
    itemReviewed: t.service_id
      ? { '@type': 'Service', name: t.service_id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), url: `${SITE_URL}/services/${t.service_id}/` }
      : { '@type': 'Organization', name: 'Zion Tech Group', url: SITE_URL },
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
    />
  );
}

/* ── Star rating ──────────────────────────────────────── */
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={`text-base leading-none ${i < rating ? 'opacity-100' : 'opacity-25'}`}>
          ★
        </span>
      ))}
    </div>
  );
}

/* ── Featured badge ───────────────────────────────────── */
function FeaturedPill() {
  return (
    <span className="inline-flex items-center gap-1 bg-yellow-500/15 text-yellow-300 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-yellow-500/25">
      ⭐ Featured
    </span>
  );
}

/* ── Main component ───────────────────────────────────── */
const FEATURED_IDS = new Set(testimonials.filter(t => t.featured).map(t => t.id));

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [animatedIds, setAnimatedIds] = useState<Set<string>>(new Set());

  // IntersectionObserver — trigger section fade-in
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

  // Stagger card animations
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => {
      setAnimatedIds(new Set(FEATURED_IDS));
    }, 200);
    return () => clearTimeout(timer);
  }, [visible]);

  const displayed = [...testimonials].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.rating - a.rating;
  });

  return (
    <section
      ref={sectionRef}
      className={`py-16 md:py-20 border-t border-slate-800/50 transition-all duration-700 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* ── Header ─────────────────────────────── */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
            💬 What Clients Say
          </h2>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
            Trusted by engineering teams, security operations, and innovation leaders across industries.
          </p>
        </div>

        {/* ── Cards grid ─────────────────────────── */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayed.map((t, i) => {
            const delay = t.featured ? 0 : i * 80;
            const show  = animatedIds.has(t.id) || FEATURED_IDS.has(t.id);
            return (
              <div
                key={t.id}
                className={`
                  relative bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6
                  transition-all duration-500 hover:border-blue-500/30 hover:bg-slate-800/70
                  ${t.featured ? 'ring-1 ring-yellow-500/20 md:col-span-2 lg:col-span-1' : ''}
                  ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
                `}
                style={{ transitionDelay: `${delay}ms` }}
              >
                {t.featured && <FeaturedPill />}

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl flex-shrink-0">{t.avatar_emoji}</span>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm truncate">{t.client_name}</p>
                    <p className="text-slate-500 text-xs truncate">{t.role} · {t.company}</p>
                  </div>
                </div>

                <Stars rating={t.rating} />

                <blockquote className="mt-3 text-slate-300 text-sm leading-relaxed line-clamp-4">
                  “{t.review_text}”
                </blockquote>

                {/* Service reference badge */}
                {t.service_id && (
                  <div className="mt-4 pt-3 border-t border-slate-700/50">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                      Service used:{' '}
                    </span>
                    <span className="text-[10px] text-blue-400 uppercase tracking-wider">
                      {t.service_id.replace(/-/g, ' ')}
                    </span>
                  </div>
                )}

                {/* Per-card Review JSON-LD */}
                <TestimonialSchema t={t} />
              </div>
            );
          })}
        </div>

        {/* ── AggregateRating JSON-LD (for SERP stars) ── */}
        <AggregateRatingSchema testimonials={displayed} />
      </div>
    </section>
  );
}

/* ── Global AggregateRating ─────────────────────────────── */
function AggregateRatingSchema({ testimonials }: { testimonials: Testimonial[] }) {
  const total  = testimonials.length;
  const sum    = testimonials.reduce((acc, t) => acc + t.rating, 0);
  const avg    = (sum / total).toFixed(1);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Zion Tech Group',
    url: SITE_URL,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue:   avg,
      reviewCount:   total,
      bestRating:    '5',
      worstRating:   '1',
    },
  };

  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
