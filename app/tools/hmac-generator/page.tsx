'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Key, Lock, Eye, EyeOff } from 'lucide-react';

type Algorithm = 'SHA-256' | 'SHA-384' | 'SHA-512';

interface HmacResult {
  algorithm: Algorithm;
  hex: string;
  base64: string;
  message: string;
  keyPreview: string;
}

const ALGORITHMS: Algorithm[] = ['SHA-256', 'SHA-384', 'SHA-512'];

const EXAMPLES = [
  {
    label: 'Webhook verification (Stripe-style)',
    message: '{"id":"evt_1234","type":"payment_intent.succeeded","data":{"object":{"amount":2000}}}',
    secret: 'whsec_test_secret_key_abc123',
  },
  {
    label: 'API request signing',
    message: 'POST\n/api/users\n{\"name\":\"Alice\"}',
    secret: 'api-secret-key-2026',
  },
  {
    label: 'JWT payload (HMAC)',
    message: '{"sub":"1234567890","name":"John Doe","iat":1516239022}',
    secret: 'your-256-bit-secret',
  },
];

async function computeHmac(
  algorithm: Algorithm,
  message: string,
  secret: string,
): Promise<{ hex: string; base64: string }> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const bytes = new Uint8Array(signature);

  // Hex
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Base64
  const base64 = btoa(String.fromCharCode(...bytes));

  return { hex, base64 };
}

export default function HmacSignatureGenerator() {
  const [message, setMessage] = useState('');
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('SHA-256');
  const [result, setResult] = useState<HmacResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSecret, setShowSecret] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!message.trim()) {
      setError('Message is required');
      return;
    }
    if (!secret.trim()) {
      setError('Secret key is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { hex, base64 } = await computeHmac(algorithm, message, secret);
      setResult({
        algorithm,
        hex,
        base64,
        message,
        keyPreview: secret.slice(0, 4) + '••••' + secret.slice(-4),
      });
    } catch (err) {
      setError('Failed to compute HMAC: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [message, secret, algorithm]);

  const handleCopy = useCallback(async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  const handleReset = useCallback(() => {
    setMessage('');
    setSecret('');
    setResult(null);
    setError('');
  }, []);

  const handleLoadExample = useCallback((ex: (typeof EXAMPLES)[0]) => {
    setMessage(ex.message);
    setSecret(ex.secret);
    setResult(null);
    setError('');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">HMAC Signature Generator</h1>
              <p className="text-slate-600">Generate HMAC-SHA256/384/512 signatures for API auth, webhooks, and request signing</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            {/* Algorithm selector */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <label className="text-sm font-medium text-slate-700">Algorithm:</label>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                {ALGORITHMS.map((alg) => (
                  <button
                    key={alg}
                    onClick={() => setAlgorithm(alg)}
                    className={`px-4 py-2 text-sm font-medium transition ${algorithm === alg ? 'bg-rose-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                  >
                    {alg}
                  </button>
                ))}
              </div>
            </div>

            {/* Examples */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">Quick Examples</label>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => handleLoadExample(ex)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-rose-50 hover:border-rose-300 transition"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">Message / Payload</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter the message or payload to sign..."
                className="w-full h-32 rounded-lg border border-slate-200 p-4 font-mono text-sm text-slate-900 resize-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                spellCheck={false}
              />
              <p className="mt-1 text-xs text-slate-500">{message.length} characters · {new Blob([message]).size} bytes</p>
            </div>

            {/* Secret key input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <Key className="w-4 h-4 inline mr-1" />
                Secret Key
              </label>
              <div className="relative">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  placeholder="Enter your secret key..."
                  className="w-full rounded-lg border border-slate-200 p-4 pr-12 font-mono text-sm text-slate-900 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
                <button
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showSecret ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-5">
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="rounded-lg bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : `Generate ${algorithm} HMAC`}
              </button>
              <button
                onClick={handleReset}
                className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-4 h-4 inline mr-1.5" />
                Reset
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-lg bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-800">
                {error}
              </div>
            )}

            {/* Result */}
            {result && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">HMAC Result</h3>

                {/* Hex */}
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Hexadecimal</span>
                    <button
                      onClick={() => handleCopy(result.hex, 'hex')}
                      className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 transition"
                    >
                      {copiedField === 'hex' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'hex' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="font-mono text-sm text-slate-900 break-all">{result.hex}</p>
                </div>

                {/* Base64 */}
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Base64</span>
                    <button
                      onClick={() => handleCopy(result.base64, 'base64')}
                      className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 transition"
                    >
                      {copiedField === 'base64' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'base64' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <p className="font-mono text-sm text-slate-900 break-all">{result.base64}</p>
                </div>

                {/* Info */}
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-xs text-slate-500 space-y-1">
                  <p>Algorithm: <span className="font-mono text-slate-700">{result.algorithm}</span></p>
                  <p>Output size: <span className="font-mono text-slate-700">{result.hex.length / 2} bytes</span></p>
                  <p>Key preview: <span className="font-mono text-slate-700">{result.keyPreview}</span></p>
                </div>

                {/* Code snippet */}
                <div className="rounded-lg bg-slate-900 border border-slate-700 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase">Verification Snippet (Node.js)</span>
                    <button
                      onClick={() => handleCopy(
                        `const crypto = require('crypto');\nconst hmac = crypto.createHmac('${result.algorithm.toLowerCase().replace('-', '')}', '${result.keyPreview.replace('••••', '...')}');\nhmac.update('${result.message.slice(0, 40)}...');\nconsole.log(hmac.digest('hex'));`,
                        'snippet',
                      )}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition"
                    >
                      {copiedField === 'snippet' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedField === 'snippet' ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap">{`const crypto = require('crypto');
const hmac = crypto.createHmac('${result.algorithm.toLowerCase().replace('-', '')}', 'YOUR_SECRET');
hmac.update('YOUR_MESSAGE');
console.log(hmac.digest('hex'));
// => ${result.hex.slice(0, 40)}...`}</pre>
                </div>
              </div>
            )}
          </div>

          {/* SEO content */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">About HMAC Signature Generator</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">What is HMAC?</h3>
                <p>HMAC (Hash-based Message Authentication Code) is a cryptographic method that combines a message with a secret key using a hash function. It verifies both data integrity and authenticity — confirming the message hasn&apos;t been tampered with and was sent by someone who knows the secret key.</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Use Cases</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Webhook signature verification (Stripe, GitHub, Slack)</li>
                  <li>API request signing and authentication</li>
                  <li>JWT token generation with HS256/384/512</li>
                  <li>Data integrity verification</li>
                  <li>Secure token generation for password resets</li>
                  <li>Cloud service authentication (AWS Signature V4)</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
