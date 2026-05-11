'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, Check, RotateCcw, Globe, AlertTriangle, Loader2, Info } from 'lucide-react';

type RecordType = 'A' | 'AAAA' | 'MX' | 'TXT' | 'NS' | 'CNAME' | 'SOA' | 'CAA' | 'PTR';

interface DnsRecord {
  type: string;
  name: string;
  value: string;
  ttl?: number;
  priority?: number;
}

interface LookupResult {
  domain: string;
  recordType: string;
  records: DnsRecord[];
  queryTime: number;
  source: string;
  timestamp: string;
}

const RECORD_TYPES: { type: RecordType; label: string; desc: string }[] = [
  { type: 'A', label: 'A', desc: 'IPv4 address' },
  { type: 'AAAA', label: 'AAAA', desc: 'IPv6 address' },
  { type: 'MX', label: 'MX', desc: 'Mail servers' },
  { type: 'TXT', label: 'TXT', desc: 'Text records (SPF, DKIM)' },
  { type: 'NS', label: 'NS', desc: 'Nameservers' },
  { type: 'CNAME', label: 'CNAME', desc: 'Canonical name' },
  { type: 'SOA', label: 'SOA', desc: 'Start of authority' },
  { type: 'CAA', label: 'CAA', desc: 'Certificate authority' },
];

const POPULAR_DOMAINS = [
  'google.com', 'github.com', 'cloudflare.com', 'amazon.com',
  'microsoft.com', 'vercel.com', 'netlify.com', 'stripe.com',
];

function validateDomain(domain: string): boolean {
  const trimmed = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const pattern = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/;
  return pattern.test(trimmed);
}

function cleanDomain(input: string): string {
  return input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
}

async function lookupDns(domain: string, type: string): Promise<LookupResult> {
  const start = performance.now();

  // Use Google DNS-over-HTTPS API
  const response = await fetch(
    `https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`,
    { headers: { Accept: 'application/dns-json' } }
  );

  if (!response.ok) {
    throw new Error(`DNS query failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const elapsed = Math.round(performance.now() - start);

  const records: DnsRecord[] = [];

  if (data.Answer) {
    for (const answer of data.Answer) {
      records.push({
        type: type,
        name: answer.name,
        value: answer.data,
        ttl: answer.TTL,
      });
    }
  }

  // For MX records, also parse priority from the data field
  if (type === 'MX') {
    for (const record of records) {
      const parts = record.value.split(' ');
      if (parts.length >= 2) {
        record.priority = parseInt(parts[0], 10);
        record.value = parts.slice(1).join(' ');
      }
    }
  }

  return {
    domain,
    recordType: type,
    records,
    queryTime: elapsed,
    source: 'Google Public DNS (dns.google)',
    timestamp: new Date().toISOString(),
  };
}

function getRecordTypeColor(type: string): string {
  const colors: Record<string, string> = {
    A: 'bg-blue-100 text-blue-700',
    AAAA: 'bg-indigo-100 text-indigo-700',
    MX: 'bg-amber-100 text-amber-700',
    TXT: 'bg-emerald-100 text-emerald-700',
    NS: 'bg-purple-100 text-purple-700',
    CNAME: 'bg-cyan-100 text-cyan-700',
    SOA: 'bg-rose-100 text-rose-700',
    CAA: 'bg-orange-100 text-orange-700',
  };
  return colors[type] || 'bg-slate-100 text-slate-700';
}

export default function DnsLookupPage() {
  const [domain, setDomain] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<Set<RecordType>>(new Set(['A', 'AAAA', 'MX', 'NS']));
  const [results, setResults] = useState<LookupResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  const handleLookup = useCallback(async () => {
    const cleaned = cleanDomain(domain);
    if (!cleaned) {
      setError('Please enter a domain name');
      return;
    }
    if (!validateDomain(cleaned)) {
      setError('Invalid domain format. Example: example.com');
      return;
    }

    setError('');
    setLoading(true);
    setResults([]);

    try {
      const promises = Array.from(selectedTypes).map(type =>
        lookupDns(cleaned, type).catch(err => ({
          domain: cleaned,
          recordType: type,
          records: [],
          queryTime: 0,
          source: 'Error',
          timestamp: new Date().toISOString(),
          error: err.message,
        }))
      );

      const allResults = await Promise.all(promises);
      setResults(allResults);

      // Update history
      setHistory(prev => {
        const updated = [cleaned, ...prev.filter(d => d !== cleaned)].slice(0, 8);
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'DNS lookup failed');
    } finally {
      setLoading(false);
    }
  }, [domain, selectedTypes]);

  const toggleType = useCallback((type: RecordType) => {
    setSelectedTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  }, []);

  const handleCopy = useCallback(() => {
    const text = results.map(r =>
      `;; ${r.recordType} records for ${r.domain}\n${r.records.map(rec => `${rec.name} ${rec.ttl || ''} IN ${r.recordType} ${rec.priority ? rec.priority + ' ' : ''}${rec.value}`).join('\n') || '(no records)'}\n;; Query time: ${r.queryTime}ms`
    ).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [results]);

  const totalRecords = results.reduce((sum, r) => sum + r.records.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">DNS Record Lookup</h1>
              <p className="text-slate-600">Query DNS records for any domain — A, AAAA, MX, TXT, NS, CNAME, SOA, and CAA records via Google Public DNS.</p>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={domain}
                onChange={e => { setDomain(e.target.value); setError(''); }}
                onKeyDown={e => e.key === 'Enter' && handleLookup()}
                placeholder="Enter domain (e.g., example.com)"
                className="w-full px-4 py-3 pl-11 text-lg border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
            <button
              onClick={handleLookup}
              disabled={loading || !domain.trim()}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
              Lookup
            </button>
          </div>

          {error && (
            <div className="mt-3 flex items-center gap-2 text-sm text-rose-600 bg-rose-50 px-4 py-2 rounded-lg border border-rose-200">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {/* Record type selector */}
          <div className="mt-4 flex flex-wrap gap-2">
            {RECORD_TYPES.map(rt => (
              <button
                key={rt.type}
                onClick={() => toggleType(rt.type)}
                className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition ${selectedTypes.has(rt.type) ? 'bg-blue-100 border-blue-400 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                title={rt.desc}
              >
                {rt.label}
              </button>
            ))}
          </div>

          {/* Quick picks */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-slate-400 self-center">Quick:</span>
            {POPULAR_DOMAINS.map(d => (
              <button key={d} onClick={() => setDomain(d)} className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition">{d}</button>
            ))}
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="text-xs text-slate-400 self-center">Recent:</span>
              {history.map(d => (
                <button key={d} onClick={() => setDomain(d)} className="text-xs text-slate-500 hover:text-slate-700 bg-slate-100 px-2 py-0.5 rounded hover:bg-slate-200 transition">{d}</button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Results */}
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Results for <span className="text-blue-600">{cleanDomain(domain)}</span>
                </h2>
                <p className="text-sm text-slate-500">
                  {totalRecords} record{totalRecords !== 1 ? 's' : ''} found · {results.length} quer{results.length !== 1 ? 'ies' : 'y'}
                </p>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy All</>}
              </button>
            </div>

            <div className="space-y-4">
              {results.map((result, ri) => (
                <div key={ri} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${getRecordTypeColor(result.recordType)}`}>{result.recordType}</span>
                      <span className="text-sm text-slate-600">
                        {result.records.length} record{result.records.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{result.queryTime}ms</span>
                  </div>

                  {result.records.length === 0 ? (
                    <div className="px-4 py-6 text-center text-sm text-slate-400">
                      No {result.recordType} records found for this domain
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {result.records.map((record, rri) => (
                        <div key={rri} className="px-4 py-3 flex items-start justify-between gap-4 hover:bg-slate-50 transition">
                          <div className="min-w-0 flex-1">
                            <div className="font-mono text-sm text-slate-900 break-all">
                              {record.priority != null && <span className="text-amber-600 font-semibold mr-2">{record.priority}</span>}
                              {record.value}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">
                              {record.name} · TTL {record.ttl ?? 'n/a'}
                            </div>
                          </div>
                          <button
                            onClick={() => navigator.clipboard.writeText(record.value)}
                            className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition"
                            title="Copy value"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Source info */}
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Info className="w-3 h-3" />
              <span>Query via Google Public DNS (dns.google) · {results[0]?.timestamp}</span>
            </div>
          </motion.div>
        )}

        {/* No results yet */}
        {results.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Globe className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-400">Enter a domain to look up DNS records</h3>
            <p className="text-sm text-slate-400 mt-2">Query A, AAAA, MX, TXT, NS, CNAME, SOA, and CAA records</p>
          </motion.div>
        )}

        {/* Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 p-6 rounded-2xl border border-blue-200 bg-blue-50/50">
          <h3 className="text-sm font-semibold text-blue-800 mb-3">💡 DNS Record Guide</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {RECORD_TYPES.map(rt => (
              <div key={rt.type} className="text-sm">
                <span className={`inline-block px-1.5 py-0.5 rounded text-xs font-bold mr-1.5 ${getRecordTypeColor(rt.type)}`}>{rt.type}</span>
                <span className="text-blue-700">{rt.desc}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-blue-600">
            100% client-side — queries go directly from your browser to Google DNS. No server involved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
