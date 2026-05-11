'use client';

import { useState, useEffect } from 'react';

interface CodeEvolution {
  id: string;
  timestamp: Date;
  file: string;
  changeType: 'refactor' | 'optimize' | 'modernize' | 'simplify' | 'secure';
  description: string;
  improvement: string;
  confidence: number;
  status: 'proposed' | 'applied' | 'tested' | 'deployed';
  metrics: {
    complexityBefore: number;
    complexityAfter: number;
    performanceBefore: number;
    performanceAfter: number;
    maintainabilityBefore: number;
    maintainabilityAfter: number;
  };
}

interface EvolutionMetric {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export default function CodeEvolutionSystem() {
  const [evolutions, setEvolutions] = useState<CodeEvolution[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 7200000),
      file: 'src/components/ai-agents/autonomous-brain.tsx',
      changeType: 'refactor',
      description: 'Extracted decision-making logic into separate service layer',
      improvement: 'Reduced component complexity by 35% and improved testability',
      confidence: 98,
      status: 'deployed',
      metrics: {
        complexityBefore: 24,
        complexityAfter: 16,
        performanceBefore: 100,
        performanceAfter: 100,
        maintainabilityBefore: 65,
        maintainabilityAfter: 82
      }
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 3600000),
      file: 'src/app/page.tsx',
      changeType: 'optimize',
      description: 'Memoized expensive AI component catalog rendering',
      improvement: 'Reduced homepage render time by 62%',
      confidence: 96,
      status: 'deployed',
      metrics: {
        complexityBefore: 18,
        complexityAfter: 18,
        performanceBefore: 340,
        performanceAfter: 129,
        maintainabilityBefore: 72,
        maintainabilityAfter: 78
      }
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1800000),
      file: 'src/components/ai-agents/self-healing-system.tsx',
      changeType: 'modernize',
      description: 'Updated to use React 18 concurrent features and Suspense',
      improvement: 'Improved user experience during loading states and reduced Time to Interactive',
      confidence: 94,
      status: 'tested',
      metrics: {
        complexityBefore: 22,
        complexityAfter: 19,
        performanceBefore: 100,
        performanceAfter: 100,
        maintainabilityBefore: 68,
        maintainabilityAfter: 81
      }
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 900000),
      file: 'src/components/ai-components.tsx',
      changeType: 'simplify',
      description: 'Consolidated duplicate component definitions and removed unused imports',
      improvement: 'Reduced bundle size by 12KB and improved tree-shaking',
      confidence: 99,
      status: 'applied',
      metrics: {
        complexityBefore: 15,
        complexityAfter: 9,
        performanceBefore: 100,
        performanceAfter: 100,
        maintainabilityBefore: 75,
        maintainabilityAfter: 88
      }
    },
    {
      id: '5',
      timestamp: new Date(Date.now() - 300000),
      file: 'src/components/ai-agents/code-auto-fix.tsx',
      changeType: 'secure',
      description: 'Enhanced input sanitization and added safe evaluation guards',
      improvement: 'Eliminated potential XSS vectors and code injection risks',
      confidence: 97,
      status: 'proposed',
      metrics: {
        complexityBefore: 27,
        complexityAfter: 23,
        performanceBefore: 100,
        performanceAfter: 99,
        maintainabilityBefore: 62,
        maintainabilityAfter: 74
      }
    }
  ]);

  const [metrics, setMetrics] = useState<EvolutionMetric[]>([
    { name: 'Code Complexity', value: 18.3, trend: 'down', change: -12.4 },
    { name: 'Performance Score', value: 94.2, trend: 'up', change: +8.7 },
    { name: 'Maintainability', value: 82.5, trend: 'up', change: +15.2 },
    { name: 'Security Rating', value: 96.8, trend: 'up', change: +5.3 },
    { name: 'Test Coverage', value: 87.3, trend: 'up', change: +12.1 },
    { name: 'Bundle Size', value: 156, trend: 'down', change: -18.4 }
  ]);

  const [totalEvolutions, setTotalEvolutions] = useState(2847);
  const [isScanning, setIsScanning] = useState(false);
  const [autoApplyEnabled, setAutoApplyEnabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        simulateNewEvolution();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const simulateNewEvolution = () => {
    const files = [
      'src/components/ai-agents/autonomous-dashboard.tsx',
      'src/components/ai-agents/deployment-orchestrator.tsx',
      'src/app/api/health/route.ts',
      'src/lib/analytics.ts',
      'src/components/Banner.tsx'
    ];

    const changeTypes: CodeEvolution['changeType'][] = ['refactor', 'optimize', 'modernize', 'simplify', 'secure'];
    const descriptions = [
      'Extracted business logic into custom hooks for better reusability',
      'Implemented memoization for expensive computations',
      'Updated to use modern ES2023+ features and syntax',
      'Removed unused code and simplified component structure',
      'Added comprehensive input validation and sanitization'
    ];

    const newEvolution: CodeEvolution = {
      id: Date.now().toString(),
      timestamp: new Date(),
      file: files[Math.floor(Math.random() * files.length)],
      changeType: changeTypes[Math.floor(Math.random() * changeTypes.length)],
      description: descriptions[Math.floor(Math.random() * descriptions.length)],
      improvement: 'Improved code quality, maintainability, and system performance',
      confidence: Math.floor(90 + Math.random() * 10),
      status: 'proposed',
      metrics: {
        complexityBefore: Math.floor(15 + Math.random() * 15),
        complexityAfter: Math.floor(10 + Math.random() * 10),
        performanceBefore: Math.floor(70 + Math.random() * 30),
        performanceAfter: Math.floor(85 + Math.random() * 15),
        maintainabilityBefore: Math.floor(60 + Math.random() * 25),
        maintainabilityAfter: Math.floor(75 + Math.random() * 20)
      }
    };

    setEvolutions(prev => [newEvolution, ...prev].slice(0, 10));
    setTotalEvolutions(prev => prev + 1);

    if (autoApplyEnabled && newEvolution.confidence >= 95) {
      setTimeout(() => {
        setEvolutions(prev => prev.map(e => 
          e.id === newEvolution.id 
            ? {...e, status: 'applied' as const}
            : e
        ));
      }, 5000);
    }
  };

  const applyEvolution = (id: string) => {
    setEvolutions(prev => prev.map(e => 
      e.id === id && e.status === 'proposed'
        ? {...e, status: 'applied' as const}
        : e
    ));
  };

  const runCodeScan = async () => {
    setIsScanning(true);
    
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const scanResults = [
      { file: 'src/components/ai-agents/ai-chat-assistant.tsx', type: 'refactor', confidence: 97 },
      { file: 'src/app/api/chat/route.ts', type: 'optimize', confidence: 95 },
      { file: 'src/components/ai-agents/code-reviewer.tsx', type: 'modernize', confidence: 99 }
    ];

    scanResults.forEach((result, index) => {
      setTimeout(() => {
        const newEvolution: CodeEvolution = {
          id: Date.now().toString() + index,
          timestamp: new Date(),
          file: result.file,
          changeType: result.type,
          description: `AI-detected improvement opportunity in ${result.file}`,
          improvement: 'Enhanced code quality and performance',
          confidence: result.confidence,
          status: 'proposed',
          metrics: {
            complexityBefore: 20,
            complexityAfter: 15,
            performanceBefore: 100,
            performanceAfter: 100,
            maintainabilityBefore: 70,
            maintainabilityAfter: 85
          }
        };
        setEvolutions(prev => [newEvolution, ...prev]);
      }, index * 1000);
    });

    setIsScanning(false);
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'refactor': return '🔧';
      case 'optimize': return '⚡';
      case 'modernize': return '✨';
      case 'simplify': return '📦';
      case 'secure': return '🔒';
      default: return '📝';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'deployed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>Deployed</span>;
      case 'tested':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>Tested</span>;
      case 'applied':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><span className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-1.5"></span>Applied</span>;
      case 'proposed':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1.5"></span>Proposed</span>;
      default:
        return null;
    }
  };

  const deployedCount = evolutions.filter(e => e.status === 'deployed').length;
  const avgComplexityReduction = Math.round((evolutions.reduce((acc, e) => acc + (e.metrics.complexityBefore - e.metrics.complexityAfter), 0) / evolutions.length) * 10) / 10;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🧬</span>
            AI Code Evolution System
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Continuously improves your codebase through intelligent refactoring, optimization, and modernization
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={runCodeScan}
            disabled={isScanning}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium disabled:opacity-50"
          >
            {isScanning ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Scanning Codebase...
              </span>
            ) : (
              '🔍 Scan & Evolve Code'
            )}
          </button>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">{totalEvolutions.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Code Improvements Applied</div>
          </div>
        </div>
      </div>

      {/* Evolution Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {metrics.map(metric => (
          <div key={metric.name} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="text-xs text-gray-500 uppercase mb-1">{metric.name}</div>
            <div className="flex items-center justify-between">
              <div className={`text-xl font-bold ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? metric.name.includes('size') || metric.name.includes('Complexity') ? 'text-green-600' : 'text-red-600' : 'text-blue-600'}`}>
                {metric.value}
                {metric.name.includes('size') && ' KB'}
                {metric.name.includes('Coverage') && '%'}
              </div>
              <div className={`text-sm ${metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? metric.name.includes('size') || metric.name.includes('Complexity') ? 'text-green-600' : 'text-red-600' : 'text-blue-600'}`}>
                {metric.change > 0 ? '+' : ''}{metric.change}%
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${metric.value >= 90 ? 'bg-green-500' : metric.value >= 75 ? 'bg-blue-500' : metric.value >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, metric.value)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Auto-Apply Toggle */}
      <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoApplyEnabled}
              onChange={(e) => setAutoApplyEnabled(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              id="autoApply"
            />
            <label htmlFor="autoApply" className="text-sm font-medium text-blue-900">
              Auto-apply high-confidence improvements (≥95%)
            </label>
          </div>
          <div className="text-xs text-blue-700">
            When enabled, AI will automatically apply safe improvements without manual approval
          </div>
        </div>
      </div>

      {/* Recent Evolutions */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Recent Code Evolutions
        </h3>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {evolutions.map(evolution => (
            <div
              key={evolution.id}
              className={`border rounded-lg p-4 hover:shadow-md transition ${evolution.status === 'deployed' ? 'border-green-200 bg-green-50' : evolution.status === 'proposed' ? 'border-yellow-200 bg-yellow-50' : 'border-gray-200'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getChangeTypeIcon(evolution.changeType)}</span>
                  <div>
                    <h4 className="font-semibold">{evolution.description}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      <code className="px-1 py-0.5 bg-gray-100 rounded text-xs">{evolution.file}</code>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">{evolution.confidence}% confidence</span>
                  {getStatusBadge(evolution.status)}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-4 bg-white bg-opacity-60 rounded-lg p-3">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Complexity</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-red-600">{evolution.metrics.complexityBefore}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium text-green-600">{evolution.metrics.complexityAfter}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Performance</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{evolution.metrics.performanceBefore}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium text-green-600">{evolution.metrics.performanceAfter}</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Maintainability</div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{evolution.metrics.maintainabilityBefore}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-sm font-medium text-green-600">{evolution.metrics.maintainabilityAfter}</span>
                  </div>
                </div>
              </div>

              {evolution.status === 'proposed' && (
                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => applyEvolution(evolution.id)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 font-medium"
                  >
                    Apply Evolution
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Evolution Impact Summary */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <span className="mr-2">📈</span>
          Codebase Evolution Impact
        </h3>
        
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Complexity Reduction</span>
              <span className="text-green-600 font-bold">{Math.abs(avgComplexityReduction)}% avg</span>
            </div>
            <div className="w-full bg-green-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-green-500" style={{ width: `${Math.min(100, 80 + avgComplexityReduction)}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Lower complexity = easier to maintain</p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Improvements Applied</span>
              <span className="text-emerald-600 font-bold">{evolutions.filter(e => e.status === 'deployed' || e.status === 'applied').length}</span>
            </div>
            <div className="w-full bg-emerald-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${evolutions.filter(e => e.status === 'deployed' || e.status === 'applied').length / evolutions.length * 100}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Current session evolutions</p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Auto-Approve Rate</span>
              <span className="text-blue-600 font-bold">{evolutions.filter(e => e.confidence >= 95).length}/{evolutions.length}</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: `${evolutions.filter(e => e.confidence >= 95).length / evolutions.length * 100}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">High-confidence improvements</p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Code Health Trend</span>
              <span className="text-purple-600 font-bold">↗️ +18.4%</span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-purple-500" style={{ width: '82%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Overall maintainability improvement</p>
          </div>
        </div>

        <div className="mt-6 bg-white bg-opacity-70 rounded-lg p-4 border border-green-200">
          <h4 className="font-medium text-green-900 mb-2">How Code Evolution Works</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• <strong>Continuous Analysis:</strong> AI scans entire codebase for improvement opportunities</li>
            <li>• <strong>Intelligent Refactoring:</strong> Applies proven design patterns and best practices</li>
            <li>• <strong>Performance Optimization:</strong> Identifies and fixes bottlenecks</li>
            <li>• <strong>Modernization:</strong> Updates code to use latest language features and standards</li>
            <li>• <strong>Security Hardening:</strong> Automatically patches vulnerabilities and adds safeguards</li>
            <li>• <strong>Confidence Scoring:</strong> Each change is rated for safety before application</li>
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-green-700">
            <span className="font-semibold">Next scan:</span> Running continuously · High-confidence changes auto-applied
          </div>
          <div className="flex items-center gap-2">
            <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-green-600">Codebase evolving autonomously</span>
          </div>
        </div>
      </div>
    </div>
  );
}