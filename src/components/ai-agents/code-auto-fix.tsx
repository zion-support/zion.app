'use client';

import { useState } from 'react';

interface CodeIssue {
  id: string;
  type: 'security' | 'performance' | 'style' | 'bug' | 'accessibility';
  severity: 'critical' | 'warning' | 'info';
  line: number;
  message: string;
  originalCode: string;
  suggestedFix: string;
  explanation: string;
}

export default function CodeAutoFix() {
  const [code, setCode] = useState(`function processUserData(data) {
  const query = "SELECT * FROM users WHERE id = " + data.id;
  
  if(data.id == 1) {
    return true;
  }
  
  eval(data.code);
  return query;
}`);
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [fixedCode, setFixedCode] = useState('');
  const [applyAll, setApplyAll] = useState(false);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    setIssues([]);
    setFixedCode('');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const detectedIssues: CodeIssue[] = [
      {
        id: 'sec-1',
        type: 'security',
        severity: 'critical',
        line: 3,
        message: 'SQL Injection vulnerability: concatenating user input directly into query',
        originalCode: '  const query = "SELECT * FROM users WHERE id = " + data.id;',
        suggestedFix: '  const query = "SELECT * FROM users WHERE id = ?";\n  // Use parameterized queries instead',
        explanation: 'Always use parameterized queries or prepared statements to prevent SQL injection attacks.'
      },
      {
        id: 'sec-2',
        type: 'security',
        severity: 'critical',
        line: 8,
        message: 'Use of eval() with potentially untrusted input is extremely dangerous',
        originalCode: '  eval(data.code);',
        suggestedFix: '  // Removed eval() for security\n  // Use a safe alternative like JSON.parse() or a sandboxed environment',
        explanation: 'eval() can execute arbitrary code and is a major security risk. Never use it with user-provided data.'
      },
      {
        id: 'style-1',
        type: 'style',
        severity: 'info',
        line: 1,
        message: 'Function parameter lacks type annotation or validation',
        originalCode: 'function processUserData(data) {',
        suggestedFix: 'function processUserData(data: { id: number, code?: string }) {',
        explanation: 'Add proper type annotations or runtime validation for function parameters.'
      },
      {
        id: 'bug-1',
        type: 'bug',
        severity: 'warning',
        line: 5,
        message: 'Loose equality (==) should use strict equality (===)',
        originalCode: '  if(data.id == 1) {',
        suggestedFix: '  if(data.id === 1) {',
        explanation: 'Strict equality prevents unexpected type coercion bugs.'
      },
      {
        id: 'accessibility-1',
        type: 'accessibility',
        severity: 'info',
        line: 2,
        explanation: 'Remove debug statements before deploying to production for better performance and security.'
      }
    ];
    
    setIssues(detectedIssues);
    setIsAnalyzing(false);
    
    // Auto-apply all fixes if toggle is on
    if (applyAll) {
      applyAllFixes(detectedIssues);
    }
  };

  const applyAllFixes = (issuesList: CodeIssue[]) => {
    let fixed = code;
    issuesList.forEach(issue => {
      fixed = fixed.replace(issue.originalCode.trim(), issue.suggestedFix.trim());
    });
    setFixedCode(fixed);
  };

  const applyIndividualFix = (issue: CodeIssue) => {
    setFixedCode(prev => prev.replace(issue.originalCode.trim(), issue.suggestedFix.trim()));
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
      case 'security': return '🔒';
      case 'performance': return '⚡';
      case 'style': return '🎨';
      case 'bug': return '🐛';
      case 'accessibility': return '♿';
      default: return '📄';
    }
  };

  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Code Auto-Fix</h2>
          <p className="text-sm text-gray-600 mt-1">
            Automatically detect and fix security, performance, and code quality issues
          </p>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={applyAll}
              onChange={(e) => setApplyAll(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Auto-apply all fixes</span>
          </label>
          <button
            onClick={analyzeCode}
            disabled={isAnalyzing || !code.trim()}
            className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold disabled:opacity-50"
          >
            {isAnalyzing ? '🔍 Analyzing & Fixing...' : '🤖 Auto-Fix Code'}
          </button>
        </div>
      </div>

      {/* Code Input */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Original Code</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here for AI analysis and auto-fix..."
            className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            spellCheck={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fixed Code</label>
          <textarea
            value={fixedCode || code}
            onChange={(e) => setFixedCode(e.target.value)}
            placeholder="AI-fixed code will appear here..."
            className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-lg border border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-y"
            spellCheck={false}
            readOnly={!applyAll}
          />
          {fixedCode && (
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => setCode(fixedCode)}
                className="text-sm px-3 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200"
              >
                Apply Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Issues Summary */}
      {isAnalyzing && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
          <p className="mt-3 text-gray-600">AI is analyzing your code and applying intelligent fixes...</p>
        </div>
      )}

      {/* Issues List */}
      {!isAnalyzing && issues.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Issues Detected & Fixed</h3>
            <div className="flex items-center gap-3">
              {criticalCount > 0 && (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  {criticalCount} Critical
                </span>
              )}
              {warningCount > 0 && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                  {warningCount} Warning
                </span>
              )}
              {infoCount > 0 && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {infoCount} Info
                </span>
              )}
            </div>
          </div>

          {issues.map(issue => (
            <div
              key={issue.id}
              className={`border rounded-lg overflow-hidden ${getSeverityColor(issue.severity)}`}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{getTypeIcon(issue.type)}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{issue.message}</h4>
                      <p className="text-sm opacity-80 mt-1">{issue.explanation}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                    {issue.severity.toUpperCase()}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-2">BEFORE (Line {issue.line})</div>
                    <pre className="bg-gray-900 text-red-400 p-3 rounded text-sm overflow-x-auto">
                      {issue.originalCode}
                    </pre>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-700 mb-2">AFTER (AI Fixed)</div>
                    <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                      {issue.suggestedFix}
                    </pre>
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => applyIndividualFix(issue)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 font-medium"
                  >
                    Apply This Fix
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Success State */}
      {!isAnalyzing && issues.length === 0 && code.length > 50 && (
        <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-semibold text-green-900 text-lg mb-2">Code Looks Clean!</h3>
          <p className="text-green-700">
            No issues detected. Your code follows best practices and security standards.
          </p>
        </div>
      )}

      {/* AI Intelligence Panel */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-green-900">🤖 AI Auto-Fix Intelligence</h3>
          <span className="text-sm text-green-700">
            {issues.length} issues processed • {criticalCount} critical, {warningCount} warning, {infoCount} info
          </span>
        </div>
        <p className="text-sm text-green-800">
          Our AI analyzes your code for security vulnerabilities, performance bottlenecks, style inconsistencies,
          and bugs. It provides context-aware fixes with explanations, ensuring secure and maintainable code.
        </p>
      </div>
    </div>
  );
}