// app/tools/ssl-checker/page.tsx — Free SSL/TLS Certificate Checker
'use client';
import { pingTool } from '@/data/tools_ping_client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SSLCheckerPage() {
  useEffect(() => { pingTool('ssl-checker'); }, []);

  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const checkSSL = async () => {
    if (!domain.trim()) { setError('Please enter a domain'); return; }
    setLoading(true); setError(''); setResult(null);
    try {
      // Use free SSL Labs API (no key for low-volume)
      const resp = await fetch(
        `https://api.ssllabs.com/api/v3/analyze?host=${encodeURIComponent(domain)}&publish=off&all=done`,
        { signal: AbortSignal.timeout(10000) }
      );
      const data = await resp.json();
      if (data.status === 'ERROR') {
        setError(data.statusMessage || 'SSL Labs could not analyze this host');
      } else {
        setResult(data);
      }
    } catch (e: any) {
      setError(e.message || 'Failed to reach SSL Labs API. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const gradeColor: Record<string, string> = {
    A: 'text-green-400', A_minus: 'text-green-400',
    B: 'text-yellow-400', B_minus: 'text-yellow-400',
    C: 'text-orange-400', C_minus: 'text-orange-400',
    D: 'text-red-400', E: 'text-red-400', F: 'text-red-500',
    T: 'text-slate-400', M: 'text-slate-400',
  };

  return (
    <div className="container-page py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/tools/" className="text-purple-400 text-sm hover:underline mb-6 inline-block">← All Tools</Link>
        <h1 className="text-4xl font-bold text-white mb-4">🔒 SSL/TLS Certificate Checker</h1>
        <p className="text-slate-400 mb-8">
          Free SSL certificate checker powered by SSL Labs. Enter any domain to check certificate validity, grade, expiry, protocol support, and potential vulnerabilities.
        </p>

        <div className="glass-card p-6 mb-8">
          <label className="block text-white font-medium mb-3">Domain to check</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value.replace(/^https?:\/\//,'').replace(/\/.*$/,''))}
              placeholder="example.com"
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:border-purple-500 outline-none"
              onKeyDown={(e) => e.key === 'Enter' && checkSSL()}
            />
            <button
              onClick={checkSSL}
              disabled={loading}
              className="btn-primary px-8 whitespace-nowrap"
            >
              {loading ? 'Checking…' : 'Check SSL'}
            </button>
          </div>
          {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
        </div>

        {result && (
          <div className="space-y-4">
            {/* Overall Grade */}
            {result.endpoints && result.endpoints.length > 0 && (
              <div className="glass-card p-6 text-center">
                <p className="text-slate-400 text-sm mb-2">Overall SSL Grade</p>
                <div className={`text-7xl font-bold ${gradeColor[result.grade] || 'text-white'}`}>
                  {result.grade || '—'}
                </div>
                <p className="text-slate-500 text-sm mt-2">{result.host}</p>
              </div>
            )}

            {/* Endpoint details */}
            {result.endpoints?.map((ep: any, i: number) => (
              <div key={i} className="glass-card p-6">
                <h3 className="text-white font-semibold mb-4">Server: {ep.ipAddress} ({ep.serverName})</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Grade</p>
                    <p className={`text-2xl font-bold ${gradeColor[ep.grade] || 'text-white'}`}>
                      {ep.grade || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Protocols</p>
                    <p className="text-slate-300 text-sm">{ep.protocols?.map((p:any)=>p.name+' '+p.version).join(', ') || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Cipher Suite</p>
                    <p className="text-slate-300 text-sm">{ep.cipherSuite?.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">TLS 1.3</p>
                    <p className={ep.tlsProtocols?.some((p:any)=>p.name==='TLS 1.3') ? 'text-green-400' : 'text-red-400'}>
                      {ep.tlsProtocols?.some((p:any)=>p.name==='TLS 1.3') ? '✓ Supported' : '✗ Not supported'}
                    </p>
                  </div>
                </div>
                {ep.issues && ep.issues.length > 0 && (
                  <div className="mt-4 p-3 rounded bg-red-900/20 border border-red-700/30">
                    <p className="text-red-300 text-sm font-medium mb-1">⚠ Issues Found:</p>
                    <ul className="text-red-200 text-sm space-y-1">
                      {ep.issues.map((issue: string, j: number) => (
                        <li key={j}>• {issue}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 glass-card p-6">
          <h2 className="text-xl font-bold text-white mb-3">What this checker tells you</h2>
          <ul className="text-slate-300 text-sm space-y-2">
            <li>• <strong className="text-white">SSL Grade (A–F)</strong> — Overall security rating from SSL Labs</li>
            <li>• <strong className="text-white">Certificate Expiry</strong> — When your cert expires and if it&apos;s already expired</li>
            <li>• <strong className="text-white">Protocol Support</strong> — Which TLS versions are enabled (1.0 is deprecated!)</li>
            <li>• <strong className="text-white">Cipher Suite</strong> — The encryption algorithm in use</li>
            <li>• <strong className="text-white">Known Vulnerabilities</strong> — POODLE, Heartbleed, BEAST, and more</li>
          </ul>
          <p className="text-slate-400 text-xs mt-4">
            Powered by <a href="https://www.ssllabs.com/ssltest/" target="_blank" rel="noopener" className="text-purple-400 hover:underline">SSL Labs SSL Test</a>. Free for public use. Status updates every 24 hours on cached results.
          </p>
        </div>

        <div className="mt-8 text-center">
<<<<<<< HEAD
          <Link href="/services/ai-compliance/" className="text-purple-400 hover:underline text-sm">
=======
          <Link href="/services/ai-fedrisk-compliance" className="text-purple-400 hover:underline text-sm">
>>>>>>> a720cf12 (fix(site-audit): hardcoded count residues → dynamic, broken anchor → ai-fedrisk-compliance)
            Need help fixing SSL issues? → Security Compliance & Monitoring
          </Link>
        </div>
      </div>
    </div>
  );
}
