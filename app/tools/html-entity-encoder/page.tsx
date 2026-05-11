'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowDownUp, Braces } from 'lucide-react';

const NAMED_ENTITIES: Record<string, string> = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'",
  '&nbsp;': '\u00A0', '&copy;': '\u00A9', '&reg;': '\u00AE', '&trade;': '\u2122', '&euro;': '\u20AC',
  '&pound;': '\u00A3', '&yen;': '\u00A5', '&cent;': '\u00A2', '&sect;': '\u00A7', '&para;': '\u00B6',
  '&laquo;': '\u00AB', '&raquo;': '\u00BB', '&mdash;': '\u2014', '&ndash;': '\u2013', '&hellip;': '\u2026',
  '&lsquo;': '\u2018', '&rsquo;': '\u2019', '&ldquo;': '\u201C', '&rdquo;': '\u201D', '&bull;': '\u2022',
  '&deg;': '\u00B0', '&micro;': '\u00B5', '&times;': '\u00D7', '&divide;': '\u00F7', '&plusmn;': '\u00B1',
  '&sup2;': '\u00B2', '&sup3;': '\u00B3', '&frac12;': '\u00BD', '&frac14;': '\u00BC', '&frac34;': '\u00BE',
  '&iexcl;': '\u00A1', '&iquest;': '\u00BF', '&Agrave;': '\u00C0', '&Aacute;': '\u00C1', '&Acirc;': '\u00C2',
  '&Egrave;': '\u00C8', '&Eacute;': '\u00C9', '&Igrave;': '\u00CC', '&Ograve;': '\u00D2', '&Ugrave;': '\u00D9',
  '&agrave;': '\u00E0', '&aacute;': '\u00E1', '&acirc;': '\u00E2', '&egrave;': '\u00E8', '&eacute;': '\u00E9',
  '&igrave;': '\u00EC', '&oacute;': '\u00F3', '&ograve;': '\u00F2', '&ugrave;': '\u00F9', '&uacute;': '\u00FA',
  '&ntilde;': '\u00F1', '&Ntilde;': '\u00D1', '&ccedil;': '\u00E7', '&Ccedil;': '\u00C7',
  '&szlig;': '\u00DF', '&oelig;': '\u0153', '&OElig;': '\u0152', '&aelig;': '\u00E6', '&AElig;': '\u00C6',
};

const CHAR_TO_ENTITY: Record<string, string> = {};
Object.entries(NAMED_ENTITIES).forEach(([entity, char]) => {
  if (!CHAR_TO_ENTITY[char] || entity.length < CHAR_TO_ENTITY[char].length) {
    CHAR_TO_ENTITY[char] = entity;
  }
});

function encodeHtml(text: string, mode: 'named' | 'numeric' | 'hex'): string {
  let result = '';
  for (const ch of text) {
    if (ch === '<') { result += '&lt;'; continue; }
    if (ch === '>') { result += '&gt;'; continue; }
    if (ch === '&') { result += '&amp;'; continue; }
    if (ch === '"') { result += '&quot;'; continue; }
    if (mode === 'named' && CHAR_TO_ENTITY[ch]) {
      result += CHAR_TO_ENTITY[ch];
    } else if (ch.charCodeAt(0) > 127) {
      result += mode === 'hex' ? `&#x${ch.charCodeAt(0).toString(16)};` : `&#${ch.charCodeAt(0)};`;
    } else {
      result += ch;
    }
  }
  return result;
}

function decodeHtml(text: string): string {
  return text
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(parseInt(dec, 10)))
    .replace(/&[a-zA-Z]+;/g, (entity) => NAMED_ENTITIES[entity] ?? entity);
}

const COMMON_ENTITIES = [
  { char: '<', entity: '&lt;', hex: '&#x3c;', numeric: '&#60;', name: 'Less than' },
  { char: '>', entity: '&gt;', hex: '&#x3e;', numeric: '&#62;', name: 'Greater than' },
  { char: '&', entity: '&amp;', hex: '&#x26;', numeric: '&#38;', name: 'Ampersand' },
  { char: '"', entity: '&quot;', hex: '&#x22;', numeric: '&#34;', name: 'Double quote' },
  { char: "'", entity: '&apos;', hex: '&#x27;', numeric: '&#39;', name: 'Single quote' },
  { char: '\u00A0', entity: '&nbsp;', hex: '&#xa0;', numeric: '&#160;', name: 'Non-breaking space' },
  { char: '\u00A9', entity: '&copy;', hex: '&#xa9;', numeric: '&#169;', name: 'Copyright' },
  { char: '\u00AE', entity: '&reg;', hex: '&#xae;', numeric: '&#174;', name: 'Registered' },
  { char: '\u2122', entity: '&trade;', hex: '&#x2122;', numeric: '&#8482;', name: 'Trademark' },
  { char: '\u20AC', entity: '&euro;', hex: '&#x20ac;', numeric: '&#8364;', name: 'Euro' },
  { char: '\u2014', entity: '&mdash;', hex: '&#x2014;', numeric: '&#8212;', name: 'Em dash' },
  { char: '\u2192', entity: '&rarr;', hex: '&#x2192;', numeric: '&#8594;', name: 'Right arrow' },
];

export default function HtmlEntityEncoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeType, setEncodeType] = useState<'named' | 'numeric' | 'hex'>('named');
  const [copied, setCopied] = useState(false);

  const process = useCallback(() => {
    if (!input.trim()) { setOutput(''); return; }
    setOutput(mode === 'encode' ? encodeHtml(input, encodeType) : decodeHtml(input));
    setCopied(false);
  }, [input, mode, encodeType]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleSwap = useCallback(() => {
    setInput(output);
    setOutput('');
  }, [output]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 rounded-full px-4 py-1.5 text-violet-400 text-sm mb-4">
            <Braces size={14} /> Free Tool
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
            HTML Entity Encoder / Decoder
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Encode or decode HTML entities instantly. Supports named entities, numeric codes, and hex codes.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-6">

          <div className="flex flex-wrap gap-2 mb-6">
            <button onClick={() => { setMode('encode'); setOutput(''); }}
              className={"px-4 py-2 rounded-lg text-sm font-medium transition-all " + (mode === 'encode' ? 'bg-violet-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700')}>
              Encode &rarr;
            </button>
            <button onClick={() => { setMode('decode'); setOutput(''); }}
              className={"px-4 py-2 rounded-lg text-sm font-medium transition-all " + (mode === 'decode' ? 'bg-violet-500 text-white' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700')}>
              &larr; Decode
            </button>
          </div>

          {mode === 'encode' && (
            <div className="flex flex-wrap gap-2 mb-6">
              {(['named', 'numeric', 'hex'] as const).map((t) => (
                <button key={t} onClick={() => { setEncodeType(t); setOutput(''); }}
                  className={"px-3 py-1.5 rounded-lg text-xs font-medium transition-all " + (encodeType === t ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700')}>
                  {t === 'named' ? 'Named (&amp;)' : t === 'numeric' ? 'Numeric (&#38;)' : 'Hex (&#x26;)'}
                </button>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">{mode === 'encode' ? 'Plain Text Input' : 'HTML Entities Input'}</label>
              <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} placeholder={mode === 'encode' ? 'Type or paste text to encode...' : 'Type or paste HTML entities to decode...'}
                className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-violet-500 focus:outline-none resize-none" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm text-gray-400">{mode === 'encode' ? 'Encoded Output' : 'Decoded Output'}</label>
                {output && (
                  <button onClick={handleCopy}
                    className={"flex items-center gap-1 px-2 py-1 rounded text-xs transition-all " + (copied ? 'bg-green-500/20 text-green-400' : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700')}>
                    {copied ? <><Check size={12} /> Copied</> : <><Copy size={12} /> Copy</>}
                  </button>
                )}
              </div>
              <textarea value={output} readOnly rows={8} placeholder="Output will appear here..."
                className="w-full bg-gray-900/50 border border-gray-600 rounded-xl px-4 py-3 text-green-300 font-mono text-sm focus:outline-none resize-none" />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={process}
              className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-violet-400 hover:to-purple-400 transition-all">
              {mode === 'encode' ? 'Encode' : 'Decode'}
            </button>
            {output && (
              <button onClick={handleSwap}
                className="flex items-center gap-2 bg-gray-700/50 text-gray-300 px-4 py-3 rounded-xl hover:bg-gray-700 transition-all">
                <ArrowDownUp size={16} /> Swap
              </button>
            )}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-white">Common HTML Entities Reference</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Character</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Named</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Hex</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Decimal</th>
                  <th className="text-left py-2 px-3 text-gray-400 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {COMMON_ENTITIES.map((e) => (
                  <tr key={e.entity} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                    <td className="py-2 px-3 text-white font-mono text-lg">{e.char}</td>
                    <td className="py-2 px-3 text-violet-300 font-mono">{e.entity}</td>
                    <td className="py-2 px-3 text-purple-300 font-mono text-xs">{e.hex}</td>
                    <td className="py-2 px-3 text-purple-300 font-mono text-xs">{e.numeric}</td>
                    <td className="py-2 px-3 text-gray-400">{e.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
