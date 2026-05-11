'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, FileJson, Braces, Wand2, Download } from 'lucide-react';

interface SchemaOptions {
  title: string;
  required: boolean;
  additionalProperties: boolean;
  examples: boolean;
  descriptions: boolean;
}

function inferSchema(obj: unknown, options: SchemaOptions, path = ''): Record<string, unknown> {
  if (obj === null) return { type: 'null' };
  if (typeof obj === 'boolean') return { type: 'boolean' };
  if (typeof obj === 'number') {
    if (Number.isInteger(obj)) return { type: 'integer', ...(options.examples ? { examples: [obj] } : {}) };
    return { type: 'number', ...(options.examples ? { examples: [obj] } : {}) };
  }
  if (typeof obj === 'string') {
    const schema: Record<string, unknown> = { type: 'string' };

    // Smart format detection
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(obj)) {
      schema.format = 'date-time';
    } else if (/^\d{4}-\d{2}-\d{2}$/.test(obj)) {
      schema.format = 'date';
    } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj)) {
      schema.format = 'email';
    } else if (/^https?:\/\//.test(obj)) {
      schema.format = 'uri';
    } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(obj)) {
      schema.format = 'uuid';
    } else if (/^\+[1-9]\d{1,14}$/.test(obj)) {
      schema.format = 'phone';
    } else if (/^#[0-9a-f]{3,8}$/i.test(obj)) {
      schema.pattern = '^#[0-9a-fA-F]{3,8}$';
    } else if (obj.length > 500) {
      // Likely a textarea/description field
      if (options.descriptions) {
        schema.description = 'Long text field';
      }
    }

    if (obj.length > 0 && obj.length <= 255) {
      schema.maxLength = 255;
    }

    if (options.examples && obj.length < 100) {
      schema.examples = [obj];
    }

    return schema;
  }
  if (Array.isArray(obj)) {
    const schema: Record<string, unknown> = { type: 'array' };
    if (obj.length > 0) {
      // Merge schemas of all items
      const itemSchemas = obj.map((item) => inferSchema(item, options, `${path}[]`));
      const uniqueTypes = [...new Set(itemSchemas.map((s) => s.type))];

      if (uniqueTypes.length === 1) {
        schema.items = itemSchemas[0];
      } else {
        schema.items = { oneOf: itemSchemas.filter((s, i, arr) => arr.findIndex((x) => JSON.stringify(x) === JSON.stringify(s)) === i) };
      }
    } else {
      schema.items = {};
    }
    return schema;
  }
  if (typeof obj === 'object') {
    const record = obj as Record<string, unknown>;
    const properties: Record<string, unknown> = {};
    const required: string[] = [];

    for (const [key, value] of Object.entries(record)) {
      properties[key] = inferSchema(value, options, `${path}.${key}`);
      if (value !== null && value !== undefined && value !== '') {
        required.push(key);
      }
    }

    const schema: Record<string, unknown> = { type: 'object', properties };
    if (options.required && required.length > 0) {
      schema.required = required;
    }
    if (!options.additionalProperties) {
      schema.additionalProperties = false;
    }
    return schema;
  }

  return {};
}

function generateFullSchema(data: unknown, options: SchemaOptions): string {
  const schema = inferSchema(data, options);

  const root: Record<string, unknown> = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    ...(options.title ? { title: options.title } : {}),
    ...schema,
  };

  return JSON.stringify(root, null, 2);
}

function generateTypescript(schema: string): string {
  try {
    const parsed = JSON.parse(schema);
    return schemaToTs(parsed, 'Root');
  } catch {
    return '// Invalid schema';
  }
}

function schemaToTs(schema: Record<string, unknown>, name: string): string {
  const type = schema.type as string;

  if (type === 'object' && schema.properties) {
    const props = schema.properties as Record<string, Record<string, unknown>>;
    const required = (schema.required as string[]) || [];
    const lines: string[] = [`interface ${name} {`];

    for (const [key, prop] of Object.entries(props)) {
      const isRequired = required.includes(key);
      const tsType = getTypeName(prop);
      lines.push(`  ${key}${isRequired ? '' : '?'}: ${tsType};`);
    }

    lines.push('}');
    return lines.join('\n');
  }

  return `type ${name} = ${getTypeName(schema)};`;
}

function getTypeName(schema: Record<string, unknown>): string {
  const type = schema.type as string;
  switch (type) {
    case 'string': return 'string';
    case 'number': case 'integer': return 'number';
    case 'boolean': return 'boolean';
    case 'null': return 'null';
    case 'array': {
      const items = schema.items as Record<string, unknown> | undefined;
      if (items) return `${getTypeName(items)}[]`;
      return 'unknown[]';
    }
    case 'object': return 'Record<string, unknown>';
    default:
      if (schema.oneOf) {
        const types = (schema.oneOf as Record<string, unknown>[]).map(getTypeName);
        return types.join(' | ');
      }
      return 'unknown';
  }
}

const EXAMPLES = [
  {
    label: 'User object',
    value: JSON.stringify({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      active: true,
      createdAt: '2024-01-15T10:30:00Z',
      tags: ['admin', 'user'],
    }, null, 2),
  },
  {
    label: 'API response',
    value: JSON.stringify({
      status: 'success',
      data: {
        users: [
          { id: 1, name: 'Alice', email: 'alice@test.com' },
          { id: 2, name: 'Bob', email: 'bob@test.com' },
        ],
        total: 2,
        page: 1,
      },
      message: 'Users retrieved successfully',
    }, null, 2),
  },
  {
    label: 'Product catalog',
    value: JSON.stringify({
      products: [
        {
          id: 'prod_abc123',
          name: 'Widget Pro',
          price: 29.99,
          inStock: true,
          categories: ['electronics', 'gadgets'],
          specs: { weight: '200g', color: '#ff5733' },
        },
      ],
      metadata: { total: 1, page: 1, perPage: 20 },
    }, null, 2),
  },
  {
    label: 'Nested config',
    value: JSON.stringify({
      database: { host: 'localhost', port: 5432, name: 'mydb', ssl: true },
      cache: { enabled: true, ttl: 3600 },
      features: ['dark-mode', 'notifications'],
    }, null, 2),
  },
];

export default function JsonSchemaGeneratorPage() {
  const [input, setInput] = useState('');
  const [schema, setSchema] = useState('');
  const [typescript, setTypescript] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [options, setOptions] = useState<SchemaOptions>({
    title: '',
    required: true,
    additionalProperties: false,
    examples: true,
    descriptions: true,
  });
  const [activeTab, setActiveTab] = useState<'schema' | 'typescript'>('schema');

  const generate = useCallback(() => {
    if (!input.trim()) {
      setError('Please paste some JSON first');
      return;
    }
    try {
      const data = JSON.parse(input);
      const result = generateFullSchema(data, options);
      setSchema(result);
      setTypescript(generateTypescript(result));
      setError('');
    } catch (e) {
      setError(`Invalid JSON: ${e instanceof Error ? e.message : 'Parse error'}`);
      setSchema('');
      setTypescript('');
    }
  }, [input, options]);

  const copyOutput = useCallback(async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const downloadSchema = useCallback(() => {
    const content = activeTab === 'schema' ? schema : typescript;
    const ext = activeTab === 'schema' ? 'json' : 'ts';
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `schema.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [schema, typescript, activeTab]);

  const loadExample = useCallback((value: string) => {
    setInput(value);
    setError('');
  }, []);

  // Auto-generate on input change with debounce
  useState(() => {
    const timer = setTimeout(generate, 500);
    return () => clearTimeout(timer);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <FileJson className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">JSON Schema Generator</h1>
              <p className="text-slate-600">Generate JSON Schema & TypeScript types from sample data</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Side */}
          <div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Paste your JSON</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"name": "John", "age": 30, "active": true}'
                className="w-full h-64 px-4 py-3 border border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-y"
                spellCheck={false}
              />
              {error && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <span className="font-semibold">Error:</span> {error}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-slate-500 self-center">Examples:</span>
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => loadExample(ex.value)}
                    className="text-xs px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 transition"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Options */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                <Braces className="w-4 h-4" /> Schema Options
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-600 mb-1 block">Schema Title</label>
                  <input
                    type="text"
                    value={options.title}
                    onChange={(e) => setOptions((o) => ({ ...o, title: e.target.value }))}
                    placeholder="MySchema"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                {[
                  { key: 'required' as const, label: 'Mark non-empty fields as required' },
                  { key: 'additionalProperties' as const, label: 'Allow additional properties' },
                  { key: 'examples' as const, label: 'Include example values' },
                  { key: 'descriptions' as const, label: 'Add field descriptions' },
                ].map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options[opt.key]}
                      onChange={(e) => setOptions((o) => ({ ...o, [opt.key]: e.target.checked }))}
                      className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
              <button
                onClick={generate}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-teal-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition"
              >
                <Wand2 className="w-4 h-4" /> Generate Schema
              </button>
            </div>
          </div>

          {/* Output Side */}
          <div>
            {schema ? (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Tabs */}
                <div className="flex items-center justify-between border-b border-slate-200 px-4">
                  <div className="flex">
                    <button
                      onClick={() => setActiveTab('schema')}
                      className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${activeTab === 'schema' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      JSON Schema
                    </button>
                    <button
                      onClick={() => setActiveTab('typescript')}
                      className={`px-4 py-3 text-sm font-semibold border-b-2 transition ${activeTab === 'typescript' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      TypeScript
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyOutput(activeTab === 'schema' ? schema : typescript, activeTab)}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                    >
                      {copied === activeTab ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {copied === activeTab ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadSchema}
                      className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
                    >
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </div>
                </div>
                <pre className="p-5 overflow-auto max-h-[500px] text-sm font-mono text-slate-800 bg-slate-50">
                  {activeTab === 'schema' ? schema : typescript}
                </pre>
              </motion.div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center h-full flex flex-col items-center justify-center">
                <FileJson className="w-12 h-12 text-slate-300 mb-3" />
                <h3 className="text-lg font-semibold text-slate-700">Paste JSON to generate schema</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm">
                  Paste any JSON object or array on the left and instantly generate a JSON Schema (2020-12 draft) with smart format detection for emails, URLs, dates, UUIDs, and more.
                </p>
              </div>
            )}

            {/* Schema Stats */}
            {schema && (
              <div className="mt-4 bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Schema Stats</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-teal-600">{(schema.match(/"type"/g) || []).length}</div>
                    <div className="text-xs text-slate-500">Properties</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-cyan-600">{(schema.match(/"format"/g) || []).length}</div>
                    <div className="text-xs text-slate-500">Formats</div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-3">
                    <div className="text-xl font-bold text-slate-600">{schema.split('\n').length}</div>
                    <div className="text-xs text-slate-500">Lines</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Feature Reference */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Smart Format Detection</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {[
              { format: 'date-time', desc: 'ISO 8601 timestamps (2024-01-15T10:30:00Z)' },
              { format: 'date', desc: 'ISO dates (2024-01-15)' },
              { format: 'email', desc: 'Email addresses (user@example.com)' },
              { format: 'uri', desc: 'URLs starting with http(s)://' },
              { format: 'uuid', desc: 'UUIDs (550e8400-e29b-...)' },
              { format: 'phone', desc: 'E.164 phone numbers (+1234567890)' },
              { format: 'integer', desc: 'Whole numbers detected separately from floats' },
              { format: 'pattern', desc: 'Hex colors get regex patterns (#ff5733)' },
            ].map((item) => (
              <div key={item.format} className="bg-slate-50 p-3 rounded-lg">
                <span className="font-mono text-xs font-semibold text-teal-700">{item.format}</span>
                <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
