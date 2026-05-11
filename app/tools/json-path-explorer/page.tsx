'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Search, FileJson, AlertCircle, RotateCcw, ChevronRight, ChevronDown } from 'lucide-react';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

function evaluateJsonPath(data: JsonValue, expression: string): { result: JsonValue; error: string | null } {
  const trimmed = expression.trim();
  if (!trimmed || trimmed === '$') return { result: data, error: null };

  try {
    let current: JsonValue[] = [data];
    const tokens = parsePath(trimmed);

    for (const token of tokens) {
      const next: JsonValue[] = [];
      for (const item of current) {
        const results = applyToken(item, token);
        next.push(...results);
      }
      current = next;
    }

    if (current.length === 0) return { result: null, error: null };
    if (current.length === 1) return { result: current[0], error: null };
    return { result: current, error: null };
  } catch (e) {
    return { result: null, error: e instanceof Error ? e.message : 'Invalid JSONPath expression' };
  }
}

type Token =
  | { type: 'root' }
  | { type: 'child'; key: string }
  | { type: 'index'; index: number }
  | { type: 'wildcard' }
  | { type: 'slice'; start: number | null; end: number | null }
  | { type: 'recursive'; key: string }
  | { type: 'filter'; expr: string };

function parsePath(path: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  if (path[i] === '$') i++;
  if (path[i] === '.') i++;

  while (i < path.length) {
    if (path[i] === '.') {
      i++;
      if (path[i] === '.') {
        i++;
        let key = '';
        while (i < path.length && path[i] !== '.' && path[i] !== '[') key += path[i++];
        if (key === '*') tokens.push({ type: 'wildcard' });
        else if (key) tokens.push({ type: 'recursive', key });
      } else {
        let key = '';
        while (i < path.length && path[i] !== '.' && path[i] !== '[') key += path[i++];
        if (key === '*') tokens.push({ type: 'wildcard' });
        else if (key) tokens.push({ type: 'child', key });
      }
    } else if (path[i] === '[') {
      i++;
      if (path[i] === '?') {
        i++;
        let depth = 1;
        let expr = '';
        while (i < path.length && depth > 0) {
          if (path[i] === '[') depth++;
          if (path[i] === ']') depth--;
          if (depth > 0) expr += path[i];
          i++;
        }
        tokens.push({ type: 'filter', expr: expr.trim() });
      } else if (path[i] === '*') {
        i++;
        if (path[i] === ']') i++;
        tokens.push({ type: 'wildcard' });
      } else {
        let content = '';
        while (i < path.length && path[i] !== ']') content += path[i++];
        if (path[i] === ']') i++;

        if (content.includes(':')) {
          const [s, e] = content.split(':');
          tokens.push({
            type: 'slice',
            start: s ? parseInt(s) : null,
            end: e ? parseInt(e) : null,
          });
        } else if (/^-?\d+$/.test(content)) {
          tokens.push({ type: 'index', index: parseInt(content) });
        } else if (content.startsWith("'") && content.endsWith("'")) {
          tokens.push({ type: 'child', key: content.slice(1, -1) });
        } else if (content.startsWith('"') && content.endsWith('"')) {
          tokens.push({ type: 'child', key: content.slice(1, -1) });
        } else {
          tokens.push({ type: 'child', key: content });
        }
      }
    } else {
      let key = '';
      while (i < path.length && path[i] !== '.' && path[i] !== '[') key += path[i++];
      if (key) tokens.push({ type: 'child', key });
    }
  }

  return tokens;
}

function applyToken(data: JsonValue, token: Token): JsonValue[] {
  if (data === null || data === undefined) return [];
  if (token.type === 'root') return [data];
  if (token.type === 'wildcard') {
    if (Array.isArray(data)) return data;
    if (typeof data === 'object') return Object.values(data as Record<string, JsonValue>);
    return [];
  }
  if (token.type === 'child') {
    if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
      const val = (data as Record<string, JsonValue>)[token.key];
      return val !== undefined ? [val] : [];
    }
    return [];
  }
  if (token.type === 'index') {
    if (Array.isArray(data)) {
      const idx = token.index < 0 ? data.length + token.index : token.index;
      return idx >= 0 && idx < data.length ? [data[idx]] : [];
    }
    return [];
  }
  if (token.type === 'slice') {
    if (!Array.isArray(data)) return [];
    const start = token.start ?? 0;
    const end = token.end ?? data.length;
    return data.slice(start < 0 ? data.length + start : start, end < 0 ? data.length + end : end);
  }
  if (token.type === 'recursive') {
    const results: JsonValue[] = [];
    const collect = (obj: JsonValue) => {
      if (obj === null || typeof obj !== 'object') return;
      if (Array.isArray(obj)) {
        obj.forEach(collect);
      } else {
        const rec = obj as Record<string, JsonValue>;
        if (rec[token.key] !== undefined) results.push(rec[token.key]);
        Object.values(rec).forEach(collect);
      }
    };
    collect(data);
    return results;
  }
  if (token.type === 'filter') {
    if (!Array.isArray(data)) return [];
    return data.filter((item) => {
      try {
        const simplified = token.expr
          .replace(/@\./g, '(item && typeof item==="object" && !Array.isArray(item) ? (item as Record<string,JsonValue>).')
          .replace(/@/g, 'item');
        const fn = new Function('item', `return ${simplified}`);
        return fn(item);
      } catch {
        return false;
      }
    });
  }
  return [];
}

const EXAMPLES = [
  { label: 'All items', path: '$.store.book[*]' },
  { label: 'First item', path: '$.store.book[0]' },
  { label: 'Last item', path: '$.store.book[-1]' },
  { label: 'All titles', path: '$.store.book[*].title' },
  { label: 'Slice', path: '$.store.book[0:2]' },
  { label: 'Recursive', path: '$..price' },
  { label: 'Nested value', path: '$.store.bicycle.color' },
];

const SAMPLE_JSON = `{
  "store": {
    "book": [
      { "title": "Nineteen Eighty-Four", "author": "George Orwell", "price": 9.99, "category": "fiction" },
      { "title": "The Pragmatic Programmer", "author": "David Thomas", "price": 42.99, "category": "programming" },
      { "title": "Clean Code", "author": "Robert C. Martin", "price": 37.99, "category": "programming" },
      { "title": "Dune", "author": "Frank Herbert", "price": 14.99, "category": "fiction" }
    ],
    "bicycle": { "color": "red", "price": 19.95 }
  }
}`;

function JsonTreeView({ data, path = '$', depth = 0 }: { data: JsonValue; path?: string; depth?: number }) {
  const [collapsed, setCollapsed] = useState(depth > 2);

  if (data === null) return <span className="text-slate-500 italic">null</span>;
  if (typeof data === 'boolean') return <span className="text-amber-400">{data.toString()}</span>;
  if (typeof data === 'number') return <span className="text-blue-400">{data}</span>;
  if (typeof data === 'string') return <span className="text-emerald-400">&quot;{data}&quot;</span>;

  if (Array.isArray(data)) {
    if (data.length === 0) return <span className="text-slate-500">[]</span>;
    return (
      <div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          <span className="text-slate-500">[{data.length} items]</span>
        </button>
        {!collapsed && (
          <div className="pl-4 border-l border-slate-700/50 ml-1 mt-1 space-y-1">
            {data.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-slate-600 text-xs shrink-0 mt-0.5">{i}:</span>
                <JsonTreeView data={item} path={`${path}[${i}]`} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data);
    if (entries.length === 0) return <span className="text-slate-500">{'{}'}</span>;
    return (
      <div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          <span className="text-slate-500">{'{'}{entries.length} keys{'}'}</span>
        </button>
        {!collapsed && (
          <div className="pl-4 border-l border-slate-700/50 ml-1 mt-1 space-y-1">
            {entries.map(([key, val]) => (
              <div key={key} className="flex items-start gap-2">
                <span className="text-purple-400 text-xs shrink-0 mt-0.5">{key}:</span>
                <JsonTreeView data={val} path={`${path}.${key}`} depth={depth + 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <span className="text-slate-400">{String(data)}</span>;
}

export default function JsonPathExplorer() {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [pathExpression, setPathExpression] = useState('$.store.book[*].title');
  const [copied, setCopied] = useState<string | null>(null);
  const [jsonError, setJsonError] = useState('');

  const parsedJson = useMemo((): JsonValue | null => {
    setJsonError('');
    if (!jsonInput.trim()) return null;
    try {
      return JSON.parse(jsonInput) as JsonValue;
    } catch (e) {
      setJsonError(e instanceof Error ? e.message : 'Invalid JSON');
      return null;
    }
  }, [jsonInput]);

  const pathResult = useMemo(() => {
    if (parsedJson === null) return { result: null as JsonValue, error: null as string | null };
    return evaluateJsonPath(parsedJson, pathExpression);
  }, [parsedJson, pathExpression]);

  const resultDisplay = useMemo(() => {
    if (pathResult.error) return pathResult.error;
    try {
      return JSON.stringify(pathResult.result, null, 2);
    } catch {
      return String(pathResult.result);
    }
  }, [pathResult]);

  const copy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleClear = () => {
    setJsonInput('');
    setPathExpression('');
  };

  const loadSample = () => {
    setJsonInput(SAMPLE_JSON);
    setPathExpression('$.store.book[*].title');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">JSON Path Explorer</h1>
              <p className="text-slate-400">Query JSON data with JSONPath expressions — live results as you type</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-400">JSON Input</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={loadSample} className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
                  Load sample
                </button>
                <button onClick={handleClear} className="p-1 text-slate-400 hover:text-white transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="relative">
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste your JSON here..."
                className={`w-full h-80 px-4 py-3 bg-slate-800/50 border rounded-xl text-sm font-mono resize-none focus:outline-none focus:ring-2 transition-all ${
                  jsonError ? 'border-red-500/50 focus:ring-red-500/50' : 'border-slate-700/50 focus:ring-violet-500/50'
                }`}
                spellCheck={false}
              />
              {jsonError && (
                <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span className="text-xs text-red-300">{jsonError}</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-400">Result</span>
              {pathResult.result !== null && (
                <button
                  onClick={() => copy(resultDisplay, 'result')}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  {copied === 'result' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'result' ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>
            <div className="w-full h-80 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-auto">
              {pathResult.error ? (
                <div className="flex items-center gap-2 text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{pathResult.error}</span>
                </div>
              ) : parsedJson !== null ? (
                <pre className="text-sm font-mono text-slate-300 whitespace-pre-wrap">{resultDisplay}</pre>
              ) : (
                <span className="text-sm text-slate-600 italic">Enter valid JSON to see results</span>
              )}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
        >
          <label className="block text-sm font-medium text-slate-400 mb-2">JSONPath Expression</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={pathExpression}
              onChange={(e) => setPathExpression(e.target.value)}
              placeholder="$.store.book[*].title"
              className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-lg font-mono focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
              spellCheck={false}
              autoComplete="off"
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.path}
                onClick={() => setPathExpression(ex.path)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  pathExpression === ex.path
                    ? 'bg-violet-500 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                }`}
              >
                {ex.label}
              </button>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
        >
          <h3 className="text-sm font-medium text-slate-400 mb-4">Syntax Reference</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              ['$', 'Root element'],
              ['@', 'Current element (in filter)'],
              ['.key', 'Child property access'],
              ['[n]', 'Array index (negative from end)'],
              ['[start:end]', 'Array slice'],
              ['[*]', 'Wildcard — all elements'],
              ['..key', 'Recursive descent'],
              ['[?(expr)]', 'Filter expression'],
            ].map(([syntax, desc]) => (
              <div key={syntax} className="flex items-start gap-3 bg-slate-900/50 p-3 rounded-lg">
                <code className="text-violet-400 shrink-0">{syntax}</code>
                <span className="text-slate-400">{desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {parsedJson !== null && !jsonError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-slate-400">JSON Tree View</h3>
              <button
                onClick={() => copy(JSON.stringify(parsedJson, null, 2), 'tree')}
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {copied === 'tree' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === 'tree' ? 'Copied' : 'Copy formatted'}
              </button>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-lg overflow-auto max-h-96">
              <JsonTreeView data={parsedJson} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
