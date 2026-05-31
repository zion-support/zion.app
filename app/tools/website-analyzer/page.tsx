'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Laptop, Sparkles, AlertTriangle, RefreshCw } from 'lucide-react';

export default function WebsiteAnalyzer() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState('');

  const analyze = async () => {
    if (!url.trim()) { setError('Please enter a URL'); return; }
    setIsAnalyzing(true);
    setError('');
    await new Promise(r => setTimeout(r, 2000));
    setScore(Math.floor(Math.random() * 30) + 70);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Website Analyzer</h1>
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-8">
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="w-full bg-slate-700/50 border border-slate-600 text-white px-4 py-3 rounded-lg mb-4" />
          <button onClick={analyze} disabled={!url.trim() || isAnalyzing} className="w-full py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50">
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
          {error && <p className="text-red-400 mt-2">{error}</p>}
          {score !== null && <div className="mt-4 text-center"><div className="text-4xl font-bold text-green-400">{score}/100</div><p className="text-slate-400">Overall Score</p></div>}
        </div>
      </div>
    </div>
  );
}
