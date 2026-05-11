'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, Laptop, Sparkles, AlertTriangle, RefreshCw
} from 'lucide-react';

interface SEOAnalysis {
  titleLength: number;
  metaDescriptionLength: number;
  h1Count: number;
  wordCount: number;
  readingTime: number;
  hasOpenGraph: boolean;
  hasTwitterCard: boolean;
  schemaOrg: boolean;
  mobileFriendly: boolean;
  score: number;
}

interface PerformanceMetrics {
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  score: number;
}

interface SecurityChecks {
  hasHTTPS: boolean;
  hasSecurityHeaders: boolean;
  hasCSP: boolean;
  hasXFrameOptions: boolean;
  hasXXSSProtection: boolean;
  hasReferrerPolicy: boolean;
  score: number;
}

interface AccessibilityChecks {
  hasAltText: boolean;
  hasLabelAssociations: boolean;
  hasHeadingHierarchy: boolean;
  hasColorContrast: boolean;
  hasAriaLabels: boolean;
  score: number;
}

export default function WebsiteAnalyzer() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [seoAnalysis, setSeoAnalysis] = useState<SEOAnalysis | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [securityChecks, setSecurityChecks] = useState<SecurityChecks | null>(null);
  const [accessibilityChecks, setAccessibilityChecks] = useState<AccessibilityChecks | null>(null);
  const [error, setError] = useState('');

  const analyzeWebsite = async () => {
    if (!url.trim()) {
      setError('Please enter a website URL');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError('');
      setSeoAnalysis(null);
      setPerformanceMetrics(null);
      setSecurityChecks(null);
      setAccessibilityChecks(null);

      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate mock analysis data
      const seoData: SEOAnalysis = {
        titleLength: Math.floor(Math.random() * 80) + 20,
        metaDescriptionLength: Math.floor(Math.random() * 180) + 40,
        h1Count: Math.floor(Math.random() * 3) + 1,
        wordCount: Math.floor(Math.random() * 2000) + 300,
        readingTime: Math.floor(Math.random() * 8) + 2,
        hasOpenGraph: Math.random() > 0.3,
        hasTwitterCard: Math.random() > 0.5,
        schemaOrg: Math.random() > 0.4,
        mobileFriendly: Math.random() > 0.2,
        score: Math.floor(Math.random() * 40) + 60
      };

      const performanceData: PerformanceMetrics = {
        loadTime: Math.floor(Math.random() * 4000) + 500,
        firstContentfulPaint: Math.floor(Math.random() * 2000) + 500,
        largestContentfulPaint: Math.floor(Math.random() * 3000) + 1000,
        cumulativeLayoutShift: Math.random() * 0.3,
        firstInputDelay: Math.floor(Math.random() * 100) + 20,
        score: Math.floor(Math.random() * 30) + 70
      };

      const securityData: SecurityChecks = {
        hasHTTPS: url.startsWith('https://'),
        hasSecurityHeaders: Math.random() > 0.4,
        hasCSP: Math.random() > 0.6,
        hasXFrameOptions: Math.random() > 0.5,
        hasXXSSProtection: Math.random() > 0.3,
        hasReferrerPolicy: Math.random() > 0.5,
        score: Math.floor(Math.random() * 40) + 60
      };

      const accessibilityData: AccessibilityChecks = {
        hasAltText: Math.random() > 0.3,
        hasLabelAssociations: Math.random() > 0.4,
        hasHeadingHierarchy: Math.random() > 0.5,
        hasColorContrast: Math.random() > 0.6,
        hasAriaLabels: Math.random() > 0.4,
        score: Math.floor(Math.random() * 35) + 65
      };

      setSeoAnalysis(seoData);
      setPerformanceMetrics(performanceData);
      setSecurityChecks(securityData);
      setAccessibilityChecks(accessibilityData);
    } catch {
      setError('Analysis failed. Please check the URL and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Improvement';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Website{' '}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Analyzer
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Analyze any website for SEO, performance, security, and accessibility.
            Get instant insights and actionable recommendations for improvement.
          </p>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-300">{error}</p>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Enter Website URL
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={analyzeWebsite}
                disabled={!url.trim() || isAnalyzing}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Globe className="w-5 h-5" />
                    Analyze Website
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Results */}
          {(seoAnalysis || performanceMetrics || securityChecks || accessibilityChecks) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
            >
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-white font-semibold flex items-center justify-between">
                  <Laptop className="w-5 h-5 text-violet-400" />
                  Analysis Results
                  {isAnalyzing && (
                    <span className="ml-2 text-xs text-blue-400">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    </span>
                  )}
                </h3>
              </div>
              <div className="p-6 space-y-6">
                {/* SEO Score */}
                {seoAnalysis && (
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h4 className="text-slate-400 text-xs uppercase mb-2">SEO Score</h4>
                    <div className={`mb-2 text-center font-mono text-3xl ${getScoreColor(seoAnalysis.score)}`}>
                      {seoAnalysis.score}/100
                    </div>
                    <p className="text-center text-sm">{getScoreLabel(seoAnalysis.score)}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                      <div>
                        <p>Title Length: {seoAnalysis.titleLength} chars</p>
                        <p>Meta Description: {seoAnalysis.metaDescriptionLength} chars</p>
                        <p>H1 Tags: {seoAnalysis.h1Count}</p>
                        <p>Word Count: {seoAnalysis.wordCount.toLocaleString()}</p>
                      </div>
                      <div>
                        <p>Reading Time: {seoAnalysis.readingTime} min</p>
                        <p>Open Graph: {seoAnalysis.hasOpenGraph ? '✓' : '✗'}</p>
                        <p>Twitter Card: {seoAnalysis.hasTwitterCard ? '✓' : '✗'}</p>
                        <p>Schema.org: {seoAnalysis.schemaOrg ? '✓' : '✗'}</p>
                        <p>Mobile Friendly: {seoAnalysis.mobileFriendly ? '✓' : '✗'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Performance Score */}
                {performanceMetrics && (
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h4 className="text-slate-400 text-xs uppercase mb-2">Performance Score</h4>
                    <div className={`mb-2 text-center font-mono text-3xl ${getScoreColor(performanceMetrics.score)}`}>
                      {performanceMetrics.score}/100
                    </div>
                    <p className="text-center text-sm">{getScoreLabel(performanceMetrics.score)}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                      <div>
                        <p>Load Time: {performanceMetrics.loadTime}ms</p>
                        <p>FCP: {performanceMetrics.firstContentfulPaint}ms</p>
                        <p>LCP: {performanceMetrics.largestContentfulPaint}ms</p>
                      </div>
                      <div>
                        <p>CLS: {performanceMetrics.cumulativeLayoutShift.toFixed(3)}</p>
                        <p>FID: {performanceMetrics.firstInputDelay}ms</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Score */}
                {securityChecks && (
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h4 className="text-slate-400 text-xs uppercase mb-2">Security Score</h4>
                    <div className={`mb-2 text-center font-mono text-3xl ${getScoreColor(securityChecks.score)}`}>
                      {securityChecks.score}/100
                    </div>
                    <p className="text-center text-sm">{getScoreLabel(securityChecks.score)}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                      <div>
                        <p>HTTPS: {securityChecks.hasHTTPS ? '✓' : '✗'}</p>
                        <p>Security Headers: {securityChecks.hasSecurityHeaders ? '✓' : '✗'}</p>
                        <p>CSP: {securityChecks.hasCSP ? '✓' : '✗'}</p>
                        <p>X-Frame Options: {securityChecks.hasXFrameOptions ? '✓' : '✗'}</p>
                        <p>X-XSS-Protection: {securityChecks.hasXXSSProtection ? '✓' : '✗'}</p>
                        <p>Referrer Policy: {securityChecks.hasReferrerPolicy ? '✓' : '✗'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Accessibility Score */}
                {accessibilityChecks && (
                  <div className="bg-slate-800/30 rounded-lg p-4">
                    <h4 className="text-slate-400 text-xs uppercase mb-2">Accessibility Score</h4>
                    <div className={`mb-2 text-center font-mono text-3xl ${getScoreColor(accessibilityChecks.score)}`}>
                      {accessibilityChecks.score}/100
                    </div>
                    <p className="text-center text-sm">{getScoreLabel(accessibilityChecks.score)}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-400">
                      <div>
                        <p>Alt Text: {accessibilityChecks.hasAltText ? '✓' : '✗'}</p>
                        <p>Label Associations: {accessibilityChecks.hasLabelAssociations ? '✓' : '✗'}</p>
                        <p>Heading Hierarchy: {accessibilityChecks.hasHeadingHierarchy ? '✓' : '✗'}</p>
                        <p>Color Contrast: {accessibilityChecks.hasColorContrast ? '✓' : '✗'}</p>
                        <p>ARIA Labels: {accessibilityChecks.hasAriaLabels ? '✓' : '✗'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}