"use client";

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface RegexPattern {
  pattern: string;
  description: string;
  flags: string;
}

const commonPatterns: RegexPattern[] = [
  { pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', description: 'Email address', flags: 'g' },
  { pattern: '^https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*$', description: 'URL', flags: 'g' },
  { pattern: '^\\d{4}-\\d{2}-\\d{2}$', description: 'Date (YYYY-MM-DD)', flags: 'g' },
  { pattern: '^\\+?[1-9]\\d{1,14}$', description: 'Phone number (E.164)', flags: 'g' },
  { pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d]{8,}$', description: 'Strong password', flags: 'g' },
  { pattern: '^\\d{1,3}(\\.\\d{1,3}){3}$', description: 'IPv4 address', flags: 'g' },
  { pattern: '^#[0-9A-Fa-f]{6}$', description: 'Hex color', flags: 'g' },
  { pattern: '^[A-Z]{2,3}$', description: 'US State abbreviation', flags: 'g' },
  { pattern: '^\\d{5}(-\\d{4})?$', description: 'US ZIP code', flags: 'g' },
  { pattern: '^(?=.*[A-Z].*[A-Z])(?=.*\\d.*\\d)[A-Za-z\\d]{10,}$', description: 'Complex password (2 uppercase, 2 digits)', flags: 'g' },
];

export default function RegexGenerator() {
  const [description, setDescription] = useState('');
  const [generatedPattern, setGeneratedPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [testResults, setTestResults] = useState<{ matches: string[]; isValid: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [customPattern, setCustomPattern] = useState('');

  const generateRegex = useCallback(() => {
    setError(null);
    
    if (!description.trim()) {
      setError('Please describe what you want to match');
      return;
    }

    const lowerDesc = description.toLowerCase();
    // The pattern is set by mutually exclusive intent branches below.
    // eslint-disable-next-line no-useless-assignment
    let pattern: string | null = null;
    
    // AI-like pattern matching based on description keywords
    if (lowerDesc.includes('email')) {
      pattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
    } else if (lowerDesc.includes('url') || lowerDesc.includes('website') || lowerDesc.includes('link')) {
      pattern = 'https?:\\/\\/[\\w\\-]+(\\.[\\w\\-]+)+[/#?]?.*';
    } else if (lowerDesc.includes('phone') || lowerDesc.includes('tel') || lowerDesc.includes('mobile')) {
      pattern = '\\+?[1-9]\\d{1,14}';
    } else if (lowerDesc.includes('date')) {
      if (lowerDesc.includes('yyyy-mm-dd') || lowerDesc.includes('iso')) {
        pattern = '\\d{4}-\\d{2}-\\d{2}';
      } else if (lowerDesc.includes('mm/dd') || lowerDesc.includes('us date')) {
        pattern = '\\d{2}\\/\\d{2}\\/\\d{4}';
      } else {
        pattern = '\\d{4}-\\d{2}-\\d{2}';
      }
    } else if (lowerDesc.includes('ip') && (lowerDesc.includes('address') || lowerDesc.includes('v4'))) {
      pattern = '\\d{1,3}(\\.\\d{1,3}){3}';
    } else if (lowerDesc.includes('color') || lowerDesc.includes('hex')) {
      pattern = '#[0-9A-Fa-f]{6}';
    } else if (lowerDesc.includes('zip') || lowerDesc.includes('postal')) {
      pattern = '\\d{5}(-\\d{4})?';
    } else if (lowerDesc.includes('password')) {
      if (lowerDesc.includes('strong')) {
        pattern = '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$';
      } else {
        pattern = '^[a-zA-Z\\d@$!%*?&]{8,}$';
      }
    } else if (lowerDesc.includes('number') || lowerDesc.includes('digit')) {
      if (lowerDesc.includes('float') || lowerDesc.includes('decimal')) {
        pattern = '\\d+\\.\\d+';
      } else {
        pattern = '\\d+';
      }
    } else if (lowerDesc.includes('word')) {
      pattern = '\\b\\w+\\b';
    } else if (lowerDesc.includes('space')) {
      pattern = '\\s+';
    } else if (lowerDesc.includes('alphanumeric')) {
      pattern = '[a-zA-Z0-9]+';
    } else if (lowerDesc.includes('letter')) {
      pattern = '[a-zA-Z]+';
    } else if (lowerDesc.includes('username')) {
      pattern = '^[a-zA-Z0-9_]{3,16}$';
    } else if (lowerDesc.includes('credit card') || lowerDesc.includes('cc')) {
      pattern = '\\d{4}[- ]?\\d{4}[- ]?\\d{4}[- ]?\\d{4}';
    } else if (lowerDesc.includes('html') || lowerDesc.includes('tag')) {
      pattern = '<([a-z]+)([^<]+)*(?:>(.*)<\\/\\1>|\\s+\\/>)';
    } else if (lowerDesc.includes('slug') || lowerDesc.includes('slugify')) {
      pattern = '^[a-z0-9]+(?:-[a-z0-9]+)*$';
    } else if (lowerDesc.includes('uuid') || lowerDesc.includes('guid')) {
      pattern = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';
    } else {
      // Try to extract words and create a basic pattern
      const words = lowerDesc.split(/\\s+/).filter(w => w.length > 2);
      if (words.length > 0) {
        pattern = `\\b(${words.join('|')})\\b`;
      } else {
        setError('Could not understand the description. Try using keywords like "email", "phone", "URL", "date", etc.');
        return;
      }
    }

    if (!pattern) {
      setError('Could not generate a pattern from the provided description.');
      return;
    }
    setGeneratedPattern(pattern);
  }, [description]);

  const testPattern = useCallback(() => {
    setError(null);
    setTestResults(null);
    
    const patternToUse = generatedPattern || customPattern;
    if (!patternToUse) {
      setError('Please generate or enter a pattern first');
      return;
    }
    
    try {
      const regex = new RegExp(patternToUse, flags);
      const matches = testString.match(regex);
      setTestResults({
        matches: matches || [],
        isValid: true,
      });
    } catch (e) {
      setError((e as Error).message);
    }
  }, [generatedPattern, customPattern, flags, testString]);

  const selectCommonPattern = (pattern: RegexPattern) => {
    setGeneratedPattern(pattern.pattern);
    setFlags(pattern.flags);
  };

  const copyPattern = async () => {
    try {
      await navigator.clipboard.writeText(`/${generatedPattern || customPattern}/${flags}`);
    } catch (e) {
      console.error('Failed to copy:', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <a href="/tools" className="text-violet-400 hover:text-violet-300 text-sm">← Back to Tools</a>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">🔍 Regex Generator</h1>
          <p className="text-slate-400">Generate regular expressions from natural language descriptions</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Generator */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">🤖 AI Regex Generator</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Describe what you want to match
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g., email address, phone number, URL, date in YYYY-MM-DD format"
                    className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-violet-500 outline-none"
                  />
                </div>
                <button
                  onClick={generateRegex}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Generate Regex
                </button>
              </div>
            </div>

            {/* Result */}
            {(generatedPattern || customPattern) && (
              <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-white">Generated Pattern</h2>
                  <button
                    onClick={copyPattern}
                    className="text-sm text-violet-400 hover:text-violet-300"
                  >
                    📋 Copy
                  </button>
                </div>
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-green-400 text-sm break-all">
                  /{generatedPattern || customPattern}/{flags}
                </div>
                
                {/* Custom Pattern Input */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Or edit the pattern manually:
                  </label>
                  <input
                    type="text"
                    value={customPattern}
                    onChange={(e) => setCustomPattern(e.target.value)}
                    placeholder="Custom regex pattern..."
                    className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-violet-500 outline-none font-mono"
                  />
                </div>

                {/* Flags */}
                <div className="mt-4">
                  <label className="text-sm font-medium text-slate-300 mb-2 block">Flags:</label>
                  <div className="flex gap-2">
                    {['g', 'i', 'm', 's', 'u'].map((flag) => (
                      <button
                        key={flag}
                        onClick={() => setFlags(prev => prev.includes(flag) ? prev.replace(flag, '') : prev + flag)}
                        className={`px-3 py-1 rounded-lg font-mono text-sm transition ${
                          flags.includes(flag)
                            ? 'bg-violet-600 text-white'
                            : 'bg-slate-700 text-slate-400 hover:text-white'
                        }`}
                      >
                        {flag}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    g=global, i=case-insensitive, m=multiline, s=single line, u=unicode
                  </p>
                </div>
              </div>
            )}

            {/* Test Section */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">🧪 Test Pattern</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-300 mb-2 block">
                    Test string
                  </label>
                  <textarea
                    value={testString}
                    onChange={(e) => setTestString(e.target.value)}
                    placeholder="Enter text to test against the regex pattern..."
                    className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-violet-500 outline-none h-24 resize-y"
                  />
                </div>
                <button
                  onClick={testPattern}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Test Pattern
                </button>
              </div>
              
              {/* Test Results */}
              {testResults && (
                <div className="mt-4 p-4 bg-slate-900 rounded-xl">
                  <div className="text-sm text-slate-400 mb-2">
                    Matches found: <span className="text-white font-semibold">{testResults.matches.length}</span>
                  </div>
                  {testResults.matches.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {testResults.matches.map((match, idx) => (
                        <span key={idx} className="px-3 py-1 bg-violet-900/50 text-violet-300 rounded-lg text-sm font-mono">
                          {match}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No matches found</p>
                  )}
                </div>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-700 rounded-xl text-red-400">
                {error}
              </div>
            )}
          </div>

          {/* Sidebar - Common Patterns */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">📚 Common Patterns</h2>
              <div className="space-y-2">
                {commonPatterns.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectCommonPattern(item)}
                    className="w-full text-left p-3 rounded-xl bg-slate-900/50 hover:bg-slate-700 transition"
                  >
                    <div className="text-sm text-slate-300">{item.description}</div>
                    <div className="text-xs text-violet-400 font-mono mt-1 truncate">{item.pattern}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-white mb-4">📖 Quick Reference</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <code className="text-green-400 font-mono">^</code>
                  <span className="text-slate-400">Start of string</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400 font-mono">$</code>
                  <span className="text-slate-400">End of string</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400 font-mono">\\d</code>
                  <span className="text-slate-400">Any digit</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400 font-mono">\\w</code>
                  <span className="text-slate-400">Word character</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400 font-mono">\\s</code>
                  <span className="text-slate-400">Whitespace</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400 font-mono">.</code>
                  <span className="text-slate-400">Any character</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400 font-mono">*</code>
                  <span className="text-slate-400">0 or more</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400 font-mono">+</code>
                  <span className="text-slate-400">1 or more</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400 font-mono">?</code>
                  <span className="text-slate-400">0 or 1</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400 font-mono">[]</code>
                  <span className="text-slate-400">Character class</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-green-400 font-mono">()</code>
                  <span className="text-slate-400">Capture group</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
