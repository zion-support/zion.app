'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Brain, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';

interface CodeAnalysis {
  complexity: 'low' | 'medium' | 'high' | 'critical';
  lines: number;
  functions: number;
  suggestions: string[];
  score: number;
}

export default function CodeComplexityAnalyzer() {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState<CodeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCode = () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const lines = code.split('\n').filter(l => l.trim()).length;
      const functions = (code.match(/function|const|let|var/g) || []).length;
      
      let complexity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      let score = 100;
      const suggestions: string[] = [];
      
      if (lines > 100) {
        complexity = 'high';
        score -= 30;
        suggestions.push('Consider breaking this into smaller modules');
      }
      if (functions > 20) {
        complexity = complexity === 'high' ? 'critical' : 'medium';
        score -= 20;
        suggestions.push('Too many functions - consider extracting logic');
      }
      if (code.includes('TODO') || code.includes('FIXME')) {
        score -= 10;
        suggestions.push('Address TODO/FIXME comments before production');
      }
      if (code.length > 1000) {
        score -= 15;
        suggestions.push('Consider code splitting for better performance');
      }
      if (!code.includes('error') && !code.includes('Error')) {
        suggestions.push('Add error handling for better robustness');
      }
      if (score < 0) score = 0;
      
      setAnalysis({
        complexity,
        lines,
        functions,
        suggestions,
        score
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'text-green-400 bg-green-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'critical': return 'text-red-400 bg-red-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-cyan-600/20 text-cyan-300 px-4 py-2 rounded-full text-sm mb-4">
            <Zap className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            AI Code{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Complexity Analyzer
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Paste your code and get instant AI-powered analysis of complexity, 
            maintainability, and improvement suggestions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Code className="w-5 h-5 text-cyan-400" />
                Your Code
              </h3>
              <button
                onClick={() => setCode('')}
                className="text-slate-400 hover:text-white text-sm"
              >
                Clear
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your JavaScript/TypeScript code here..."
              className="w-full h-96 bg-transparent text-slate-300 p-4 font-mono text-sm resize-none focus:outline-none"
            />
            <div className="p-4 border-t border-slate-700">
              <button
                onClick={analyzeCode}
                disabled={!code.trim() || isAnalyzing}
                className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5" />
                    Analyze with AI
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Analysis Results
              </h3>
            </div>
            
            {analysis ? (
              <div className="p-4 space-y-4">
                {/* Score */}
                <div className="text-center py-6">
                  <div className="text-5xl font-bold mb-2" style={{ color: analysis.score >= 80 ? '#4ade80' : analysis.score >= 60 ? '#fbbf24' : '#f87171' }}>
                    {analysis.score}
                  </div>
                  <div className="text-slate-400 text-sm">Code Score</div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{analysis.lines}</div>
                    <div className="text-slate-400 text-xs">Lines of Code</div>
                  </div>
                  <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{analysis.functions}</div>
                    <div className="text-slate-400 text-xs">Functions</div>
                  </div>
                </div>

                {/* Complexity */}
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Complexity</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getComplexityColor(analysis.complexity)}`}>
                    {analysis.complexity}
                  </span>
                </div>

                {/* Suggestions */}
                {analysis.suggestions.length > 0 && (
                  <div>
                    <h4 className="text-slate-400 text-sm mb-2">AI Suggestions</h4>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                          <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Enter code and click Analyze</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}