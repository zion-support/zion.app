'use client';

import { useState } from 'react';

type AnalysisResult = {
  summary: string;
  errorCount: number;
  warningCount: number;
  patterns: string[];
  recommendations: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
};

export default function AILogAnalyzerPage() {
  const [logs, setLogs] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeLogs = () => {
    if (!logs.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const lines = logs.split('\n').filter(l => l.trim());
      const errors = lines.filter(l => 
        l.toLowerCase().includes('error') || 
        l.toLowerCase().includes('exception') ||
        l.toLowerCase().includes('fatal')
      );
      const warnings = lines.filter(l => 
        l.toLowerCase().includes('warn') || 
        l.toLowerCase().includes('warning')
      );
      
      // Determine severity based on error count
      let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (errors.length > 20) severity = 'critical';
      else if (errors.length > 10) severity = 'high';
      else if (errors.length > 5) severity = 'medium';
      
      // Generate patterns
      const patterns: string[] = [];
      if (errors.some(e => e.toLowerCase().includes('null') || e.toLowerCase().includes('undefined'))) {
        patterns.push('Null/undefined reference errors detected');
      }
      if (errors.some(e => e.toLowerCase().includes('timeout') || e.toLowerCase().includes('network'))) {
        patterns.push('Network/timeout issues present');
      }
      if (errors.some(e => e.toLowerCase().includes('memory') || e.toLowerCase().includes('heap'))) {
        patterns.push('Memory-related issues detected');
      }
      if (errors.some(e => e.toLowerCase().includes('database') || e.toLowerCase().includes('sql'))) {
        patterns.push('Database-related errors found');
      }
      
      const recommendations: string[] = [];
      if (patterns.includes('Null/undefined reference errors')) {
        recommendations.push('Add null checks and defensive programming');
      }
      if (patterns.includes('Network/timeout issues present')) {
        recommendations.push('Implement retry logic and connection pooling');
      }
      if (patterns.includes('Database-related errors found')) {
        recommendations.push('Review query optimization and connection management');
      }
      if (errors.length > 10) {
        recommendations.push('Consider implementing centralized error tracking (e.g., Sentry)');
      }
      
      const result: AnalysisResult = {
        summary: `Analyzed ${lines.length} log lines. Found ${errors.length} errors and ${warnings.length} warnings.`,
        errorCount: errors.length,
        warningCount: warnings.length,
        patterns,
        recommendations,
        severity,
      };
      
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 1500);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-4">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            AI-Powered Analysis
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            AI Log Analyzer
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Paste your application logs and get instant AI-powered insights, error categorization, and actionable debugging recommendations.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6 mb-8">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Paste your logs here
          </label>
          <textarea
            value={logs}
            onChange={(e) => setLogs(e.target.value)}
            placeholder="2024-01-15 10:23:45 ERROR NullPointerException in UserService.java:45&#10;2024-01-15 10:23:46 WARN Connection timeout to database&#10;2024-01-15 10:23:47 INFO User session started for user_id: 12345"
            className="w-full h-48 bg-slate-900/50 border border-slate-600 rounded-xl p-4 text-slate-300 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setLogs('')}
              className="text-slate-400 hover:text-slate-300 text-sm"
            >
              Clear
            </button>
            <button
              onClick={analyzeLogs}
              disabled={!logs.trim() || isAnalyzing}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-slate-600 disabled:to-slate-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              {isAnalyzing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </span>
              ) : (
                'Analyze Logs'
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {analysis && (
          <div className="space-y-6">
            {/* Summary Card */}
            <div className={`bg-slate-800/50 rounded-2xl border-2 p-6 ${getSeverityColor(analysis.severity)}`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Analysis Summary</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium uppercase ${getSeverityColor(analysis.severity)}`}>
                  {analysis.severity} Severity
                </span>
              </div>
              <p className="text-lg">{analysis.summary}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{analysis.errorCount}</div>
                <div className="text-slate-400 text-sm">Errors</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
                <div className="text-3xl font-bold text-yellow-400">{analysis.warningCount}</div>
                <div className="text-slate-400 text-sm">Warnings</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{analysis.patterns.length}</div>
                <div className="text-slate-400 text-sm">Patterns Found</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
                <div className="text-3xl font-bold text-purple-400">{analysis.recommendations.length}</div>
                <div className="text-slate-400 text-sm">Recommendations</div>
              </div>
            </div>

            {/* Patterns */}
            {analysis.patterns.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  Detected Patterns
                </h3>
                <div className="space-y-2">
                  {analysis.patterns.map((pattern, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-slate-300">
                      <span className="text-purple-400">→</span>
                      {pattern}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations.length > 0 && (
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  AI Recommendations
                </h3>
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex items-start gap-3 bg-slate-900/30 rounded-lg p-3">
                      <span className="text-green-400 mt-1">✓</span>
                      <span className="text-slate-300">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Pattern Detection</h3>
            <p className="text-slate-400 text-sm">
              AI identifies recurring issues and帮助你 understand the root cause of problems.
            </p>
          </div>
          <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Actionable Insights</h3>
            <p className="text-slate-400 text-sm">
              Get specific recommendations to fix issues and improve application reliability.
            </p>
          </div>
          <div className="bg-slate-800/30 rounded-xl border border-slate-700 p-6">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Instant Analysis</h3>
            <p className="text-slate-400 text-sm">
              Paste your logs and get comprehensive analysis in seconds, not minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}