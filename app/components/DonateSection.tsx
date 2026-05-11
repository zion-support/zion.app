import React from 'react';
import { Heart, Coffee, Gift } from 'lucide-react';
import TrackedLink from './TrackedLink';

export default function DonateSection() {
  return (
    <section className="mt-12 p-8 bg-slate-800/30 border border-slate-700 rounded-3xl text-center">
      <h3 className="text-2xl font-bold text-white mb-4">Support Zion Tech Group</h3>
      <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
        Your contributions help keep our free tools available and improve the platform.
        Choose a way to support us:
      </p>
      <div className="flex flex-col md:flex-row justify-center gap-6">
        <TrackedLink
          href="https://github.com/sponsors/Zion-support"
          utmParams={{utm_source: 'ziontechgroup.com', utm_medium: 'referral', utm_campaign: 'sponsor'}}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-xl hover:from-pink-500 hover:to-rose-500 transition-all"
        >
          <Heart className="w-5 h-5" /> GitHub Sponsors
        </TrackedLink>
        <TrackedLink
          href="https://ko-fi.com/ziontech"
          utmParams={{utm_source: 'ziontechgroup.com', utm_medium: 'referral', utm_campaign: 'ko-fi'}}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all"
        >
          <Coffee className="w-5 h-5" /> Ko-fƯ
        </TrackedLink>
        <TrackedLink
          href="https://www.buymeacoffee.com/ziontech"
          utmParams={{utm_source: 'ziontechgroup.com', utm_medium: 'referral', utm_campaign: 'bmac'}}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all"
        >
          <Gift className="w-5 h-5" /> Buy Me a Coffee
        </TrackedLink>
      </div>
    </section>
  );
}