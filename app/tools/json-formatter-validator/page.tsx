"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';

type TabType = 'format' | 'validate' | 'minify' | 'compare';

interface ValidationResult {
  valid: boolean;
  error?: string;
  errorPosition?: { line: number; column: number };
}

interface CompareResult {
  differences: string[];
  isEqual: boolean;
}

export default function JSONFormatterValidator() {
  const [input, setInput] = useState('{\n  "name": "Zion AI Platform",\n  "version": "1.0.0",\n  "features": [\n    "AI Services",\n    "AI Lab",\n    "Automation"\n  ]\n}');
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState<TabType>('format');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [compareInput, setCompareInput] = useState('');
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  const validateJSON = useCallback((json: string): ValidationResult => {
    try {
      JSON.parse(json);
      return { valid: true };
    } catch (e) {
      const error = e as SyntaxError;
      const match = error.message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1]);
        const lines = json.substring(0, position).split('\n');
        const line = lines.length;
        const column = lines[lines.length - 1].length + 1;
        return { valid: false, error: error.message, errorPosition: { line, column } };
      }
      return { valid: false, error: error.message };
    }
  }, []);

  const formatJSON = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setValidationResult({ valid: true });
    } catch {
      const result = validateJSON(input);
      setValidationResult(result);
      setOutput('');
    }
  }, [input, validateJSON]);

  const minifyJSON = useCallback(() => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setValidationResult({ valid: true });
    } catch {
      const result = validateJSON(input);
      setValidationResult(result);
      setOutput('');
    }
  }, [input, validateJSON]);

  const validateJSONTab = useCallback(() => {
    const result = validateJSON(input);
    setValidationResult(result);
    if (result.valid) {
      setOutput('✓ Valid JSON');
    }
  }, [input, validateJSON]);

  const compareJSON = useCallback(() => {
    try {
      const parsed1 = JSON.parse(input);
      const parsed2 = JSON.parse(compareInput);
      
      const differences: string[] = [];
      
      const findDifferences = (obj1: Record<string, unknown>, obj2: Record<string, unknown>, path = '') => {
        const keys1 = new Set(Object.keys(obj1));
        const keys2 = new Set(Object.keys(obj2));
        
        for (const key of keys1) {
          if (!keys2.has(key)) {
            differences.push(`Missing key in second object: ${path}${key}`);
          }
        }
        for (const key of keys2) {
          if (!keys1.has(key)) {
            differences.push(`Missing key in first object: ${path}${key}`);
          }
        }
        
        for (const key of keys1) {
          if (keys2.has(key)) {
            const newPath = path ? `${path}.${key}` : key;
            if (typeof obj1[key] === 'object' && obj1[key] !== null && 
                typeof obj2[key] === 'object' && obj2[key] !== null) {
              if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
                if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
                  differences.push(`Array difference at ${newPath}`);
                }
              } else {
                findDifferences(
                  obj1[key] as Record<string, unknown>,
                  obj2[key] as Record<string, unknown>,
                  `${newPath}.`
                );
              }
            } else if (obj1[key] !== obj2[key]) {
              differences.push(`Value difference at ${newPath}: "${obj1[key]}" vs "${obj2[key]}"`);
            }
          }
        }
      };
      
      findDifferences(parsed1 as Record<string, unknown>, parsed2 as Record<string, unknown>);
      setCompareResult({ differences, isEqual: differences.length === 0 });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e);
      setCompareResult({ differences: [message], isEqual: false });
    }
  }, [input, compareInput]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setValidationResult(null);
    setCompareResult(null);
    setOutput('');
    if (tab === 'compare') {
      setCompareInput('');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  const sampleData = () => {
    setInput('{\n  "product": {\n    "id": 1,\n    "name": "AI Assistant Pro",\n    "price": 99.99,\n    "inStock": true\n  },\n  "tags": ["ai", "productivity", "automation"],\n  "metadata": {\n    "created": "2024-01-15",\n    "updated": "2024-03-20"\n  }\n}');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <a href="/tools" className="text-violet-400 hover:text-violet-300 text-sm">← Back to Tools</a>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">📋 JSON Formatter & Validator</h1>
          <p className="text-slate-400">Format, validate, minify, and compare JSON data</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['format', 'validate', 'minify', 'compare'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'compare' ? (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">JSON 1</label>
                <button onClick={sampleData} className="text-xs text-violet-400 hover:text-violet-300">Load Sample</button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full h-96 bg-slate-800 text-slate-100 p-4 rounded-xl border border-slate-700 font-mono text-sm focus:border-violet-500 outline-none resize-y"
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-300">JSON 2</label>
              <textarea
                value={compareInput}
                onChange={(e) => setCompareInput(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full h-96 bg-slate-800 text-slate-100 p-4 rounded-xl border border-slate-700 font-mono text-sm focus:border-violet-500 outline-none resize-y"
              />
              <button
                onClick={compareJSON}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Compare JSON
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Input JSON</label>
                <button onClick={sampleData} className="text-xs text-violet-400 hover:text-violet-300">Load Sample</button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='{"key": "value"}'
                className="w-full h-96 bg-slate-800 text-slate-100 p-4 rounded-xl border border-slate-700 font-mono text-sm focus:border-violet-500 outline-none resize-y"
              />
              <button
                onClick={() => {
                  if (activeTab === 'format') formatJSON();
                  else if (activeTab === 'validate') validateJSONTab();
                  else if (activeTab === 'minify') minifyJSON();
                }}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                {activeTab === 'format' && 'Format JSON'}
                {activeTab === 'validate' && 'Validate JSON'}
                {activeTab === 'minify' && 'Minify JSON'}
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-300">Output</label>
                {output && (
                  <button
                    onClick={copyToClipboard}
                    className="text-xs text-violet-400 hover:text-violet-300"
                  >
                    {copySuccess ? '✓ Copied!' : 'Copy'}
                  </button>
                )}
              </div>
              <textarea
                value={output}
                readOnly
                placeholder="Output will appear here..."
                className="w-full h-96 bg-slate-800/50 text-slate-100 p-4 rounded-xl border border-slate-700 font-mono text-sm focus:border-violet-500 outline-none resize-y"
              />
            </div>
          </div>
        )}

        {/* Validation Result */}
        {validationResult && (
          <div className={`mt-6 p-4 rounded-xl border ${
            validationResult.valid 
              ? 'bg-green-900/20 border-green-700' 
              : 'bg-red-900/20 border-red-700'
          }`}>
            <div className="flex items-center gap-3">
              <span className={`text-2xl ${validationResult.valid ? '✓' : '✗'}`}>
                {validationResult.valid ? '✅' : '❌'}
              </span>
              <div>
                <div className={`font-semibold ${validationResult.valid ? 'text-green-400' : 'text-red-400'}`}>
                  {validationResult.valid ? 'Valid JSON' : 'Invalid JSON'}
                </div>
                {!validationResult.valid && validationResult.error && (
                  <div className="text-sm text-red-300 mt-1">
                    {validationResult.error}
                    {validationResult.errorPosition && (
                      <span className="text-slate-400"> (Line {validationResult.errorPosition.line}, Column {validationResult.errorPosition.column})</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Compare Result */}
        {compareResult && (
          <div className={`mt-6 p-4 rounded-xl border ${
            compareResult.isEqual 
              ? 'bg-green-900/20 border-green-700' 
              : 'bg-amber-900/20 border-amber-700'
          }`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{compareResult.isEqual ? '✅' : '⚠️'}</span>
              <div className={`font-semibold ${compareResult.isEqual ? 'text-green-400' : 'text-amber-400'}`}>
                {compareResult.isEqual ? 'JSON objects are equal' : `${compareResult.differences.length} difference(s) found`}
              </div>
            </div>
            {!compareResult.isEqual && compareResult.differences.length > 0 && (
              <ul className="space-y-1 text-sm text-slate-300 font-mono">
                {compareResult.differences.slice(0, 10).map((diff, idx) => (
                  <li key={idx} className="text-amber-300">• {diff}</li>
                ))}
                {compareResult.differences.length > 10 && (
                  <li className="text-slate-400">...and {compareResult.differences.length - 10} more</li>
                )}
              </ul>
            )}
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 bg-slate-800/30 rounded-xl p-4 border border-slate-700">
          <h3 className="text-sm font-semibold text-white mb-2">💡 JSON Tips</h3>
          <div className="text-sm text-slate-400 space-y-1">
            <p>• Use <code className="bg-slate-800 px-1 rounded">Ctrl+Shift+F</code> in VS Code to format JSON</p>
            <p>• Use <code className="bg-slate-800 px-1 rounded">JSON.stringify(obj, null, 2)</code> in JavaScript for pretty printing</p>
            <p>• Always validate JSON before sending to APIs to avoid runtime errors</p>
          </div>
        </div>
      </div>
    </div>
  );
}
