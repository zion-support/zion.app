import React from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Free Consulting Sessions',
  description: 'Book a free 15‑minute consulting call via Calendly (free tier).',
};

export default function ConsultingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 text-center text-slate-100">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">Free 15‑Minute Consulting Call</h1>
        <p className="mb-8 text-lg">
          Need help with AI, DevOps, or cloud architecture? Book a short, no‑cost call with our team.
        </p>
        <a
          href="https://calendly.com/your-calendly-username/15min?utm_source=ziontech"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-500 hover:to-purple-500 transition-colors"
        >
          <Calendar className="h-5 w-5" />
          Book Now
          <ArrowRight className="ml-1 h-4 w-4" />
        </a>
      </div>
    </div>
  );
}
