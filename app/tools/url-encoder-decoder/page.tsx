'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Zap, ArrowDownUp, RotateCcw, Link2, Unlink } from 'lucide-react';

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [componentMode, setComponentMode] = useState<'full' | 'component'>('full');

  const processText = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        if (componentMode === 'component') {
          setOutput(encodeURIComponent(input));
        } else {
          setOutput(encodeURI(input));
        }
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch {
      setError(`Failed to ${mode} — the input may not be valid ${mode === 'decode' ? 'URL-encoded text' : 'text'}.`);
      setOutput('');
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    setError('');
    if (!value.trim()) {
      setOutput('');
      return;
    }
    try {
      if (mode === 'encode') {
        setOutput(componentMode === 'component' ? encodeURIComponent(value) : encodeURI(value));
      } else {
        setOutput(decodeURIComponent(value));
      }
    } catch {
      setError(`Failed to ${mode} — invalid input.`);
      setOutput('');
    }
  };

  const swap = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    setError('');
    if (!output.trim()) {
      setOutput('');
      return;
    }
    try {
      if (newMode === 'encode') {
        setOutput(componentMode === 'component' ? encodeURIComponent(output) : encodeURI(output));
      } else {
        setOutput(decodeURIComponent(output));
      }
    } catch {
      setError(`Failed to ${newMode} — invalid input.`);
      setOutput('');
    }
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  const copyOutput = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    { label: 'URL with spaces', value: 'https://example.com/search?q=hello world&lang=en' },
    { label: 'Special characters', value: 'name=John Doe&email=user@example.com&msg=Hello & Goodbye!' },
    { label: 'Unicode text', value: 'greeting=你好&emoji=🎉&price=$100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-orange-600/20 text-orange-300 px-4 py-2 rounded-full text-sm mb-4">
            <Zap className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            URL{' '}
            <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">
              Encoder / Decoder
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Encode or decode URLs and URL components instantly. Handles full URLs and individual components like query parameters.
          </p>
        </motion.div>

        {/* Mode Toggle */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => { setMode('encode'); handleInputChange(input); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm transition ${mode === 'encode' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              <a2 className="w-4 h-4" />
              Encode
            </button>
            <button
              onClick={() => { setMode('decode'); handleInputChange(input); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm transition ${mode === 'decode' ? 'bg-orange-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              <Unlink className="w-4 h-4" />
              Decode
            </button>
          </div>

          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => { setComponentMode('full'); handleInputChange(input); }}
              className={`px-3 py-1.5 rounded-md text-sm transition ${componentMode === 'full' ? 'bg-slate-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Full URL
            </button>
            <button
              onClick={() => { setComponentMode('component'); handleInputChange(input); }}
              className={`px-3 py-1.5 rounded-md text-sm transition ${componentMode === 'component' ? 'bg-slate-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              Component
            </button>
          </div>

          <button
            onClick={swap}
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm transition"
          >
            <ArrowDownUp className="w-4 h-4" />
            Swap
          </button>
          <button
            onClick={clear}
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Examples */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {examples.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleInputChange(ex.value)}
              className="text-xs bg-slate-700/50 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition border border-slate-600"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            {mode === 'encode' ? 'Input (decoded text)' : 'Input (encoded text)'}
          </label>
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === 'encode' ? 'https://example.com/search?q=hello world' : 'https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world'}
            className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-slate-200 font-mono text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-y"
          />
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        {/* Output */}
        {output && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">
                {mode === 'encode' ? 'Output (encoded)' : 'Output (decoded)'}
              </label>
              <button
                onClick={copyOutput}
                className="inline-flex items-center gap-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded-lg text-sm transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 font-mono text-sm text-orange-300 break-all whitespace-pre-wrap">
              {output}
            </div>
          </motion.div>
        )}

        {/* Info */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">How it works</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex gap-2">
              <span className="text-orange-400">•</span>
              <span><strong className="text-slate-300">Full URL</strong> — Encodes only special characters while preserving URL structure (://, ?, &amp;, =)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-400">•</span>
              <span><strong className="text-slate-300">Component</strong> — Encodes everything including :, /, ?, &amp; — for use as a single URL parameter value</span>
            </li>
            <li className="flex gap-2">
              <span className="text-orange-400">•</span>
              <span><strong className="text-slate-300">Decode</strong> — Converts %20-style encoded strings back to readable text</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
