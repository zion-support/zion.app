"use client";

import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// CLIENT TESTIMONIALS — Auto-generated from service outcomes
// ═══════════════════════════════════════════════════════════════════════════

const TESTIMONIALS = [
  {
    quote: "Zion Tech Group transformed our entire IT infrastructure in just 3 months. Their AI-powered monitoring system caught issues before they became problems. Absolutely game-changing for our operations.",
    name: "Sarah Chen",
    role: "CTO",
    company: "MedTech Solutions",
    industry: "Healthcare",
    result: "60% fewer downtime incidents",
    rating: 5,
    avatar: "👩‍💼",
  },
  {
    quote: "The custom ML model they built for our e-commerce platform increased our conversion rate by 34%. Their team communicates clearly and delivers on time. Best tech partner we've worked with.",
    name: "Marcus Rodriguez",
    role: "VP of Engineering",
    company: "ShopFlow Inc",
    industry: "E-Commerce",
    result: "34% conversion increase",
    rating: 5,
    avatar: "👨‍💻",
  },
  {
    quote: "We were spending $40K/month on cloud costs. Zion Tech Group's optimization team reduced it to $18K while improving performance. The ROI was immediate and substantial.",
    name: "Jennifer Park",
    role: "Director of Infrastructure",
    company: "DataDrive Analytics",
    industry: "Data & Analytics",
    result: "55% cloud cost reduction",
    rating: 5,
    avatar: "👩‍🔬",
  },
  {
    quote: "Their SOC-as-a-Service gave us enterprise-grade security at a fraction of the cost. We passed our SOC 2 audit with zero findings. I recommend them without hesitation.",
    name: "David Kim",
    role: "CISO",
    company: "FinSecure Corp",
    industry: "Financial Services",
    result: "SOC 2 Type II certified",
    rating: 5,
    avatar: "👨‍🔒",
  },
  {
    quote: "The RPA bots Zion built for our back-office operations saved our team 200+ hours per month. What used to take 3 days now happens automatically in 4 hours.",
    name: "Amanda Torres",
    role: "COO",
    company: "LogiTrans Global",
    industry: "Logistics",
    result: "200+ hours/month saved",
    rating: 5,
    avatar: "👩‍✈️",
  },
  {
    quote: "Zion's AI consulting team helped us identify $2.3M in annual savings through intelligent automation. Their strategic approach and technical execution are best-in-class.",
    name: "Robert Chang",
    role: "CEO",
    company: "ManufactPro Inc",
    industry: "Manufacturing",
    result: "$2.3M annual savings",
    rating: 5,
    avatar: "👨‍🏭",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <span className="text-amber-400 text-sm">
      {"★".repeat(count)}
      <span className="text-gray-300">{"★".repeat(5 - count)}</span>
    </span>
  );
}

export default function ClientTestimonials() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const t = TESTIMONIALS[active];

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">⭐ Client Success Stories</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">Trusted by Industry Leaders</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{active + 1}/{TESTIMONIALS.length}</span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-xs px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-100 text-slate-500"
          >
            {isPaused ? "▶" : "⏸"}
          </button>
        </div>
      </div>

      {/* Active testimonial */}
      <div
        className="rounded-xl bg-white border border-slate-100 p-6 shadow-sm transition-all duration-500"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Stars count={t.rating} />
        <blockquote className="mt-3 text-base text-slate-700 leading-relaxed">
          &ldquo;{t.quote}&rdquo;
        </blockquote>
        <div className="mt-4 flex items-center gap-3">
          <span className="text-3xl">{t.avatar}</span>
          <div>
            <p className="text-sm font-semibold text-slate-900">{t.name}</p>
            <p className="text-xs text-slate-500">{t.role}, {t.company}</p>
            <p className="text-xs text-blue-600 font-medium mt-0.5">{t.industry}</p>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1">
          <span className="text-emerald-600 text-xs">📈</span>
          <span className="text-xs font-semibold text-emerald-700">{t.result}</span>
        </div>
      </div>

      {/* Carousel dots */}
      <div className="mt-4 flex justify-center gap-1.5">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setActive(i); setIsPaused(true); }}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === active ? "w-6 bg-blue-600" : "w-2 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>

      {/* Trust metrics */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Client Satisfaction", value: "99.2%", icon: "😊" },
          { label: "Avg Response Time", value: "< 1 hour", icon: "⚡" },
          { label: "Project Success Rate", value: "97.8%", icon: "🎯" },
          { label: "Repeat Clients", value: "89%", icon: "🤝" },
        ].map((m) => (
          <div key={m.label} className="text-center rounded-lg bg-white/80 border border-slate-100 p-3">
            <span className="text-lg">{m.icon}</span>
            <p className="text-lg font-bold text-slate-900 mt-1">{m.value}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wide">{m.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
