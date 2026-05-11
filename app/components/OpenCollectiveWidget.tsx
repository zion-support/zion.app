"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Donation {
  id: string;
  contributor: string;
  amount: string;
  currency: string;
  date: string;
}

export default function OpenCollectiveWidget() {
  const [topDonors, setTopDonors] = useState<Donation[]>([]);

  useEffect(() => {
    fetch('https://opencollective.com/zion-support/api/v2/collectives/Zion-support?perPage=4')
      .then(res => res.json())
      .then(data => {
        // Parse donors from data (simplified example)
        if (data && data.donations) {
          const donors = data.donations.map((d: any) => ({
            id: d._id,
            contributor: d.user ? d.user.username : 'Anonymous',
            amount: d.amount.toFixed(2),
            currency: d.currency,
            date: new Date(d.createdAt).toLocaleDateString('en-US'),
          }));
          setTopDonors(donors);
        }
      })
      .catch(err => console.error('opencollective fetch error', err));
  }, []);

  return (
    <section className="mt-12 p-8 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl shadow-xl">
      <h3 className="text-2xl font-bold mb-4">Support via OpenCollective</h3>
      <p className="mb-6">Your small contributions keep our free tools alive.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topDonors.length > 0 ?
          topDonors.map(d => (
            <div key={d.id} className="bg-white/10 rounded-xl p-4 flex flex-col items-center">
              <Image src="/icons/oc-logo.svg" alt="OpenCollective" width={48} height={48} />
              <p className="mt-2 font-semibold">{d.contributor}</p>
              <p className="text-sm">${d.amount} {d.currency}</p>
              <p className="text-xs text-slate-200">{d.date}</p>
            </div>
          ))
        :
          <p className="col-span-full text-center text-slate-300">Loading donors…</p>
        }
      </div>
      <div className="mt-6 text-center">
        <a href="https://opencollective.com/zion-support" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 py-2 px-4 bg-white/20 hover:bg-white/30 rounded-full font-medium text-white transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="21" y1="8" x2="15" y2="20"/><line x1="4" y1="4" x2="20" y2="20"/></svg>
          Donate on OpenCollective
        </a>
      </div>
    </section>
  );
}
