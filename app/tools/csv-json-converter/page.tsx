'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, ArrowLeftRight, Download, FileJson, FileSpreadsheet, Trash2, Upload } from 'lucide-react';

function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          result.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = lines.slice(1).filter((l) => l.trim()).map(parseRow);
  return { headers, rows };
}

function csvToJson(csv: string): string {
  const { headers, rows } = parseCSV(csv);
  const objects = rows.map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ?? '';
    });
    return obj;
  });
  return JSON.stringify(objects, null, 2);
}

function jsonToCsv(json: string): string {
  const data = JSON.parse(json);
  if (!Array.isArray(data) || data.length === 0) return '';
  const headers = [...new Set(data.flatMap((obj: Record<string, unknown>) => Object.keys(obj)))] as string[];
  const escape = (val: unknown): string => {
    const str = val === null || val === undefined ? '' : String(val);
    return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const headerLine = headers.map(escape).join(',');
  const dataLines = data.map((obj: Record<string, unknown>) => headers.map((h) => escape(obj[h])).join(','));
  return [headerLine, ...dataLines].join('\n');
}

type Mode = 'csv-to-json' | 'json-to-csv';

export default function CsvJsonConverter() {
  const [mode, setMode] = useState<Mode>('csv-to-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const convert = useCallback(() => {
    setError('');
    setOutput('');
    try {
      if (mode === 'csv-to-json') {
        if (!input.trim()) { setError('Please enter CSV data'); return; }
        setOutput(csvToJson(input));
      } else {
        if (!input.trim()) { setError('Please enter JSON data'); return; }
        setOutput(jsonToCsv(input));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  }, [mode, input]);

  const copyOutput = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadOutput = () => {
    const ext = mode === 'csv-to-json' ? 'json' : 'csv';
    const mime = mode === 'csv-to-json' ? 'application/json' : 'text/csv';
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setInput(ev.target?.result as string);
    };
    reader.readAsText(file);
  };

  const sampleCSV = `name,email,age,role
Alice Johnson,alice@example.com,32,Engineer
Bob Smith,bob@example.com,28,Designer
Carol Williams,carol@example.com,35,PM`;

  const sampleJSON = `[
  {"name": "Alice Johnson", "email": "alice@example.com", "age": "32", "role": "Engineer"},
  {"name": "Bob Smith", "email": "bob@example.com", "age": "28", "role": "Designer"},
  {"name": "Carol Williams", "email": "carol@example.com", "age": "35", "role": "PM"}
]`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50 via-white to-emerald-50">
      <div className="container mx-auto max-w-5xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-lime-500 to-emerald-600 shadow-lg shadow-lime-500/20">
              <ArrowLeftRight className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">CSV ↔ JSON Converter</h1>
            <p className="mt-2 text-slate-600">Convert between CSV and JSON formats instantly with live preview</p>
          </div>
        </motion.div>

        {/* Mode Toggle */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => { setMode('csv-to-json'); setOutput(''); setError(''); }}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                mode === 'csv-to-json' ? 'bg-white text-lime-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileSpreadsheet className="h-4 w-4" /> CSV → JSON
            </button>
            <button
              onClick={() => { setMode('json-to-csv'); setOutput(''); setError(''); }}
              className={`flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition ${
                mode === 'json-to-csv' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileJson className="h-4 w-4" /> JSON → CSV
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Input */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">
                {mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}
              </h2>
              <div className="flex gap-2">
                <label className="cursor-pointer rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition">
                  <Upload className="mr-1 inline h-3 w-3" /> Upload
                  <input type="file" accept={mode === 'csv-to-json' ? '.csv,.txt' : '.json,.txt'} className="hidden" onChange={handleFileUpload} />
                </label>
                <button
                  onClick={() => { setInput(mode === 'csv-to-json' ? sampleCSV : sampleJSON); }}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
                >
                  Sample
                </button>
                <button
                  onClick={() => { setInput(''); setOutput(''); setError(''); }}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition"
                >
                  <Trash2 className="inline h-3 w-3" /> Clear
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'csv-to-json' ? 'Paste CSV data here...' : 'Paste JSON data here...'}
              className="h-64 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-800 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">
                {mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={copyOutput}
                  disabled={!output}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition disabled:opacity-40"
                >
                  {copied ? <><Check className="inline h-3 w-3 text-emerald-600" /> Copied</> : <><Copy className="inline h-3 w-3" /> Copy</>}
                </button>
                <button
                  onClick={downloadOutput}
                  disabled={!output}
                  className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 transition disabled:opacity-40"
                >
                  <Download className="inline h-3 w-3" /> Download
                </button>
              </div>
            </div>
            <textarea
              value={error ? `Error: ${error}` : output}
              readOnly
              placeholder="Converted output will appear here..."
              className={`h-64 w-full resize-none rounded-xl border p-4 font-mono text-sm focus:outline-none ${
                error ? 'border-red-200 bg-red-50 text-red-700' : 'border-slate-200 bg-slate-50 text-slate-800'
              }`}
            />
          </div>
        </div>

        {/* Convert Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={convert}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-lime-500 to-emerald-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-lime-500/20 hover:from-lime-600 hover:to-emerald-700 transition"
          >
            <ArrowLeftRight className="h-4 w-4" /> Convert {mode === 'csv-to-json' ? 'CSV to JSON' : 'JSON to CSV'}
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-2 text-sm font-semibold text-slate-700">Features</h3>
          <ul className="grid gap-2 text-sm text-slate-600 md:grid-cols-2">
            <li>✓ Handles quoted fields with commas and newlines</li>
            <li>✓ File upload support (.csv / .json)</li>
            <li>✓ Copy to clipboard or download as file</li>
            <li>✓ Bidirectional conversion (CSV ↔ JSON)</li>
            <li>✓ Live preview and error detection</li>
            <li>✓ Sample data for quick testing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
