'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowDownUp, Shield, RotateCcw, Info } from 'lucide-react';

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function encodeBase32(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let bits = '';
  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, '0');
  }

  let result = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5).padEnd(5, '0');
    const index = parseInt(chunk, 2);
    result += BASE32_ALPHABET[index];
  }

  // Add padding
  while (result.length % 8 !== 0) {
    result += '=';
  }
  return result;
}

function decodeBase32(input: string): { text: string; error: string | null } {
  const cleaned = input.toUpperCase().replace(/=+$/, '').replace(/\s/g, '');

  // Validate
  for (const char of cleaned) {
    if (!BASE32_ALPHABET.includes(char)) {
      return { text: '', error: `Invalid character: "${char}". Base32 only uses A-Z and 2-7.` };
    }
  }

  let bits = '';
  for (const char of cleaned) {
    const index = BASE32_ALPHABET.indexOf(char);
    bits += index.toString(2).padStart(5, '0');
  }

  const bytes: number[] = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) {
    bytes.push(parseInt(bits.substring(i, i + 8), 2));
  }

  try {
    const text = new TextDecoder().decode(new Uint8Array(bytes));
    return { text, error: null };
  } catch {
    return { text: '', error: 'Failed to decode bytes to UTF-8 text.' };
  }
}

function encodeBase32Hex(input: string): string {
  const HEX_ALPHABET = '0123456789abcdefghijklmnopqrstuv';
  const bytes = new TextEncoder().encode(input);
  let bits = '';
  for (const byte of bytes) {
    bits += byte.toString(2).padStart(8, '0');
  }
  let result = '';
  for (let i = 0; i < bits.length; i += 5) {
    const chunk = bits.substring(i, i + 5).padEnd(5, '0');
    result += HEX_ALPHABET[parseInt(chunk, 2)];
  }
  while (result.length % 8 !== 0) {
    result += '=';
  }
  return result;
}

const EXAMPLES = [
  { label: 'Hello World', text: 'Hello, World!' },
  { label: '2FA Secret (16 bytes)', text: 'JBSWY3DPEHPK3PXP' },
  { label: 'API Key', text: 'sk-proj-abc123def456ghi789' },
  { label: 'UUID', text: '550e8400-e29b-41d4-a716-446655440000' },
  { label: 'JSON payload', text: '{"sub":"user123","role":"admin"}' },
];

export default function Base32EncoderDecoder() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [showHex, setShowHex] = useState(false);

  const process = useCallback(() => {
    setError('');
    setOutput('');
    setCopied(false);

    if (!input.trim()) {
      setError('Please enter some text');
      return;
    }

    if (mode === 'encode') {
      try {
        const encoded = encodeBase32(input);
        setOutput(encoded);
        if (showHex) {
          const hexEncoded = encodeBase32Hex(input);
          setOutput((prev) => prev + '\n\nBase32Hex: ' + hexEncoded);
        }
      } catch (e) {
        setError(`Encoding failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      }
    } else {
      const result = decodeBase32(input);
      if (result.error) {
        setError(result.error);
      } else {
        setOutput(result.text);
      }
    }
  }, [input, mode, showHex]);

  const swapInputOutput = () => {
    setInput(output);
    setOutput('');
    setError('');
    setCopied(false);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = (text: string) => {
    setInput(text);
    setOutput('');
    setError('');
    setCopied(false);
  };

  const byteLength = (() => {
    try {
      return new TextEncoder().encode(input).length;
    } catch {
      return 0;
    }
  })();

  const encodedLength = input.trim() ? encodeBase32(input).length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-4">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300 text-sm font-medium">Encoding Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Base32 Encoder / Decoder</h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Encode and decode text to Base32 — the standard used in TOTP 2FA secrets, DNS records, and more.
            100% client-side.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button
              onClick={() => { setMode('encode'); setOutput(''); setError(''); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'encode'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => { setMode('decode'); setOutput(''); setError(''); }}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                mode === 'decode'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Decode
            </button>
          </div>
        </div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-4"
        >
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-slate-300">
              {mode === 'encode' ? 'Text to Encode' : 'Base32 to Decode'}
            </label>
            <div className="flex items-center gap-3">
              {mode === 'encode' && input.trim() && (
                <span className="text-xs text-slate-500">
                  {input.length} chars · {byteLength} bytes
                </span>
              )}
              <button
                onClick={() => { setInput(''); setOutput(''); setError(''); }}
                className="text-slate-500 hover:text-slate-300 transition-colors"
                title="Clear"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base32 string to decode...'}
            className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-white font-mono text-sm resize-y min-h-[120px] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 placeholder:text-slate-600"
            spellCheck={false}
          />

          {/* Options */}
          {mode === 'encode' && (
            <label className="flex items-center gap-2 mt-3 text-sm text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={showHex}
                onChange={(e) => setShowHex(e.target.checked)}
                className="rounded border-slate-600 bg-slate-700 text-emerald-500 focus:ring-emerald-500"
              />
              Also show Base32Hex variant
            </label>
          )}
        </motion.div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={process}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <ArrowDownUp className="w-4 h-4" />
            {mode === 'encode' ? 'Encode to Base32' : 'Decode from Base32'}
          </motion.button>

          {output && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={swapInputOutput}
              className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <ArrowDownUp className="w-4 h-4" />
              Swap
            </motion.button>
          )}
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Output */}
        {output && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-300">
                {mode === 'encode' ? 'Base32 Output' : 'Decoded Text'}
              </label>
              <div className="flex items-center gap-3">
                {mode === 'encode' && (
                  <span className="text-xs text-slate-500">
                    {encodedLength} chars
                  </span>
                )}
                <button
                  onClick={copyOutput}
                  className="flex items-center gap-1.5 text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
            <pre className="bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-emerald-300 font-mono text-sm whitespace-pre-wrap break-all select-all">
              {output}
            </pre>
          </motion.div>
        )}

        {/* Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-8"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Examples</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => loadExample(ex.text)}
                className="text-left bg-slate-900/50 hover:bg-slate-700/50 border border-slate-600 rounded-xl p-3 transition-colors group"
              >
                <div className="text-sm font-medium text-white group-hover:text-emerald-300 transition-colors">
                  {ex.label}
                </div>
                <div className="text-xs text-slate-500 font-mono mt-1 truncate">{ex.text}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Info className="w-5 h-5 text-slate-400" />
            <h2 className="text-lg font-semibold text-white">About Base32</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-400">
            <div>
              <h3 className="font-medium text-slate-200 mb-2">What is Base32?</h3>
              <p>
                Base32 is a binary-to-text encoding that uses 32 ASCII characters (A-Z, 2-7).
                It&apos;s case-insensitive and avoids ambiguous characters like 0/O and 1/I,
                making it ideal for human-readable codes.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-slate-200 mb-2">Common Uses</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>TOTP/HOTP 2FA secrets (Google Authenticator)</li>
                <li>DNS records (RFC 4648)</li>
                <li>Backup codes and recovery keys</li>
                <li>Data URIs and filenames</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
