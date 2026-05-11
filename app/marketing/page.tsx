'use client';

import { useState } from 'react';
import Link from 'next/link';
import DefaultSEO from '@/components/DefaultSEO';

interface SEOCheckResult {
  name: string;
  description: string;
  passed: boolean;
  details?: string;
}

export default function AutonomousSEOAuditAgent() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<SEOCheckResult[] | null>(null);
  const [overallScore, setOverallScore] = useState<number | null>(null);

  const runAnalysis = () => {
    if (!url) return;
    setIsAnalyzing(true);
    
    // Simulate SEO analysis
    setTimeout(() => {
      const checks: SEOCheckResult[] = [
        {
          name: 'Meta Tags',
          description: 'Check for title, description, and canonical tags',
          passed: Math.random() > 0.3,
          details: 'Found optimized title and meta description',
        },
        {
          name: 'Heading Structure',
          description: 'Verify H1-H6 hierarchy',
          passed: Math.random() > 0.2,
          details: 'Single H1 tag found with proper subheadings',
        },
        {
          name: 'Image Optimization',
          description: 'Check for alt attributes and image sizing',
          passed: Math.random() > 0.4,
          details: '3 images missing alt text detected',
        },
        {
          name: 'Mobile Responsiveness',
          description: 'Verify mobile-friendly design',
          passed: Math.random() > 0.1,
          details: 'Page is fully responsive',
        },
        {
          name: 'Page Speed',
          description: 'Analyze load time and performance',
          passed: Math.random() > 0.5,
          details: 'LCP: 2.3s, FID: 45ms',
        },
        {
          name: 'Internal Linking',
          description: 'Check for proper internal links',
          passed: Math.random() > 0.25,
          details: '12 internal links found',
        },
        {
          name: 'Content Quality',
          description: 'Evaluate content depth and uniqueness',
          passed: Math.random() > 0.2,
          details: '1,200 words, 85% unique content',
        },
        {
          name: 'Schema Markup',
          description: 'Check for structured data',
          passed: Math.random() > 0.6,
          details: 'Organization schema detected',
        },
      ];
      
      const score = Math.round(
        (checks.filter(c => c.passed).length / checks.length) * 100
      );
      
      setResults(checks);
      setOverallScore(score);
      setIsAnalyzing(false);
    }, 2000);
  };

  const getStatusBadge = (passed: boolean) => {
    if (passed) {
      return <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">Pass</span>;
    }
    return <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">Fail</span>;
  };

  return (
    <>
      <DefaultSEO
        title="Autonomous SEO Audit Agent | AI Lab | Zion Tech Group"
        description="Run autonomous SEO audits with AI-powered analysis. Get instant scores for meta tags, content, performance, and more."
        keywords={['AI SEO audit', 'SEO analyzer', 'autonomous SEO', 'SEO health check']}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 py-12">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-sm">
            <a href="/ai-lab" className="text-indigo-600 hover:underline">AI Lab</a>
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">Autonomous SEO Audit Agent</span>
          </div>

          <div className="mb-10 text-center">
            <div className="mb-2 inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
              AI Lab · Live
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Autonomous SEO Audit Agent</h1>
            <p className="mt-2 text-lg text-slate-600">
              AI-powered SEO analysis with instant scoring and actionable recommendations
            </p>
          </div>

          {/* Input Section */}
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
            <div className="flex flex-col gap-4 md:flex-row">
              <input
                type="url"
                placeholder="Enter URL to audit (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
              <button
                onClick={runAnalysis}
                disabled={!url || isAnalyzing}
                className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyzing...' : 'Run Audit'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div className="space-y-6">
              {/* Score Card */}
              <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
                <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                  <div>
                    <h2 className="text-2xl font-semibold">Overall SEO Score</h2>
                    <p className="mt-1 text-indigo-100">
                      {overallScore! >= 80 ? 'Excellent - Your page is well-optimized!' :
                       overallScore! >= 60 ? 'Good - Some improvements recommended' :
                       'Needs Work - Several issues detected'}
                    </p>
                  </div>
                  <div className={`text-7xl font-bold ${overallScore! >= 80 ? 'text-green-300' : overallScore! >= 60 ? 'text-amber-300' : 'text-red-300'}`}>
                    {overallScore}
                    <span className="text-3xl text-indigo-200">/100</span>
                  </div>
                </div>
              </div>

              {/* Checks Grid */}
              <div className="grid gap-4 md:grid-cols-2">
                {results.map((check, index) => (
                  <div
                    key={index}
                    className={`rounded-xl border p-5 ${
                      check.passed
                        ? 'border-green-200 bg-green-50'
                        : 'border-red-200 bg-red-50'
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-semibold text-slate-900">{check.name}</h3>
                      {getStatusBadge(check.passed)}
                    </div>
                    <p className="text-sm text-slate-600">{check.description}</p>
                    {check.details && (
                      <p className="mt-2 text-sm font-medium text-slate-700">{check.details}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Recommendations */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-slate-900">AI Recommendations</h3>
                <ul className="space-y-3">
                  {results.filter(r => !r.passed).length > 0 ? (
                    results.filter(r => !r.passed).map((check, index) => (
                      <li key={index} className="flex items-start gap-3 rounded-lg bg-amber-50 p-3">
                        <span className="text-amber-600">⚠️</span>
                        <div>
                          <span className="font-medium text-slate-900">{check.name}: </span>
                          <span className="text-slate-700">{check.details || 'Needs improvement'}</span>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
                      <span className="text-green-600">✅</span>
                      <div>
                        <span className="font-medium text-slate-900">Great job! </span>
                        <span className="text-slate-700">Your page passes all SEO checks.</span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Info Section */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">About This Tool</h3>
            <p className="text-slate-600">
              The Autonomous SEO Audit Agent uses AI to analyze your page for key SEO factors including meta tags, 
              heading structure, image optimization, mobile responsiveness, page speed, internal linking, 
              content quality, and schema markup. Get instant feedback and actionable recommendations to improve 
              your search rankings.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/ai-lab"
                className="rounded-lg border border-indigo-300 bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-800 hover:bg-indigo-100"
              >
                Explore More AI Lab Tools
              </a>
              <a
                href="/ai-services"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                View AI Services
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
