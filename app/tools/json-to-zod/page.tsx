'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, FileCode2, Wand2, ArrowRight, Braces, RefreshCw } from 'lucide-react';

type ZodMode = 'strict' | 'loose';

function jsonToZod(value: unknown, indent: number = 0, mode: ZodMode = 'strict'): string {
  const pad = '  '.repeat(indent);

  if (value === null) return 'z.null()';
  if (value === undefined) return 'z.undefined()';

  if (typeof value === 'boolean') return 'z.boolean()';
  if (typeof value === 'number') {
    if (Number.isInteger(value)) return 'z.number().int()';
    return 'z.number()';
  }
  if (typeof value === 'string') {
    // Detect common string patterns
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) return 'z.string().datetime()';
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return 'z.string().date()';
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'z.string().email()';
    if (/^https?:\/\//.test(value)) return 'z.string().url()';
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) return 'z.string().uuid()';
    if (/^\+[1-9]\d{1,14}$/.test(value)) return 'z.string().regex(/^\\+[1-9]\\d{1,14}$/)';
    return 'z.string()';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return 'z.array(z.unknown())';

    // Merge all element schemas
    const elementSchemas = value.map((el) => jsonToZod(el, indent + 1, mode));
    const unique = [...new Set(elementSchemas)];

    if (unique.length === 1) {
      return `z.array(${unique[0]})`;
    }

    // Use union for mixed types
    return `z.array(z.union([\n${pad}  ${unique.join(`,\n${pad}  `)}\n${pad}]))`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return 'z.object({})';

    const fields = entries.map(([key, val]) => {
      const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      const zodType = jsonToZod(val, indent + 1, mode);
      return `${pad}  ${safeKey}: ${zodType},`;
    });

    const suffix = mode === 'loose' ? '.passthrough()' : '.strict()';
    return `z.object({\n${fields.join('\n')}\n${pad}})${suffix}`;
  }

  return 'z.unknown()';
}

function generateSchemaName(json: unknown): string {
  if (typeof json === 'object' && json !== null && !Array.isArray(json)) {
    const keys = Object.keys(json as Record<string, unknown>);
    if (keys.includes('id') && keys.includes('name')) return 'Entity';
    if (keys.includes('email')) return 'User';
    if (keys.includes('title') || keys.includes('body')) return 'Post';
    if (keys.includes('url') || keys.includes('href')) return 'Link';
    if (keys.includes('data')) return 'Response';
    if (keys.includes('items') || keys.includes('results')) return 'PaginatedResponse';
  }
  return 'Schema';
}

const EXAMPLES = [
  {
    label: 'User object',
    value: JSON.stringify(
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 28,
        active: true,
        role: 'admin',
        createdAt: '2026-03-30T10:00:00Z',
      },
      null,
      2,
    ),
  },
  {
    label: 'API Response',
    value: JSON.stringify(
      {
        status: 'success',
        data: {
          items: [
            { id: 1, title: 'First item', completed: false },
            { id: 2, title: 'Second item', completed: true },
          ],
          total: 2,
          page: 1,
        },
        meta: { requestId: 'abc-123', timestamp: '2026-03-30T10:00:00Z' },
      },
      null,
      2,
    ),
  },
  {
    label: 'Nested config',
    value: JSON.stringify(
      {
        app: { name: 'zion', version: '1.0.0', debug: false },
        database: { host: 'localhost', port: 5432, name: 'zion_db', ssl: true },
        features: ['ai-lab', 'tools', 'blog'],
      },
      null,
      2,
    ),
  },
  {
    label: 'Array of objects',
    value: JSON.stringify(
      [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
      ],
      null,
      2,
    ),
  },
];

export default function JsonToZod() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<ZodMode>('strict');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [schemaName, setSchemaName] = useState('Schema');

  const handleConvert = useCallback(() => {
    setError('');
    setOutput('');

    if (!input.trim()) {
      setError('Please enter some JSON to convert.');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const name = generateSchemaName(parsed);
      setSchemaName(name);

      const zodSchema = jsonToZod(parsed, 0, mode);
      const fullOutput = `import { z } from 'zod';\n\nexport const ${name} = ${zodSchema};\n\nexport type ${name} = z.infer<typeof ${name}>;`;

      setOutput(fullOutput);
    } catch (e) {
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  }, [input, mode]);

  const handleFormat = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError(`Cannot format: ${(e as Error).message}`);
    }
  }, [input]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadExample = (value: string) => {
    setInput(value);
    setOutput('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/20">
              <FileCode2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">JSON to Zod Converter</h1>
            <p className="mt-2 text-slate-600">
              Convert JSON data to Zod validation schemas with smart type inference — dates, emails, URLs, UUIDs auto-detected
            </p>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mb-4 flex flex-wrap items-center gap-3"
        >
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            {(['strict', 'loose'] as ZodMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 text-sm font-semibold transition ${
                  mode === m ? 'bg-violet-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {m === 'strict' ? '.strict()' : '.passthrough()'}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500">
            {mode === 'strict'
              ? 'Rejects unknown keys'
              : 'Allows extra keys through'}
          </span>

          <div className="ml-auto flex gap-2">
            <button
              onClick={handleFormat}
              disabled={!input.trim()}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition"
            >
              <Braces className="h-4 w-4" />
              Format JSON
            </button>
            <button
              onClick={handleConvert}
              disabled={!input.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-40 transition"
            >
              <Wand2 className="h-4 w-4" />
              Convert to Zod
            </button>
          </div>
        </motion.div>

        {/* Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          <span className="text-xs text-slate-500 py-1">Examples:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => loadExample(ex.value)}
              className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition"
            >
              {ex.label}
            </button>
          ))}
        </motion.div>

        {/* Editor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid gap-4 lg:grid-cols-2"
        >
          {/* Input */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
              <span className="text-sm font-semibold text-slate-700">JSON Input</span>
              <button
                onClick={() => { setInput(''); setOutput(''); setError(''); }}
                className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
              >
                <RefreshCw className="h-3 w-3" />
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder='{\n  "id": 1,\n  "name": "Example",\n  "email": "user@example.com"\n}'
              className="h-96 w-full resize-none bg-white p-4 font-mono text-sm text-slate-800 focus:outline-none"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
              <span className="text-sm font-semibold text-slate-700">Zod Schema Output</span>
              {output && (
                <button
                  onClick={copyOutput}
                  className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <div className="h-96 overflow-auto p-4">
              {error ? (
                <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                  <strong>Error:</strong> {error}
                </div>
              ) : output ? (
                <pre className="font-mono text-sm text-slate-800 whitespace-pre-wrap">{output}</pre>
              ) : (
                <div className="flex h-full items-center justify-center text-slate-400">
                  <div className="text-center">
                    <ArrowRight className="mx-auto h-8 w-8 mb-2 opacity-40" />
                    <p className="text-sm">Paste JSON on the left and click Convert</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900">Smart Type Detection</h2>
          <p className="mt-1 text-sm text-slate-600">
            The converter automatically detects common string patterns and maps them to Zod validators:
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { pattern: 'Email addresses', validator: 'z.string().email()' },
              { pattern: 'URLs', validator: 'z.string().url()' },
              { pattern: 'ISO datetimes', validator: 'z.string().datetime()' },
              { pattern: 'ISO dates', validator: 'z.string().date()' },
              { pattern: 'UUIDs', validator: 'z.string().uuid()' },
              { pattern: 'Phone numbers', validator: 'z.string().regex(...)' },
              { pattern: 'Integers', validator: 'z.number().int()' },
              { pattern: 'Mixed arrays', validator: 'z.array(z.union([...]))' },
              { pattern: 'TypeScript types', validator: 'z.infer<typeof Schema>' },
            ].map((item) => (
              <div key={item.pattern} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                <span className="text-sm font-semibold text-slate-800">{item.pattern}</span>
                <code className="mt-1 block text-xs text-violet-600 font-mono">{item.validator}</code>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Zod info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 to-indigo-50 p-6"
        >
          <h2 className="text-lg font-semibold text-violet-900">What is Zod?</h2>
          <p className="mt-2 text-sm text-violet-800/80">
            Zod is a TypeScript-first schema validation library with zero dependencies. It lets you declare
            schemas once and automatically infer TypeScript types from them — eliminating type drift between
            your runtime validation and compile-time types.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <a
              href="https://zod.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-violet-700 hover:text-violet-900 underline"
            >
              zod.dev →
            </a>
            <code className="rounded bg-violet-100 px-2 py-1 text-violet-800">npm install zod</code>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
