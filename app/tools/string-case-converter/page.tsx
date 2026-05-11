'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Type, Shuffle } from 'lucide-react';

type CaseType =
  | 'camelCase'
  | 'PascalCase'
  | 'snake_case'
  | 'kebab-case'
  | 'CONSTANT_CASE'
  | 'dot.case'
  | 'Sentence case'
  | 'Title Case'
  | 'lowercase'
  | 'UPPERCASE'
  | 'aLtErNaTiNg cAsE';

function splitWords(input: string): string[] {
  // Handle various delimiters: spaces, underscores, hyphens, dots, camelCase boundaries
  return input
    .replace(/([a-z])([A-Z])/g, '$1 $2') // camelCase boundary
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // PascalCase boundary (e.g. XMLHttp)
    .replace(/[-_.\s]+/g, ' ') // normalize delimiters
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function toCamelCase(input: string): string {
  const words = splitWords(input);
  return words
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join('');
}

function toPascalCase(input: string): string {
  return splitWords(input)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

function toSnakeCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toLowerCase())
    .join('_');
}

function toKebabCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toLowerCase())
    .join('-');
}

function toConstantCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toUpperCase())
    .join('_');
}

function toDotCase(input: string): string {
  return splitWords(input)
    .map((w) => w.toLowerCase())
    .join('.');
}

function toSentenceCase(input: string): string {
  const lower = input.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function toTitleCase(input: string): string {
  return splitWords(input)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

function toAlternatingCase(input: string): string {
  return input
    .split('')
    .map((c, i) => (i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()))
    .join('');
}

function convertCase(input: string, type: CaseType): string {
  if (!input.trim()) return '';
  switch (type) {
    case 'camelCase': return toCamelCase(input);
    case 'PascalCase': return toPascalCase(input);
    case 'snake_case': return toSnakeCase(input);
    case 'kebab-case': return toKebabCase(input);
    case 'CONSTANT_CASE': return toConstantCase(input);
    case 'dot.case': return toDotCase(input);
    case 'Sentence case': return toSentenceCase(input);
    case 'Title Case': return toTitleCase(input);
    case 'lowercase': return input.toLowerCase();
    case 'UPPERCASE': return input.toUpperCase();
    case 'aLtErNaTiNg cAsE': return toAlternatingCase(input);
    default: return input;
  }
}

const caseTypes: CaseType[] = [
  'camelCase',
  'PascalCase',
  'snake_case',
  'kebab-case',
  'CONSTANT_CASE',
  'dot.case',
  'Sentence case',
  'Title Case',
  'lowercase',
  'UPPERCASE',
  'aLtErNaTiNg cAsE',
];

const caseDescriptions: Record<string, string> = {
  'camelCase': 'JavaScript variables, functions',
  'PascalCase': 'Class names, components, types',
  'snake_case': 'Python, Ruby, database columns',
  'kebab-case': 'URLs, CSS classes, file names',
  'CONSTANT_CASE': 'Environment variables, constants',
  'dot.case': 'Java packages, config keys',
  'Sentence case': 'Prose, descriptions',
  'Title Case': 'Headings, titles',
  'lowercase': 'Normalized text',
  'UPPERCASE': 'Labels, emphasis',
  'aLtErNaTiNg cAsE': 'Sarcasm, memes',
};

const exampleInputs = [
  'hello world',
  'my_variable_name',
  'myVariableName',
  'MyClassName',
  'kebab-case-string',
  'SOME_CONSTANT',
];

export default function StringCaseConverter() {
  const [input, setInput] = useState('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedInput, setCopiedInput] = useState(false);

  const handleCopy = useCallback(async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const handleCopyInput = useCallback(async () => {
    await navigator.clipboard.writeText(input);
    setCopiedInput(true);
    setTimeout(() => setCopiedInput(false), 2000);
  }, [input]);

  const handleExample = useCallback(() => {
    const rand = exampleInputs[Math.floor(Math.random() * exampleInputs.length)];
    setInput(rand);
  }, []);

  const detectedFormats = caseTypes.filter((type) => {
    // Check if the input matches what it would look like if converted from camelCase
    const camelToTarget = convertCase(toCamelCase(input), type);
    return input === camelToTarget;
  });

  const wordCount = input.trim() ? splitWords(input).length : 0;
  const charCount = input.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900">
            String Case Converter
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Convert text between camelCase, snake_case, kebab-case, and more — instantly
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          {/* Input */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <Type className="h-4 w-4" />
                Input Text
              </label>
              <div className="flex gap-2">
                <button
                  onClick={handleExample}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                >
                  <Shuffle className="h-3 w-3" />
                  Example
                </button>
                <button
                  onClick={handleCopyInput}
                  disabled={!input}
                  className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                >
                  {copiedInput ? (
                    <>
                      <Check className="h-3 w-3 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste text in any case format..."
              className="w-full rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition resize-none"
              rows={3}
            />
            <div className="mt-2 flex gap-4 text-xs text-slate-500">
              <span>{charCount} characters</span>
              <span>{wordCount} words</span>
              {detectedFormats.length > 0 && (
                <span className="text-blue-600">
                  Detected: {detectedFormats.join(', ')}
                </span>
              )}
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            {caseTypes.map((type, index) => {
              const result = convertCase(input, type);
              const isCopied = copiedIndex === index;
              const isMatch = input && result === input;

              return (
                <motion.div
                  key={type}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`group rounded-xl border p-4 transition hover:shadow-md ${
                    isMatch
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-slate-800">{type}</span>
                      <p className="text-xs text-slate-500">{caseDescriptions[type]}</p>
                    </div>
                    <button
                      onClick={() => result && handleCopy(result, index)}
                      disabled={!result}
                      className={`rounded-lg p-2 transition ${
                        isCopied
                          ? 'bg-green-100 text-green-600'
                          : 'text-slate-400 hover:bg-white hover:text-slate-600'
                      } disabled:opacity-30`}
                      title="Copy result"
                    >
                      {isCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="rounded-lg bg-white border border-slate-200 p-3 font-mono text-sm text-slate-800 break-all min-h-[2.5rem]">
                    {result || (
                      <span className="text-slate-400 italic">Enter text above...</span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Quick Reference */}
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="text-sm font-semibold text-slate-700 mb-2">Quick Reference</h3>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs text-slate-600">
              <div><span className="font-mono font-medium text-slate-800">camelCase</span> — <code>myVariable</code></div>
              <div><span className="font-mono font-medium text-slate-800">PascalCase</span> — <code>MyClass</code></div>
              <div><span className="font-mono font-medium text-slate-800">snake_case</span> — <code>my_variable</code></div>
              <div><span className="font-mono font-medium text-slate-800">kebab-case</span> — <code>my-variable</code></div>
              <div><span className="font-mono font-medium text-slate-800">CONSTANT_CASE</span> — <code>MY_CONSTANT</code></div>
              <div><span className="font-mono font-medium text-slate-800">dot.case</span> — <code>my.variable</code></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
