'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Minimize2, Maximize2, RotateCcw, FileText, BarChart3 } from 'lucide-react';

const SAMPLE_CSS = `/* Main layout styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0  1.5rem;
}

.hero-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea  0%, #764ba2  100%);
}

.hero-title {
  font-size: 3.5rem;
  font-weight:  700;
  color: #ffffff;
  text-align: center;
  line-height:  1.2;
  margin-bottom:  1.0rem;
}

/* Card component */
.card {
  border-radius: 0.5rem;
  box-shadow: 0  4px  6px  rgba(0,  0,  0,  0.1);
  padding: 1.5rem;
  background-color: #ffffff;
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0  8px  25px  rgba(0,  0,  0,  0.15);
}

/* Responsive grid */
@media (max-width: 768px) {
  .container {
    padding: 0  1rem;
  }

  .hero-title {
    font-size: 2rem;
  }

  .card {
    padding: 1rem;
    border-radius:  0.25rem;
  }
}

/* Utility classes */
.hidden {
  display: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,  0,  0,  0);
  border: 0;
}`;

function minifyCSS(css: string): string {
  let result = css;
  // Remove comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  // Preserve strings by replacing them with placeholders
  const strings: string[] = [];
  result = result.replace(/(["'])(?:(?!\1)[^\\]|\\.)*?\1/g, (match) => {
    strings.push(match);
    return `__STR${strings.length - 1}__`;
  });
  // Collapse whitespace
  result = result.replace(/\s+/g, ' ');
  // Remove space around { } : ; , > + ~
  result = result.replace(/\s*([{}:;,>~+])\s*/g, '$1');
  // Remove space after ( in functions
  result = result.replace(/\(\s+/g, '(');
  // Remove trailing semicolons before }
  result = result.replace(/;}/g, '}');
  // Remove leading zeros from decimals
  result = result.replace(/:?\s*0+(\.\d+)/g, '$1');
  // Remove units from zero values
  result = result.replace(/:?\s*0(?:px|em|rem|%|vh|vw|vmin|vmax|pt|pc|in|cm|mm|ex|ch)/gi, ':0');
  // Restore strings
  result = result.replace(/__STR(\d+)__/g, (_, i) => strings[parseInt(i)]);
  return result.trim();
}

function beautifyCSS(css: string, indent: string = '  '): string {
  let result = css;
  // Remove existing comments for clean re-formatting
  const comments: string[] = [];
  result = result.replace(/\/\*[\s\S]*?\*\//g, (match) => {
    comments.push(match);
    return `\n__COMMENT${comments.length - 1}__\n`;
  });
  // Remove excessive whitespace
  result = result.replace(/\s+/g, ' ').trim();
  // Add newline after {
  result = result.replace(/\{/g, ' {\n');
  // Add newline before }
  result = result.replace(/\}/g, '\n}\n');
  // Add newline after ;
  result = result.replace(/;/g, ';\n');
  // Split into lines and indent
  const lines = result.split('\n');
  let depth = 0;
  const indented: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed === '}') {
      depth = Math.max(0, depth - 1);
    }
    if (trimmed.startsWith('__COMMENT')) {
      indented.push(indent.repeat(depth) + trimmed);
    } else {
      indented.push(indent.repeat(depth) + trimmed);
    }
    if (trimmed.endsWith('{')) {
      depth++;
    }
  }
  // Restore comments
  result = indented.join('\n');
  result = result.replace(/__COMMENT(\d+)__/g, (_, i) => comments[parseInt(i)]);
  return result.trim() + '\n';
}

function analyzeCSS(css: string) {
  const rules = (css.match(/[^{}]+\{[^}]*\}/g) || []).length;
  const selectors = new Set(
    (css.match(/[^{}\s][^{}]*(?=\{)/g) || []).map((s) => s.trim().split(',')[0].trim())
  );
  const properties = (css.match(/[\w-]+\s*:/g) || []).length;
  const comments = (css.match(/\/\*[\s\S]*?\*\//g) || []).length;
  const mediaQueries = (css.match(/@media[^{]+\{/g) || []).length;
  const keyframes = (css.match(/@keyframes[^{]+\{/g) || []).length;
  const colors = new Set(
    (css.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]+\)|hsla?\([^)]+\)/g) || []).map((c) =>
      c.toLowerCase()
    )
  );
  const fonts = new Set(
    (css.match(/font-family\s*:[^;]+/gi) || []).map((f) =>
      f.replace(/font-family\s*:\s*/i, '').replace(/['"]/g, '').trim()
    )
  );
  const important = (css.match(/!important/gi) || []).length;
  const emptyRules = (css.match(/\{[\s]*\}/g) || []).length;
  const charCount = css.length;
  const lineCount = css.split('\n').length;
  const minified = minifyCSS(css);
  const savings = charCount > 0 ? ((1 - minified.length / charCount) * 100).toFixed(1) : '0';

  return {
    rules,
    uniqueSelectors: selectors.size,
    properties,
    comments,
    mediaQueries,
    keyframes,
    colors: colors.size,
    fonts: fonts.size,
    important,
    emptyRules,
    charCount,
    lineCount,
    minifiedSize: minified.length,
    savings: savings + '%',
  };
}

type Mode = 'minify' | 'beautify';

export default function CSSMinifierBeautifier() {
  const [input, setInput] = useState(SAMPLE_CSS);
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('minify');
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const processCSS = useCallback(
    (css: string, m: Mode, indent: number) => {
      if (!css.trim()) {
        setOutput('');
        return;
      }
      try {
        if (m === 'minify') {
          setOutput(minifyCSS(css));
        } else {
          const indentStr = ' '.repeat(indent);
          setOutput(beautifyCSS(css, indentStr));
        }
      } catch {
        setOutput('Error processing CSS');
      }
    },
    []
  );

  const handleModeChange = (m: Mode) => {
    setMode(m);
    processCSS(input, m, indentSize);
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    processCSS(val, mode, indentSize);
  };

  const handleIndentChange = (size: number) => {
    setIndentSize(size);
    processCSS(input, mode, size);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setInput('');
    setOutput('');
  };

  const handleLoadSample = () => {
    setInput(SAMPLE_CSS);
    processCSS(SAMPLE_CSS, mode, indentSize);
  };

  const stats = input.trim() ? analyzeCSS(input) : null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CSS Minifier & Beautifier</h1>
              <p className="text-gray-600">Minify CSS for production or beautify for readability. Includes analysis stats.</p>
            </div>
          </div>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex rounded-lg border border-gray-200 overflow-hidden">
            <button
              onClick={() => handleModeChange('minify')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                mode === 'minify'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Minimize2 className="w-4 h-4" />
              Minify
            </button>
            <button
              onClick={() => handleModeChange('beautify')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                mode === 'beautify'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
              Beautify
            </button>
          </div>

          {mode === 'beautify' && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600">Indent:</span>
              {[2, 4].map((size) => (
                <button
                  key={size}
                  onClick={() => handleIndentChange(size)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                    indentSize === size
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {size} spaces
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setShowStats(!showStats)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition ${
              showStats
                ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Stats
          </button>

          <button
            onClick={handleLoadSample}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Load Sample
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            <RotateCcw className="w-4 h-4" />
            Clear
          </button>
        </div>

        {/* Stats Panel */}
        {showStats && stats && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4"
          >
            <h3 className="text-sm font-semibold text-indigo-900 mb-3">CSS Analysis</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {[
                { label: 'Rules', value: stats.rules, color: 'text-indigo-700' },
                { label: 'Selectors', value: stats.uniqueSelectors, color: 'text-violet-700' },
                { label: 'Properties', value: stats.properties, color: 'text-purple-700' },
                { label: 'Colors', value: stats.colors, color: 'text-pink-700' },
                { label: 'Media Queries', value: stats.mediaQueries, color: 'text-cyan-700' },
                { label: '!important', value: stats.important, color: stats.important > 0 ? 'text-amber-700' : 'text-gray-500' },
                { label: 'Empty Rules', value: stats.emptyRules, color: stats.emptyRules > 0 ? 'text-red-700' : 'text-gray-500' },
                { label: 'Comments', value: stats.comments, color: 'text-gray-600' },
                { label: 'Keyframes', value: stats.keyframes, color: 'text-teal-700' },
                { label: 'Fonts', value: stats.fonts, color: 'text-sky-700' },
                { label: 'Lines', value: stats.lineCount, color: 'text-slate-700' },
                { label: 'Characters', value: stats.charCount.toLocaleString(), color: 'text-slate-700' },
                { label: 'Minified Size', value: stats.minifiedSize.toLocaleString() + 'B', color: 'text-emerald-700' },
                { label: 'Savings', value: stats.savings, color: 'text-emerald-700' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-lg p-2.5 border border-indigo-100">
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Editor */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Input CSS</label>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder="Paste your CSS here..."
              className="w-full h-96 p-4 font-mono text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
              spellCheck={false}
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">
                Output {mode === 'minify' ? '(Minified)' : '(Beautified)'}
              </label>
              {output && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder={mode === 'minify' ? 'Minified CSS will appear here...' : 'Beautified CSS will appear here...'}
              className="w-full h-96 p-4 font-mono text-sm border border-gray-200 rounded-xl bg-gray-50 resize-none"
              spellCheck={false}
            />
          </div>
        </div>

        {output && (
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Input: <strong>{input.length.toLocaleString()}</strong> chars</span>
            <span>Output: <strong>{output.length.toLocaleString()}</strong> chars</span>
            <span>
              Change:{' '}
              <strong className={output.length < input.length ? 'text-emerald-600' : 'text-amber-600'}>
                {output.length < input.length ? '-' : '+'}
                {Math.abs(output.length - input.length).toLocaleString()} chars
                ({input.length > 0 ? ((1 - output.length / input.length) * 100).toFixed(1) : 0}%)
              </strong>
            </span>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Minification</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Removes all comments</li>
                <li>Collapses whitespace and newlines</li>
                <li>Strips spaces around selectors and properties</li>
                <li>Removes trailing semicolons before closing braces</li>
                <li>100% client-side — your CSS never leaves the browser</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Beautification</h3>
              <ul className="space-y-1 list-disc list-inside">
                <li>Adds consistent indentation (2 or 4 spaces)</li>
                <li>Puts each property on its own line</li>
                <li>Formats media queries and nested rules clearly</li>
                <li>Preserves comments in readable positions</li>
                <li>Great for cleaning up minified or messy CSS</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
