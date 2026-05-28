'use client';

import React from 'react';

const testimonials = [
  {
    quote: "Zion's AI services saved us 40 hours a month. Highly recommended!",
    author: "Sarah Chen",
    title: "CEO",
    company: "TechCorp",
    avatar: "👩‍💼",
    rating: 5,
  },
  {
    quote: "The best IT support team we've ever worked with. 24/7 and always responsive.",
    author: "Marcus Rivera",
    title: "CTO",
    company: "FinanceFlow",
    avatar: "👨‍💻",
    rating: 5,
  },
  {
    quote: "Their cloud migration cut our costs by 60%. Incredible ROI.",
    author: "Jennifer Walsh",
    title: "VP Engineering",
    company: "DataDriven Inc",
    avatar: "👩‍🔬",
    rating: 5,
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 border-t border-slate-800">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold gradient-text mb-3">
            ⭐ What Our Clients Say
          </h2>
          <p className="text-slate-400 text-sm">
            Trusted by businesses across technology, finance, healthcare, and more
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-slate-900/60 border border-slate-700/50 rounded-xl p-6 hover:border-purple-500/30 transition-all duration-300 flex flex-col"
            >
              {/* Quote icon */}
              <div className="text-4xl text-purple-500/30 absolute top-4 right-4">"</div>

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-sm">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-6">
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-slate-700/50 pt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{testimonial.author}</div>
                  <div className="text-xs text-slate-400">{testimonial.title}, {testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View all reviews link */}
        <div className="text-center mt-8">
          <a
            href="/testimonials"
            className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            View all client reviews →
          </a>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
