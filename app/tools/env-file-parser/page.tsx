'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Download, FileKey, Plus, Trash2, Eye, EyeOff, Shuffle, Upload } from 'lucide-react';

interface EnvVar {
  key: string;
  value: string;
  isSecret: boolean;
}

function parseEnv(text: string): EnvVar[] {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const eqIdx = line.indexOf('=');
      if (eqIdx === -1) return null;
      const key = line.slice(0, eqIdx).trim();
      let value = line.slice(eqIdx + 1).trim();
      // Remove surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      const isSecret = /secret|password|token|key|api_key|apikey|private/i.test(key);
      return { key, value, isSecret } as EnvVar;
    })
    .filter((v): v is EnvVar => v !== null);
}

function generateEnvContent(vars: EnvVar[]): string {
  return vars
    .map(({ key, value }) => {
      const needsQuote = value.includes(' ') || value.includes('#') || value.includes('"') || value === '';
      const escaped = value.replace(/"/g, '\\"');
      return needsQuote ? `${key}="${escaped}"` : `${key}=${value}`;
    })
    .join('\n');
}

function generateExampleEnv(vars: EnvVar[]): string {
  return vars
    .map(({ key, value }) => {
      if (/secret|password|token|key|apikey/i.test(key)) {
        return `${key}=your_${key.toLowerCase()}_here`;
      }
      if (/url|host|endpoint/i.test(key)) {
        return `${key}=https://example.com`;
      }
      if (/port/i.test(key)) {
        return `${key}=3000`;
      }
      if (/email/i.test(key)) {
        return `${key}=user@example.com`;
      }
      if (/^(debug|verbose|log)/i.test(key)) {
        return `${key}=false`;
      }
      return `${key}=${value || 'your_value_here'}`;
    })
    .join('\n');
}

function generateRandomValue(key: string): string {
  if (/port/i.test(key)) return String(3000 + Math.floor(Math.random() * 60000));
  if (/url|host|endpoint/i.test(key)) return 'https://api.example.com';
  if (/email/i.test(key)) return 'user@example.com';
  if (/debug|verbose|enabled/i.test(key)) return 'false';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export default function EnvFileParser() {
  const [input, setInput] = useState('');
  const [vars, setVars] = useState<EnvVar[]>([]);
  const [copied, setCopied] = useState(false);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');
  const [view, setView] = useState<'table' | 'raw'>('table');

  const parse = useCallback(() => {
    const parsed = parseEnv(input);
    setVars(parsed);
    setShowSecrets({});
  }, [input]);

  const addVar = () => {
    if (!newKey.trim()) return;
    setVars((prev) => [...prev, { key: newKey.trim(), value: newValue, isSecret: /secret|password|token|key/i.test(newKey) }]);
    setNewKey('');
    setNewValue('');
  };

  const removeVar = (index: number) => {
    setVars((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVar = (index: number, field: 'key' | 'value', val: string) => {
    setVars((prev) => prev.map((v, i) => (i === index ? { ...v, [field]: val } : v)));
  };

  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyEnv = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadEnv = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setInput(text);
      setVars(parseEnv(text));
    };
    reader.readAsText(file);
  };

  const generatedContent = useMemo(() => generateEnvContent(vars), [vars]);
  const exampleContent = useMemo(() => generateExampleEnv(vars), [vars]);

  const secretCount = vars.filter((v) => v.isSecret).length;
  const regularCount = vars.length - secretCount;

  const sampleEnv = `# Database Configuration
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
DATABASE_SECRET_KEY=sk_live_abc123xyz789

# Application Settings
APP_PORT=3000
APP_DEBUG=true
APP_NAME="My Awesome App"

# Third-party Services
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxx
REDIS_URL=redis://localhost:6379

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
ADMIN_EMAIL=admin@example.com`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
              <FileKey className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Env File Parser</h1>
            <p className="mt-2 text-slate-600">Parse, edit, and generate .env files with secret detection and example templates</p>
          </div>
        </motion.div>

        {/* Input Area */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Paste your .env file</h2>
            <div className="flex gap-2">
              <label className="cursor-pointer rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition">
                <Upload className="mr-1 inline h-3 w-3" /> Upload
                <input type="file" accept=".env,.env.*,.txt" className="hidden" onChange={handleFileUpload} />
              </label>
              <button
                onClick={() => { setInput(sampleEnv); setVars(parseEnv(sampleEnv)); }}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
              >
                Sample
              </button>
              <button
                onClick={() => { setInput(''); setVars([]); }}
                className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
              >
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="# Paste your .env content here&#10;DATABASE_URL=postgresql://...&#10;API_KEY=your_key_here"
            className="h-40 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
            spellCheck={false}
          />
          <div className="mt-3 flex justify-center">
            <button
              onClick={parse}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/20 hover:from-amber-600 hover:to-orange-700 transition"
            >
              Parse .env File
            </button>
          </div>
        </div>

        {vars.length > 0 && (
          <>
            {/* Stats */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-slate-900">{vars.length}</p>
                <p className="text-xs text-slate-500">Total Variables</p>
              </div>
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-amber-700">{secretCount}</p>
                <p className="text-xs text-amber-600">Secrets Detected</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-slate-900">{regularCount}</p>
                <p className="text-xs text-slate-500">Regular Variables</p>
              </div>
            </div>

            {/* View Toggle & Actions */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg bg-slate-100 p-1">
                <button
                  onClick={() => setView('table')}
                  className={`rounded-md px-4 py-1.5 text-xs font-medium transition ${view === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
                >
                  Table View
                </button>
                <button
                  onClick={() => setView('raw')}
                  className={`rounded-md px-4 py-1.5 text-xs font-medium transition ${view === 'raw' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
                >
                  Raw Output
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copyEnv(view === 'raw' ? generatedContent : vars.map((v) => `${v.key}=${v.value}`).join('\n'))}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
                >
                  {copied ? <><Check className="inline h-3 w-3 text-emerald-600" /> Copied</> : <><Copy className="inline h-3 w-3" /> Copy</>}
                </button>
                <button
                  onClick={() => downloadEnv(generatedContent, '.env')}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
                >
                  <Download className="inline h-3 w-3" /> .env
                </button>
                {vars.some((v) => v.isSecret) && (
                  <button
                    onClick={() => copyEnv(exampleContent)}
                    className="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-200 transition"
                  >
                    <Download className="inline h-3 w-3" /> .env.example
                  </button>
                )}
              </div>
            </div>

            {view === 'table' ? (
              <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Key</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500">Value</th>
                      <th className="w-20 px-4 py-3 text-center text-xs font-semibold text-slate-500">Type</th>
                      <th className="w-20 px-4 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {vars.map((v, i) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-4 py-2.5">
                          <input
                            value={v.key}
                            onChange={(e) => updateVar(i, 'key', e.target.value)}
                            className="w-full bg-transparent font-mono text-sm text-slate-800 focus:outline-none"
                          />
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-2">
                            <input
                              type={v.isSecret && !showSecrets[`${i}`] ? 'password' : 'text'}
                              value={v.value}
                              onChange={(e) => updateVar(i, 'value', e.target.value)}
                              className="w-full bg-transparent font-mono text-sm text-slate-600 focus:outline-none"
                            />
                            {v.isSecret && (
                              <button onClick={() => toggleSecret(`${i}`)} className="text-slate-400 hover:text-slate-600">
                                {showSecrets[`${i}`] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          {v.isSecret ? (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700">SECRET</span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">VAR</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-center">
                          <button onClick={() => removeVar(i)} className="text-slate-400 hover:text-red-500 transition">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Add New Variable */}
                <div className="border-t border-slate-200 bg-slate-50 p-4">
                  <div className="flex gap-2">
                    <input
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      placeholder="VARIABLE_NAME"
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm focus:border-amber-400 focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && addVar()}
                    />
                    <input
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="value"
                      className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm focus:border-amber-400 focus:outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && addVar()}
                    />
                    <button
                      onClick={addVar}
                      className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (newKey.trim()) {
                          setVars((prev) => [...prev, { key: newKey.trim(), value: generateRandomValue(newKey), isSecret: /secret|password|token|key/i.test(newKey) }]);
                          setNewKey('');
                          setNewValue('');
                        }
                      }}
                      disabled={!newKey.trim()}
                      className="rounded-lg bg-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-300 transition disabled:opacity-40"
                      title="Generate random value"
                    >
                      <Shuffle className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <pre className="whitespace-pre-wrap font-mono text-sm text-slate-800">{generatedContent}</pre>
              </div>
            )}

            {/* Features */}
            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-2 text-sm font-semibold text-slate-700">Features</h3>
              <ul className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
                <li>✓ Auto-detects secrets (passwords, tokens, API keys)</li>
                <li>✓ Generates .env.example with placeholder values</li>
                <li>✓ Inline editing with add/remove variables</li>
                <li>✓ Secret masking with show/hide toggle</li>
                <li>✓ Random value generation for new keys</li>
                <li>✓ File upload and download support</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
