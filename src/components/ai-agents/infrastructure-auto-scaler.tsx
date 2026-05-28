'use client';

import { useState, useEffect } from 'react';

interface ScaleEvent {
  timestamp: Date;
  action: 'scale-up' | 'scale-down' | 'maintain';
  reason: string;
  resourcesAffected: string[];
  capacityChange: number;
  confidence: number;
  status: 'proposed' | 'applied' | 'monitored' | 'reverted';
}

interface InfrastructureMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  activeConnections: number;
  queueLength: number;
  errorRate: number;
  availableCapacity: number;
}

interface ScalingAlgorithm {
  name: string;
  type: 'queue-based' | 'threshold-based' | 'predictive' | 'learning-based';
  parameters: Record<string, number>;
}

export default function InfrastructureAutoScaler() {
  const [scaleEvents, setScaleEvents] = useState<ScaleEvent[]>([]);
  const [metrics, setMetrics] = useState<InfrastructureMetrics>({
    cpuUsage: 45,
    memoryUsage: 55,
    networkLatency: 67,
    activeConnections: 2400,
    queueLength: 12,
    errorRate: 0.015,
    availableCapacity: 85,
  });
  const [algorithms, setAlgorithms] = useState<ScalingAlgorithm[]>([
    {
      name: 'Dynamic Queue Throttler',
      type: 'queue-based',
      parameters: { threshold: 15, maxConcurrency: 100 },
    },
    {
      name: 'CPU-Aware Autoscaler',
      type: 'threshold-based',
      parameters: { threshold: 85, minNodes: 2, maxNodes: 10, scaleRate: 2 },
    },
    {
      name: 'Predictive Traffic Forecast',
      type: 'predictive',
      parameters: { horizonHours: 24, confidence: 0.92 },
    },
    {
      name: 'Learning-Based Adaptive Router',
      type: 'learning-based',
      parameters: { batchSize: 32, learningRate: 0.001, epochs: 100 },
    },
  ]);
  const [isScaling, setIsScaling] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(95);
  const [mockSuccessRate, setMockSuccessRate] = useState(92);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate live monitoring & auto-scaling decisions
      if (Math.random() > 0.7) {
        setScaleEvents(prev => [
          ...prev,
          {
            timestamp: new Date(),
            action: Math.random() > 0.5 ? 'scale-up' : 'scale-down',
            reason: 'Auto-detected resource saturation based on predictive metrics',
            resourcesAffected: ['Load Balancer', 'Web Servers'],
            capacityChange: Math.floor(Math.random() * 3) + 1,
            confidence: 96,
            status: 'applied',
          }
        ]).slice(-5);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const triggerScaling = async (action: 'scale-up' | 'scale-down') => {
    setIsScaling(true);
    setTimeout(() => {
      setIsScaling(false);
      // Simulate successful scaling operation
      setMockSuccessRate(prev => Math.min(100, prev + (action === 'scale-up' ? 3 : -2)));
    }, 2500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'text-green-600';
      case 'monitored': return 'text-blue-600';
      case 'reverted': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getAlgorithmColor = (type: string) => {
    switch (type) {
      case 'queue-based': return 'bg-indigo-100 text-indigo-800';
      case 'threshold-based': return 'bg-amber-100 text-amber-800';
      case 'predictive': return 'bg-green-100 text-green-800';
      case 'learning-based': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-300 text-gray-800';
    }
  };

  const upcomingDecisions = [
    'Implement predictive load balancing based on user geolocation patterns',
    'Automate database sharding based on query volume predictions',
    'Introduce auto-healing circuit breaker patterns',
    'Implement zero-downtime deployment orchestration',
    'Add auto-configuration of CDN cache policies',
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">⚙️</span>
            Infrastructure Auto-Scaling Engine
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Autonomous infrastructure management for optimal performance and cost efficiency
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => triggerScaling('scale-up')}
            disabled={isScaling}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-lime-600 text-white rounded-lg hover:from-emerald-700 hover:to-lime-700 font-medium disabled:opacity-50"
          >
            {isScaling ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Scaling Infrastructure...
              </span>
            ) : (
              '⚡ Optimize Resources'
            )}
          </button>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">
              {metrics.availableCapacity}%
            </div>
            <div className="text-xs text-gray-500">Available Capacity</div>
          </div>
        </div>
      </div>

      {/* Scale Events Feed */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-2 flex items-center">
          <span className="mr-2">📌</span>
          Recent Scaling Actions
        </h3>
        
        <div className="max-h-80 overflow-y-auto space-y-3">
          {scaleEvents.map(event => (
            <div
              key={event.timestamp.toISOString()}
              className="border rounded-lg p-3 hover:shadow-md bg-white"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{event.action.toUpperCase()}</h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {event.reason}
                  </p>
                </div>
                <span 
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    event.status === 'applied' 
                      ? 'bg-green-100 text-green-800' 
                      : event.status === 'monitored'
                        ? 'bg-blue-100 text-blue-800' 
                        : event.status === 'reverted'
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {event.status}
                </span>
              </div>
              
              <div className="mt-2 flex flex-col gap-1 text-xs">
                <div>Resources: {event.resourcesAffected.join(', ')}</div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">Capacity: {event.capacityChange}%</span>
                  <span className={`ml-1 text-sm ${event.capacityChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {event.capacityChange >= 0 ? '+' : ''}
                    {event.capacityChange}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Confidence: {event.confidence}%</span>
                  <span className="ml-1">
                    <span className={`text-xs rounded px-2 py-0.5 ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Algorithms Configuration */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-3 flex items-center">
          <span className="mr-2">🤖</span>
          Active Scaling Algorithms
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {algorithms.map(alg => (
            <div
              key={alg.name}
              className="bg-gray-50 rounded-lg p-4 border border-gray-100 hover:shadow-sm transition flex flex-col"
            >
              <div className="flex flex-col items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getAlgorithmColor(alg.type)}`}>
                  {alg.type}
                </span>
                <div className="font-medium text-gray-800">{alg.name}</div>
              </div>
              
              <div className="flex-1 mt-2">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {alg.parameters.threshold !== undefined
                    ? `Threshold: ${alg.parameters.threshold}`
                    : 'Parameter configuration not set'}
                  <br />
                  {alg.parameters.maxConcurrency !== undefined
                    ? `Max Concurrency: ${alg.parameters.maxConcurrency}`
                    : ''}
                  <br />
                  <span className="text-xs text-gray-400">
                    {alg.parameters.learningRate !== undefined 
                      ? `Learning Rate: ${alg.parameters.learningRate}`
                      : ''}
                  </span>
                </p>
              </div>
              
              {alg.name.includes('Predictive') && (
                <div className="mt-2 flex items-center gap-2 bg-green-50 rounded px-2 py-1 text-xs">
                  <span className="text-green-600">✅ Recommended</span>
                  <span className="ml-2 text-green-600">AI-optimized horizon detected</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Metrics */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <span className="mr-2">📊</span>
          Confidence & System Intelligence
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Model Accuracy</span>
              <span className="text-indigo-600 font-bold">94.7%</span>
            </div>
            <div className="w-full bg-indigo-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-indigo-500" style={{ width: '95%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Predictive scaling precision across all environments
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Auto-Resolution Rate</span>
              <span className="text-blue-600 font-bold">{mockSuccessRate}%</span>
            </div>
            <div className="w-full bg-blue-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: `${Math.min(100, mockSuccessRate)}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Percentage of scaling actions requiring no human intervention
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">System Health</span>
              <span className="text-green-600 font-bold">Optimal</span>
            </div>
            <div className="w-full bg-green-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-green-500" style={{ width: '99%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Uptime-stable operations across all services
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-white bg-opacity-70 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Scaling Decision Process</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li><strong>Real-time Monitoring:</strong> Continuously tracks 100+ infrastructure metrics</li>
            <li><strong>Predictive Analysis:</strong> Uses ML models trained on historical load patterns</li>
            <li><strong>Multi-tier Evaluation:</strong> Assesses impact, risk, and cost for each action</li>
            <li><strong>Automated Execution:</strong> Updates cloud resources via IaC without human intervention</li>
            <li><strong>Feedback Loop:</strong> Measures outcomes and refines future decisions</li>
          </ul>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-blue-700">
            <span className="font-semibold">Next Evaluation:</span> In 30 seconds · High-confidence auto-scaling enabled
          </div>
          <div className="flex items-center gap-2">
            <div className="animate-pulse w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-blue-600">Optimizing infrastructure autonomously</span>
          </div>
        </div>
      </div>
    </div>
  );
}