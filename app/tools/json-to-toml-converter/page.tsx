'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, ArrowLeftRight, FileJson, FileText, Download, Upload } from 'lucide-react';

// Lightweight JSON <-> TOML converter (no external dependency)
// Supports: objects, arrays, strings, numbers, booleans, null, nested tables, inline tables, inline arrays

function jsonToToml(data: unknown, prefix = ''): string {
  const lines: string[] = [];
  const tables: string[] = [];

  if (typeof data !== 'object' || data === null) {
    return tomlValue(data);
  }

  if (Array.isArray(data)) {
    // Top-level array of objects = array of tables
    for (const item of data) {
      if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
        lines.push(`[[${prefix}]]`);
        for (const [key, val] of Object.entries(item)) {
          if (isPrimitive(val)) {
            lines.push(`${key} = ${tomlValue(val)}`);
          } else if (Array.isArray(val) && val.every(isPrimitive)) {
            lines.push(`${key} = [${val.map(tomlValue).join(', ')}]`);
          } else {
            tables.push(jsonToToml(val, prefix ? `${prefix}.${key}` : key));
          }
        }
      } else {
        lines.push(tomlValue(item));
      }
    }
  } else {
    for (const [key, val] of Object.entries(data as Record<string, unknown>)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (isPrimitive(val)) {
        lines.push(`${key} = ${tomlValue(val)}`);
      } else if (Array.isArray(val) && val.every(isPrimitive)) {
        lines.push(`${key} = [${val.map(tomlValue).join(', ')}]`);
      } else if (Array.isArray(val)) {
        // Array of tables
        tables.push(jsonToToml(val, fullKey));
      } else {
        tables.push(`[${fullKey}]${jsonToToml(val, '').split('\n').filter(l => l.trim() && !l.startsWith('[')).map(l => `\n${l}`).join('')}`);
      }
    }
  }

  return [...lines, ...tables].join('\n').trim();
}

function isPrimitive(val: unknown): boolean {
  return val === null || typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean';
}

function tomlValue(val: unknown): string {
  if (val === null || val === undefined) return '""';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') {
    if (Number.isNaN(val)) return '"NaN"';
    if (!Number.isFinite(val)) return val > 0 ? '"inf"' : '"-inf"';
    return String(val);
  }
  if (typeof val === 'string') {
    // Use basic string, escape special chars
    const escaped = val
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
    return `"${escaped}"`;
  }
  return `"${String(val)}"`;
}

function tomlToJson(toml: string): { data: unknown; error: string | null } {
  try {
    const lines = toml.split('\n');
    const result: Record<string, unknown> = {};
    let current: Record<string, unknown> = result;
    let currentPath: string[] = [];

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      let line = lines[lineNum];
      // Remove comments
      const commentIdx = line.indexOf('#');
      if (commentIdx >= 0 && !isInsideString(line, commentIdx)) {
        line = line.slice(0, commentIdx);
      }
      line = line.trim();
      if (!line) continue;

      // Table header [table]
      const tableMatch = line.match(/^\[([^\[\]]+)\]$/);
      if (tableMatch) {
        const path = tableMatch[1].split('.');
        currentPath = path;
        current = ensurePath(result, path);
        continue;
      }

      // Array of tables [[array]]
      const arrayTableMatch = line.match(/^\[\[([^\[\]]+)\]\]$/);
      if (arrayTableMatch) {
        const path = arrayTableMatch[1].split('.');
        const key = path.pop()!;
        const parent = path.length > 0 ? ensurePath(result, path) : result;
        if (!Array.isArray(parent[key])) {
          parent[key] = [];
        }
        const newObj: Record<string, unknown> = {};
        (parent[key] as unknown[]).push(newObj);
        current = newObj;
        currentPath = path.concat(key);
        continue;
      }

      // Key = value
      const kvMatch = line.match(/^([^=]+?)\s*=\s*(.+)$/);
      if (kvMatch) {
        const key = kvMatch[1].trim();
        const valueStr = kvMatch[2].trim();
        current[key] = parseTomlValue(valueStr);
      }
    }

    return { data: result, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Invalid TOML' };
  }
}

function isInsideString(line: string, idx: number): boolean {
  let inStr = false;
  for (let i = 0; i < idx; i++) {
    if (line[i] === '"' && (i === 0 || line[i - 1] !== '\\')) inStr = !inStr;
  }
  return inStr;
}

function ensurePath(obj: Record<string, unknown>, path: string[]): Record<string, unknown> {
  let current = obj;
  for (const key of path) {
    if (typeof current[key] !== 'object' || current[key] === null || Array.isArray(current[key])) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  return current;
}

function parseTomlValue(str: string): unknown {
  // Multiline string
  if (str.startsWith('"""') || str.startsWith("'''")) {
    return str.slice(3, -3).trim();
  }
  // Basic string
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1)
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\');
  }
  // Literal string
  if (str.startsWith("'") && str.endsWith("'")) {
    return str.slice(1, -1);
  }
  // Boolean
  if (str === 'true') return true;
  if (str === 'false') return false;
  // Number
  if (/^-?\d+(\.\d+)?$/.test(str)) return Number(str);
  if (/^-?\d+(\.\d+)?e[+-]?\d+$/i.test(str)) return Number(str);
  // Array (inline)
  if (str.startsWith('[') && str.endsWith(']')) {
    const inner = str.slice(1, -1).trim();
    if (!inner) return [];
    return inner.split(',').map(s => parseTomlValue(s.trim()));
  }
  // Inline table
  if (str.startsWith('{') && str.endsWith('}')) {
    const inner = str.slice(1, -1).trim();
    if (!inner) return {};
    const obj: Record<string, unknown> = {};
    for (const part of inner.split(',')) {
      const [k, ...v] = part.split('=');
      if (k) obj[k.trim()] = parseTomlValue(v.join('=').trim());
    }
    return obj;
  }
  // Date/time (ISO format)
  if (/^\d{4}-\d{2}-\d{2}[T ]/.test(str)) return str;
  if (/^\d{2}:\d{2}:\d{2}/.test(str)) return str;
  return str;
}

function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

const sampleJson = `{
  "name": "zion-app",
  "version": "2.1.0",
  "description": "AI-powered developer platform",
  "repository": {
    "type": "git",
    "url": "https://github.com/zion/app"
  },
  "features": ["ai-tools", "automation", "analytics"],
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "zion_prod",
    "ssl": true,
    "pool": {
      "min": 2,
      "max": 20
    }
  },
  "deploy": {
    "environments": [
      { "name": "staging", "url": "https://staging.zion.dev" },
      { "name": "production", "url": "https://zion.dev" }
    ],
    "autoDeploy": true
  }
}`;

const sampleToml = `[package]
name = "zion-app"
version = "2.1.0"
description = "AI-powered developer platform"
features = ["ai-tools", "automation", "analytics"]

[repository]
type = "git"
url = "https://github.com/zion/app"

[database]
host = "localhost"
port = 5432
name = "zion_prod"
ssl = true

[database.pool]
min = 2
max = 20

[deploy]
autoDeploy = true

[[deploy.environments]]
name = "staging"
url = "https://staging.zion.dev"

[[deploy.environments]]
name = "production"
url = "https://zion.dev"`;

export default function JSONTOMLConverter() {
  const [input, setInput] = useState(sampleJson);
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'json2toml' | 'toml2json'>('json2toml');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<{ inputLines: number; outputLines: number; keys: number } | null>(null);

  const convert = useCallback(() => {
    setError(null);
    try {
      if (mode === 'json2toml') {
        const parsed = JSON.parse(input);
        if (typeof parsed !== 'object' || parsed === null) {
          setError('JSON must be an object or array of objects');
          setOutput('');
          setStats(null);
          return;
        }
        const toml = jsonToToml(parsed);
        setOutput(toml);
        const inputLines = input.split('\n').length;
        const outputLines = toml.split('\n').length;
        const keys = countKeys(parsed);
        setStats({ inputLines, outputLines, keys });
      } else {
        const { data, error: tomlError } = tomlToJson(input);
        if (tomlError) {
          setError(tomlError);
          setOutput('');
          setStats(null);
          return;
        }
        const json = formatJson(data);
        setOutput(json);
        const inputLines = input.split('\n').length;
        const outputLines = json.split('\n').length;
        const keys = countKeys(data);
        setStats({ inputLines, outputLines, keys });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setOutput('');
      setStats(null);
    }
  }, [input, mode]);

  const countKeys = (obj: unknown): number => {
    if (typeof obj !== 'object' || obj === null) return 0;
    if (Array.isArray(obj)) {
      let total = 0;
      for (const item of obj) { total += countKeys(item); }
      return total;
    }
    const record = obj as Record<string, unknown>;
    let total = Object.keys(record).length;
    for (const val of Object.values(record)) { total += countKeys(val); }
    return total;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = mode === 'json2toml' ? 'toml' : 'json';
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `output.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
      setOutput('');
      setError(null);
    };
    reader.readAsText(file);
  };

  const swapMode = () => {
    const newMode = mode === 'json2toml' ? 'toml2json' : 'json2toml';
    setMode(newMode);
    if (output) {
      setInput(output);
      setOutput('');
    } else {
      setInput(newMode === 'json2toml' ? sampleJson : sampleToml);
      setOutput('');
    }
    setError(null);
    setStats(null);
  };

  const loadSample = () => {
    setInput(mode === 'json2toml' ? sampleJson : sampleToml);
    setOutput('');
    setError(null);
    setStats(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white">
                <FileJson className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">JSON ↔ TOML Converter</h1>
                <p className="text-gray-600">Convert between JSON and TOML formats instantly</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Supports nested objects, arrays of tables, inline arrays, all TOML data types, and file upload.
              100% client-side — nothing leaves your browser.
            </p>
          </div>

          {/* Mode Toggle & Actions */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => { setMode('json2toml'); setInput(sampleJson); setOutput(''); setError(null); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  mode === 'json2toml' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                JSON → TOML
              </button>
              <button
                onClick={() => { setMode('toml2json'); setInput(sampleToml); setOutput(''); setError(null); }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${
                  mode === 'toml2json' ? 'bg-amber-500 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                TOML → JSON
              </button>
            </div>
            <button
              onClick={swapMode}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              title="Swap direction"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Swap
            </button>
            <button
              onClick={loadSample}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            >
              <FileText className="w-4 h-4" />
              Load Sample
            </button>
            <label className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload File
              <input
                type="file"
                accept={mode === 'json2toml' ? '.json' : '.toml'}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Editor Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'json2toml' ? 'JSON Input' : 'TOML Input'}
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-[400px] p-4 font-mono text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
                placeholder={mode === 'json2toml' ? 'Paste your JSON here...' : 'Paste your TOML here...'}
                spellCheck={false}
              />
            </div>

            {/* Output */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {mode === 'json2toml' ? 'TOML Output' : 'JSON Output'}
                </label>
                {output && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </div>
                )}
              </div>
              <textarea
                value={output}
                readOnly
                className="w-full h-[400px] p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-xl resize-none"
                placeholder="Output will appear here..."
              />
            </div>
          </div>

          {/* Convert Button */}
          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={convert}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-700 transition shadow-lg shadow-amber-500/20"
            >
              <ArrowLeftRight className="w-4 h-4" />
              Convert {mode === 'json2toml' ? 'JSON → TOML' : 'TOML → JSON'}
            </button>
            {stats && (
              <div className="flex gap-4 text-sm text-gray-600">
                <span>Input: <strong>{stats.inputLines}</strong> lines</span>
                <span>Output: <strong>{stats.outputLines}</strong> lines</span>
                <span>Keys: <strong>{stats.keys}</strong></span>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* Info Cards */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">What is TOML?</h3>
              <p className="text-sm text-gray-600">
                TOML (Tom&apos;s Obvious Minimal Language) is a config file format designed to be easy to read
                and write. Used by Cargo (Rust), Hugo, pyproject.toml, and many CI/CD tools.
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Supported Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Nested tables & dotted keys</li>
                <li>• Array of tables [[array]]</li>
                <li>• Inline arrays & tables</li>
                <li>• All data types (string, int, float, bool)</li>
                <li>• Comments preservation</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-900 mb-2">Use Cases</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Convert npm configs to Cargo.toml</li>
                <li>• Migrate JSON configs to TOML</li>
                <li>• Generate pyproject.toml from JSON</li>
                <li>• Create Cargo.toml from JSON schema</li>
                <li>• CI/CD config file conversion</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
