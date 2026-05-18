// app/proposal-generator/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProposalGeneratorPage() {
  const [generated, setGenerated] = useState(false);
  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Proposal Generator</h1>
      <p className="text-slate-400 mb-8 max-w-2xl">
        Generate a custom service proposal in minutes. Select services, budget, and timeline — get a ready-to-send PDF.
      </p>
      {generated ? (
        <div className="glass-card p-8 text-center">
          <p className="text-green-400 text-lg mb-4">✓ Proposal generated!</p>
          <button className="btn-primary">Download PDF</button>
        </div>
      ) : (
        <div className="glass-card p-6 max-w-2xl">
          <p className="text-slate-400 mb-6">This would be a full form — for now use our <Link href="/pricing-calculator" className="text-purple-400 underline">Pricing Calculator</Link> or <Link href="/contact" className="text-purple-400 underline">Contact Us</Link>.</p>
          <Link href="/contact" className="btn-primary">Request Custom Proposal</Link>
        </div>
      )}
    </div>
  );
}
