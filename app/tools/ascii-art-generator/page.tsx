'use client';

import { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Type, Download, Sparkles } from 'lucide-react';

// Block-style font (each char is 5 tall × 6 wide)
const FONT_MAP: Record<string, string[]> = {
  A: [
    ' ░███░ ',
    '██░░░██',
    '███████',
    '██░░░██',
    '██░░░██',
  ],
  B: [
    '██████░',
    '██░░░██',
    '██████░',
    '██░░░██',
    '██████░',
  ],
  C: [
    '░██████',
    '██░░░░░',
    '██░░░░░',
    '██░░░░░',
    '░██████',
  ],
  D: [
    '██████░',
    '██░░░██',
    '██░░░██',
    '██░░░██',
    '██████░',
  ],
  E: [
    '███████',
    '██░░░░░',
    '█████░░',
    '██░░░░░',
    '███████',
  ],
  F: [
    '███████',
    '██░░░░░',
    '█████░░',
    '██░░░░░',
    '██░░░░░',
  ],
  G: [
    '░██████',
    '██░░░░░',
    '██░░███',
    '██░░░██',
    '░█████░',
  ],
  H: [
    '██░░░██',
    '██░░░██',
    '███████',
    '██░░░██',
    '██░░░██',
  ],
  I: [
    '███████',
    '░░███░░',
    '░░███░░',
    '░░███░░',
    '███████',
  ],
  J: [
    '░░░░░██',
    '░░░░░██',
    '░░░░░██',
    '██░░░██',
    '░█████░',
  ],
  K: [
    '██░░░██',
    '██░░██░',
    '█████░░',
    '██░░██░',
    '██░░░██',
  ],
  L: [
    '██░░░░░',
    '██░░░░░',
    '██░░░░░',
    '██░░░░░',
    '███████',
  ],
  M: [
    '██░░░██',
    '███████',
    '███████',
    '██░░░██',
    '██░░░██',
  ],
  N: [
    '██░░░██',
    '███░░██',
    '███████',
    '██░░███',
    '██░░░██',
  ],
  O: [
    '░█████░',
    '██░░░██',
    '██░░░██',
    '██░░░██',
    '░█████░',
  ],
  P: [
    '██████░',
    '██░░░██',
    '██████░',
    '██░░░░░',
    '██░░░░░',
  ],
  Q: [
    '░█████░',
    '██░░░██',
    '██░░░██',
    '██░░██░',
    '░████░█',
  ],
  R: [
    '██████░',
    '██░░░██',
    '██████░',
    '██░░██░',
    '██░░░██',
  ],
  S: [
    '░██████',
    '██░░░░░',
    '░█████░',
    '░░░░░██',
    '██████░',
  ],
  T: [
    '███████',
    '░░███░░',
    '░░███░░',
    '░░███░░',
    '░░███░░',
  ],
  U: [
    '██░░░██',
    '██░░░██',
    '██░░░██',
    '██░░░██',
    '░█████░',
  ],
  V: [
    '██░░░██',
    '██░░░██',
    '██░░░██',
    '░██░██░',
    '░░███░░',
  ],
  W: [
    '██░░░██',
    '██░░░██',
    '███████',
    '███████',
    '██░░░██',
  ],
  X: [
    '██░░░██',
    '░██░██░',
    '░░███░░',
    '░██░██░',
    '██░░░██',
  ],
  Y: [
    '██░░░██',
    '░██░██░',
    '░░███░░',
    '░░███░░',
    '░░███░░',
  ],
  Z: [
    '███████',
    '░░░░██░',
    '░░██░░░',
    '░██░░░░',
    '███████',
  ],
  '0': [
    '░█████░',
    '██░░░██',
    '██░░░██',
    '██░░░██',
    '░█████░',
  ],
  '1': [
    '░░███░░',
    '░█████░',
    '░░███░░',
    '░░███░░',
    '░░███░░',
  ],
  '2': [
    '░█████░',
    '██░░░██',
    '░░░███░',
    '░██░░░░',
    '███████',
  ],
  '3': [
    '░█████░',
    '██░░░██',
    '░░░███░',
    '██░░░██',
    '░█████░',
  ],
  '4': [
    '██░░░██',
    '██░░░██',
    '███████',
    '░░░░░██',
    '░░░░░██',
  ],
  '5': [
    '███████',
    '██░░░░░',
    '██████░',
    '░░░░░██',
    '██████░',
  ],
  '6': [
    '░█████░',
    '██░░░░░',
    '██████░',
    '██░░░██',
    '░█████░',
  ],
  '7': [
    '███████',
    '░░░░░██',
    '░░░███░',
    '░███░░░',
    '░██░░░░',
  ],
  '8': [
    '░█████░',
    '██░░░██',
    '░█████░',
    '██░░░██',
    '░█████░',
  ],
  '9': [
    '░█████░',
    '██░░░██',
    '░██████',
    '░░░░░██',
    '░█████░',
  ],
  ' ': [
    '░░░░░░',
    '░░░░░░',
    '░░░░░░',
    '░░░░░░',
    '░░░░░░',
  ],
  '!': [
    '░███░░',
    '░███░░',
    '░███░░',
    '░░░░░░',
    '░███░░',
  ],
  '?': [
    '░█████░',
    '██░░░██',
    '░░░███░',
    '░░░░░░░',
    '░░███░░',
  ],
  '-': [
    '░░░░░░░',
    '░░░░░░░',
    '███████',
    '░░░░░░░',
    '░░░░░░░',
  ],
  '.': [
    '░░░░░',
    '░░░░░',
    '░░░░░',
    '░░░░░',
    '░███░',
  ],
  ',': [
    '░░░░░',
    '░░░░░',
    '░░░░░',
    '░██░░',
    '░██░░',
  ],
  ':': [
    '░░░░░',
    '░██░░',
    '░░░░░',
    '░██░░',
    '░░░░░',
  ],
  '+': [
    '░░░░░░░',
    '░░███░░',
    '███████',
    '░░███░░',
    '░░░░░░░',
  ],
  '=': [
    '░░░░░░░',
    '███████',
    '░░░░░░░',
    '███████',
    '░░░░░░░',
  ],
  '/': [
    '░░░░░██',
    '░░░░██░',
    '░░███░░',
    '░██░░░░',
    '██░░░░░',
  ],
  '@': [
    '░██████',
    '██░░░░█',
    '██░██░█',
    '██░██░█',
    '░█████░',
  ],
  '#': [
    '░██░██░',
    '███████',
    '░██░██░',
    '███████',
    '░██░██░',
  ],
  '*': [
    '░░░░░░░',
    '░█░█░█░',
    '░░███░░',
    '░█░█░█░',
    '░░░░░░░',
  ],
  '(': [
    '░░██░░',
    '░██░░░',
    '░██░░░',
    '░██░░░',
    '░░██░░',
  ],
  ')': [
    '░░██░░',
    '░░░██░',
    '░░░██░',
    '░░░██░',
    '░░██░░',
  ],
  '_': [
    '░░░░░░░',
    '░░░░░░░',
    '░░░░░░░',
    '░░░░░░░',
    '███████',
  ],
  "'": [
    '░██░░',
    '░██░░',
    '░░░░░',
    '░░░░░',
    '░░░░░',
  ],
  '"': [
    '██░██░',
    '██░██░',
    '░░░░░░',
    '░░░░░░',
    '░░░░░░',
  ],
};

// Small/compact font for the compact mode
const SMALL_FONT: Record<string, string[]> = {
  A: ['▄▀█░', '█▀█░', '░░░░'],
  B: ['█▄▄░', '█▄█░', '░░░░'],
  C: ['█▀▀░', '█▄▄░', '░░░░'],
  D: ['█▀▄░', '█▄▀░', '░░░░'],
  E: ['█▀▀░', '██▄░', '░░░░'],
  F: ['█▀▀░', '█▀░░', '░░░░'],
  G: ['█▀▀░', '█▄█░', '░░░░'],
  H: ['█░█░', '█▀█░', '░░░░'],
  I: ['█░░░', '█░░░', '░░░░'],
  J: ['░░█░', '█▄█░', '░░░░'],
  K: ['█▄▀░', '█▀▄░', '░░░░'],
  L: ['█░░░', '█▄▄░', '░░░░'],
  M: ['█▀▄▀█', '█░▀░█', '░░░░░'],
  N: ['█▄░█░', '█░▀█░', '░░░░░'],
  O: ['█▀█░', '█▄█░', '░░░░'],
  P: ['█▀█░', '█▀░░', '░░░░'],
  Q: ['█▀█░', '▀▀█░', '░░░░'],
  R: ['█▀█░', '█▀▄░', '░░░░'],
  S: ['█▀▀░', '▄▄█░', '░░░░'],
  T: ['▀█▀░', '░█░░', '░░░░'],
  U: ['█░█░', '█▄█░', '░░░░'],
  V: ['█░█░', '▀▄▀░', '░░░░'],
  W: ['█░█░█', '▀▄▀▄▀', '░░░░░'],
  X: ['█░█░', '▄▀▄░', '░░░░'],
  Y: ['█░█░', '░▀░░', '░░░░'],
  Z: ['▀▀█░', '█▄▄░', '░░░░'],
  '0': ['█▀█░', '█▄█░', '░░░░'],
  '1': ['▄█░░', '░█░░', '░░░░'],
  '2': ['▀█░░', '█▄▄░', '░░░░'],
  '3': ['▀█░░', '▄█░░', '░░░░'],
  '4': ['█░█░', '▀▀█░', '░░░░'],
  '5': ['█▀░░', '▄█░░', '░░░░'],
  '6': ['█▀▀░', '█▄█░', '░░░░'],
  '7': ['▀▀█░', '░█░░', '░░░░'],
  '8': ['█▀█░', '█▄█░', '░░░░'],
  '9': ['█▀█░', '▀▀█░', '░░░░'],
  ' ': ['░░░░', '░░░░', '░░░░'],
  '!': ['█░░░', '░░░░', '░░░░'],
  '?': ['▀█░░', '░░░░', '░░░░'],
  '-': ['░░░░', '▀▀░░', '░░░░'],
  '.': ['░░░░', '░░░░'],
  '+': ['░█░░', '▀█▀░'],
  '=': ['▀▀░░', '▀▀░░'],
};

type FontMode = 'block' | 'small' | 'banner';

// Banner text using simple ASCII characters
function renderBanner(text: string): string {
  const upper = text.toUpperCase();
  const lines: string[] = ['', '', '', '', ''];
  
  for (const ch of upper) {
    const glyph = FONT_MAP[ch];
    if (glyph) {
      for (let row = 0; row < 5; row++) {
        lines[row] += glyph[row] + '░';
      }
    } else {
      for (let row = 0; row < 5; row++) {
        lines[row] += '░░░░░░░';
      }
    }
  }
  
  return lines.join('\n');
}

// Small text using unicode block chars
function renderSmall(text: string): string {
  const upper = text.toUpperCase();
  const rows = 2;
  const lines: string[] = ['', ''];
  
  for (const ch of upper) {
    const glyph = SMALL_FONT[ch];
    if (glyph) {
      lines[0] += glyph[0];
      lines[1] += glyph[1];
    } else {
      lines[0] += '░░░░';
      lines[1] += '░░░░';
    }
  }
  
  return lines.join('\n');
}

// Standard text banner using classic `banner` style
function renderStandard(text: string): string {
  const upper = text.toUpperCase();
  const lines: string[] = [];
  
  for (const ch of upper) {
    const glyph = FONT_MAP[ch];
    if (glyph) {
      lines.push(...glyph.map((line, i) => {
        const idx = i;
        return line;
      }));
      // Add spacing row
    }
  }
  
  // Rebuild by interleaving rows
  const result: string[] = ['', '', '', '', ''];
  for (const ch of upper) {
    const glyph = FONT_MAP[ch];
    if (glyph) {
      for (let r = 0; r < 5; r++) {
        result[r] += glyph[r] + '░';
      }
    } else {
      for (let r = 0; r < 5; r++) {
        result[r] += '░░░░░░░░';
      }
    }
  }
  
  return result.join('\n');
}

export default function AsciiArtGenerator() {
  const [input, setInput] = useState('HELLO');
  const [fontMode, setFontMode] = useState<FontMode>('block');
  const [fillChar, setFillChar] = useState('█');
  const [emptyChar, setEmptyChar] = useState('░');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const downloadText = useCallback((text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const output = useMemo(() => {
    if (!input.trim()) return '';
    
    const upper = input.toUpperCase();
    
    if (fontMode === 'banner') {
      // Simple ASCII banner using = and |
      const width = upper.length * 8 + 2;
      const border = '#'.repeat(width);
      const middle = `#${upper.split('').map(c => `  ${c}  `).join('')}#`;
      return [border, '#  ' + upper + '  #', border].join('\n');
    }
    
    const result: string[] = ['', '', '', '', ''];
    for (const ch of upper) {
      const glyph = FONT_MAP[ch];
      if (glyph) {
        for (let r = 0; r < 5; r++) {
          result[r] += glyph[r]
            .replace(/█/g, fillChar)
            .replace(/░/g, emptyChar) + emptyChar;
        }
      } else {
        for (let r = 0; r < 5; r++) {
          result[r] += emptyChar.repeat(7) + emptyChar;
        }
      }
    }
    
    return result.join('\n');
  }, [input, fontMode, fillChar, emptyChar]);

  // Generate shadow variant
  const shadowOutput = useMemo(() => {
    if (!output || fontMode === 'banner') return '';
    const lines = output.split('\n');
    const shadowLines = lines.map((line, i) => {
      if (i === 0) return line;
      return '░'.repeat(i) + line.slice(0, -i);
    });
    return shadowLines.join('\n');
  }, [output, fontMode]);

  const presets = [
    { label: 'HELLO', value: 'HELLO' },
    { label: 'ZION', value: 'ZION' },
    { label: 'DEPLOY', value: 'DEPLOY' },
    { label: '404', value: '404' },
    { label: 'AI POWERED', value: 'AI POWERED' },
    { label: 'BUILD', value: 'BUILD' },
    { label: 'WOW', value: 'WOW' },
    { label: 'ALPHA', value: 'ALPHA' },
  ];

  const charSets = [
    { label: 'Blocks', fill: '█', empty: '░' },
    { label: 'Hashes', fill: '#', empty: ' ' },
    { label: 'Stars', fill: '*', empty: ' ' },
    { label: 'X/O', fill: 'X', empty: '.' },
    { label: '1/0', fill: '1', empty: '0' },
    { label: 'Dots', fill: '●', empty: '○' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-4">
            <Type className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ASCII Art Text Generator</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Convert any text into block-style ASCII art. Perfect for terminal banners, README headers, 
            comments in code, and decorative text. 100% client-side.
          </p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Text</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to convert..."
            maxLength={20}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-lg font-mono focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          />
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setInput(p.value)}
                  className={`px-2.5 py-1 text-xs font-mono rounded-md transition ${
                    input === p.value
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-400">{input.length}/20</span>
          </div>
        </div>

        {/* Options */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Character Set</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {charSets.map((cs) => (
              <button
                key={cs.label}
                onClick={() => { setFillChar(cs.fill); setEmptyChar(cs.empty); }}
                className={`px-3 py-1.5 text-sm rounded-lg border transition ${
                  fillChar === cs.fill && emptyChar === cs.empty
                    ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-medium'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <span className="font-mono">{cs.fill}</span>
                <span className="text-gray-400">{cs.empty}</span>
                {' '}{cs.label}
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Fill character</label>
              <input
                type="text"
                value={fillChar}
                onChange={(e) => setFillChar(e.target.value.charAt(0) || '█')}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg font-mono text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Empty character</label>
              <input
                type="text"
                value={emptyChar}
                onChange={(e) => setEmptyChar(e.target.value.charAt(0) || '░')}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg font-mono text-center focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Output */}
        {output && (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Generated ASCII Art
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(output)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() => downloadText(output, `ascii-${input.toLowerCase().replace(/\s+/g, '-')}.txt`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-xs leading-tight font-mono select-all">
                {output}
              </pre>
            </div>

            {/* Shadow variant */}
            {shadowOutput && fontMode !== 'banner' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-700">Shadow Variant</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(shadowOutput)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      Copy
                    </button>
                    <button
                      onClick={() => downloadText(shadowOutput, `ascii-shadow-${input.toLowerCase().replace(/\s+/g, '-')}.txt`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                </div>
                <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-x-auto text-xs leading-tight font-mono select-all">
                  {shadowOutput}
                </pre>
              </div>
            )}

            {/* Usage Examples */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">💡 Usage Ideas</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Terminal Welcome</p>
                  <p className="text-xs text-gray-500">Add to your .bashrc or .zshrc for a custom login banner</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-1">README Headers</p>
                  <p className="text-xs text-gray-500">Make your GitHub README stand out with ASCII headers</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Code Comments</p>
                  <p className="text-xs text-gray-500">Label sections in large codebases with visible banners</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Server Banners</p>
                  <p className="text-xs text-gray-500">SSH motd or server status pages</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Log File Headers</p>
                  <p className="text-xs text-gray-500">Mark major sections in log files for easy scanning</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-700 mb-1">ASCII Art Fun</p>
                  <p className="text-xs text-gray-500">Generate text art for social posts, chat, or Slack</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
