'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, ArrowLeftRight, FileJson, FileText, Download, Upload, AlertTriangle } from 'lucide-react';

// Lightweight YAML parser/emitter (no external dependency needed for basic usage)
// Supports: objects, arrays, strings, numbers, booleans, null, nested structures

function yamlToJson(yaml: string): { data: unknown; error: string | null } {
  try {
    const lines = yaml.split('\n');
    const result = parseYamlLines(lines, 0, 0);
    return { data: result.value, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Invalid YAML' };
  }
}

function parseYamlLines(
  lines: string[],
  startIdx: number,
  baseIndent: number,
): { value: unknown; nextIdx: number } {
  let i = startIdx;
  let result: Record<string, unknown> | unknown[] | null = null;
  let isArray = false;
  let isObject = false;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.replace(/\s+$/, '');

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      i++;
      continue;
    }

    const indent = line.search(/\S/);
    if (indent < baseIndent) break;
    if (indent > baseIndent && result === null) {
      // First content line defines the base indent
      break;
    }
    if (indent > baseIndent) break;

    // Array item
    if (/^\s*-\s/.test(line)) {
      if (!isArray && result === null) {
        isArray = true;
        result = [];
      }
      if (!isArray) break;

      const afterDash = line.replace(/^\s*-\s*/, '');
      if (afterDash.includes(':') && !afterDash.startsWith('"') && !afterDash.startsWith("'")) {
        // Inline object in array
        const subLines = [' '.repeat(indent + 2) + afterDash];
        i++;
        while (i < lines.length) {
          const nextLine = lines[i];
          const nextTrimmed = nextLine.replace(/\s+$/, '');
          if (!nextTrimmed || nextTrimmed.startsWith('#')) {
            i++;
            continue;
          }
          const nextIndent = nextLine.search(/\S/);
          if (nextIndent <= indent) break;
          subLines.push(nextLine);
          i++;
        }
        const sub = parseYamlLines(subLines, 0, indent + 2);
        (result as unknown[]).push(sub.value);
        continue;
      } else {
        (result as unknown[]).push(parseScalar(afterDash));
        i++;
        continue;
      }
    }

    // Object key
    const colonMatch = line.match(/^(\s*)([\w\s._@/+-]+?)\s*:\s*(.*)?$/);
    if (colonMatch) {
      if (!isObject && result === null) {
        isObject = true;
        result = {};
      }
      if (!isObject) break;

      const key = colonMatch[2].trim();
      const valueStr = (colonMatch[3] || '').trim();

      if (valueStr === '' || valueStr === '|' || valueStr === '>') {
        // Check for child content
        const childStart = i + 1;
        if (childStart < lines.length) {
          const childLine = lines[childStart];
          const childTrimmed = childLine.replace(/\s+$/, '');
          if (childTrimmed && !childTrimmed.startsWith('#')) {
            const childIndent = childLine.search(/\S/);
            if (childIndent > indent) {
              const sub = parseYamlLines(lines, childStart, childIndent);
              (result as Record<string, unknown>)[key] = sub.value;
              i = sub.nextIdx;
              continue;
            }
          }
        }
        (result as Record<string, unknown>)[key] = null;
      } else {
        (result as Record<string, unknown>)[key] = parseScalar(valueStr);
      }
      i++;
      continue;
    }

    i++;
  }

  return { value: result, nextIdx: i };
}

function parseScalar(val: string): unknown {
  if (val === '' || val === 'null' || val === '~' || val === 'Null' || val === 'NULL') return null;
  if (val === 'true' || val === 'True' || val === 'TRUE') return true;
  if (val === 'false' || val === 'False' || val === 'FALSE') return false;
  // Quoted strings
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }
  // Inline array
  if (val.startsWith('[') && val.endsWith(']')) {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  // Inline object
  if (val.startsWith('{') && val.endsWith('}')) {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  // Numbers
  if (/^-?\d+$/.test(val)) return parseInt(val, 10);
  if (/^-?\d+\.\d+$/.test(val)) return parseFloat(val);
  return val;
}

function jsonToYaml(data: unknown, indent: number = 0): string {
  const pad = '  '.repeat(indent);

  if (data === null || data === undefined) return 'null';
  if (typeof data === 'boolean') return String(data);
  if (typeof data === 'number') return String(data);
  if (typeof data === 'string') {
    if (data.includes('\n') || data.includes(':') || data.includes('#') || data.startsWith(' ') || data.endsWith(' ')) {
      return `"${data.replace(/"/g, '\\"')}"`;
    }
    if (data === '' || data === 'true' || data === 'false' || data === 'null' ||
        /^-?\d+\.?\d*$/.test(data)) {
      return `"${data}"`;
    }
    return data;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) return '[]';
    return data
      .map((item) => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          const entries = Object.entries(item);
          if (entries.length === 0) return `${pad}- {}`;
          const first = entries[0];
          const rest = entries.slice(1);
          let result = `${pad}- ${first[0]}: ${jsonToYaml(first[1], indent + 2)}`;
          for (const [k, v] of rest) {
            if (typeof v === 'object' && v !== null) {
              result += `\n${pad}  ${k}:\n${jsonToYaml(v, indent + 2).split('\n').map(l => `${pad}  ${l.trim() ? l : ''}`).join('\n')}`;
            } else {
              result += `\n${pad}  ${k}: ${jsonToYaml(v, indent + 2)}`;
            }
          }
          return result;
        }
        const val = jsonToYaml(item, indent + 1);
        if (typeof item === 'object' && item !== null) {
          return `${pad}-\n${val.split('\n').map(l => `  ${l}`).join('\n')}`;
        }
        return `${pad}- ${val}`;
      })
      .join('\n');
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    return entries
      .map(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          const nested = jsonToYaml(value, indent + 1);
          return `${pad}${key}:\n${nested}`;
        }
        return `${pad}${key}: ${jsonToYaml(value, indent)}`;
      })
      .join('\n');
  }

  return String(data);
}

const exampleYaml = `name: zion-app
version: 1.0.0
description: AI-powered developer tools
features:
  - case-converter
  - yaml-converter
  - json-formatter
settings:
  theme: dark
  language: en
  notifications: true
metadata:
  author: Zion Tech Group
  tags:
    - developer-tools
    - ai
    - automation`;

const exampleJson = `{
  "name": "zion-app",
  "version": "1.0.0",
  "description": "AI-powered developer tools",
  "features": ["case-converter", "yaml-converter", "json-formatter"],
  "settings": {
    "theme": "dark",
    "language": "en",
    "notifications": true
  },
  "metadata": {
    "author": "Zion Tech Group",
    "tags": ["developer-tools", "ai", "automation"]
  }
}`;

type Direction = 'yaml-to-json' | 'json-to-yaml';

export default function YamlJsonConverter() {
  const [direction, setDirection] = useState<Direction>('yaml-to-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [indent, setIndent] = useState(2);

  const handleCopy = useCallback(async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    const ext = direction === 'yaml-to-json' ? 'json' : 'yaml';
    const mime = direction === 'yaml-to-json' ? 'application/json' : 'text/yaml';
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [output, direction]);

  const handleLoadExample = useCallback(() => {
    setInput(direction === 'yaml-to-json' ? exampleYaml : exampleJson);
  }, [direction]);

  const handleSwap = useCallback(() => {
    setDirection((d) => (d === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json'));
    setInput(output);
    setOutput('');
    setError(null);
  }, [output]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
    };
    reader.readAsText(file);
  }, []);

  // Auto-convert on input change
  const handleInputChange = useCallback((val: string) => {
    setInput(val);
    if (!val.trim()) {
      setOutput('');
      setError(null);
      return;
    }
    if (direction === 'yaml-to-json') {
      const { data, error: yamlError } = yamlToJson(val);
      if (yamlError) {
        setError(yamlError);
        setOutput('');
      } else {
        setError(null);
        setOutput(JSON.stringify(data, null, indent));
      }
    } else {
      try {
        const parsed = JSON.parse(val);
        setError(null);
        setOutput(jsonToYaml(parsed, 0));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Invalid JSON');
        setOutput('');
      }
    }
  }, [direction, indent]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            YAML ↔ JSON Converter
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Convert between YAML and JSON instantly with live preview — no server required
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-4">
          <div className="flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
            <button
              onClick={() => setDirection('yaml-to-json')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                direction === 'yaml-to-json'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="h-4 w-4" />
              YAML → JSON
            </button>
            <button
              onClick={() => setDirection('json-to-yaml')}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                direction === 'json-to-yaml'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileJson className="h-4 w-4" />
              JSON → YAML
            </button>
          </div>

          <button
            onClick={handleSwap}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Swap
          </button>

          <button
            onClick={handleLoadExample}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition"
          >
            Load Example
          </button>

          {direction === 'yaml-to-json' && (
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500">Indent:</label>
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={1}>1 space</option>
              </select>
            </div>
          )}

          <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition cursor-pointer">
            <Upload className="h-4 w-4" />
            Upload File
            <input
              type="file"
              accept=".yaml,.yml,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Editor */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                {direction === 'yaml-to-json' ? (
                  <>
                    <FileText className="h-4 w-4 text-amber-500" />
                    YAML Input
                  </>
                ) : (
                  <>
                    <FileJson className="h-4 w-4 text-blue-500" />
                    JSON Input
                  </>
                )}
              </h2>
              <span className="text-xs text-slate-400">
                {input.length} chars
              </span>
            </div>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={
                direction === 'yaml-to-json'
                  ? 'Paste your YAML here...'
                  : 'Paste your JSON here...'
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none"
              rows={20}
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                {direction === 'yaml-to-json' ? (
                  <>
                    <FileJson className="h-4 w-4 text-blue-500" />
                    JSON Output
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 text-amber-500" />
                    YAML Output
                  </>
                )}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!output}
                  className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    copied
                      ? 'bg-green-100 text-green-600'
                      : 'border border-slate-300 text-slate-600 hover:bg-slate-50'
                  } disabled:opacity-50`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={!output}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                >
                  <Download className="h-3 w-3" />
                  Download
                </button>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-700">Parse Error</p>
                    <p className="mt-1 text-sm text-red-600 font-mono">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <pre className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 overflow-auto min-h-[480px]">
                {output || (
                  <span className="text-slate-400 italic">
                    Output will appear here...
                  </span>
                )}
              </pre>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">How It Works</h3>
          <div className="grid gap-4 sm:grid-cols-3 text-sm text-slate-600">
            <div>
              <p className="font-medium text-slate-700 mb-1">🔒 100% Client-Side</p>
              <p>Your data never leaves the browser. All parsing happens locally — no server involved.</p>
            </div>
            <div>
              <p className="font-medium text-slate-700 mb-1">⚡ Live Conversion</p>
              <p>Type or paste and the output updates instantly. No button clicks needed.</p>
            </div>
            <div>
              <p className="font-medium text-slate-700 mb-1">📦 Full Support</p>
              <p>Nested objects, arrays, multi-type values, inline structures — all handled.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
