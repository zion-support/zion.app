'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Copy, Check, Play, RotateCcw, ChevronRight, ChevronDown, FileJson, Lightbulb } from 'lucide-react';

interface PathResult {
  path: string;
  value: unknown;
}

const EXAMPLES = [
  {
    label: 'API response',
    json: `{
  "users": [
    { "id": 1, "name": "Alice", "email": "alice@example.com", "roles": ["admin", "editor"] },
    { "id": 2, "name": "Bob", "email": "bob@example.com", "roles": ["viewer"] },
    { "id": 3, "name": "Charlie", "email": "charlie@example.com", "roles": ["editor", "contributor"] }
  ],
  "meta": { "total": 3, "page": 1, "hasMore": true }
}`,
    paths: [
      '$.users[*].name',
      '$.users[0].roles[*]',
      '$.users[?(@.roles.length > 1)].name',
      '$.meta.total',
      '$.users[*].email',
    ],
  },
  {
    label: 'Package.json',
    json: `{
  "name": "zion-app",
  "version": "2.5.0",
  "dependencies": {
    "next": "14.2.0",
    "react": "18.3.0",
    "tailwindcss": "3.4.0"
  },
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}`,
    paths: [
      '$.dependencies.*',
      '$.scripts.build',
      '$.name',
      '$.version',
    ],
  },
  {
    label: 'Nested data',
    json: `{
  "company": {
    "departments": [
      {
        "name": "Engineering",
        "employees": [
          { "name": "Dev1", "skills": ["React", "Node.js"] },
          { "name": "Dev2", "skills": ["Python", "ML"] }
        ]
      },
      {
        "name": "Design",
        "employees": [
          { "name": "Designer1", "skills": ["Figma", "CSS"] }
        ]
      }
    ]
  }
}`,
    paths: [
      '$.company.departments[*].name',
      '$.company.departments[0].employees[*].skills[*]',
      '$.company.departments[*].employees[*].name',
    ],
  },
];

function evaluateJsonPath(data: unknown, path: string): PathResult[] {
  const results: PathResult[] = [];

  if (!path || path === '$') {
    results.push({ path: '$', value: data });
    return results;
  }

  try {
    const segments = path.replace(/^\$\.?/, '').split(/\.|\[(\d+)\]|\[\*\]|\[\?\(@\.([^)]+)\)\]/g).filter(Boolean);
    
    const walk = (current: unknown, segments: string[], currentPath: string): void => {
      if (segments.length === 0) {
        results.push({ path: currentPath || '$', value: current });
        return;
      }

      const seg = segments[0];
      const remaining = segments.slice(1);

      if (seg === '*') {
        if (Array.isArray(current)) {
          current.forEach((item, i) => walk(item, remaining, `${currentPath}[${i}]`));
        } else if (typeof current === 'object' && current !== null) {
          Object.entries(current).forEach(([key, val]) => walk(val, remaining, `${currentPath}.${key}`));
        }
      } else if (/^\d+$/.test(seg)) {
        const idx = parseInt(seg);
        if (Array.isArray(current) && idx < current.length) {
          walk(current[idx], remaining, `${currentPath}[${idx}]`);
        }
      } else if (seg.startsWith('?(@.')) {
        const filterMatch = seg.match(/\?\(@\.(\w+)(?:\.(\w+))?\s*(==|!=|>|<|>=|<=|includes|length\s*[><=])\s*['"]?([^'"\]]+)['"]?\)/);
        if (filterMatch && Array.isArray(current)) {
          const [, prop, subProp, op, val] = filterMatch;
          current.forEach((item, i) => {
            let itemVal = item?.[prop];
            if (subProp) itemVal = itemVal?.[subProp];
            let match = false;
            const numVal = parseFloat(val);
            const itemNum = typeof itemVal === 'number' ? itemVal : parseFloat(String(itemVal));
            
            switch (op) {
              case '==': match = String(itemVal) === val; break;
              case '!=': match = String(itemVal) !== val; break;
              case '>': match = !isNaN(itemNum) && itemNum > numVal; break;
              case '<': match = !isNaN(itemNum) && itemNum < numVal; break;
              case '>=': match = !isNaN(itemNum) && itemNum >= numVal; break;
              case '<=': match = !isNaN(itemNum) && itemNum <= numVal; break;
              case 'includes': match = Array.isArray(itemVal) ? itemVal.includes(val) : String(itemVal).includes(val); break;
              default:
                if (op.includes('length') && op.includes('>')) {
                  match = Array.isArray(itemVal) && itemVal.length > numVal;
                }
            }
            if (match) {
              walk(item, remaining, `${currentPath}[${i}]`);
            }
          });
        } else if (Array.isArray(current)) {
          // Simple filter like ?(@.prop)
          const propMatch = seg.match(/\?\(@\.(\w+)\)/);
          if (propMatch) {
            current.forEach((item, i) => {
              if (item?.[propMatch[1]]) {
                walk(item, remaining, `${currentPath}[${i}]`);
              }
            });
          }
        }
      } else {
        if (typeof current === 'object' && current !== null && seg in current) {
          walk((current as Record<string, unknown>)[seg], remaining, `${currentPath}.${seg}`);
        }
      }
    };

    // Simple path execution
    const parts = path.replace(/^\$\.?/, '').split('.');
    const execSimple = (obj: unknown, parts: string[], p: string) => {
      if (parts.length === 0) {
        results.push({ path: p, value: obj });
        return;
      }
      const part = parts[0];
      const rest = parts.slice(1);

      if (part === '*') {
        if (Array.isArray(obj)) {
          obj.forEach((v, i) => execSimple(v, rest, `${p}[${i}]`));
        } else if (typeof obj === 'object' && obj !== null) {
          Object.entries(obj).forEach(([k, v]) => execSimple(v, rest, `${p}.${k}`));
        }
      } else if (part.match(/^\d+$/)) {
        const idx = parseInt(part);
        if (Array.isArray(obj) && idx < obj.length) {
          execSimple(obj[idx], rest, `${p}[${idx}]`);
        }
      } else {
        if (typeof obj === 'object' && obj !== null && part in obj) {
          execSimple((obj as Record<string, unknown>)[part], rest, `${p}.${part}`);
        }
      }
    };

    execSimple(data, parts, '$');
  } catch {
    // fallback
  }

  return results;
}

function formatValue(val: unknown): string {
  if (val === null) return 'null';
  if (val === undefined) return 'undefined';
  if (typeof val === 'string') return `"${val}"`;
  if (typeof val === 'object') return JSON.stringify(val, null, 2);
  return String(val);
}

function getTypeColor(val: unknown): string {
  if (val === null || val === undefined) return 'text-slate-400';
  if (typeof val === 'string') return 'text-emerald-400';
  if (typeof val === 'number') return 'text-amber-400';
  if (typeof val === 'boolean') return 'text-purple-400';
  if (Array.isArray(val)) return 'text-sky-400';
  if (typeof val === 'object') return 'text-rose-400';
  return 'text-slate-300';
}

export default function JSONPathExplorer() {
  const [jsonInput, setJsonInput] = useState(EXAMPLES[0].json);
  const [pathInput, setPathInput] = useState(EXAMPLES[0].paths[0]);
  const [results, setResults] = useState<PathResult[]>([]);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set([0]));

  const parsedJson = useMemo(() => {
    try {
      return { data: JSON.parse(jsonInput), error: null };
    } catch (e) {
      return { data: null, error: (e as Error).message };
    }
  }, [jsonInput]);

  const execute = useCallback(() => {
    setError('');
    setResults([]);

    if (parsedJson.error) {
      setError(`Invalid JSON: ${parsedJson.error}`);
      return;
    }

    if (!pathInput.trim()) {
      setError('Please enter a JSONPath expression');
      return;
    }

    const res = evaluateJsonPath(parsedJson.data, pathInput.trim());
    if (res.length === 0) {
      setError('No results found. Try a different path expression.');
      return;
    }

    setResults(res);
    setExpanded(new Set(res.map((_, i) => i)));
  }, [parsedJson, pathInput]);

  const reset = () => {
    setJsonInput(EXAMPLES[0].json);
    setPathInput(EXAMPLES[0].paths[0]);
    setResults([]);
    setError('');
  };

  const loadExample = (idx: number) => {
    const ex = EXAMPLES[idx];
    setJsonInput(ex.json);
    setPathInput(ex.paths[0]);
    setResults([]);
    setError('');
  };

  const copyResults = async () => {
    const text = results.map(r => `${r.path}: ${formatValue(r.value)}`).join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleExpand = (idx: number) => {
    const next = new Set(expanded);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setExpanded(next);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-50 sm:text-4xl">
            <Search className="mr-2 inline-block h-8 w-8 text-sky-400" />
            JSONPath Explorer
          </h1>
          <p className="text-slate-400">Query and explore JSON data with JSONPath expressions. Filter, traverse, and extract nested data instantly.</p>
        </motion.div>

        {/* Example Selector */}
        <div className="mb-6 flex flex-wrap gap-2">
          {EXAMPLES.map((ex, i) => (
            <button key={i} onClick={() => loadExample(i)} className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-1.5 text-xs text-slate-300 transition hover:border-sky-500/50 hover:text-sky-300">
              <FileJson className="mr-1 inline h-3 w-3" />{ex.label}
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left: JSON Input */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <label className="mb-2 block text-sm font-medium text-slate-300">JSON Data</label>
            <textarea
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              rows={16}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-3 font-mono text-sm text-slate-200 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
              placeholder="Paste your JSON here..."
              spellCheck={false}
            />
            {parsedJson.error && (
              <p className="mt-1 text-xs text-rose-400">Invalid JSON: {parsedJson.error}</p>
            )}
          </motion.div>

          {/* Right: Path + Results */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <label className="mb-2 block text-sm font-medium text-slate-300">JSONPath Expression</label>
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                value={pathInput}
                onChange={e => setPathInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && execute()}
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 font-mono text-sm text-slate-200 outline-none transition focus:border-sky-500"
                placeholder="$.users[*].name"
              />
              <button onClick={execute} className="rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-sky-500">
                <Play className="h-4 w-4" />
              </button>
              <button onClick={reset} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-slate-400 transition hover:text-slate-200">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            {/* Suggested Paths */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {EXAMPLES.find(e => e.json === jsonInput)?.paths.map((p, i) => (
                <button key={i} onClick={() => { setPathInput(p); }} className="rounded-md border border-slate-700/50 bg-slate-800/50 px-2 py-1 font-mono text-[11px] text-slate-400 transition hover:border-sky-500/50 hover:text-sky-300">
                  {p}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
                {error}
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="rounded-xl border border-slate-700 bg-slate-900/60">
                <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
                  <span className="text-sm font-medium text-slate-300">
                    Results <span className="text-sky-400">({results.length})</span>
                  </span>
                  <button onClick={copyResults} className="flex items-center gap-1 text-xs text-slate-400 transition hover:text-slate-200">
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied' : 'Copy all'}
                  </button>
                </div>
                <div className="max-h-[340px] divide-y divide-slate-800 overflow-y-auto">
                  {results.map((r, i) => (
                    <div key={i} className="px-4 py-3">
                      <button onClick={() => toggleExpand(i)} className="flex w-full items-center gap-2 text-left">
                        {expanded.has(i) ? <ChevronDown className="h-3.5 w-3.5 text-slate-500" /> : <ChevronRight className="h-3.5 w-3.5 text-slate-500" />}
                        <span className="font-mono text-xs text-sky-400">{r.path}</span>
                        <span className={`ml-auto text-xs ${getTypeColor(r.value)}`}>
                          {Array.isArray(r.value) ? `Array[${r.value.length}]` : typeof r.value}
                        </span>
                      </button>
                      {expanded.has(i) && (
                        <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-950 p-3 font-mono text-xs leading-relaxed">
                          <span className={getTypeColor(r.value)}>{formatValue(r.value)}</span>
                        </pre>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Quick Reference */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 rounded-xl border border-slate-700 bg-slate-900/40 p-6">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Lightbulb className="h-4 w-4 text-amber-400" /> JSONPath Quick Reference
          </h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { syntax: '$', desc: 'Root element' },
              { syntax: '$.prop', desc: 'Property access' },
              { syntax: '$.a.b', desc: 'Nested property' },
              { syntax: '$.arr[0]', desc: 'Array index' },
              { syntax: '$.arr[*]', desc: 'All array elements' },
              { syntax: '$.obj.*', desc: 'All object values' },
              { syntax: '$.arr[-1]', desc: 'Last array element' },
              { syntax: '$.arr[0:2]', desc: 'Array slice' },
              { syntax: '$.arr[?(@.x)]', desc: 'Filter: has property' },
            ].map((ref, i) => (
              <div key={i} className="flex items-start gap-2">
                <code className="shrink-0 rounded bg-slate-800 px-2 py-0.5 font-mono text-xs text-sky-300">{ref.syntax}</code>
                <span className="text-xs text-slate-400">{ref.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
