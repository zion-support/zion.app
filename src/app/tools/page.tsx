import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Tools — Zion Tech Group',
  description: 'Free and practical AI-assisted developer and operations tools for faster delivery.',
};

const CONTACT_EMAIL = 'kleber@ziontechgroup.com';
const CONTACT_PHONE = '+1 302 464 0950';
const CONTACT_ADDRESS = '364 E Main St STE 1008, Middletown, DE 19709';

const tools = [
  {
    title: 'Cron Schedule Generator',
    description: 'Generate readable cron expressions from human scheduling input with previews and quick copy.',
    href: '/tools/cron-generator',
    benefit: 'Reduce scheduling mistakes before deploy',
    marketRange: 'Free utility',
  },
  {
    title: 'PDF Generator',
    description: 'Create basic PDF outputs from structured inputs for summaries, invoices, reports, and shared outputs.',
    href: '/tools/pdf-generator',
    benefit: 'Move from manual export to repeatable output',
    marketRange: 'Free utility',
  },
  {
    title: 'JSON to TypeScript Converter',
    description: 'Convert JSON samples into typed TypeScript interfaces, union types, and validation-ready definitions.',
    href: '/tools/json-to-typescript-converter',
    benefit: 'Cut hand-typed interface errors',
    marketRange: 'Free utility',
  },
  {
    title: 'SQL Query Generator',
    description: 'Draft SQL statements from English-like prompts, table descriptions, and schema context with format options.',
    href: '/tools/sql-query-generator',
    benefit: 'Faster query drafting with fewer syntax errors',
    marketRange: 'Free utility',
  },
  {
    title: 'API Response Tester',
    description: 'Define expected API response shape and status behavior to validate integrations, SDK calls, and webhook outputs.',
    href: '/tools/api-response-tester',
    benefit: 'Catch integration breakage before production',
    marketRange: 'Free utility',
  },
  {
    title: 'Code Complexity Analyzer',
    description: 'Estimate function-level complexity hotspots, nesting depth, duplicated logic, and maintainability risk from source input.',
    href: '/tools/code-complexity-analyzer',
    benefit: 'Target refactoring where it matters most',
    marketRange: 'Free utility',
  },
  {
    title: 'Website Analyzer',
    description: 'Audit page structure, metadata, loading surface, and basic SEO signals from a page URL or HTML input.',
    href: '/tools/website-analyzer',
    benefit: 'Find quick wins before full performance work',
    marketRange: 'Free utility',
  },
  {
    title: 'File Analyzer',
    description: 'Inspect uploaded files for type, metadata, size risk, and simple content structure issues for developer review.',
    href: '/tools/file-analyzer',
    benefit: 'Speed up onboarding and artifacts review',
    marketRange: 'Free utility',
  },
];

export default function Tools() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(120,50,200,0.18),rgba(20,10,40,0.92))]"></div>
        <div className="relative container-page pt-24 pb-16">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tools</h1>
            <p className="text-lg text-slate-300 mb-8 max-w-3xl">
              Practical developer and operations utilities that reduce repetition, lower avoidable mistakes, and speed up delivery.
              These tools are available now and do not require a paid account to try.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/services" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Browse services</Link>
              <Link href="/contact" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Contact sales</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <div key={tool.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
                <h2 className="text-lg font-semibold text-white">{tool.title}</h2>
                <p className="mt-3 text-sm text-slate-300">{tool.description}</p>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Benefit</p>
                  <p className="mt-2 text-sm text-slate-300">{tool.benefit}</p>
                </div>
                <div className="mt-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Use model</p>
                  <p className="mt-2 text-sm text-slate-300">{tool.marketRange}</p>
                </div>
                <div className="mt-6">
                  <Link href={tool.href} className="text-sm font-semibold text-blue-300 hover:text-blue-200">Open tool →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container-page">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 md:flex md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Need a custom tool or integration?</h2>
              <p className="mt-2 text-sm text-slate-300">We can extend internal workflows, add private tools, or wrap these utilities into a branded workspace.</p>
              <div className="mt-3 text-sm text-slate-300">
                <div>📞 {CONTACT_PHONE}</div>
                <div>✉️ {CONTACT_EMAIL}</div>
                <div>📍 {CONTACT_ADDRESS}</div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Contact sales</Link>
              <Link href="/services" className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Browse services</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
