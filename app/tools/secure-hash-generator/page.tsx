'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, X, RefreshCw, Zap, Settings } from 'lucide-react';

export default function SecureHashGenerator() {
  const [input, setInput] = useState('');
  const [hash, setHash] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('SHA-256');

  const generateHash = async () => {
    if (!input.trim()) {
      setError('Please enter text to hash');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');

      // Convert string to ArrayBuffer
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      let hashBuffer;
      if (selectedAlgorithm === 'SHA-256') {
        hashBuffer = await crypto.subtle.digest('SHA-256', data);
      } else if (selectedAlgorithm === 'SHA-512') {
        hashBuffer = await crypto.subtle.digest('SHA-512', data);
      } else {
        setError('Unsupported algorithm');
        setIsGenerating(false);
        return;
      }

      // Convert ArrayBuffer to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase();
      setHash(hashHex);
    } catch {
      setError('Hash generation failed');
      setHash('');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-600/20 text-indigo-300 px-4 py-2 rounded-full text-sm mb-4">
            <Zap className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Secure{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
              Hash Generator
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Generate secure cryptographic hashes (SHA-256, SHA-512) from text.
            Ideal for verifying data integrity, creating signatures, and cryptographic applications.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
          >
            <X className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        <div className="space-y-6">
          {/* Input and Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-indigo-400" />
                Generate Secure Hash
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to hash..."
                className="w-full h-32 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center justify-between mb-4">
                <select
                  value={selectedAlgorithm}
                  onChange={(e) => setSelectedAlgorithm(e.target.value)}
                  className="bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="SHA-256">SHA-256</option>
                  <option value="SHA-512">SHA-512</option>
                </select>
                <span className="text-slate-400">Selected: {selectedAlgorithm}</span>
              </div>
              <div className="flex items-center justify-between">
                <button
                  onClick={generateHash}
                  disabled={!input.trim() || isGenerating}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5" />
                      Generate Hash
                    </>
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(hash)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  disabled={!hash}
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {hash && (
                <div className="p-4">
                  <h4 className="mb-2 text-sm text-slate-400">Hash Result ({selectedAlgorithm})</h4>
                  <p className="text-slate-300 font-mono break-all word-break">{hash}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 p-4"
          >
            <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-indigo-400" />
              About Secure Hashes
            </h3>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-indigo-400" />
                <span>SHA-256: 256-bit (32-byte) hash, commonly used for data integrity and security applications.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-indigo-400" />
                <span>SHA-512: 512-bit (64-byte) hash, provides higher security margin than SHA-256.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-indigo-400" />
                <span>Both algorithms are collision-resistant and suitable for cryptographic purposes.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check className="w-4 h-4 text-indigo-400" />
                <span>Note: MD5 and SHA1 are not included due to known security vulnerabilities.</span>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 text-center text-slate-500">
          <p>Tip: Secure hashes are irreversible and uniquely represent the input data.</p>
        </div>
      </div>
    </div>
  );
}