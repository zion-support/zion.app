'use client';

import React, { useState, useCallback } from 'react';

interface A11yIssue {
  id: string;
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  category: string;
  title: string;
  description: string;
  impact: string;
  fix: string;
  wcag?: string;
  element?: string;
}

interface AuditResult {
  url: string;
  timestamp: string;
  score: number;
  totalIssues: number;
  issuesBySeverity: Record<string, number>;
  issues: A11yIssue[];
  summary: string;
}

const CATEGORY_RULES = [
  {
    id: 'color-contrast',
    category: 'Color & Visual',
    title: 'Insufficient Color Contrast',
    description: 'Text elements with contrast ratios below WCAG AA standards.',
    impact: 'Users with low vision may struggle to read content.',
    fix: 'Ensure a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.',
    wcag: '1.4.3 Contrast (Minimum)',
    severity: 'serious' as const,
  },
  {
    id: 'missing-alt',
    category: 'Images & Media',
    title: 'Missing Image Alt Text',
    description: 'Images without alternative text descriptions.',
    impact: 'Screen reader users cannot understand image content.',
    fix: 'Add descriptive alt attributes to all informative images. Use alt="" for decorative images.',
    wcag: '1.1.1 Non-text Content',
    severity: 'critical' as const,
  },
  {
    id: 'keyboard-trap',
    category: 'Keyboard Navigation',
    title: 'Potential Keyboard Trap',
    description: 'Interactive elements that may trap keyboard focus.',
    impact: 'Keyboard-only users may become stuck and unable to navigate.',
    fix: 'Ensure all interactive elements are reachable and escapable via keyboard.',
    wcag: '2.1.2 No Keyboard Trap',
    severity: 'critical' as const,
  },
  {
    id: 'missing-labels',
    category: 'Forms & Input',
    title: 'Form Inputs Without Labels',
    description: 'Form fields missing associated label elements or aria-label.',
    impact: 'Screen reader users cannot identify form field purposes.',
    fix: 'Add <label for="id"> or aria-label to all form inputs.',
    wcag: '1.3.1 Info and Relationships',
    severity: 'serious' as const,
  },
  {
    id: 'focus-visible',
    category: 'Keyboard Navigation',
    title: 'Missing Focus Indicators',
    description: 'Interactive elements without visible focus states.',
    impact: 'Keyboard users cannot see which element is currently focused.',
    fix: 'Ensure :focus-visible styles are defined for all interactive elements.',
    wcag: '2.4.7 Focus Visible',
    severity: 'moderate' as const,
  },
  {
    id: 'heading-order',
    category: 'Document Structure',
    title: 'Skipped Heading Levels',
    description: 'Heading hierarchy skips levels (e.g., h1 to h3).',
    impact: 'Screen reader users may miss the logical document structure.',
    fix: 'Maintain sequential heading levels without skipping.',
    wcag: '1.3.1 Info and Relationships',
    severity: 'moderate' as const,
  },
  {
    id: 'aria-hidden-focus',
    category: 'ARIA',
    title: 'Focusable Elements Inside aria-hidden',
    description: 'Interactive elements within aria-hidden containers.',
    impact: 'Focus may land on hidden elements, confusing screen reader users.',
    fix: 'Remove focusable elements from aria-hidden containers or use inert attribute.',
    wcag: '4.1.2 Name, Role, Value',
    severity: 'serious' as const,
  },
  {
    id: 'link-purpose',
    category: 'Links & Navigation',
    title: 'Ambiguous Link Text',
    description: 'Links with generic text like "click here" or "read more".',
    impact: 'Screen reader users navigating by links cannot determine destinations.',
    fix: 'Use descriptive link text that indicates the destination or purpose.',
    wcag: '2.4.4 Link Purpose (In Context)',
    severity: 'moderate' as const,
  },
  {
    id: 'lang-missing',
    category: 'Document Structure',
    title: 'Missing Page Language',
    description: 'html element missing lang attribute.',
    impact: 'Screen readers cannot determine the correct pronunciation.',
    fix: 'Add lang="en" (or appropriate language code) to the <html> element.',
    wcag: '3.1.1 Language of Page',
    severity: 'serious' as const,
  },
  {
    id: 'skip-link',
    category: 'Keyboard Navigation',
    title: 'Missing Skip Navigation Link',
    description: 'No skip link to bypass repeated navigation blocks.',
    impact: 'Keyboard users must tab through all navigation on every page.',
    fix: 'Add a "Skip to main content" link as the first focusable element.',
    wcag: '2.4.1 Bypass Blocks',
    severity: 'moderate' as const,
  },
];

function analyzeHtml(html: string): A11yIssue[] {
  const issues: A11yIssue[] = [];
  const issueId = (cat: string, i: number) => `${cat}-${i}`;

  // Check for images without alt
  const imgMatches = html.match(/<img[^>]*>/gi) || [];
  let imgCounter = 0;
  imgMatches.forEach((img) => {
    if (!img.includes('alt=') || /alt\s*=\s*["']\s*["']/.test(img)) {
      imgCounter++;
      const rule = CATEGORY_RULES.find(r => r.id === 'missing-alt')!;
      const src = img.match(/src\s*=\s*["']([^"']*)["']/)?.[1] || 'unknown';
      issues.push({
        ...rule,
        id: issueId('missing-alt', imgCounter),
        element: `<img src="${src.slice(0, 60)}">`,
      });
    }
  });

  // Check for form inputs without labels
  const inputMatches = html.match(/<input[^>]*>/gi) || [];
  let inputCounter = 0;
  inputMatches.forEach((input) => {
    const id = input.match(/id\s*=\s*["']([^"']*)["']/)?.[1];
    const ariaLabel = input.match(/aria-label\s*=\s*["'][^"']*["']/);
    const ariaLabelledby = input.match(/aria-labelledby/);
    const type = input.match(/type\s*=\s*["']([^"']*)["']/)?.[1] || 'text';
    if (type !== 'hidden' && type !== 'submit' && type !== 'button' && !ariaLabel && !ariaLabelledby) {
      if (!id || !html.includes(`for="${id}"`)) {
        inputCounter++;
        const rule = CATEGORY_RULES.find(r => r.id === 'missing-labels')!;
        issues.push({
          ...rule,
          id: issueId('missing-labels', inputCounter),
          element: `<input type="${type}"${id ? ` id="${id}"` : ''}>`,
        });
      }
    }
  });

  // Check heading hierarchy
  const headingMatches = html.match(/<h[1-6][^>]*>/gi) || [];
  const headingLevels = headingMatches.map(h => parseInt(h.match(/<h([1-6])/i)?.[1] || '1'));
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i - 1] > 1) {
      const rule = CATEGORY_RULES.find(r => r.id === 'heading-order')!;
      issues.push({
        ...rule,
        id: issueId('heading-order', i),
        element: `h${headingLevels[i - 1]} → h${headingLevels[i]}`,
        description: `Heading jumps from h${headingLevels[i - 1]} to h${headingLevels[i]}`,
      });
    }
  }

  // Check for lang attribute
  if (!/<html[^>]*lang\s*=/i.test(html)) {
    const rule = CATEGORY_RULES.find(r => r.id === 'lang-missing')!;
    issues.push({ ...rule, id: issueId('lang-missing', 0) });
  }

  // Check for skip link
  if (!/skip.*(?:content|nav|main)/i.test(html)) {
    const rule = CATEGORY_RULES.find(r => r.id === 'skip-link')!;
    issues.push({ ...rule, id: issueId('skip-link', 0) });
  }

  // Check for links with ambiguous text
  const linkTexts = html.match(/<a[^>]*>([^<]*)<\/a>/gi) || [];
  let linkCounter = 0;
  const ambiguousTexts = ['click here', 'read more', 'learn more', 'here', 'more', 'link'];
  linkTexts.forEach((link) => {
    const text = link.replace(/<[^>]*>/g, '').trim().toLowerCase();
    if (ambiguousTexts.includes(text)) {
      linkCounter++;
      const rule = CATEGORY_RULES.find(r => r.id === 'link-purpose')!;
      issues.push({
        ...rule,
        id: issueId('link-purpose', linkCounter),
        element: `<a>${text}</a>`,
        description: `Link text "${text}" does not describe the destination.`,
      });
    }
  });

  // Check for focus styles in CSS
  if (/<style|<link[^>]*stylesheet/i.test(html) && !/:focus/i.test(html)) {
    const rule = CATEGORY_RULES.find(r => r.id === 'focus-visible')!;
    issues.push({ ...rule, id: issueId('focus-visible', 0) });
  }

  // Check for aria-hidden with focusable children
  const ariaHiddenBlocks = html.match(/aria-hidden\s*=\s*["']true["'][^>]*>([\s\S]*?)<\/[^>]+>/gi) || [];
  let ariaCounter = 0;
  ariaHiddenBlocks.forEach((block) => {
    if (/<(button|a|input|select|textarea)[^>]*>/i.test(block) || /tabindex\s*=\s*["']0?["']/i.test(block)) {
      ariaCounter++;
      const rule = CATEGORY_RULES.find(r => r.id === 'aria-hidden-focus')!;
      issues.push({
        ...rule,
        id: issueId('aria-hidden-focus', ariaCounter),
      });
    }
  });

  return issues;
}

function calculateScore(issues: A11yIssue[]): number {
  let score = 100;
  issues.forEach((issue) => {
    switch (issue.severity) {
      case 'critical': score -= 15; break;
      case 'serious': score -= 8; break;
      case 'moderate': score -= 4; break;
      case 'minor': score -= 2; break;
    }
  });
  return Math.max(0, Math.min(100, score));
}

function generateSummary(score: number, issues: A11yIssue[]): string {
  const severityCounts = issues.reduce(
    (acc, i) => ({ ...acc, [i.severity]: (acc[i.severity] || 0) + 1 }),
    {} as Record<string, number>
  );

  const parts: string[] = [];
  if (severityCounts.critical) parts.push(`${severityCounts.critical} critical`);
  if (severityCounts.serious) parts.push(`${severityCounts.serious} serious`);
  if (severityCounts.moderate) parts.push(`${severityCounts.moderate} moderate`);
  if (severityCounts.minor) parts.push(`${severityCounts.minor} minor`);

  if (score >= 90) return `Excellent accessibility (${score}/100)! ${issues.length > 0 ? `Only ${issues.length} minor issue(s) detected.` : 'No issues detected.'}`;
  if (score >= 70) return `Good accessibility (${score}/100). Found ${parts.join(', ')} issue(s) to address.`;
  if (score >= 50) return `Moderate accessibility (${score}/100). ${parts.join(', ')} issue(s) need attention.`;
  return `Poor accessibility (${score}/100). ${parts.join(', ')} issue(s) require immediate attention.`;
}

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-500/20 text-red-300 border-red-500/30',
  serious: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  moderate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  minor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

const SEVERITY_ICONS: Record<string, string> = {
  critical: '🔴',
  serious: '🟠',
  moderate: '🟡',
  minor: '🔵',
};

export default function AccessibilityAuditorClient() {
  const [url, setUrl] = useState('');
  const [htmlInput, setHtmlInput] = useState('');
  const [mode, setMode] = useState<'url' | 'html'>('html');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [expandedIssue, setExpandedIssue] = useState<string | null>(null);

  const runAudit = useCallback(async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      let html = htmlInput;

      if (mode === 'url') {
        if (!url.trim()) throw new Error('Please enter a URL');
        const response = await fetch(`/api/accessibility-audit?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('Failed to fetch page');
        const data = await response.json();
        html = data.html;
      } else {
        if (!htmlInput.trim()) throw new Error('Please paste HTML to analyze');
      }

      // Run analysis
      const issues = analyzeHtml(html);
      const score = calculateScore(issues);
      const summary = generateSummary(score, issues);

      const issuesBySeverity = issues.reduce(
        (acc, i) => ({ ...acc, [i.severity]: (acc[i.severity] || 0) + 1 }),
        {} as Record<string, number>
      );

      setResult({
        url: mode === 'url' ? url : 'Pasted HTML',
        timestamp: new Date().toISOString(),
        score,
        totalIssues: issues.length,
        issuesBySeverity,
        issues,
        summary,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [mode, url, htmlInput]);

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    if (score >= 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number): string => {
    if (score >= 90) return 'from-green-500 to-emerald-600';
    if (score >= 70) return 'from-yellow-500 to-amber-600';
    if (score >= 50) return 'from-orange-500 to-red-600';
    return 'from-red-500 to-red-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Free AI-Powered Tool
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            AI Accessibility Auditor
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Analyze your website for WCAG compliance issues. Get actionable recommendations to make your site accessible to everyone.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 md:p-8 mb-8">
          {/* Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setMode('html')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                mode === 'html'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:text-white'
              }`}
            >
              📋 Paste HTML
            </button>
            <button
              onClick={() => setMode('url')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                mode === 'url'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700/50 text-slate-400 hover:text-white'
              }`}
            >
              🌐 Enter URL
            </button>
          </div>

          {mode === 'url' ? (
            <div className="mb-6">
              <label htmlFor="url-input" className="block text-sm font-medium text-slate-300 mb-2">
                Website URL
              </label>
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
          ) : (
            <div className="mb-6">
              <label htmlFor="html-input" className="block text-sm font-medium text-slate-300 mb-2">
                HTML Source Code
              </label>
              <textarea
                id="html-input"
                value={htmlInput}
                onChange={(e) => setHtmlInput(e.target.value)}
                placeholder="Paste your HTML source code here..."
                rows={8}
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition font-mono text-sm resize-y"
              />
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm" role="alert">
              {error}
            </div>
          )}

          <button
            onClick={runAudit}
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            data-cta-event="cta_audit_accessibility"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Run Accessibility Audit
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Score Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                    {result.score}
                  </div>
                  <div className="text-slate-500 text-sm text-center">/ 100</div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-xl font-bold text-white mb-2">Audit Results</h2>
                  <p className="text-slate-400 mb-4">{result.summary}</p>
                  <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getScoreGradient(result.score)} transition-all duration-1000`}
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Severity Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {['critical', 'serious', 'moderate', 'minor'].map((severity) => (
                  <div
                    key={severity}
                    className={`p-4 rounded-xl border ${
                      SEVERITY_COLORS[severity]
                    }`}
                  >
                    <div className="text-2xl font-bold">
                      {result.issuesBySeverity[severity] || 0}
                    </div>
                    <div className="text-sm capitalize opacity-80">{severity}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Issues List */}
            {result.issues.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6">
                  Issues Found ({result.totalIssues})
                </h2>
                <div className="space-y-3">
                  {result.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="bg-slate-900/50 rounded-xl border border-slate-700/30 overflow-hidden"
                    >
                      <button
                        onClick={() =>
                          setExpandedIssue(expandedIssue === issue.id ? null : issue.id)
                        }
                        className="w-full p-4 text-left flex items-start gap-3 hover:bg-slate-800/50 transition"
                        aria-expanded={expandedIssue === issue.id}
                      >
                        <span className="text-xl flex-shrink-0 mt-0.5">
                          {SEVERITY_ICONS[issue.severity]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white">{issue.title}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${SEVERITY_COLORS[issue.severity]}`}>
                              {issue.severity}
                            </span>
                            {issue.wcag && (
                              <span className="text-xs text-slate-500">WCAG {issue.wcag}</span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{issue.description}</p>
                        </div>
                        <svg
                          className={`w-5 h-5 text-slate-400 transition-transform flex-shrink-0 ${
                            expandedIssue === issue.id ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedIssue === issue.id && (
                        <div className="px-4 pb-4 pl-11 space-y-3 border-t border-slate-700/30 pt-4">
                          <div>
                            <h4 className="text-sm font-semibold text-slate-300 mb-1">Impact</h4>
                            <p className="text-sm text-slate-400">{issue.impact}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-300 mb-1">How to Fix</h4>
                            <p className="text-sm text-green-400/80">{issue.fix}</p>
                          </div>
                          {issue.element && (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-300 mb-1">Element</h4>
                              <code className="text-xs bg-slate-800 text-pink-400 px-2 py-1 rounded font-mono">
                                {issue.element}
                              </code>
                            </div>
                          )}
                          {issue.category && (
                            <div className="text-xs text-slate-500">
                              Category: {issue.category}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.issues.length === 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-green-500/30 p-8 text-center">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-xl font-bold text-green-400 mb-2">No Issues Found!</h2>
                <p className="text-slate-400">
                  Great job! Your HTML appears to follow accessibility best practices.
                  Consider running a full audit with screen readers and keyboard-only navigation for complete coverage.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tips Section */}
        <div className="mt-12 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 md:p-8">
          <h2 className="text-xl font-bold text-white mb-4">Accessibility Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: 'Color Contrast', desc: 'Ensure 4.5:1 ratio for text, 3:1 for large text', icon: '🎨' },
              { title: 'Keyboard Navigation', desc: 'All interactive elements must be keyboard accessible', icon: '⌨️' },
              { title: 'Alt Text', desc: 'Provide descriptive alternatives for all images', icon: '🖼️' },
              { title: 'Semantic HTML', desc: 'Use proper heading hierarchy and landmarks', icon: '📄' },
              { title: 'ARIA Labels', desc: 'Label form inputs and interactive elements', icon: '🏷️' },
              { title: 'Focus Management', desc: 'Visible focus indicators on all interactive elements', icon: '🎯' },
            ].map((tip) => (
              <div key={tip.title} className="flex items-start gap-3 p-3 bg-slate-900/30 rounded-lg">
                <span className="text-2xl">{tip.icon}</span>
                <div>
                  <h3 className="font-semibold text-white text-sm">{tip.title}</h3>
                  <p className="text-xs text-slate-400">{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
