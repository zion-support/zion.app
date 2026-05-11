'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Table2, ArrowLeftRight, AlignLeft, AlignCenter, AlignRight, Download } from 'lucide-react';

type AlignOption = 'left' | 'center' | 'right';

function parseInput(text: string): string[][] {
  // Try CSV first
  const lines = text.trim().split('\n');
  if (lines.length === 0) return [];

  const rows: string[][] = [];
  for (const line of lines) {
    // Check if tab-separated
    if (line.includes('\t')) {
      rows.push(line.split('\t').map(c => c.trim()));
    } else {
      // CSV with quote handling
      const cells: string[] = [];
      let current = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          inQuotes = !inQuotes;
        } else if (ch === ',' && !inQuotes) {
          cells.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      cells.push(current.trim());
      rows.push(cells);
    }
  }
  return rows;
}

function generateMarkdownTable(rows: string[][], alignment: AlignOption, hasHeader: boolean): string {
  if (rows.length === 0) return '';

  const maxCols = Math.max(...rows.map(r => r.length));
  // Pad rows to equal length
  const padded = rows.map(r => {
    while (r.length < maxCols) r.push('');
    return r;
  });

  // Calculate column widths
  const widths = Array(maxCols).fill(0);
  for (const row of padded) {
    for (let i = 0; i < maxCols; i++) {
      widths[i] = Math.max(widths[i], row[i].length);
    }
  }
  // Minimum width of 3 for separator
  const w = widths.map(v => Math.max(v, 3));

  const pad = (s: string, width: number) => s + ' '.repeat(Math.max(0, width - s.length));

  const alignChar = alignment === 'left' ? ':' : alignment === 'right' ? ':' : ':';
  const alignEnd = alignment === 'center' ? ':' : alignment === 'right' ? ':' : '';

  const headerIdx = hasHeader ? 0 : -1;

  const lines: string[] = [];
  for (let i = 0; i < padded.length; i++) {
    const row = padded[i];
    const cells = row.map((c, j) => pad(c, w[j]));
    lines.push('| ' + cells.join(' | ') + ' |');

    if (i === headerIdx) {
      const sep = w.map(width => {
        if (alignment === 'center') return ':' + '-'.repeat(width - 2) + ':';
        if (alignment === 'right') return '-'.repeat(width - 1) + ':';
        return ':' + '-'.repeat(width - 1);
      });
      lines.push('|' + sep.join('|') + '|');
    }
  }

  return lines.join('\n');
}

function generateAsciiTable(rows: string[][]): string {
  if (rows.length === 0) return '';

  const maxCols = Math.max(...rows.map(r => r.length));
  const padded = rows.map(r => {
    while (r.length < maxCols) r.push('');
    return r;
  });

  const widths = Array(maxCols).fill(0);
  for (const row of padded) {
    for (let i = 0; i < maxCols; i++) {
      widths[i] = Math.max(widths[i], row[i].length);
    }
  }

  const pad = (s: string, width: number) => ' ' + s + ' '.repeat(Math.max(0, width - s.length)) + ' ';
  const sep = '+' + widths.map(w => '-'.repeat(w + 2)).join('+') + '+';

  const lines: string[] = [sep];
  for (let i = 0; i < padded.length; i++) {
    const cells = padded[i].map((c, j) => pad(c, widths[j]));
    lines.push('|' + cells.join('|') + '|');
    if (i === 0) lines.push(sep);
  }
  lines.push(sep);
  return lines.join('\n');
}

function generateHtmlTable(rows: string[][], hasHeader: boolean): string {
  if (rows.length === 0) return '';

  const lines: string[] = ['<table>'];
  for (let i = 0; i < rows.length; i++) {
    const tag = (i === 0 && hasHeader) ? 'th' : 'td';
    const rowTag = (i === 0 && hasHeader) ? 'thead' : (i === 1 || (!hasHeader && i === 0)) ? 'tbody' : null;
    if (rowTag === 'thead') lines.push('  <thead>');
    if (rowTag === 'tbody') lines.push('  <tbody>');
    const cells = rows[i].map(c => `    <${tag}>${c}</${tag}>`).join('\n');
    lines.push('  <tr>\n' + cells + '\n  </tr>');
  }
  lines.push('</table>');
  return lines.join('\n');
}

const SAMPLE_INPUT = `Name,Email,Role,Status
Alice Johnson,alice@example.com,Admin,Active
Bob Smith,bob@example.com,Editor,Active
Carol Davis,carol@example.com,Viewer,Pending
Dave Wilson,dave@example.com,Editor,Inactive`;

export default function MarkdownTableGeneratorPage() {
  const [input, setInput] = useState(SAMPLE_INPUT);
  const [alignment, setAlignment] = useState<AlignOption>('left');
  const [hasHeader, setHasHeader] = useState(true);
  const [outputFormat, setOutputFormat] = useState<'markdown' | 'ascii' | 'html'>('markdown');
  const [copied, setCopied] = useState(false);

  const rows = parseInput(input);
  const markdown = generateMarkdownTable(rows, alignment, hasHeader);
  const ascii = generateAsciiTable(rows);
  const html = generateHtmlTable(rows, hasHeader);

  const output = outputFormat === 'markdown' ? markdown : outputFormat === 'ascii' ? ascii : html;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    const ext = outputFormat === 'html' ? 'html' : outputFormat === 'ascii' ? 'txt' : 'md';
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `table.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, outputFormat]);

  const handleReset = useCallback(() => {
    setInput(SAMPLE_INPUT);
    setAlignment('left');
    setHasHeader(true);
    setOutputFormat('markdown');
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
              <Table2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Markdown Table Generator</h1>
              <p className="text-slate-600">Convert CSV or TSV data to Markdown tables, ASCII tables, or HTML. Live preview, alignment controls, and instant export.</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Input (CSV / TSV)</h2>
              <button onClick={handleReset} className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition">
                <RotateCcw className="w-4 h-4" /> Reset
              </button>
            </div>

            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Paste CSV or TSV data here...&#10;&#10;Name,Email,Role&#10;Alice,alice@example.com,Admin&#10;Bob,bob@example.com,Editor"
              className="w-full h-64 p-4 font-mono text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
              spellCheck={false}
            />

            {/* Controls */}
            <div className="flex flex-wrap gap-4 p-4 bg-white rounded-xl border border-slate-200">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Alignment</label>
                <div className="flex gap-1">
                  {(['left', 'center', 'right'] as AlignOption[]).map(a => (
                    <button
                      key={a}
                      onClick={() => setAlignment(a)}
                      className={`p-2 rounded-lg border transition ${alignment === a ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'border-slate-200 text-slate-400 hover:border-slate-300'}`}
                      title={`Align ${a}`}
                    >
                      {a === 'left' ? <AlignLeft className="w-4 h-4" /> : a === 'center' ? <AlignCenter className="w-4 h-4" /> : <AlignRight className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Header Row</label>
                <button
                  onClick={() => setHasHeader(!hasHeader)}
                  className={`px-3 py-2 rounded-lg border text-sm font-medium transition ${hasHeader ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                >
                  {hasHeader ? '✓ First row is header' : 'No header'}
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-2">Output Format</label>
                <div className="flex gap-1">
                  {(['markdown', 'ascii', 'html'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setOutputFormat(f)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition capitalize ${outputFormat === f ? 'bg-emerald-100 border-emerald-400 text-emerald-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4 text-xs text-slate-500">
              <span>{rows.length} row{rows.length !== 1 ? 's' : ''}</span>
              <span>{rows.length > 0 ? Math.max(...rows.map(r => r.length)) : 0} column{(rows.length > 0 ? Math.max(...rows.map(r => r.length)) : 0) !== 1 ? 's' : ''}</span>
              <span>{input.length} characters</span>
            </div>
          </motion.div>

          {/* Output Panel */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Output</h2>
              <div className="flex gap-2">
                <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition">
                  {copied ? <><Check className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy</>}
                </button>
                <button onClick={handleDownload} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition">
                  <Download className="w-4 h-4" /> Download
                </button>
              </div>
            </div>

            {/* Live Preview - rendered markdown */}
            {outputFormat === 'markdown' && rows.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4">
                <table className="min-w-full text-sm">
                  {hasHeader && rows[0] && (
                    <thead>
                      <tr>
                        {rows[0].map((cell, i) => (
                          <th key={i} className={`px-3 py-2 font-semibold text-slate-900 border-b-2 border-slate-200 ${alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left'}`}>{cell}</th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {rows.slice(hasHeader ? 1 : 0).map((row, ri) => (
                      <tr key={ri} className="hover:bg-slate-50">
                        {row.map((cell, ci) => (
                          <td key={ci} className={`px-3 py-2 text-slate-700 border-b border-slate-100 ${alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left'}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Raw output */}
            <pre className="w-full h-64 p-4 font-mono text-sm border border-slate-300 rounded-xl bg-slate-900 text-slate-100 overflow-auto whitespace-pre-wrap">{output || 'Enter data to generate table...'}</pre>
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 p-6 rounded-2xl border border-emerald-200 bg-emerald-50/50">
          <h3 className="text-sm font-semibold text-emerald-800 mb-3">💡 Tips</h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-emerald-700">
            <li>• Paste CSV data with commas or TSV with tabs — auto-detected</li>
            <li>• Quoted fields with commas are handled correctly</li>
            <li>• Toggle header row on/off to control separator rendering</li>
            <li>• Export as Markdown (.md), ASCII (.txt), or HTML (.html)</li>
            <li>• All processing is 100% client-side — your data never leaves the browser</li>
            <li>• Works great for README documentation, wiki tables, and data reports</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
