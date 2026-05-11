'use client';

import { useState, useEffect } from 'react';

interface Learning {
  id: string;
  timestamp: Date;
  insight: string;
  category: 'behavior' | 'performance' | 'preference' | 'system' | 'user';
  confidence: number;
  applied: boolean;
  impact?: string;
}

interface Model {
  id: string;
  name: string;
  version: string;
  accuracy: number;
  lastTraining: Date;
  dataPoints: number;
  status: 'training' | 'healthy' | 'degraded';
}

export default function SelfLearningSystem() {
  const [learnings, setLearnings] = useState<Learning[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 120000),
      insight: 'Users abandon checkout process at shipping information step 73% of time',
      category: 'behavior',
      confidence: 97,
      applied: true,
      impact: 'Implemented auto-fill from address API - completion rate +58%'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 600000),
      insight: 'Peak traffic occurs Tuesday 9-11AM and Thursday 2-4PM',
      category: 'system',
      confidence: 99,
      applied: true,
      impact: 'Pre-scaled resources for expected peak windows'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1800000),
      insight: '70% of users prefer video content over text for onboarding',
      category: 'preference',
      confidence: 94,
      applied: true,
      impact: 'Switched onboarding default - engagement +85%'
    },
    {
      id: '4',
      timestamp: new Date(Date.now() - 300000),
      insight: 'Image carousel CTR increases 40% when using high-res images >800px',
      category: 'performance',
      confidence: 91,
      applied: false,
      impact: 'Pending auto-implementation'
    }
  ]);

  const [models, setModels] = useState<Model[]>([
    {
      id: 'user-behavior',
      name: 'User Behavior Predictor',
      version: 2.7,
      accuracy: 94.2,
      lastTraining: new Date(Date.now() - 86400000),
      dataPoints: 1847293,
      status: 'healthy'
    },
    {
      id: 'conversion',
      name: 'Conversion Optimizer',
      version: 3.1,
      accuracy: 91.8,
      lastTraining: new Date(Date.now() - 3600000),
      dataPoints: 593847,
      status: 'healthy'
    },
    {
      id: 'content',
      name: 'Content Personalization',
      version: 1.9,
      accuracy: 88.5,
      lastTraining: new Date(Date.now() - 1800000),
      dataPoints: 294821,
      status: 'training'
    },
    {
      id: 'anomaly',
      name: 'Anomaly Detection',
      version: 4.0,
      accuracy: 97.1,
      lastTraining: new Date(Date.now() - 7200000),
      dataPoints: 4102939,
      status: 'healthy'
    },
    {
      id: 'recommendation',
      name: 'Smart Recommendation Engine',
      version: 2.3,
      accuracy: 89.4,
      lastTraining: new Date(Date.now() - 14400000),
      dataPoints: 847231,
      status: 'degraded'
    }
  ]);

  const [isLearning, setIsLearning] = useState(false);
  const [totalInsights, setTotalInsights] = useState(2847);
  const [improvementRate, setImprovementRate] = useState(12.4);

  useEffect(() => {
    const interval = setInterval(() => {
      simulateLearning();
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const simulateLearning = () => {
    setIsLearning(true);
    
    setTimeout(() => {
      const newInsights: Learning[] = [
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          insight: 'Mobile users convert 45% more with simplified payment forms (≤3 fields)',
          category: 'behavior',
          confidence: 96,
          applied: true,
          impact: 'Automatically simplified mobile checkout - conversion +45%'
        },
        {
          id: Date.now().toString(),
          timestamp: new Date(),
          insight: 'A/B test variant B outperforms A by 67% on hero section CTA',
          category: 'performance',
          confidence: 99,
          applied: true,
          impact: 'Auto-published winning variant to all traffic'
        }
      ];
      
      const randomInsight = newInsights[Math.floor(Math.random() * newInsights.length)];
      setLearnings(prev => [randomInsight, ...prev].slice(0, 10));
      setTotalInsights(prev => prev + 1);
      
      const improvement = (Math.random() - 0.3) * 2;
      setImprovementRate(prev => Math.max(0, prev + improvement));
      
      setIsLearning(false);
    }, 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'behavior': return '👥';
      case 'performance': return '⚡';
      case 'preference': return '❤️';
      case 'system': return '🔧';
      case 'user': return '👤';
      default: return '📊';
    }
  };

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'training': return 'text-yellow-600 bg-yellow-100';
      case 'degraded': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const recentLearnings = learnings.filter(l => l.applied).length;
  const successRate = (recentLearnings / learnings.length * 100).toFixed(1);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🧠</span>
            Self-Learning System
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Continuously improving through data analysis and automated insight application
          </p>
        </div>
        <div className="text-right flex items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{totalInsights.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Learnings</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{successRate}%</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
        </div>
      </div>

      {/* Training Models */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center">
            <span className="mr-2">🤖</span>
            Active Learning Models
          </h3>
          {isLearning && (
            <div className="flex items-center text-sm text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Learning from new data...
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {models.map(model => (
            <div 
              key={model.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{model.name}</h4>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getModelStatusColor(model.status)}`}>
                  {model.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Version</span>
                  <span className="font-medium">v{model.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Accuracy</span>
                  <span className={`font-medium ${model.accuracy >= 90 ? 'text-green-600' : model.accuracy >= 80 ? 'text-blue-600' : 'text-yellow-600'}`}>
                    {model.accuracy}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Points</span>
                  <span className="font-medium">{model.dataPoints.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Training</span>
                  <span className="text-gray-500">
                    {model.lastTraining.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full ${model.accuracy >= 90 ? 'bg-green-500' : model.accuracy >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                    style={{ width: `${model.accuracy}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Learnings */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <span className="mr-2">💡</span>
          Latest AI Learnings & Auto-Improvements
        </h3>

        <div className="space-y-3">
          {learnings.map(learning => (
            <div
              key={learning.id}
              className="border rounded-lg p-4 hover:shadow-md transition bg-white"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getCategoryIcon(learning.category)}</span>
                  <div>
                    <h4 className="font-semibold">{learning.insight}</h4>
                    <p className="text-sm text-gray-600 mt-1">{learning.details}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">
                    {learning.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                  <span className={`block mt-1 px-2 py-0.5 rounded text-xs font-medium ${learning.confidence >= 95 ? 'bg-green-100 text-green-800' : learning.confidence >= 85 ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {learning.confidence}% confidence
                  </span>
                </div>
              </div>

              {learning.impact && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold text-sm">✓ Auto-Applied:</span>
                    <span className="text-sm text-green-700">{learning.impact}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <span className="mr-2">📈</span>
          Learning Progress & Impact
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Learning Velocity</span>
              <span className="text-blue-600 font-bold">{improvementRate > 0 ? '+' : ''}{improvementRate.toFixed(1)}%/hr</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-blue-500" 
                style={{ width: `${Math.min(100, 50 + improvementRate * 2)}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">How quickly the system is learning</p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Model Coverage</span>
              <span className="text-indigo-600 font-bold">94%</span>
            </div>
            <div className="w-full bg-indigo-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-indigo-500" style={{ width: '94%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Percentage of system covered by AI models</p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Auto-Improvement Rate</span>
              <span className="text-purple-600 font-bold">87%</span>
            </div>
            <div className="w-full bg-purple-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-purple-500" style={{ width: '87%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Insights successfully applied to improve system</p>
          </div>
        </div>

        <div className="mt-6 bg-white bg-opacity-70 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">How Self-Learning Works</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Data Collection:</strong> Continuously monitors user behavior, system performance, and business metrics</li>
            <li>• <strong>Pattern Recognition:</strong> Uses ML models to identify trends, correlations, and anomalies in the data</li>
            <li>• <strong>Confidence Scoring:</strong> Each learning is validated against historical data before application</li>
            <li>• <strong>Auto-Implementation:</strong> High-confidence learnings (≥90%) are automatically applied to the system</li>
            <li>• <strong>Feedback Loop:</strong> Results are measured and fed back to improve future learning accuracy</li>
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-blue-700">
            Models training continuously · Next refresh in 45 sec
          </div>
          <button
            onClick={() => simulateLearning()}
            disabled={isLearning}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium disabled:opacity-50"
          >
            {isLearning ? 'Learning...' : 'Trigger Learning Cycle'}
          </button>
        </div>
      </div>

      {/* Overall Health */}
      <div className="mt-6 text-center p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
          <h3 className="font-semibold text-green-900">System Intelligence: Optimal</h3>
        </div>
        <p className="text-sm text-green-700">
          All {models.length} learning models operational · {recentLearnings} insights applied in last 24h · 
          Confidence avg: {((learnings.reduce((a, l) => a + l.confidence, 0) / learnings.length || 0)).toFixed(1)}%
        </p>
      </div>
    </div>
  );
}