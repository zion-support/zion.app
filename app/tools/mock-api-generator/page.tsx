'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, Server, Plus, Trash2, Play, Shuffle, Download } from 'lucide-react';

interface FieldDef {
  name: string;
  type: string;
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const FIELD_TYPES = [
  'uuid', 'name', 'firstName', 'lastName', 'email', 'phone',
  'address', 'city', 'country', 'zipCode',
  'company', 'jobTitle', 'url', 'domain',
  'sentence', 'paragraph', 'boolean',
  'integer', 'float', 'price',
  'date', 'datetime', 'timestamp',
  'color', 'ip', 'mac', 'lorem',
];

const EXAMPLE_SCHEMAS: { label: string; fields: FieldDef[]; endpoint: string }[] = [
  { label: 'Users', endpoint: '/api/users', fields: [
    { name: 'id', type: 'uuid' }, { name: 'name', type: 'name' }, { name: 'email', type: 'email' },
    { name: 'phone', type: 'phone' }, { name: 'company', type: 'company' }, { name: 'createdAt', type: 'datetime' },
  ]},
  { label: 'Products', endpoint: '/api/products', fields: [
    { name: 'id', type: 'uuid' }, { name: 'name', type: 'sentence' }, { name: 'price', type: 'price' },
    { name: 'inStock', type: 'boolean' }, { name: 'category', type: 'jobTitle' }, { name: 'image', type: 'url' },
  ]},
  { label: 'Blog Posts', endpoint: '/api/posts', fields: [
    { name: 'id', type: 'uuid' }, { name: 'title', type: 'sentence' }, { name: 'body', type: 'paragraph' },
    { name: 'author', type: 'name' }, { name: 'published', type: 'date' }, { name: 'tags', type: 'lorem' },
  ]},
];

function generateValue(type: string): JsonValue {
  const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  switch (type) {
    case 'uuid':
      return crypto.randomUUID?.() ?? 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });
    case 'name': return `${random(['James','Mary','Robert','Patricia','John','Jennifer','Michael','Linda','David','Elizabeth','Sarah','Emma','Alex','Chris','Taylor'])} ${random(['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez'])}`;
    case 'firstName': return random(['James','Mary','Robert','Patricia','John','Jennifer','Michael','Linda','David','Elizabeth','Sarah','Emma','Alex','Chris','Taylor']);
    case 'lastName': return random(['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez']);
    case 'email': return `${random(['john','jane','alex','sam','taylor','morgan','casey','drew'])}${randInt(1,999)}@${random(['example.com','test.io','demo.org','mail.dev'])}`;
    case 'phone': return `+1 (${randInt(200,999)}) ${randInt(100,999)}-${randInt(1000,9999)}`;
    case 'address': return `${randInt(100,9999)} ${random(['Oak','Maple','Cedar','Pine','Elm','Main','First','Park'])} ${random(['St','Ave','Blvd','Dr','Ln','Way','Rd'])}`;
    case 'city': return random(['New York','Los Angeles','Chicago','Houston','Phoenix','Seattle','Denver','Boston','Miami','Portland','Austin','San Francisco']);
    case 'country': return random(['United States','Canada','United Kingdom','Germany','France','Japan','Australia','Brazil','India','Mexico','Spain','Italy']);
    case 'zipCode': return `${randInt(10000,99999)}`;
    case 'company': return `${random(['Tech','Cloud','Data','Smart','Neo','Alpha','Blue','Green'])}${random(['Systems','Labs','Corp','Inc','Solutions','Hub','IO','AI'])}`;
    case 'jobTitle': return random(['Software Engineer','Product Manager','Designer','Data Scientist','DevOps Engineer','Marketing Lead','Sales Rep','CEO','CTO','VP Engineering']);
    case 'url': return `https://${random(['app','www','api','dev','staging'])}.${random(['example','demo','test','acme'])}.${random(['com','io','dev','org'])}`;
    case 'domain': return `${random(['example','demo','test','acme','api','app'])}.${random(['com','io','dev','org','net'])}`;
    case 'sentence': return random(['The quick brown fox jumps over the lazy dog.','Innovation distinguishes between a leader and a follower.','Stay hungry, stay foolish.','The best way to predict the future is to create it.','Less is more.','Code is poetry.','Build fast, break things.','Think different.','Move fast and break things.']);
    case 'paragraph': return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit.';
    case 'boolean': return Math.random() > 0.5;
    case 'integer': return randInt(1, 1000);
    case 'float': return parseFloat((Math.random() * 1000).toFixed(2));
    case 'price': return parseFloat((Math.random() * 500 + 0.99).toFixed(2));
    case 'date': return new Date(Date.now() - randInt(0, 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    case 'datetime': return new Date(Date.now() - randInt(0, 365 * 24 * 60 * 60 * 1000)).toISOString();
    case 'timestamp': return Date.now() - randInt(0, 365 * 24 * 60 * 60 * 1000);
    case 'color': return `#${randInt(0, 16777215).toString(16).padStart(6, '0')}`;
    case 'ip': return `${randInt(1,223)}.${randInt(0,255)}.${randInt(0,255)}.${randInt(1,254)}`;
    case 'mac': return Array.from({ length: 6 }, () => randInt(0, 255).toString(16).padStart(2, '0')).join(':');
    case 'lorem': return random(['tech', 'design', 'web', 'cloud', 'ai', 'mobile', 'saas', 'startup']);
    default: return 'value';
  }
}

function generateData(fields: FieldDef[], count: number): JsonValue[] {
  return Array.from({ length: count }, () => {
    const obj: { [key: string]: JsonValue } = {};
    for (const field of fields) {
      obj[field.name] = generateValue(field.type);
    }
    return obj;
  });
}

function generateCurl(endpoint: string, method: string): string {
  const origin = 'https://api.example.com';
  return `curl -X ${method} ${origin}${endpoint}`;
}

export default function MockApiGenerator() {
  const [fields, setFields] = useState<FieldDef[]>([
    { name: 'id', type: 'uuid' },
    { name: 'name', type: 'name' },
    { name: 'email', type: 'email' },
  ]);
  const [endpoint, setEndpoint] = useState('/api/users');
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'json' | 'curl' | 'fetch'>('json');

  const handleGenerate = useCallback(() => {
    const data = generateData(fields, count);
    if (outputFormat === 'json') {
      setOutput(JSON.stringify(data, null, 2));
    } else if (outputFormat === 'curl') {
      setOutput(generateCurl(endpoint, 'GET') + `\n\n# Response:\n${JSON.stringify(data, null, 2)}`);
    } else {
      const fetchCode = `const response = await fetch('${endpoint}');
const data = await response.json();
console.log(data);`;
      setOutput(`${fetchCode}\n\n// Response:\n${JSON.stringify(data, null, 2)}`);
    }
  }, [fields, count, endpoint, outputFormat]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mock-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [output]);

  const addField = () => setFields([...fields, { name: '', type: 'name' }]);
  const removeField = (idx: number) => setFields(fields.filter((_, i) => i !== idx));
  const updateField = (idx: number, key: keyof FieldDef, value: string) => {
    const updated = [...fields];
    updated[idx] = { ...updated[idx], [key]: value };
    setFields(updated);
  };

  const loadExample = (example: typeof EXAMPLE_SCHEMAS[0]) => {
    setFields(example.fields);
    setEndpoint(example.endpoint);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
              <Server className="w-5 h-5" />
            </div>
            Mock API Generator
          </h1>
          <p className="mt-2 text-slate-600">
            Generate realistic fake data for your API development. Define a schema, pick a count, and get JSON, curl, or Fetch.js output instantly.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Schema Editor */}
          <div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Schema</h2>

              <div className="mb-4">
                <label className="text-sm font-medium text-slate-600 block mb-1">Endpoint</label>
                <input
                  type="text"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  placeholder="/api/resource"
                />
              </div>

              <div className="space-y-2 mb-4">
                {fields.map((field, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={field.name}
                      onChange={(e) => updateField(idx, 'name', e.target.value)}
                      placeholder="field name"
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-mono focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                    />
                    <select
                      value={field.type}
                      onChange={(e) => updateField(idx, 'type', e.target.value)}
                      className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none bg-white"
                    >
                      {FIELD_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <button onClick={() => removeField(idx)} className="p-2 text-red-400 hover:text-red-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={addField} className="w-full text-sm text-indigo-600 hover:text-indigo-800 py-2 border border-dashed border-indigo-300 rounded-lg flex items-center justify-center gap-1 transition hover:bg-indigo-50">
                <Plus className="w-4 h-4" /> Add Field
              </button>

              <div className="mt-4 flex items-center gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Records</label>
                  <input
                    type="number"
                    value={count}
                    onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                    min={1}
                    max={50}
                    className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Format</label>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden">
                    {(['json', 'curl', 'fetch'] as const).map((fmt) => (
                      <button
                        key={fmt}
                        onClick={() => setOutputFormat(fmt)}
                        className={`px-3 py-2 text-xs font-medium transition ${outputFormat === fmt ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                      >
                        {fmt.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={handleGenerate} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition">
                  <Play className="w-4 h-4" /> Generate
                </button>
                <button onClick={() => setFields(fields.map((f) => ({ ...f, name: f.name })))} className="px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition" title="Regenerate">
                  <Shuffle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Example Schemas */}
            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Quick Start Examples</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLE_SCHEMAS.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => loadExample(ex)}
                    className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full transition"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">Generated Output</label>
              <div className="flex gap-2">
                {output && (
                  <>
                    <button onClick={handleDownload} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                      <Download className="w-3 h-3" /> Download
                    </button>
                    <button onClick={handleCopy} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </>
                )}
              </div>
            </div>
            <pre className="w-full h-[560px] rounded-xl border border-slate-300 bg-white p-4 font-mono text-xs text-slate-800 shadow-sm overflow-auto whitespace-pre-wrap">
              {output || <span className="text-slate-400">Click "Generate" to create mock data...</span>}
            </pre>
          </div>
        </div>

        {/* Type Reference */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Field Types Reference</h2>
          <div className="flex flex-wrap gap-2">
            {FIELD_TYPES.map((t) => (
              <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-mono">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
