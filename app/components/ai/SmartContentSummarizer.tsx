'use client';

import { useState } from 'react';

interface SummaryResult {
  summary: string;
  keyPoints: string[];
  readingTime: number;
}

export default function SmartContentSummarizer() {
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!content.trim()) return;
    
    setLoading(true);
    try {
      // Simulate AI summarization (in production, call actual AI API)
      const words = content.split(/\s+/).length;
      const readingTime = Math.ceil(words / 200);
      
      // Mock summary generation
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
      const keyPoints = sentences.slice(0, 3).map(s => s.trim());
      
      setSummary({
        summary: `This content covers ${sentences.length} key points with approximately ${words} words.`,
        keyPoints,
        readingTime
      });
    } catch (error) {
      console.error('Summarization failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 border border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🤖 AI Smart Content Summarizer
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Paste any content below and get an AI-powered summary with key points and reading time.
      </p>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Paste your content here to summarize..."
        className="w-full h-32 p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      
      <button
        onClick={handleSummarize}
        disabled={loading || !content.trim()}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Summarizing...' : '✨ Summarize with AI'}
      </button>
      
      {summary && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
          <h4 className="font-semibold text-green-800 mb-2">Summary</h4>
          <p className="text-sm text-gray-700 mb-3">{summary.summary}</p>
          
          <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
            <span>📖 Reading time: ~{summary.readingTime} min</span>
          </div>
          
          {summary.keyPoints.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-gray-800 mb-1">Key Points:</h5>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {summary.keyPoints.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
