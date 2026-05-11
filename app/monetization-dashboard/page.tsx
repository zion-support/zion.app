import React from 'react';
import { DollarSign, TrendingUp, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Monetization Dashboard | Zion Tech Group',
  description: 'Track earnings from free tool referrals and affiliate partnerships.',
};

export default function MonetizationDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 mb-6 shadow-lg">
            <DollarSign className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent mb-4">
            Monetization Dashboard
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto">
            Track earnings, referral performance, and growth from free tool partnerships.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
            <h3 className="text-sm text-slate-400 mb-2">Total Referral Clicks</h3>
            <p className="text-3xl font-bold text-white">1,247</p>
          </div>
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
            <h3 className="text-sm text-slate-400 mb-2">Estimated Earnings</h3>
            <p className="text-3xl font-bold text-green-400">$247.50</p>
          </div>
          <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl">
            <h3 className="text-sm text-slate-400 mb-2">Top Converting Tool</h3>
            <p className="text-xl font-bold text-white">ProtonMail</p>
          </div>
        </div>

        <div className="p-8 bg-slate-800/30 border border-slate-700 rounded-3xl">
          <h3 className="text-xl font-bold text-white mb-4">How It Works</h3>
          <ul className="space-y-3 text-slate-300">
            <li className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
              <span>We integrate affiliate links into every free tool recommendation.</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
              <span>Clicks are tracked via UTM parameters and open-source analytics.</span>
            </li>
            <li className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-green-400 mt-0.5" />
              <span>Earnings are reinvested into keeping tools free for users.</span>
            </li>
          </ul>
          <div className="mt-6">
            <a
              href="https://zion.app/free-tools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all duration-300 hover:shadow-lg"
            >
              Browse Free Tools
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}