'use client';

import { useState } from 'react';

export default function UrlEncoderDecoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [componentType, setComponentType] = useState<'full' | 'component' | 'query'>('full');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const processText = () => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      if (mode === 'encode') {
        if (componentType === 'full') {
          setOutput(encodeURI(input));
        } else if (componentType === 'component') {
          setOutput(encodeURIComponent(input));
        } else {
          // Query: encode each key=value pair
          const lines = input.split('\n');
          const encoded = lines.map(line => {
            if (line.includes('=')) {
              const [key, ...valueParts] = line.split('=');
              return `${encodeURIComponent(key)}=${encodeURIComponent(valueParts.join('='))}`;
            }
            return encodeURIComponent(line);
          });
          setOutput(encoded.join('\n'));
        }
      } else {
        if (componentType === 'full') {
          setOutput(decodeURI(input));
        } else if (componentType === 'component') {
          setOutput(decodeURIComponent(input));
        } else {
          const lines = input.split('\n');
          const decoded = lines.map(line => {
            if (line.includes('=')) {
              const [key, ...valueParts] = line.split('=');
              return `${decodeURIComponent(key)}=${decodeURIComponent(valueParts.join('='))}`;
            }
            return decodeURIComponent(line);
          });
          setOutput(decoded.join('\n'));
        }
      }
    } catch (e) {
      setError(`Failed to ${mode}: ${(e as Error).message}`);
      setOutput('');
    }
  };

  const swap = () => {
    setInput(output);
    setOutput('');
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = {
    encode: [
      'https://example.com/search?q=hello world&lang=en',
      'name=John Doe&email=user@example.com',
      'café résumé naïve',
    ],
    decode: [
      'https://example.com/search?q=hello%20world&lang=en',
      'name=John%20Doe&email=user%40example.com',
      'caf%C3%A9%20r%C3%A9sum%C3%A9%20na%C3%AFve',
    ],
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">URL Encoder / Decoder</h1>
      <p className="mb-6 text-slate-600">
        Encode or decode URLs, URI components, and query strings. Handles special characters, Unicode, and batch query parameters.
      </p>

      <div className="border rounded-lg p-6 mb-6 space-y-6">
        {/* Mode & Type Controls */}
        <div className="flex flex-wrap gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Mode</label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode('encode')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'encode'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  mode === 'decode'
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Decode
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
            <div className="flex gap-2">
              {[
                { value: 'full' as const, label: 'Full URL' },
                { value: 'component' as const, label: 'Component' },
                { value: 'query' as const, label: 'Query String' },
              ].map((t) => (
                <button
                  key={t.value}
                  onClick={() => setComponentType(t.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    componentType === t.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Input {componentType === 'query' && '(one key=value per line)'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === 'encode'
                ? 'Enter text or URL to encode...'
                : 'Enter encoded text to decode...'
            }
            className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={processText}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            {mode === 'encode' ? 'Encode' : 'Decode'}
          </button>
          <button
            onClick={swap}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
          >
            ⇄ Swap
          </button>
          <button
            onClick={() => { setInput(''); setOutput(''); setError(''); }}
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium transition-colors"
          >
            Clear
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Output */}
        {output && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-700">Output</label>
              <button
                onClick={copyToClipboard}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
            <textarea
              readOnly
              value={output}
              className="w-full h-32 px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm bg-slate-50"
            />
          </div>
        )}

        {/* Examples */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Quick Examples</label>
          <div className="flex flex-wrap gap-2">
            {examples[mode].map((ex, i) => (
              <button
                key={i}
                onClick={() => setInput(ex)}
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono text-slate-600 hover:bg-slate-100 truncate max-w-xs"
              >
                {ex.length > 40 ? ex.substring(0, 40) + '…' : ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reference */}
      <div className="border rounded-lg p-6 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Quick Reference</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h3 className="font-medium text-slate-700 mb-1">Full URL</h3>
            <p className="text-slate-600">Encodes spaces and special chars but preserves URL structure (://, /, ?, &).</p>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-1">Component</h3>
            <p className="text-slate-600">Encodes everything — use for individual URL parts like path segments or values.</p>
          </div>
          <div>
            <h3 className="font-medium text-slate-700 mb-1">Query String</h3>
            <p className="text-slate-600">Encodes key=value pairs separately, preserving the = and & structure.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
