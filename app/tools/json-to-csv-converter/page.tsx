"use client";

import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';

interface ConversionOptions {
  delimiter: ',' | ';' | '\t' | '|';
  includeHeaders: boolean;
  flattenNested: boolean;
  flattenSeparator: string;
  quoteAll: boolean;
  nullValue: string;
}

const delimiterLabels: Record<string, string> = {
  ',': 'Comma (,)',
  ';': 'Semicolon (;)',
  '\t': 'Tab',
  '|': 'Pipe (|)',
};

function flattenObject(obj: Record<string, unknown>, prefix = '', sep = '.'): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}${sep}${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(result, flattenObject(value as Record<string, unknown>, newKey, sep));
    } else if (Array.isArray(value)) {
      result[newKey] = JSON.stringify(value);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

function jsonToCsv(data: unknown[], options: ConversionOptions): string {
  if (!Array.isArray(data) || data.length === 0) return '';

  const processed = options.flattenNested
    ? data.map((row) => (typeof row === 'object' && row !== null ? flattenObject(row as Record<string, unknown>, '', options.flattenSeparator) : { value: row }))
    : data.map((row) => {
        if (typeof row === 'object' && row !== null) {
          const obj: Record<string, unknown> = {};
          for (const [k, v] of Object.entries(row as Record<string, unknown>)) {
            obj[k] = v && typeof v === 'object' ? JSON.stringify(v) : v;
          }
          return obj;
        }
        return { value: row };
      });

  const allKeys = new Set<string>();
  processed.forEach((row) => Object.keys(row).forEach((k) => allKeys.add(k)));
  const headers = Array.from(allKeys);

  const escapeField = (val: unknown): string => {
    const str = val === null || val === undefined ? options.nullValue : String(val);
    const needsQuote = options.quoteAll || str.includes(options.delimiter) || str.includes('"') || str.includes('\n') || str.includes('\r');
    if (needsQuote) return `"${str.replace(/"/g, '""')}"`;
    return str;
  };

  const lines: string[] = [];
  if (options.includeHeaders) {
    lines.push(headers.map(escapeField).join(options.delimiter));
  }
  for (const row of processed) {
    lines.push(headers.map((h) => escapeField((row as Record<string, unknown>)[h])).join(options.delimiter));
  }
  return lines.join('\n');
}

function detectJsonArray(input: string): { data: unknown[]; source: string } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) return { data: parsed, source: 'array' };
    if (typeof parsed === 'object' && parsed !== null) {
      const keys = Object.keys(parsed);
      for (const key of keys) {
        if (Array.isArray((parsed as Record<string, unknown>)[key])) {
          return { data: (parsed as Record<string, unknown>)[key] as unknown[], source: `object.${key}` };
        }
      }
      return { data: [parsed], source: 'wrapped-object' };
    }
    return null;
  } catch {
    // Try NDJSON (newline-delimited JSON)
    const lines = trimmed.split('\n').filter((l) => l.trim());
    const parsed: unknown[] = [];
    let allValid = true;
    for (const line of lines) {
      try {
        parsed.push(JSON.parse(line));
      } catch {
        allValid = false;
        break;
      }
    }
    if (allValid && parsed.length > 0) return { data: parsed, source: 'ndjson' };
    return null;
  }
}

const sampleData = `[
  { "id": 1, "name": "Alice Johnson", "email": "alice@example.com", "age": 32, "department": "Engineering", "address": { "city": "San Francisco", "state": "CA" } },
  { "id": 2, "name": "Bob Smith", "email": "bob@example.com", "age": 28, "department": "Design", "address": { "city": "New York", "state": "NY" } },
  { "id": 3, "name": "Carol Williams", "email": "carol@example.com", "age": 45, "department": "Marketing", "address": { "city": "Austin", "state": "TX" } }
]`;

export default function JsonToCsvConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ rows: number; cols: number; source: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState<ConversionOptions>({
    delimiter: ',',
    includeHeaders: true,
    flattenNested: true,
    flattenSeparator: '.',
    quoteAll: false,
    nullValue: '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const convert = useCallback(() => {
    setError(null);
    setOutput('');
    setStats(null);

    const result = detectJsonArray(input);
    if (!result) {
      setError('Could not detect a JSON array. Paste a JSON array, an object containing an array, or NDJSON.');
      return;
    }

    try {
      const csv = jsonToCsv(result.data, options);
      if (!csv) {
        setError('Empty result — check that your data has extractable fields.');
        return;
      }
      setOutput(csv);
      const firstLine = csv.split('\n')[0];
      const colCount = options.includeHeaders ? firstLine.split(options.delimiter).length : result.data.length;
      setStats({ rows: result.data.length, cols: colCount, source: result.source });
    } catch (err) {
      setError(`Conversion error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }, [input, options]);

  const loadSample = useCallback(() => {
    setInput(sampleData);
    setError(null);
    setOutput('');
    setStats(null);
  }, []);

  const copyOutput = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [output]);

  const downloadCsv = useCallback(() => {
    const blob = new Blob([output], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
      setError(null);
      setOutput('');
    };
    reader.readAsText(file);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <a href="/" className="text-cyan-400 hover:text-cyan-300 text-sm mb-4 inline-flex items-center gap-1">
            ← Back to Home
          </a>
          <h1 className="text-3xl font-bold mt-2 mb-2">JSON to CSV Converter</h1>
          <p className="text-gray-400 max-w-2xl">
            Convert JSON arrays to CSV with support for nested objects, NDJSON, custom delimiters, and
            configurable quoting. 100% client-side — your data never leaves the browser.
          </p>
        </div>

        {/* Options bar */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Delimiter</label>
            <select
              value={options.delimiter}
              onChange={(e) => setOptions((o) => ({ ...o, delimiter: e.target.value as ConversionOptions['delimiter'] }))}
              className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-cyan-500"
            >
              {Object.entries(delimiterLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeHeaders}
              onChange={(e) => setOptions((o) => ({ ...o, includeHeaders: e.target.checked }))}
              className="rounded border-gray-600 bg-gray-900 text-cyan-500 focus:ring-cyan-500"
            />
            Headers
          </label>

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={options.flattenNested}
              onChange={(e) => setOptions((o) => ({ ...o, flattenNested: e.target.checked }))}
              className="rounded border-gray-600 bg-gray-900 text-cyan-500 focus:ring-cyan-500"
            />
            Flatten nested
          </label>

          {options.flattenNested && (
            <div>
              <label className="text-xs text-gray-500 block mb-1">Separator</label>
              <input
                type="text"
                value={options.flattenSeparator}
                onChange={(e) => setOptions((o) => ({ ...o, flattenSeparator: e.target.value }))}
                className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm w-16 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={options.quoteAll}
              onChange={(e) => setOptions((o) => ({ ...o, quoteAll: e.target.checked }))}
              className="rounded border-gray-600 bg-gray-900 text-cyan-500 focus:ring-cyan-500"
            />
            Quote all fields
          </label>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Null value</label>
            <input
              type="text"
              value={options.nullValue}
              onChange={(e) => setOptions((o) => ({ ...o, nullValue: e.target.value }))}
              placeholder="(empty)"
              className="bg-gray-900 border border-gray-700 rounded px-3 py-1.5 text-sm w-24 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Main editor */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">JSON Input</h2>
              <div className="flex gap-2">
                <button onClick={loadSample} className="text-xs text-cyan-400 hover:text-cyan-300">
                  Load sample
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="text-xs text-cyan-400 hover:text-cyan-300">
                  Upload file
                </button>
                <input ref={fileInputRef} type="file" accept=".json,.jsonl,.ndjson" onChange={handleFileUpload} className="hidden" />
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='Paste a JSON array like [{"name":"Alice","age":30}, ...] or NDJSON...'
              className="w-full h-80 bg-gray-900 border border-gray-700 rounded-xl p-4 font-mono text-sm resize-none focus:outline-none focus:border-cyan-500 placeholder-gray-600"
              spellCheck={false}
            />
            <button
              onClick={convert}
              className="mt-3 w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium transition-colors"
            >
              Convert to CSV →
            </button>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-semibold">CSV Output</h2>
              {output && (
                <div className="flex gap-2">
                  <button onClick={copyOutput} className="text-xs text-cyan-400 hover:text-cyan-300">
                    {copied ? '✓ Copied!' : 'Copy'}
                  </button>
                  <button onClick={downloadCsv} className="text-xs text-cyan-400 hover:text-cyan-300">
                    Download .csv
                  </button>
                </div>
              )}
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="CSV output will appear here..."
              className="w-full h-80 bg-gray-900 border border-gray-700 rounded-xl p-4 font-mono text-sm resize-none focus:outline-none placeholder-gray-600"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm">
            ⚠ {error}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="bg-gray-800/30 border border-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{stats.rows}</div>
              <div className="text-sm text-gray-400">Rows</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{stats.cols}</div>
              <div className="text-sm text-gray-400">Columns</div>
            </div>
            <div className="bg-gray-800/30 border border-gray-800 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400">{stats.source}</div>
              <div className="text-sm text-gray-400">Detected format</div>
            </div>
          </div>
        )}

        {/* Preview table */}
        {output && (
          <div className="mt-6 bg-gray-800/50 border border-gray-700 rounded-xl p-6 overflow-x-auto">
            <h3 className="font-semibold mb-4">Preview (first 10 rows)</h3>
            <table className="min-w-full text-sm">
              <thead>
                <tr>
                  {output.split('\n')[0]?.split(options.delimiter).map((h, i) => (
                    <th key={i} className="px-3 py-2 text-left text-gray-400 border-b border-gray-700 font-medium whitespace-nowrap">
                      {h.replace(/^"|"$/g, '')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {output.split('\n').slice(1, 11).map((row, ri) => (
                  <tr key={ri} className="hover:bg-gray-700/30">
                    {row.split(options.delimiter).map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 border-b border-gray-800 whitespace-nowrap font-mono text-gray-300">
                        {cell.replace(/^"|"$/g, '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-8 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-300 text-sm">
          🔒 <strong>100% Client-Side:</strong> All conversion happens in your browser. No data is sent to any server.
        </div>
      </div>
    </div>
  );
}
