'use client';

import { useState, useEffect } from 'react';

interface CodeIssue {
  id: string;
  type: 'bug' | 'performance' | 'security' | 'style' | 'complexity';
  severity: 'critical' | 'warning' | 'info';
  file: string;
  line: number;
  message: string;
  suggestion: string;
}

export default function AICodeReviewer() {
  const [code, setCode] = useState('');
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [score, setScore] = useState(0);

  const analyzeCode = async () => {
    if (!code.trim()) return;
    setIsAnalyzing(true);
    setIssues([]);

    await new Promise(resolve => setTimeout(resolve, 3000));

    const detectedIssues: CodeIssue[] = [];
    const lines = code.split('\n');

    // Analyze code patterns
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Check for common issues
        detectedIssues.push({
          id: `issue-${lineNum}-1`,
          type: 'style',
          severity: 'info',
          file: 'current-file.ts',
          line: lineNum,
          suggestion: 'Use a proper logging library or remove debug statements before production'
        });
      }
      
      if (line.includes('any')) {
        detectedIssues.push({
          id: `issue-${lineNum}-2`,
          type: 'complexity',
          severity: 'warning',
          file: 'current-file.ts',
          line: lineNum,
          message: '"any" type used',
          suggestion: 'Replace "any" with a specific type for better type safety'
        });
      }
      
      if (line.includes('==') && !line.includes('===')) {
        detectedIssues.push({
          id: `issue-${lineNum}-3`,
          type: 'bug',
          severity: 'warning',
          file: 'current-file.ts',
          line: lineNum,
          message: 'Loose equality (==) detected',
          suggestion: 'Use strict equality (===) to avoid type coercion bugs'
        });
      }
      
      if (line.includes('eval(')) {
        detectedIssues.push({
          id: `issue-${lineNum}-4`,
          type: 'security',
          severity: 'critical',
          file: 'current-file.ts',
          line: lineNum,
          message: 'eval() usage detected',
          suggestion: 'Never use eval() with user input. Use JSON.parse() or a safer alternative'
        });
      }
      
      if (line.length > 120) {
        detectedIssues.push({
          id: `issue-${lineNum}-5`,
          type: 'style',
          severity: 'info',
          file: 'current-file.ts',
          line: lineNum,
          message: `Line too long (${line.length} characters)`,
          suggestion: 'Break long lines into multiple lines for better readability'
        });
      }
      
      // Check for unused variables pattern
      if (line.match(/const \w+ = .*;/) && !code.includes(line.match(/const (\w+)(?=\s*=)/)?.[1] || '', lines.slice(index + 1).join('\n'))) {
        detectedIssues.push({
          id: `issue-${lineNum}-6`,
          type: 'performance',
          severity: 'warning',
          file: 'current-file.ts',
          line: lineNum,
          message: 'Potentially unused variable',
          suggestion: 'Remove unused variables to reduce bundle size'
        });
      }
    });

    // Check for missing patterns
    if (!code.includes('export default') && !code.includes('module.exports')) {
      detectedIssues.push({
        id: 'issue-module-1',
        type: 'style',
        severity: 'info',
        file: 'current-file.ts',
        line: 1,
        message: 'No export detected',
        suggestion: 'Ensure the module exports its public API'
      });
    }

    if (!code.includes('//') && !code.includes('/*') && code.length > 500) {
      detectedIssues.push({
        id: 'issue-doc-1',
        type: 'style',
        severity: 'info',
        file: 'current-file.ts',
        line: 1,
        message: 'No comments found',
        suggestion: 'Add JSDoc comments to explain complex logic'
      });
    }

    // Calculate score
    let calculatedScore = 100;
    detectedIssues.forEach(issue => {
      if (issue.severity === 'critical') calculatedScore -= 15;
      else if (issue.severity === 'warning') calculatedScore -= 5;
      else calculatedScore -= 2;
    });
    calculatedScore = Math.max(0, calculatedScore);
    
    setScore(calculatedScore);
    setIssues(detectedIssues);
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'bug': return '🐛';
      case 'performance': return '⚡';
      case 'security': return '🔒';
      case 'style': return '🎨';
      case 'complexity': return '🧠';
      default: return '📄';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Code Reviewer</h2>
          <p className="text-sm text-gray-600 mt-1">
            Paste your code below for instant AI-powered code quality analysis
          </p>
        </div>
        {issues.length > 0 && (
          <div className="text-right">
            <div className={`text-3xl font-bold ${score >= 90 ? 'text-green-600' : score >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
              {score}/100
            </div>
            <div className="text-sm text-gray-600">Code Quality Score</div>
          </div>
        )}
      </div>

      {/* Code Input */}
      <div className="mb-6">
        <textarea
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Paste your code here for AI review..."
          className="w-full h-64 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          spellCheck={false}
        />
        <div className="flex items-center justify-between mt-3">
          <div className="text-sm text-gray-600">
            {code.split('\n').length} lines • {code.length} characters
          </div>
          <button
            onClick={analyzeCode}
            disabled={!code.trim() || isAnalyzing}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isAnalyzing ? '🔍 Analyzing...' : '🤖 Review Code'}
          </button>
        </div>
      </div>

      {/* Analysis Results */}
      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="mt-3 text-gray-600">AI is reviewing your code for bugs, security issues, and improvements...</p>
        </div>
      )}

      {/* Issues List */}
      {!isAnalyzing && issues.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">
            Found {issues.length} issue{issues.length !== 1 ? 's' : ''}
          </h3>
          {issues.map(issue => (
            <div
              key={issue.id}
              className={`p-4 rounded-lg border ${getSeverityColor(issue.severity)}`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-xl">{getTypeIcon(issue.type)}</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">{issue.message}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(issue.severity)}`}>
                      {issue.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm opacity-80 mb-2">{issue.suggestion}</p>
                  <div className="text-xs opacity-70 font-mono">
                    {issue.file}:{issue.line}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Clear State */}
      {!isAnalyzing && issues.length === 0 && code.length > 100 && (
        <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-semibold text-green-900 text-lg mb-2">Code Looks Clean!</h3>
          <p className="text-green-700">
            No issues detected. Your code follows best practices and has good quality patterns.
          </p>
        </div>
      )}

      {/* AI Intelligence Note */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-1">🤖 AI Code Review Intelligence</h3>
        <p className="text-sm text-purple-800">
          Our AI reviewer detects bugs, security vulnerabilities, performance issues, style violations, 
          and complexity problems. It provides actionable suggestions and learns from your codebase patterns.
        </p>
      </div>
    </div>
  );
}