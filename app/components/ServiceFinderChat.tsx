'use client';
import React from 'react';

export default function ServiceFinderChat() {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 via-purple-950/20 to-gray-900">
      <div className="max-w-4xl mx-auto text-center">
        <span className="inline-block px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-widest mb-4">AI Powered</span>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">🤖 AI Service Finder</h2>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Chat with our AI to find the perfect service for your business needs. Describe your challenge and get instant recommendations.
        </p>
        <div className="bg-gray-800/50 rounded-2xl border border-gray-700 p-8 mb-8">
          <p className="text-gray-500 italic">AI Chat interface coming soon. Use our <a href="/services/" className="text-purple-400 hover:text-purple-300 underline">Service Browser</a> or <a href="#quiz" className="text-purple-400 hover:text-purple-300 underline">Service Matcher Quiz</a> to explore 1168+ services now.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="mailto:kleber@ziontechgroup.com" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700 text-sm">📧 kleber@ziontechgroup.com</a>
          <a href="tel:+130****0950" className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors border border-gray-700 text-sm">📞 +1 302 464 0950</a>
        </div>
      </div>
    </section>
  );
}
