'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Copy, Check, RefreshCw, Download, Wand2, Sparkles } from 'lucide-react';

export default function JSONToTypeScript() {
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30\n}');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = () => {
    try {
      const obj = JSON.parse(input);
      const toTS = (o: Record<string, unknown>, indent = 0): string => {
        const pad = '  '.repeat(indent);
        const inner = '  '.repeat(indent + 1);
        const lines = Object.entries(o).map(([k, v]) => {
          const t = Array.isArray(v) ? `${typeof v[0]}[]` : typeof v;
          return `${inner}${k}: ${t};`;
        });
        return `${pad}{\n${lines.join('\n')}\n${pad}}`;
      };
      setOutput(`interface Root ${toTS(obj as Record<string, unknown>)}`);
    } catch { setOutput('Invalid JSON'); }
  };

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">JSON to TypeScript</h1>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-64 bg-slate-900 text-slate-300 font-mono text-sm p-4 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500" />
            <button onClick={convert} className="w-full mt-4 py-3 bg-purple-600 text-white rounded-lg font-semibold">Convert</button>
          </div>
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-400 text-sm">TypeScript Output</span>
              {output && <button onClick={copy} className="text-purple-400 text-sm">{copied ? 'Copied!' : 'Copy'}</button>}
            </div>
            <pre className="bg-slate-900 text-slate-300 font-mono text-sm p-4 rounded-lg h-64 overflow-auto">{output || 'Output will appear here'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
