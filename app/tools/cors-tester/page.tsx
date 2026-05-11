'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Globe, Search, Copy, Check, AlertCircle, CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';

interface CorsResult {
  url: string;
  origin: string;
  timestamp: string;
  headers: Record<string, string | null>;
  preflightStatus?: number;
  preflightAllowed?: boolean;
  getStatus?: number;
  getAllowed?: boolean;
  error?: string;
}

const CORS_HEADERS = [
  { key: 'access-control-allow-origin', label: 'Allow-Origin', description: 'Which origins can access the resource' },
  { key: 'access-control-allow-methods', label: 'Allow-Methods', description: 'Allowed HTTP methods' },
  { key: 'access-control-allow-headers', label: 'Allow-Headers', description: 'Allowed request headers' },
  { key: 'access-control-allow-credentials', label: 'Allow-Credentials', description: 'Whether credentials are allowed' },
  { key: 'access-control-expose-headers', label: 'Expose-Headers', description: 'Headers exposed to the browser' },
  { key: 'access-control-max-age', label: 'Max-Age', description: 'Preflight cache duration (seconds)' },
];

const COMMON_ORIGINS = [
  'https://localhost:3000',
  'https://localhost:8080',
  'https://example.com',
  'https://app.example.com',
];

const EXAMPLE_URLS = [
  'https://api.github.com',
  'https://httpbin.org/get',
  'https://jsonplaceholder.typicode.com/posts',
  'https://api.openweathermap.org',
];

function normalizeUrl(input: string): string {
  let url = input.trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url;
  }
  return url;
}

function getHeaderValue(headers: Record<string, string | null>, key: string): string | null {
  // Headers might be lowercase
  const lowerKey = key.toLowerCase();
  for (const [k, v] of Object.entries(headers)) {
    if (k.toLowerCase() === lowerKey) return v;
  }
  return null;
}

export default function CorsTester() {
  const [url, setUrl] = useState('');
  const [origin, setOrigin] = useState('https://localhost:3000');
  const [result, setResult] = useState<CorsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const testCors = useCallback(async () => {
    if (!url.trim()) {
      setError('Please enter a URL to test');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    const normalizedUrl = normalizeUrl(url);
    const testOrigin = origin.trim() || 'https://localhost:3000';

    const corsResult: CorsResult = {
      url: normalizedUrl,
      origin: testOrigin,
      timestamp: new Date().toISOString(),
      headers: {},
    };

    try {
      // Try a simple GET with Origin header via no-cors mode first to check basic connectivity
      // Then try with CORS proxy or direct fetch
      try {
        const response = await fetch(normalizedUrl, {
          method: 'GET',
          headers: { 'Origin': testOrigin },
          mode: 'cors',
        });

        corsResult.getStatus = response.status;
        corsResult.getAllowed = true;

        const headerEntries: Record<string, string | null> = {};
        for (const header of CORS_HEADERS) {
          headerEntries[header.key] = response.headers.get(header.key);
        }
        corsResult.headers = headerEntries;
      } catch (fetchError: unknown) {
        corsResult.getAllowed = false;
        corsResult.error = fetchError instanceof Error ? fetchError.message : 'CORS request blocked';

        // Try without CORS mode to at least check if the server responds
        try {
          const noCorsResponse = await fetch(normalizedUrl, {
            method: 'HEAD',
            mode: 'no-cors',
          });
          corsResult.preflightStatus = noCorsResponse.status;
        } catch {
          // Server may be unreachable entirely
        }
      }
    } catch (err: unknown) {
      corsResult.error = err instanceof Error ? err.message : 'Unknown error occurred';
    }

    setResult(corsResult);
    setLoading(false);
  }, [url, origin]);

  const copyResult = useCallback(() => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') testCors();
    },
    [testCors],
  );

  const hasHeader = (key: string) => {
    if (!result) return false;
    return getHeaderValue(result.headers, key) !== null;
  };

  const getHeader = (key: string) => {
    if (!result) return null;
    return getHeaderValue(result.headers, key);
  };

  const isOriginAllowed = () => {
    const allowed = getHeader('access-control-allow-origin');
    if (!allowed) return false;
    if (allowed === '*') return true;
    return allowed === origin.trim();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white mb-4 shadow-lg shadow-blue-500/25">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">CORS Header Tester</h1>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Test Cross-Origin Resource Sharing (CORS) headers for any URL. Check which origins, methods, and headers are allowed — all from your browser.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-6"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">URL to test</label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://api.example.com/endpoint"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
                  />
                </div>
                <button
                  onClick={testCors}
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2 shrink-0"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                  Test CORS
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Origin header (simulating)</label>
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="https://localhost:3000"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-900"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-slate-500 self-center">Quick URLs:</span>
              {EXAMPLE_URLS.map((u) => (
                <button
                  key={u}
                  onClick={() => setUrl(u)}
                  className="text-xs px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition font-mono"
                >
                  {u.replace('https://', '').slice(0, 30)}{u.replace('https://', '').length > 30 ? '…' : ''}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-medium text-slate-500 self-center">Quick origins:</span>
              {COMMON_ORIGINS.map((o) => (
                <button
                  key={o}
                  onClick={() => setOrigin(o)}
                  className={`text-xs px-3 py-1.5 rounded-lg transition font-mono ${
                    origin === o ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {o.replace('https://', '')}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overall Status */}
            <div className={`rounded-2xl border p-6 ${
              result.getAllowed
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  result.getAllowed ? 'bg-emerald-500' : 'bg-amber-500'
                }`}>
                  {result.getAllowed
                    ? <CheckCircle className="w-6 h-6 text-white" />
                    : <XCircle className="w-6 h-6 text-white" />
                  }
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {result.getAllowed ? 'CORS Allowed' : 'CORS Blocked or Partial'}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {result.getAllowed
                      ? `The server at ${result.url} allows cross-origin requests from ${result.origin}.`
                      : result.error
                        ? `Request blocked: ${result.error}`
                        : 'The server did not return CORS headers for this origin. Requests from the browser will be blocked.'
                    }
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs font-mono text-slate-500">
                    <span>URL: {result.url}</span>
                    <span>Origin: {result.origin}</span>
                    {result.getStatus != null && <span>HTTP {result.getStatus}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Origin Check */}
            {hasHeader('access-control-allow-origin') && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  Origin Verification
                </h3>
                <div className={`rounded-xl p-4 ${isOriginAllowed() ? 'bg-emerald-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2">
                    {isOriginAllowed()
                      ? <CheckCircle className="w-5 h-5 text-emerald-600" />
                      : <XCircle className="w-5 h-5 text-red-600" />
                    }
                    <span className={`text-sm font-medium ${isOriginAllowed() ? 'text-emerald-800' : 'text-red-800'}`}>
                      {isOriginAllowed()
                        ? `Your origin (${origin}) is allowed`
                        : `Your origin (${origin}) is NOT allowed`
                      }
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 font-mono">
                    Server returned: access-control-allow-origin: {getHeader('access-control-allow-origin')}
                  </p>
                </div>
              </div>
            )}

            {/* CORS Headers Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">CORS Headers Detail</h3>
              <div className="space-y-3">
                {CORS_HEADERS.map((header) => {
                  const value = getHeader(header.key);
                  const present = value !== null;
                  return (
                    <div
                      key={header.key}
                      className={`rounded-xl border p-4 ${
                        present ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {present
                            ? <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                            : <XCircle className="w-4 h-4 text-slate-300 shrink-0" />
                          }
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{header.label}</p>
                            <p className="text-xs text-slate-500 font-mono mt-0.5">{header.key}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{header.description}</p>
                          </div>
                        </div>
                        {present && (
                          <code className="text-xs bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg font-mono break-all max-w-[250px] text-right">
                            {value}
                          </code>
                        )}
                        {!present && (
                          <span className="text-xs text-slate-400 italic">Not set</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Copy JSON */}
            <div className="flex gap-3">
              <button
                onClick={copyResult}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy as JSON'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 bg-blue-50 rounded-2xl border border-blue-200 p-6"
        >
          <h3 className="text-sm font-semibold text-blue-900 mb-3">How CORS Testing Works</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>This tool sends a real HTTP request with the <code className="bg-blue-100 px-1 rounded">Origin</code> header set to your chosen origin</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>If the server returns <code className="bg-blue-100 px-1 rounded">Access-Control-Allow-Origin</code>, CORS is configured</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Blocked requests usually mean the server doesn&apos;t set CORS headers for your origin</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>100% client-side — no proxy, no server processing. Results depend on your browser&apos;s CORS enforcement</span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
