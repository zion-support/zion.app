'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, Trash2, Plus, Minus, AlertTriangle, CheckCircle, Info, Palette } from 'lucide-react';

interface Specificity {
  a: number; // IDs
  b: number; // classes, attributes, pseudo-classes
  c: number; // elements, pseudo-elements
}

interface SelectorResult {
  selector: string;
  specificity: Specificity;
  score: number;
  category: 'important' | 'inline' | 'id' | 'class' | 'type' | 'universal';
  label: string;
  color: string;
}

function calculateSpecificity(selector: string): Specificity {
  // Remove :not() contents but keep as pseudo-class
  let cleaned = selector.replace(/:not\([^)]*\)/g, ':not()');

  let a = 0; // IDs
  let b = 0; // classes, attributes, pseudo-classes
  let c = 0; // elements, pseudo-elements

  // Split by combinators while preserving structure
  const parts = cleaned.split(/[\s>+~]+/);

  for (const part of parts) {
    if (!part.trim()) continue;

    // Count IDs (#id)
    const idMatches = part.match(/#[\w-]+(?![^(]*\))/g);
    if (idMatches) a += idMatches.length;

    // Count classes (.class)
    const classMatches = part.match(/\.[\w-]+(?![^(]*\))/g);
    if (classMatches) b += classMatches.length;

    // Count attributes ([attr])
    const attrMatches = part.match(/\[[^\]]+\]/g);
    if (attrMatches) b += attrMatches.length;

    // Count pseudo-classes (:hover, :focus, :first-child, etc.)
    // Exclude pseudo-elements (::)
    const pseudoClassMatches = part.match(/(?<!:):[\w-]+(?![^(]*\))/g);
    if (pseudoClassMatches) {
      // Filter out pseudo-elements (::)
      const actualPseudoClasses = pseudoClassMatches.filter(p => !p.startsWith('::'));
      b += actualPseudoClasses.length;
    }

    // Count pseudo-elements (::before, ::after, etc.)
    const pseudoElementMatches = part.match(/::[\w-]+/g);
    if (pseudoElementMatches) c += pseudoElementMatches.length;

    // Count type selectors (element names)
    // Remove IDs, classes, attributes, pseudo-classes, pseudo-elements
    let stripped = part
      .replace(/#[\w-]+/g, '')
      .replace(/\.[\w-]+/g, '')
      .replace(/\[[^\]]+\]/g, '')
      .replace(/::[\w-]+/g, '')
      .replace(/(?<!:):[\w-]+/g, '')
      .replace(/[*]/g, '');

    // What remains should be type selectors or empty
    const typeMatch = stripped.match(/\b[a-zA-Z][\w-]*/g);
    if (typeMatch) {
      c += typeMatch.filter(t => !['from', 'to', 'of'].includes(t)).length;
    }
  }

  return { a, b, c };
}

function specificityScore(spec: Specificity): number {
  return spec.a * 100 + spec.b * 10 + spec.c;
}

function getCategory(spec: Specificity): { category: SelectorResult['category']; label: string; color: string } {
  if (spec.a > 0) return { category: 'id', label: 'ID Selector', color: '#ef4444' };
  if (spec.b > 0) return { category: 'class', label: 'Class / Attr / Pseudo-class', color: '#f59e0b' };
  if (spec.c > 0) return { category: 'type', label: 'Type / Pseudo-element', color: '#3b82f6' };
  return { category: 'universal', label: 'Universal', color: '#9ca3af' };
}

function compareSpecificity(a: Specificity, b: Specificity): 'left' | 'right' | 'equal' {
  if (a.a !== b.a) return a.a > b.a ? 'left' : 'right';
  if (a.b !== b.b) return a.b > b.b ? 'left' : 'right';
  if (a.c !== b.c) return a.c > b.c ? 'left' : 'right';
  return 'equal';
}

function formatSpecificity(spec: Specificity): string {
  return `(${spec.a}, ${spec.b}, ${spec.c})`;
}

const examples = [
  { label: 'Universal', selector: '*' },
  { label: 'Type', selector: 'div' },
  { label: 'Class', selector: '.container' },
  { label: 'Attribute', selector: '[type="text"]' },
  { label: 'Pseudo-class', selector: 'a:hover' },
  { label: 'ID', selector: '#header' },
  { label: 'Multiple IDs', selector: '#nav #logo' },
  { label: 'Class chain', selector: '.btn.btn-primary' },
  { label: 'Compound', selector: 'div.container > p.intro::first-line' },
  { label: 'Complex', selector: '#main .content a:hover' },
  { label: 'Very complex', selector: 'html body #app .nav > ul li a.active:hover::after' },
  { label: 'Attribute selector', selector: 'input[type="email"][required]' },
  { label: 'nth-child', selector: '.list li:nth-child(odd)' },
  { label: 'Pseudo-element', selector: 'p::first-letter' },
  { label: 'Not pseudo-class', selector: 'div:not(.hidden)' },
  { label: 'Has pseudo-class', selector: '.card:has(img)' },
  { label: 'Data attribute', selector: '[data-theme="dark"] button' },
  { label: 'Adjacent sibling', selector: 'h1 + p.intro' },
];

export default function CSSSpecificityCalculator() {
  const [selectors, setSelectors] = useState<string[]>(['#header .nav > li a:hover', '.btn-primary', 'div p']);
  const [results, setResults] = useState<SelectorResult[]>([]);
  const [copied, setCopied] = useState(false);
  const [input, setInput] = useState('');
  const [comparison, setComparison] = useState<{ left: string; right: string } | null>(null);

  const analyze = useCallback(() => {
    const filtered = selectors.filter(s => s.trim());
    const res: SelectorResult[] = filtered.map((selector) => {
      const spec = calculateSpecificity(selector.trim());
      const { category, label, color } = getCategory(spec);
      return {
        selector: selector.trim(),
        specificity: spec,
        score: specificityScore(spec),
        category,
        label,
        color,
      };
    });
    // Sort by score descending
    res.sort((a, b) => b.score - a.score);
    setResults(res);

    // Set comparison for top 2
    if (res.length >= 2) {
      setComparison({ left: res[0].selector, right: res[1].selector });
    } else {
      setComparison(null);
    }
  }, [selectors]);

  const addSelector = () => {
    if (input.trim()) {
      setSelectors([...selectors, input.trim()]);
      setInput('');
    }
  };

  const removeSelector = (idx: number) => {
    setSelectors(selectors.filter((_, i) => i !== idx));
  };

  const updateSelector = (idx: number, value: string) => {
    const newSelectors = [...selectors];
    newSelectors[idx] = value;
    setSelectors(newSelectors);
  };

  const loadExample = (selector: string) => {
    if (!selectors.includes(selector)) {
      setSelectors([...selectors, selector]);
    }
  };

  const handleCopy = () => {
    const text = results.map(r => `${r.selector} → ${formatSpecificity(r.specificity)} [score: ${r.score}]`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setSelectors([]);
    setResults([]);
    setComparison(null);
  };

  // Visual specificity bar
  const maxScore = Math.max(...results.map(r => r.score), 1);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center text-white">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">CSS Specificity Calculator</h1>
                <p className="text-gray-600">Calculate and compare CSS specificity scores</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Enter CSS selectors to calculate their specificity in (a, b, c) format — a = IDs, b = classes/attributes/pseudo-classes, c = elements/pseudo-elements.
              Higher values win when rules conflict.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Selectors</h2>
                  <div className="flex gap-2">
                    <button
                      onClick={analyze}
                      className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-semibold rounded-lg hover:from-rose-600 hover:to-pink-700 transition"
                    >
                      Calculate
                    </button>
                    {results.length > 0 && (
                      <>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1 px-3 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                        <button
                          onClick={clearAll}
                          className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                          Clear
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Selector Inputs */}
                <div className="space-y-2 mb-4">
                  {selectors.map((sel, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={sel}
                        onChange={(e) => updateSelector(idx, e.target.value)}
                        className="flex-1 px-4 py-2.5 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="Enter CSS selector..."
                        onKeyDown={(e) => { if (e.key === 'Enter') analyze(); }}
                      />
                      <button
                        onClick={() => removeSelector(idx)}
                        className="p-2 text-gray-400 hover:text-red-500 transition"
                        title="Remove"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Selector */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    placeholder="Add a selector..."
                    onKeyDown={(e) => { if (e.key === 'Enter') addSelector(); }}
                  />
                  <button
                    onClick={addSelector}
                    className="flex items-center gap-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>

                {/* Results */}
                {results.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Results (highest first)</h3>
                    {results.map((result, idx) => (
                      <div
                        key={idx}
                        className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <code className="font-mono text-sm text-gray-900 break-all">{result.selector}</code>
                          <div className="flex items-center gap-2 shrink-0 ml-3">
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: result.color }}
                            >
                              {result.label}
                            </span>
                            <span className="font-mono text-sm font-bold text-gray-900">
                              {formatSpecificity(result.specificity)}
                            </span>
                          </div>
                        </div>

                        {/* Visual Bar */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 flex gap-0.5 h-5 rounded overflow-hidden bg-gray-100">
                            {result.specificity.a > 0 && (
                              <div
                                className="bg-red-400 flex items-center justify-center text-[10px] font-bold text-white px-1"
                                style={{ width: `${(result.specificity.a / Math.max(result.specificity.a + result.specificity.b + result.specificity.c, 1)) * 100}%`, minWidth: '20px' }}
                              >
                                {result.specificity.a}×ID
                              </div>
                            )}
                            {result.specificity.b > 0 && (
                              <div
                                className="bg-amber-400 flex items-center justify-center text-[10px] font-bold text-white px-1"
                                style={{ width: `${(result.specificity.b / Math.max(result.specificity.a + result.specificity.b + result.specificity.c, 1)) * 100}%`, minWidth: '20px' }}
                              >
                                {result.specificity.b}×CL
                              </div>
                            )}
                            {result.specificity.c > 0 && (
                              <div
                                className="bg-blue-400 flex items-center justify-center text-[10px] font-bold text-white px-1"
                                style={{ width: `${(result.specificity.c / Math.max(result.specificity.a + result.specificity.b + result.specificity.c, 1)) * 100}%`, minWidth: '20px' }}
                              >
                                {result.specificity.c}×EL
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 font-mono w-12 text-right">
                            {result.score}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Comparison */}
                {comparison && results.length >= 2 && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <strong>Comparison:</strong>{' '}
                        <code className="font-mono">{results[0].selector}</code>{' '}
                        {compareSpecificity(results[0].specificity, results[1].specificity) === 'left' ? 'beats' : 'ties with'}{' '}
                        <code className="font-mono">{results[1].selector}</code>
                        {' → '}
                        {formatSpecificity(results[0].specificity)} vs {formatSpecificity(results[1].specificity)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Quick Reference */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Specificity Reference</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-400"></span>
                    <span className="text-gray-700"><strong>(a)</strong> ID selectors — #id</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                    <span className="text-gray-700"><strong>(b)</strong> Classes, attrs, pseudo-classes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                    <span className="text-gray-700"><strong>(c)</strong> Elements, pseudo-elements</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Not included: inline styles (highest non-!important), <code className="text-xs">!important</code> (highest overall).
                    The cascade source order breaks ties when specificity is equal.
                  </p>
                </div>
              </div>

              {/* Examples */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Try Examples</h3>
                <div className="flex flex-wrap gap-1.5">
                  {examples.map((ex) => (
                    <button
                      key={ex.selector}
                      onClick={() => loadExample(ex.selector)}
                      className="px-2 py-1 text-xs font-mono bg-gray-50 border border-gray-200 rounded hover:bg-rose-50 hover:border-rose-300 transition text-gray-700"
                      title={ex.label}
                    >
                      {ex.selector.length > 28 ? ex.selector.slice(0, 28) + '…' : ex.selector}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cheat Sheet */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Cascade Order</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-red-100 text-red-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <code className="text-xs bg-gray-50 px-1 rounded">!important</code>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    Inline styles
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    ID selectors
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-yellow-100 text-yellow-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    Classes / Attrs / Pseudo-classes
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                    Elements / Pseudo-elements
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-5 h-5 bg-gray-100 text-gray-700 rounded-full flex items-center justify-center text-xs font-bold">6</span>
                    Universal <code className="text-xs bg-gray-50 px-1 rounded">*</code>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
