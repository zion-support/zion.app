'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Upload, Trash2, File, Image, Film, Music, Archive, Download, Search, Sparkles } from 'lucide-react';

export default function FileAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const analyze = () => {
    if (!file) return;
    setAnalyzing(true);
    setTimeout(() => {
      setResult(`File: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB\nType: ${file.type || 'Unknown'}`);
      setAnalyzing(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">File Analyzer</h1>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8">
          <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full mb-4" />
          <button onClick={analyze} disabled={!file || analyzing} className="w-full py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">
            {analyzing ? 'Analyzing...' : 'Analyze File'}
          </button>
          {result && <pre className="mt-4 bg-slate-900 rounded-lg p-4 text-slate-300 text-sm whitespace-pre-wrap">{result}</pre>}
        </div>
      </div>
    </div>
  );
}
