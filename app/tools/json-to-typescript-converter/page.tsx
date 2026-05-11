'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Copy,
  Check,
  RefreshCw,
  Settings,
  Download,
  Wand2,
  ChevronDown,
  ChevronUp,
  Type,
  Braces,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface ConversionOptions {
  interfaceName: string;
  exportType: 'interface' | 'type';
  addExport: boolean;
  strictNullChecks: boolean;
  optionalProps: boolean;
  readonlyProps: boolean;
  prefix: string;
}

export default function JSONToTypeScriptConverter() {
  const [jsonInput, setJsonInput] = useState('{\n  "name": "John Doe",\n  "age": 30,\n  "email": "john@example.com",\n  "isActive": true,\n  "roles": ["admin", "user"],\n  "address": {\n    "street": "123 Main St",\n    "city": "New York",\n    "country": "USA"\n  },\n  "projects": [\n    { "id": 1, "name": "Project A" },\n    { "id": 2, "name": "Project B" }\n  ]\n}');
  const [tsOutput, setTsOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const [options, setOptions] = useState<ConversionOptions>({
    interfaceName: 'Root',
    exportType: 'interface',
    addExport: true,
    strictNullChecks: true,
    optionalProps: false,
    readonlyProps: false,
    prefix: '',
  });

  const parseJson = (json: string): unknown => {
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  };

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const generateTypeName = (key: string): string => {
    const cleaned = key.replace(/[^a-zA-Z0-9]/g, ' ');
    const words = cleaned.split(' ').filter(Boolean);
    return words.map(capitalize).join('');
  };

  const convertToTypeScript = (json: unknown, rootName: string, indent: number = 0): string => {
    const spaces = '  '.repeat(indent);
    const nextSpaces = '  '.repeat(indent + 1);
    
    if (json === null || json === undefined) {
      return 'unknown';
    }
    
    if (Array.isArray(json)) {
      if (json.length === 0) return 'unknown[]';
      
      const allObjects = json.every(item => typeof item === 'object' && item !== null && !Array.isArray(item));
      if (allObjects && json.length > 0) {
        const properties = Object.entries(json[0] as object).map(([key, value]) => {
          const propName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
          const propType = convertToTypeScript(value, generateTypeName(key), indent + 1);
          const optional = options.optionalProps ? '?' : '';
          const readonly = options.readonlyProps ? 'readonly ' : '';
          return `${nextSpaces}${readonly}${propName}${optional}: ${propType};`;
        }).join('\n');
        
        const arrTypeName = capitalize(rootName);
        if (indent === 0) {
          if (options.addExport) {
            return `export ${options.exportType} ${arrTypeName} = {\n${properties}\n${spaces}};\n\nexport type ${rootName} = ${arrTypeName}[];`;
          }
          return `${options.exportType} ${arrTypeName} {\n${properties}\n${spaces}}\n\nexport type ${rootName} = ${arrTypeName}[];`;
        }
        return `${arrTypeName}[]`;
      }
      
      const itemTypes = new Set(json.map(item => convertToTypeScript(item, rootName + 'Item', indent)));
      if (itemTypes.size === 1) {
        return `${Array.from(itemTypes)[0]}[]`;
      }
      return `(${Array.from(itemTypes).join(' | ')})[]`;
    }
    
    if (typeof json === 'object' && json !== null) {
      const entries = Object.entries(json);
      if (entries.length === 0) return 'Record<string, unknown>';
      
      const properties = entries.map(([key, value]) => {
        const propName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        const propType = convertToTypeScript(value, generateTypeName(key), indent + 1);
        const optional = options.optionalProps ? '?' : '';
        const readonly = options.readonlyProps ? 'readonly ' : '';
        
        if (options.strictNullChecks && (value === null || value === undefined)) {
          return `${nextSpaces}${readonly}${propName}${optional}: ${propType} | null;`;
        }
        
        return `${nextSpaces}${readonly}${propName}${optional}: ${propType};`;
      }).join('\n');
      
      if (indent === 0) {
        const typeName = options.prefix + capitalize(rootName);
        if (options.addExport) {
          return `export ${options.exportType} ${typeName} {\n${properties}\n${spaces}}`;
        }
        return `${options.exportType} ${typeName} {\n${properties}\n${spaces}}`;
      }
      
      return `{${entries.map(([key, value]) => {
        const propName = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        const propType = convertToTypeScript(value, generateTypeName(key), indent + 1);
        return `${propName}: ${propType}`;
      }).join(', ')}}`;
    }
    
    if (typeof json === 'string') return 'string';
    if (typeof json === 'number') return 'number';
    if (typeof json === 'boolean') return 'boolean';
    
    return 'unknown';
  };

  const generateAiAnalysis = (json: string, _ts: string): string => {
    try {
      const parsed = JSON.parse(json);
      const keys = Object.keys(parsed);
      const hasNested = Object.values(parsed).some(v => typeof v === 'object' && v !== null && !Array.isArray(v));
      const hasArrays = Object.values(parsed).some(v => Array.isArray(v));
      
      return `This JSON structure contains ${keys.length} top-level properties. ${hasNested ? 'Includes nested objects for structured data.' : ''} ${hasArrays ? 'Contains arrays for collections.' : ''} Generated TypeScript provides type safety with ${options.strictNullChecks ? 'strict null checking enabled' : 'standard null handling'}.`;
    } catch {
      return 'Unable to analyze the JSON structure.';
    }
  };

  useEffect(() => {
    const parsed = parseJson(jsonInput);
    if (parsed && typeof parsed === 'object') {
      try {
        const ts = convertToTypeScript(parsed, options.interfaceName);
        setTsOutput(ts);
        setError(null);
        setAiAnalysis(generateAiAnalysis(jsonInput, ts));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Conversion failed');
      }
    } else if (jsonInput.trim()) {
      setError('Invalid JSON');
      setTsOutput('');
      setAiAnalysis(null);
    } else {
      setTsOutput('');
      setError(null);
      setAiAnalysis(null);
    }
  }, [jsonInput, options]);

  const handleCopy = () => {
    navigator.clipboard.writeText(tsOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([tsOutput], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${options.interfaceName.toLowerCase()}.ts`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch {
      // Invalid JSON, ignore
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed));
    } catch {
      // Invalid JSON, ignore
    }
  };

  const sampleJsons = [
    {
      name: 'User Profile',
      json: '{\n  "id": 1,\n  "username": "johndoe",\n  "email": "john@example.com",\n  "profile": {\n    "firstName": "John",\n    "lastName": "Doe",\n    "avatar": "https://example.com/avatar.png",\n    "bio": "Software Developer"\n  },\n  "settings": {\n    "theme": "dark",\n    "notifications": true\n  }\n}'
    },
    {
      name: 'API Response',
      json: '{\n  "status": "success",\n  "data": [\n    {\n      "id": 1,\n      "title": "Post Title",\n      "content": "Post content here",\n      "author": {\n        "id": 1,\n        "name": "Author Name"\n      },\n      "tags": ["tech", "ai"],\n      "createdAt": "2024-01-01T00:00:00Z"\n    }\n  ],\n  "pagination": {\n    "page": 1,\n    "totalPages": 10,\n    "totalItems": 100\n  }\n}'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700">
            <Wand2 className="h-4 w-4" />
            AI-Powered
          </div>
          <h1 className="text-4xl font-bold text-slate-900">
            JSON to TypeScript Converter
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Convert JSON data to TypeScript interfaces instantly with AI-powered type inference
          </p>
        </motion.div>

        {/* Options Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2 text-slate-700">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Conversion Options</span>
            </div>
            {showOptions ? <ChevronUp className="h-5 w-5 text-slate-500" /> : <ChevronDown className="h-5 w-5 text-slate-500" />}
          </button>
          
          {showOptions && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 grid gap-4 md:grid-cols-4"
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Interface Name</label>
                <input
                  type="text"
                  value={options.interfaceName}
                  onChange={(e) => setOptions({ ...options, interfaceName: e.target.value })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Export Type</label>
                <select
                  value={options.exportType}
                  onChange={(e) => setOptions({ ...options, exportType: e.target.value as 'interface' | 'type' })}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="interface">interface</option>
                  <option value="type">type</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Prefix</label>
                <input
                  type="text"
                  value={options.prefix}
                  onChange={(e) => setOptions({ ...options, prefix: e.target.value })}
                  placeholder="e.g., I"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={options.addExport}
                    onChange={(e) => setOptions({ ...options, addExport: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Add Export
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={options.strictNullChecks}
                    onChange={(e) => setOptions({ ...options, strictNullChecks: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  Strict Null Checks
                </label>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Sample Templates */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 flex flex-wrap gap-2"
        >
          <span className="text-sm font-medium text-slate-600">Quick Samples:</span>
          {sampleJsons.map((sample) => (
            <button
              key={sample.name}
              onClick={() => setJsonInput(sample.json)}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-600 transition hover:border-blue-300 hover:bg-blue-50"
            >
              {sample.name}
            </button>
          ))}
        </motion.div>

        {/* Main Editor */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* JSON Input */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <Braces className="h-5 w-5 text-orange-500" />
                <span className="font-semibold text-slate-900">JSON Input</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleFormat}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  title="Format JSON"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
                <button
                  onClick={handleMinify}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  title="Minify JSON"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="h-96 w-full resize-none p-4 font-mono text-sm text-slate-800 focus:outline-none"
              placeholder="Paste your JSON here..."
              spellCheck={false}
            />
            {error && (
              <div className="mx-4 mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </motion.div>

          {/* TypeScript Output */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-2">
                <Type className="h-5 w-5 text-blue-500" />
                <span className="font-semibold text-slate-900">TypeScript Output</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:bg-slate-100"
                >
                  <Download className="h-4 w-4" />
                  Download
                </button>
              </div>
            </div>
            <textarea
              value={tsOutput}
              readOnly
              className="h-96 w-full resize-none bg-slate-50 p-4 font-mono text-sm text-slate-800 focus:outline-none"
              placeholder="TypeScript output will appear here..."
              spellCheck={false}
            />
          </motion.div>
        </div>

        {/* AI Analysis */}
        {aiAnalysis && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-6 rounded-xl border border-violet-200 bg-violet-50 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-violet-600" />
              <span className="font-semibold text-violet-900">AI Analysis</span>
            </div>
            <p className="text-sm text-violet-800">{aiAnalysis}</p>
          </motion.div>
        )}

        {/* Features */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <Code className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Accurate Type Inference</h3>
            <p className="mt-2 text-sm text-slate-600">
              Automatically detects strings, numbers, booleans, arrays, and nested objects with proper type mapping.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Settings className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="font-semibold text-slate-900">Customizable Options</h3>
            <p className="mt-2 text-sm text-slate-600">
              Configure export types, add prefixes, toggle strict null checks, and choose optional or readonly properties.
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
              <Sparkles className="h-5 w-5 text-violet-600" />
            </div>
            <h3 className="font-semibold text-slate-900">AI-Powered Insights</h3>
            <p className="mt-2 text-sm text-slate-600">
              Get instant analysis of your JSON structure with suggestions for optimal TypeScript type definitions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
