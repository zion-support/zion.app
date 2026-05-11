'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, FileCode, Minimize2, AlignLeft, AlertTriangle, CheckCircle } from 'lucide-react';

const SAMPLE_XML = `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2000-10-01</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</author>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2000-12-16</publish_date>
    <description>A former architect battles corporate zombies and an evil sorceress.</description>
  </book>
</catalog>`;

function formatXml(xml: string, indent: number = 2): string {
  let formatted = '';
  let indentLevel = 0;
  const indentStr = ' '.repeat(indent);

  // Normalize whitespace
  xml = xml.replace(/>\s*</g, '><').trim();

  // Split on tags
  const parts = xml.split(/(<[^>]+>)/g).filter(Boolean);

  for (const part of parts) {
    if (part.startsWith('<?')) {
      // Processing instruction
      formatted += part + '\n';
      continue;
    }

    if (part.startsWith('</')) {
      // Closing tag
      indentLevel = Math.max(0, indentLevel - 1);
      formatted += indentStr.repeat(indentLevel) + part + '\n';
    } else if (part.startsWith('<') && part.endsWith('/>')) {
      // Self-closing tag
      formatted += indentStr.repeat(indentLevel) + part + '\n';
    } else if (part.startsWith('<')) {
      // Opening tag
      formatted += indentStr.repeat(indentLevel) + part + '\n';
      indentLevel++;
    } else {
      // Text content
      const text = part.trim();
      if (text) {
        // Put text inline with previous tag
        const lines = formatted.split('\n');
        const lastLine = lines[lines.length - 2] ?? '';
        if (lastLine.trim().startsWith('<')) {
          lines[lines.length - 2] = lastLine + text;
          lines.pop(); // remove the empty line
          formatted = lines.join('\n') + '\n';
        } else {
          formatted += indentStr.repeat(indentLevel) + text + '\n';
        }
      }
    }
  }

  return formatted.trimEnd();
}

function minifyXml(xml: string): string {
  return xml
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .replace(/\s{2,}/g, ' ') // Collapse whitespace
    .replace(/^\s+|\s+$/gm, '') // Trim lines
    .trim();
}

function validateXml(xml: string): { valid: boolean; error: string; line?: number } {
  // Remove BOM if present
  xml = xml.replace(/^\uFEFF/, '');

  // Check for empty input
  if (!xml.trim()) {
    return { valid: false, error: 'XML input is empty' };
  }

  // Use DOMParser for validation
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');

  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    const errorText = parserError.textContent || 'Unknown parsing error';
    // Try to extract line number
    const lineMatch = errorText.match(/line\s+(\d+)/i);
    const line = lineMatch ? parseInt(lineMatch[1], 10) : undefined;
    return {
      valid: false,
      error: errorText.slice(0, 300),
      line,
    };
  }

  // Count elements for info
  const elementCount = doc.querySelectorAll('*').length;
  return {
    valid: true,
    error: `Valid XML — ${elementCount} element${elementCount !== 1 ? 's' : ''} found`,
  };
}

function getXmlStats(xml: string): { elements: number; attributes: number; maxDepth: number; textNodes: number; comments: number; size: number } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, 'text/xml');
  const elements = doc.querySelectorAll('*');
  let attributes = 0;
  let maxDepth = 0;
  let textNodes = 0;

  elements.forEach((el) => {
    attributes += el.attributes.length;
    el.childNodes.forEach((node) => {
      if (node.nodeType === 3 && node.textContent?.trim()) textNodes++;
    });
  });

  // Calculate max depth
  function depth(node: Element, d: number): number {
    let max = d;
    for (const child of Array.from(node.children)) {
      max = Math.max(max, depth(child, d + 1));
    }
    return max;
  }
  const root = doc.documentElement;
  if (root) maxDepth = depth(root, 1);

  const comments = xml.match(/<!--[\s\S]*?-->/g)?.length ?? 0;

  return {
    elements: elements.length,
    attributes,
    maxDepth,
    textNodes,
    comments,
    size: new Blob([xml]).size,
  };
}

export default function XmlFormatterValidator() {
  const [input, setInput] = useState(SAMPLE_XML);
  const [output, setOutput] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [copied, setCopied] = useState(false);
  const [validation, setValidation] = useState<{ valid: boolean; error: string; line?: number } | null>(null);
  const [mode, setMode] = useState<'format' | 'minify'>('format');
  const [stats, setStats] = useState<ReturnType<typeof getXmlStats> | null>(null);

  const handleProcess = useCallback(() => {
    if (!input.trim()) {
      setOutput('');
      setValidation(null);
      setStats(null);
      return;
    }

    const v = validateXml(input);
    setValidation(v);

    try {
      const s = getXmlStats(input);
      setStats(s);
    } catch {
      setStats(null);
    }

    if (mode === 'format') {
      try {
        setOutput(formatXml(input, indentSize));
      } catch {
        setOutput(input);
      }
    } else {
      setOutput(minifyXml(input));
    }
  }, [input, indentSize, mode]);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleReset = useCallback(() => {
    setInput('');
    setOutput('');
    setValidation(null);
    setStats(null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <FileCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">XML Formatter & Validator</h1>
              <p className="text-slate-600">Format, validate, and minify XML with syntax checking and statistics</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                <button
                  onClick={() => setMode('format')}
                  className={`px-4 py-2 text-sm font-medium transition ${mode === 'format' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  <AlignLeft className="w-4 h-4 inline mr-1.5" />
                  Format
                </button>
                <button
                  onClick={() => setMode('minify')}
                  className={`px-4 py-2 text-sm font-medium transition ${mode === 'minify' ? 'bg-amber-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  <Minimize2 className="w-4 h-4 inline mr-1.5" />
                  Minify
                </button>
              </div>

              {mode === 'format' && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-600">Indent:</label>
                  <select
                    value={indentSize}
                    onChange={(e) => setIndentSize(Number(e.target.value))}
                    className="rounded-md border border-slate-200 px-3 py-1.5 text-sm bg-white"
                  >
                    <option value={2}>2 spaces</option>
                    <option value={4}>4 spaces</option>
                    <option value={8}>8 spaces</option>
                  </select>
                </div>
              )}

              <button
                onClick={handleProcess}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700 transition"
              >
                {mode === 'format' ? 'Format XML' : 'Minify XML'}
              </button>

              <button
                onClick={handleReset}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
              >
                <RotateCcw className="w-4 h-4 inline mr-1.5" />
                Reset
              </button>
            </div>

            {/* Validation status */}
            {validation && (
              <div className={`mb-4 rounded-lg px-4 py-3 text-sm flex items-center gap-2 ${validation.valid ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                {validation.valid ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
                <span>{validation.error}</span>
              </div>
            )}

            {/* Stats */}
            {stats && (
              <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { label: 'Elements', value: stats.elements },
                  { label: 'Attributes', value: stats.attributes },
                  { label: 'Max Depth', value: stats.maxDepth },
                  { label: 'Text Nodes', value: stats.textNodes },
                  { label: 'Comments', value: stats.comments },
                  { label: 'Size', value: `${stats.size} B` },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-slate-50 border border-slate-100 px-3 py-2 text-center">
                    <div className="text-lg font-bold text-slate-900">{s.value}</div>
                    <div className="text-xs text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Input / Output panels */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Input XML</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Paste your XML here..."
                  className="w-full h-80 rounded-lg border border-slate-200 p-4 font-mono text-sm text-slate-900 resize-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  spellCheck={false}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">Output</label>
                  {output && (
                    <button
                      onClick={handleCopy}
                      className="text-xs text-amber-600 hover:text-amber-800 flex items-center gap-1 transition"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <textarea
                  value={output}
                  readOnly
                  placeholder={mode === 'format' ? 'Formatted XML will appear here...' : 'Minified XML will appear here...'}
                  className="w-full h-80 rounded-lg border border-slate-200 p-4 font-mono text-sm text-slate-900 bg-slate-50 resize-none"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* SEO content */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">About XML Formatter & Validator</h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600">
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Features</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Pretty-print XML with configurable indentation (2, 4, or 8 spaces)</li>
                  <li>Minify XML for production — strip whitespace between tags</li>
                  <li>Real-time validation with error details and line numbers</li>
                  <li>XML statistics: element count, attribute count, max depth, text nodes</li>
                  <li>100% client-side — your XML never leaves your browser</li>
                  <li>Copy output to clipboard with one click</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Use Cases</h3>
                <ul className="space-y-1 list-disc list-inside">
                  <li>Format messy XML from APIs, logs, or config files</li>
                  <li>Validate XML before sending to SOAP services</li>
                  <li>Minify XML for faster network transmission</li>
                  <li>Debug XML parsing errors with detailed validation</li>
                  <li>Inspect XML document structure and statistics</li>
                  <li>Prepare XML for code reviews with consistent formatting</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
