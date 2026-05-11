'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Plus, Trash2, Shield } from 'lucide-react';

type Algorithm = 'HS256' | 'HS384' | 'HS512';

const ALGORITHMS: Algorithm[] = ['HS256', 'HS384', 'HS512'];

const EXAMPLE_PAYLOADS: Record<string, Record<string, unknown>> = {
  'Basic Auth': { sub: 'user_123', name: 'Jane Doe', email: 'jane@example.com', role: 'admin', iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 3600 },
  'API Token': { sub: 'api_client', client_id: 'app_abc', scopes: ['read', 'write'], iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 86400 },
  'Session': { sub: 'user_456', session_id: 'sess_xyz', permissions: ['user'], iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + 7200 },
};

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function hmacSign(algorithm: Algorithm, data: string, secret: string): Promise<string> {
  const algoMap: Record<Algorithm, string> = { HS256: 'SHA-256', HS384: 'SHA-384', HS512: 'SHA-512' };
  const enc = new TextEncoder();
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: algoMap[algorithm] }, false, ['sign'])
    .then(key => crypto.subtle.sign('HMAC', key, enc.encode(data)))
    .then(sig => {
      const bytes = new Uint8Array(sig);
      let binary = '';
      bytes.forEach(b => binary += String.fromCharCode(b));
      return base64UrlEncode(binary);
    });
}

export default function JWTEncoderPage() {
  const [header, setHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payload, setPayload] = useState(JSON.stringify(EXAMPLE_PAYLOADS['Basic Auth'], null, 2));
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [algorithm, setAlgorithm] = useState<Algorithm>('HS256');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [expiryMinutes, setExpiryMinutes] = useState(60);

  const generateToken = useCallback(async () => {
    setError('');
    try {
      const parsedHeader = JSON.parse(header);
      const parsedPayload = JSON.parse(payload);
      
      if (!parsedPayload.iat) {
        parsedPayload.iat = Math.floor(Date.now() / 1000);
      }
      parsedPayload.exp = Math.floor(Date.now() / 1000) + expiryMinutes * 60;
      
      parsedHeader.alg = algorithm;
      if (!parsedHeader.typ) parsedHeader.typ = 'JWT';
      
      const headerB64 = base64UrlEncode(JSON.stringify(parsedHeader));
      const payloadB64 = base64UrlEncode(JSON.stringify(parsedPayload));
      const signingInput = `${headerB64}.${payloadB64}`;
      
      const signature = await hmacSign(algorithm, signingInput, secret);
      setOutput(`${signingInput}.${signature}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to generate token');
      setOutput('');
    }
  }, [header, payload, secret, algorithm, expiryMinutes]);

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = output;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClear = () => {
    setHeader('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
    setPayload('{\n  "sub": "1234567890",\n  "name": "John Doe"\n}');
    setSecret('your-256-bit-secret');
    setOutput('');
    setError('');
    setAlgorithm('HS256');
    setExpiryMinutes(60);
  };

  const loadExample = (name: string) => {
    setPayload(JSON.stringify(EXAMPLE_PAYLOADS[name], null, 2));
    setError('');
    setOutput('');
  };

  const addClaim = () => {
    try {
      const p = JSON.parse(payload);
      p['custom_claim'] = 'value';
      setPayload(JSON.stringify(p, null, 2));
    } catch {
      // ignore invalid JSON
    }
  };

  const now = Math.floor(Date.now() / 1000);
  let tokenParts: { header: string; payload: string; signature: string } | null = null;
  if (output) {
    const parts = output.split('.');
    if (parts.length === 3) {
      tokenParts = { header: parts[0], payload: parts[1], signature: parts[2] };
    }
  }

  let payloadParsed: Record<string, unknown> | null = null;
  try { payloadParsed = JSON.parse(payload); } catch { /* */ }

  const isExpired = typeof payloadParsed?.exp === 'number' && payloadParsed.exp < now;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">JWT Encoder</h1>
          <p className="mt-2 text-lg text-slate-600">
            Create and sign JSON Web Tokens with HMAC algorithms
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* Controls */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-sm font-medium text-slate-700">Algorithm:</label>
              <div className="flex gap-1">
                {ALGORITHMS.map(a => (
                  <button
                    key={a}
                    onClick={() => { setAlgorithm(a); setHeader(prev => prev.replace(/"alg"\s*:\s*"[^"]*"/, `"alg": "${a}"`)); setOutput(''); }}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      algorithm === a ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">Expires in:</label>
                <select
                  value={expiryMinutes}
                  onChange={e => { setExpiryMinutes(Number(e.target.value)); setOutput(''); }}
                  className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm"
                >
                  <option value={5}>5 min</option>
                  <option value={15}>15 min</option>
                  <option value={60}>1 hour</option>
                  <option value={1440}>24 hours</option>
                  <option value={10080}>7 days</option>
                  <option value={43200}>30 days</option>
                  <option value={525600}>1 year</option>
                </select>
              </div>
              <button onClick={handleClear} className="flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <RotateCcw className="h-4 w-4" /> Reset
              </button>
            </div>
          </div>

          {/* Examples */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="text-xs font-medium text-slate-500 self-center">Preset:</span>
            {Object.keys(EXAMPLE_PAYLOADS).map(name => (
              <button
                key={name}
                onClick={() => loadExample(name)}
                className="rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
              >
                {name}
              </button>
            ))}
          </div>

          {/* Input grid */}
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Header */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Header</label>
              <textarea
                value={header}
                onChange={e => { setHeader(e.target.value); setOutput(''); }}
                className="h-28 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            {/* Secret */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">Secret Key</label>
              <input
                type="text"
                value={secret}
                onChange={e => { setSecret(e.target.value); setOutput(''); }}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                placeholder="Enter your secret key..."
              />
              <div className="mt-3 flex gap-2">
                <button onClick={() => { setSecret(Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b => b.toString(16).padStart(2, '0')).join('')); setOutput(''); }} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  🔑 Generate Random Secret
                </button>
              </div>
            </div>
          </div>

          {/* Payload */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Payload (JSON)</label>
              <button onClick={addClaim} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50">
                <Plus className="h-3 w-3" /> Add Claim
              </button>
            </div>
            <textarea
              value={payload}
              onChange={e => { setPayload(e.target.value); setOutput(''); }}
              className="h-48 w-full resize-none rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
            {typeof payloadParsed?.exp === 'number' && (
              <p className={`mt-1 text-xs ${isExpired ? 'text-red-600 font-semibold' : 'text-slate-400'}`}>
                {isExpired ? '⚠ Token is expired' : `Expires: ${new Date(payloadParsed.exp * 1000).toLocaleString()}`}
              </p>
            )}
          </div>

          {/* Generate button */}
          <div className="mt-4">
            <button
              onClick={generateToken}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition"
            >
              <Shield className="h-4 w-4" /> Generate JWT Token
            </button>
          </div>

          {/* Output */}
          {output && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Generated Token</label>
                <button onClick={handleCopy} className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100">
                  {copied ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="rounded-xl border border-slate-300 bg-slate-50 p-4">
                <code className="block break-all font-mono text-xs leading-relaxed text-slate-800">
                  <span className="text-blue-600">{tokenParts?.header}</span>
                  <span className="text-slate-400">.</span>
                  <span className="text-emerald-600">{tokenParts?.payload}</span>
                  <span className="text-slate-400">.</span>
                  <span className="text-rose-600">{tokenParts?.signature}</span>
                </code>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs text-slate-500">
                <span className="rounded bg-blue-50 px-2 py-1 text-blue-700">Header</span>
                <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700">Payload</span>
                <span className="rounded bg-rose-50 px-2 py-1 text-rose-700">Signature</span>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </motion.div>
          )}

          {/* Info */}
          <div className="mt-6 rounded-xl bg-emerald-50 p-4">
            <h3 className="text-sm font-semibold text-emerald-900">About JWT Encoding</h3>
            <p className="mt-1 text-sm text-emerald-800">
              JSON Web Tokens (JWT) are a compact, URL-safe means of representing claims between two parties.
              The token is signed using HMAC with a secret key, ensuring integrity. JWTs are widely used for
              authentication, authorization, and information exchange. Never put sensitive data in JWT payloads
              without encryption — the payload is base64-encoded, not encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
