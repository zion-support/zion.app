'use client';

import { useState, useEffect } from 'react';

interface ModelMetrics {
  accuracy: number;
  loss: number;
  trainingTime: number;
  inferenceLatency: number;
  confidence: number;
}

interface LearningCycle {
  id: string;
  timestamp: string;
  modelId: string;
  metrics: ModelMetrics;
  adjustments: string[];
  improvement: number;
}

export default function AutonomousLearningEngine() {
  const [cycles, setCycles] = useState<LearningCycle[]>([]);
  const [isLearning, setIsLearning] = useState(false);
  const [globalMetrics, setGlobalMetrics] = useState({
    modelsOptimized: 0,
    avgImprovement: 0,
    totalCycles: 0,
    activeLearning: false
  });

  useEffect(() => {
    // Initialize with sample data
    const sampleCycles: LearningCycle[] = [
      {
        id: 'cycle-001',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        modelId: 'predictive-analytics',
        metrics: {
          accuracy: 0.94,
          loss: 0.12,
          trainingTime: 245,
          inferenceLatency: 23,
          confidence: 0.91
        },
        adjustments: ['Adjusted learning rate', 'Increased batch size', 'Added dropout'],
        improvement: 3.2
      },
      {
        id: 'cycle-002',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        modelId: 'task-optimizer',
        metrics: {
          accuracy: 0.89,
          loss: 0.18,
          trainingTime: 180,
          inferenceLatency: 15,
          confidence: 0.87
        },
        adjustments: ['Optimized architecture', 'Reduced parameters', 'Added regularization'],
        improvement: 2.1
      }
    ];
    setCycles(sampleCycles);
    setGlobalMetrics({
      modelsOptimized: 12,
      avgImprovement: 2.4,
      totalCycles: 147,
      activeLearning: true
    });
  }, []);

  const startLearningCycle = async () => {
    if (isLearning) return;
    
    setIsLearning(true);
    
    // Simulate autonomous learning cycle
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newCycle: LearningCycle = {
      id: `cycle-${Date.now()}`,
      timestamp: new Date().toISOString(),
      modelId: 'autonomous-brain',
      metrics: {
        accuracy: 0.97 + Math.random() * 0.02,
        loss: 0.08 + Math.random() * 0.04,
        trainingTime: 120 + Math.floor(Math.random() * 60),
        inferenceLatency: 12 + Math.floor(Math.random() * 8),
        confidence: 0.94 + Math.random() * 0.05
      },
      adjustments: [
        'Dynamic learning rate adjustment',
        'Gradient clipping optimization',
        'Attention mechanism refinement'
      ],
      improvement: 1.5 + Math.random() * 2.5
    };
    
    setCycles(prev => [newCycle, ...prev].slice(0, 10));
    setGlobalMetrics(prev => ({
      ...prev,
      totalCycles: prev.totalCycles + 1,
      avgImprovement: (prev.avgImprovement * prev.totalCycles + newCycle.improvement) / (prev.totalCycles + 1)
    }));
    
    setIsLearning(false);
  };

  const getStatusColor = (value: number, threshold: number) => {
    return value >= threshold ? '#4CAF50' : value >= threshold * 0.8 ? '#FF9800' : '#F44336';
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🧠</span>
            Autonomous Learning Engine
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Self-improving AI models with continuous optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${globalMetrics.activeLearning ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {globalMetrics.activeLearning ? '● Learning Active' : '○ Learning Paused'}
          </div>
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <div className="text-2xl font-bold text-blue-600">{globalMetrics.modelsOptimized}</div>
          <div className="text-sm text-blue-800">Models Optimized</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <div className="text-2xl font-bold text-green-600">{globalMetrics.avgImprovement.toFixed(1)}%</div>
          <div className="text-sm text-green-800">Avg Improvement</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <div className="text-2xl font-bold text-purple-600">{globalMetrics.totalCycles}</div>
          <div className="text-sm text-purple-800">Learning Cycles</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
          <div className="text-2xl font-bold text-orange-600">{cycles.length}</div>
          <div className="text-sm text-orange-800">Recent Cycles</div>
        </div>
      </div>

      {/* Learning Control */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={startLearningCycle}
          disabled={isLearning}
          className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 flex items-center gap-2"
        >
          {isLearning ? (
            <>
              <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
              <span>Optimizing...</span>
            </>
          ) : (
            <>
              <span>🚀</span>
              <span>Start Learning Cycle</span>
            </>
          )}
        </button>
        <div className="text-sm text-gray-600">
          Last cycle: {cycles.length > 0 ? new Date(cycles[0].timestamp).toLocaleTimeString() : 'Never'}
        </div>
      </div>

      {/* Recent Cycles */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-800 mb-2">Recent Learning Cycles</h3>
        {cycles.slice(0, 5).map(cycle => (
          <div key={cycle.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-medium text-gray-800">Model: {cycle.modelId}</div>
                <div className="text-sm text-gray-500">{new Date(cycle.timestamp).toLocaleString()}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${cycle.improvement > 2 ? 'text-green-600' : cycle.improvement > 1 ? 'text-blue-600' : 'text-orange-600'}`}>
                  +{cycle.improvement.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">improvement</div>
              </div>
            </div>
            
            <div className="grid grid-cols-5 gap-2 mb-3 text-sm">
              <div>
                <span className="text-gray-600">Accuracy:</span>
                <div className="font-medium" style={{ color: getStatusColor(cycle.metrics.accuracy, 0.95) }}>
                  {(cycle.metrics.accuracy * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-gray-600">Loss:</span>
                <div className="font-medium" style={{ color: getStatusColor(1 - cycle.metrics.loss, 0.85) }}>
                  {cycle.metrics.loss.toFixed(3)}
                </div>
              </div>
              <div>
                <span className="text-gray-600">Training:</span>
                <div className="font-medium text-gray-800">{cycle.metrics.trainingTime}s</div>
              </div>
              <div>
                <span className="text-gray-600">Latency:</span>
                <div className="font-medium text-gray-800">{cycle.metrics.inferenceLatency}ms</div>
              </div>
              <div>
                <span className="text-gray-600">Confidence:</span>
                <div className="font-medium" style={{ color: getStatusColor(cycle.metrics.confidence, 0.9) }}>
                  {(cycle.metrics.confidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {cycle.adjustments.map((adj, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {adj}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Capabilities */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100 p-6">
        <h3 className="font-semibold text-purple-800 mb-3 flex items-center">
          <span className="mr-2">⚡</span>
          Autonomous Learning Capabilities
        </h3>
        <ul className="text-sm text-purple-900 space-y-2">
          <li><strong>Continuous Optimization:</strong> Models self-improve through gradient-based meta-learning</li>
          <li><strong>Federated Learning:</strong> Knowledge is shared across distributed agents without data leakage</li>
          <li><strong>Bayesian Hyperparameter Tuning:</strong> Automatic search for optimal model configurations</li>
          <li><strong>Neural Architecture Search:</strong> AI designs better AI architectures autonomously</li>
          <li><strong>Transfer Learning:</strong> Knowledge transfers between related tasks automatically</li>
        </ul>
      </div>
    </div>
  );
}