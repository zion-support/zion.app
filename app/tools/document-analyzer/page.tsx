'use client';

import { useState, useCallback, useMemo } from 'react';

interface AnalysisResult {
  fileName: string;
  fileSize: number;
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  lines: number;
  paragraphs: number;
  avgWordLength: number;
  avgSentenceLength: number;
  readingTimeMinutes: number;
  topKeywords: Array<{ word: string; count: number }>;
  readabilityScore: number;
  readabilityLabel: string;
  longSentences: number;
  uniqueWords: number;
  lexicalDiversity: number;
}

function analyzeText(text: string, fileName: string, fileSize: number): AnalysisResult {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  const lines = text.split('\n').length;

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const wordCount = words.length;
  const uniqueWords = new Set(words).size;

  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const sentenceCount = sentences.length;
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length || 1;

  const avgWordLength = wordCount > 0 ? words.reduce((sum, w) => sum + w.length, 0) / wordCount : 0;
  const avgSentenceLength = sentenceCount > 0 ? wordCount / sentenceCount : 0;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 250));

  // Count syllables (rough English heuristic)
  const countSyllables = (word: string): number => {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (w.length <= 2) return 1;
    const vowels = w.match(/[aeiouy]+/g);
    let count = vowels ? vowels.length : 1;
    if (w.endsWith('e') && !w.endsWith('le') && count > 1) count--;
    return Math.max(1, count);
  };

  const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);

  // Flesch Reading Ease approximation
  const readabilityScore =
    wordCount > 0 && sentenceCount > 0
      ? Math.max(0, Math.min(100, 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (totalSyllables / wordCount)))
      : 0;

  const getReadabilityLabel = (score: number): string => {
    if (score >= 80) return 'Easy';
    if (score >= 60) return 'Standard';
    if (score >= 40) return 'Moderate';
    if (score >= 20) return 'Difficult';
    return 'Very Difficult';
  };

  // Long sentences (>30 words)
  const longSentences = sentences.filter((s) => s.split(/\s+/).length > 30).length;

  // Keyword frequency (exclude common stop words)
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall',
    'it', 'its', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'we', 'they',
    'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'our', 'their', 'not', 'no',
    'so', 'if', 'as', 'what', 'which', 'who', 'when', 'where', 'how', 'all', 'each',
    'than', 'then', 'also', 'just', 'more', 'some', 'very', 'can', 'only', 'about',
  ]);

  const freq = new Map<string, number>();
  for (const w of words) {
    if (w.length > 2 && !stopWords.has(w)) {
      freq.set(w, (freq.get(w) || 0) + 1);
    }
  }

  const topKeywords = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([word, count]) => ({ word, count }));

  return {
    fileName,
    fileSize,
    characters,
    charactersNoSpaces,
    words: wordCount,
    sentences: sentenceCount,
    lines,
    paragraphs,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
    readingTimeMinutes,
    topKeywords,
    readabilityScore: Math.round(readabilityScore),
    readabilityLabel: getReadabilityLabel(readabilityScore),
    longSentences,
    uniqueWords,
    lexicalDiversity: wordCount > 0 ? Math.round((uniqueWords / wordCount) * 100) : 0,
  };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function DocumentAnalyzerPage() {
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setText(content);
      setResult(analyzeText(content, file.name, file.size));
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleAnalyze = () => {
    if (text.trim()) {
      setResult(analyzeText(text, 'Pasted text', new Blob([text]).size));
    }
  };

  const getReadabilityColor = (score: number): string => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-green-600';
    if (score >= 40) return 'text-amber-600';
    if (score >= 20) return 'text-orange-600';
    return 'text-red-600';
  };

  const maxKeywordCount = useMemo(() => (result?.topKeywords[0]?.count || 1), [result]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Document Analyzer</h1>
      <p className="text-slate-600 mb-6">
        Upload a document or paste text for instant analysis — word counts, readability scoring, keyword extraction, and more. All processing happens in your browser.
      </p>

      {/* Input Area */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm mb-6">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center transition ${
            dragOver ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto text-slate-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-slate-600 mb-2">Drag &amp; drop a file here, or</p>
          <label className="inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg cursor-pointer hover:bg-indigo-700 transition">
            Browse files
            <input
              type="file"
              accept=".txt,.md,.csv,.json,.js,.ts,.tsx,.jsx,.py,.html,.css,.xml,.yaml,.yml,.toml,.ini,.cfg,.log,.sh,.rb,.go,.rs,.java,.c,.cpp,.h"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </label>
          <p className="mt-2 text-xs text-slate-400">Supports .txt, .md, .csv, .json, .js, .ts, .py, .html, and more</p>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Or paste text directly</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your document text here..."
            className="w-full h-40 px-4 py-3 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-y"
          />
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleAnalyze}
              disabled={!text.trim()}
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Analyze
            </button>
            <button
              onClick={() => { setText(''); setResult(null); }}
              className="px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-5">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Words', value: result.words.toLocaleString(), icon: '📝' },
              { label: 'Characters', value: result.characters.toLocaleString(), icon: '🔤' },
              { label: 'Sentences', value: result.sentences.toLocaleString(), icon: '💬' },
              { label: 'Lines', value: result.lines.toLocaleString(), icon: '📏' },
              { label: 'Paragraphs', value: result.paragraphs.toLocaleString(), icon: '📄' },
              { label: 'Unique Words', value: result.uniqueWords.toLocaleString(), icon: '🧩' },
              { label: 'Reading Time', value: `${result.readingTimeMinutes} min`, icon: '⏱️' },
              { label: 'File Size', value: formatBytes(result.fileSize), icon: '📦' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="text-2xl mb-1">{icon}</div>
                <div className="text-xl font-bold text-slate-900">{value}</div>
                <div className="text-xs text-slate-500">{label}</div>
              </div>
            ))}
          </div>

          {/* Readability */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Readability</h2>
            <div className="flex items-center gap-6">
              <div>
                <div className={`text-4xl font-bold ${getReadabilityColor(result.readabilityScore)}`}>
                  {result.readabilityScore}
                </div>
                <div className="text-xs text-slate-500 mt-1">Flesch Score</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-sm font-semibold ${getReadabilityColor(result.readabilityScore)}`}>
                    {result.readabilityLabel}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full transition-all ${
                      result.readabilityScore >= 80 ? 'bg-emerald-500' :
                      result.readabilityScore >= 60 ? 'bg-green-500' :
                      result.readabilityScore >= 40 ? 'bg-amber-500' :
                      result.readabilityScore >= 20 ? 'bg-orange-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${result.readabilityScore}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Very Difficult</span>
                  <span>Easy</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-4 border-t border-slate-100">
              <div>
                <div className="text-lg font-bold text-slate-900">{result.avgWordLength}</div>
                <div className="text-xs text-slate-500">Avg word length</div>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">{result.avgSentenceLength}</div>
                <div className="text-xs text-slate-500">Avg sentence length</div>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">{result.lexicalDiversity}%</div>
                <div className="text-xs text-slate-500">Lexical diversity</div>
              </div>
              <div>
                <div className={`text-lg font-bold ${result.longSentences > 0 ? 'text-amber-600' : 'text-slate-900'}`}>
                  {result.longSentences}
                </div>
                <div className="text-xs text-slate-500">Long sentences (&gt;30 words)</div>
              </div>
            </div>
          </div>

          {/* Keywords */}
          {result.topKeywords.length > 0 && (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-3">Top Keywords</h2>
              <div className="space-y-2">
                {result.topKeywords.map(({ word, count }) => (
                  <div key={word} className="flex items-center gap-3">
                    <span className="text-sm font-mono text-slate-700 w-32 truncate">{word}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-4">
                      <div
                        className="bg-indigo-500 h-4 rounded-full transition-all"
                        style={{ width: `${(count / maxKeywordCount) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
