'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Upload, Sparkles, X, Copy, Check, 
  Download, Loader2, Brain, FileSpreadsheet, File 
} from 'lucide-react';

interface AnalysisResult {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  keywords: string[];
  suggestions: string[];
}

const mockAnalysis: AnalysisResult = {
  summary: 'This document appears to be a business proposal or report containing key findings about AI implementation benefits. The content discusses measurable improvements in operational efficiency, cost reduction strategies, and future roadmap items.',
  keyPoints: [
    '87% improvement in operational efficiency',
    '$2.4M potential annual cost savings',
    'Implementation timeline: 6-9 months',
    'ROI projected at 340% within first year',
    'Risk mitigation strategies outlined'
  ],
  sentiment: 'positive',
  keywords: ['AI', 'efficiency', 'ROI', 'automation', 'cost savings', 'implementation', 'scalability'],
  suggestions: [
    'Consider adding more detailed case studies',
    'Include competitive analysis section',
    'Add technical requirements documentation',
    'Consider phased rollout approach'
  ]
};

export default function AIDocumentAnalyzer() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type.startsWith('text/') || droppedFile.type === 'application/pdf')) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const analyzeDocument = async () => {
    if (!file) return;
    
    setIsAnalyzing(true);
    setResult(null);

    // Simulate AI analysis
    setTimeout(() => {
      setResult(mockAnalysis);
      setIsAnalyzing(false);
    }, 2500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (!file) return <File className="w-12 h-12 text-slate-400" />;
    if (file.type.includes('pdf')) return <FileText className="w-12 h-12 text-red-400" />;
    if (file.type.includes('spreadsheet') || file.name.endsWith('.csv')) {
      return <FileSpreadsheet className="w-12 h-12 text-green-400" />;
    }
    return <FileText className="w-12 h-12 text-blue-400" />;
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500/20 text-green-400';
      case 'negative': return 'bg-red-500/20 text-red-400';
      default: return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">AI Document Analyzer</h3>
          <p className="text-slate-400 text-sm">Upload documents for instant AI analysis</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!file && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              isDragging 
                ? 'border-violet-500 bg-violet-500/10' 
                : 'border-slate-600 hover:border-slate-500'
            }`}
          >
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-white font-medium mb-2">
              Drag and drop your document here
            </p>
            <p className="text-slate-400 text-sm mb-4">
              or click to browse (PDF, TXT, DOC, CSV)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx,.csv"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
            >
              Select File
            </button>
          </motion.div>
        )}

        {file && !result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="bg-slate-800/50 rounded-xl p-4 flex items-center gap-4">
              {getFileIcon()}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{file.name}</p>
                <p className="text-slate-400 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={reset} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <button
              onClick={analyzeDocument}
              disabled={isAnalyzing}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Document
                </>
              )}
            </button>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Summary */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-semibold">AI Summary</h4>
                <button
                  onClick={() => copyToClipboard(result.summary)}
                  className="text-slate-400 hover:text-white"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-slate-300 text-sm bg-slate-800/50 rounded-lg p-3">{result.summary}</p>
            </div>

            {/* Key Points */}
            <div>
              <h4 className="text-white font-semibold mb-2">Key Findings</h4>
              <ul className="space-y-2">
                {result.keyPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Sentiment & Keywords */}
            <div className="flex gap-4">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Sentiment</h4>
                <span className={`px-3 py-1 rounded-full text-sm ${getSentimentColor(result.sentiment)}`}>
                  {result.sentiment.charAt(0).toUpperCase() + result.sentiment.slice(1)}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-1">
                  {result.keywords.slice(0, 4).map((kw, i) => (
                    <span key={i} className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <h4 className="text-white font-semibold mb-2">AI Suggestions</h4>
              <ul className="space-y-2">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                    <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={reset}
                className="flex-1 py-2 border border-slate-600 text-slate-300 rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                Analyze Another
              </button>
              <button className="flex-1 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
