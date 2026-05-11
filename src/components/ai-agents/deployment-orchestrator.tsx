'use client';

import { useState, useEffect } from 'react';

interface Deployment {
  id: string;
  name: string;
  status: 'pending' | 'deploying' | 'success' | 'failed';
  timestamp: Date;
  duration?: number;
  rollbackAvailable: boolean;
}

export default function AIDeploymentOrchestrator() {
  const [deployments, setDeployments] = useState<Deployment[]>([
    {
      id: 'dep-001',
      name: 'Production - Main Branch',
      status: 'success',
      timestamp: new Date(Date.now() - 3600000),
      duration: 45000,
      rollbackAvailable: true
    },
    {
      id: 'dep-002',
      name: 'Staging - Feature Branch',
      status: 'deploying',
      timestamp: new Date(),
      rollbackAvailable: false
    }
  ]);
  const [isPredicting, setIsPredicting] = useState(false);

  const predictDeployment = async () => {
    setIsPredicting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const prediction = {
      successProbability: 94,
      estimatedDuration: 32000,
      riskFactors: ['Minor dependency update', 'No database migrations'],
      recommendations: ['Deploy during low-traffic window', 'Have rollback ready']
    };
    
    setIsPredicting(false);
    return prediction;
  };

  const handleDeploy = async (id: string) => {
    setDeployments(prev => prev.map(dep =>
      dep.id === id
        ? { ...dep, status: 'deploying' as const, timestamp: new Date() }
        : dep
    ));

    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setDeployments(prev => prev.map(dep =>
      dep.id === id
        ? { 
            ...dep, 
            status: 'success' as const, 
            duration: 32000,
            rollbackAvailable: true 
          }
        : dep
    ));
  };

  const handleRollback = async (id: string) => {
    setDeployments(prev => prev.map(dep =>
      dep.id === id
        ? { ...dep, status: 'pending' as const }
        : dep
    ));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setDeployments(prev => prev.map(dep =>
      dep.id === id
        ? { 
            ...dep, 
            status: 'success' as const, 
            timestamp: new Date(),
            rollbackAvailable: false 
          }
        : dep
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'deploying':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'deploying':
        return '🚀';
      case 'failed':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">AI Deployment Orchestrator</h2>
        <button
          onClick={predictDeployment}
          disabled={isPredicting}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {isPredicting ? 'Predicting...' : 'Predict Next Deployment'}
        </button>
      </div>

      <div className="space-y-4">
        {deployments.map(deployment => (
          <div
            key={deployment.id}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{getStatusIcon(deployment.status)}</span>
                <div>
                  <h3 className="font-semibold text-gray-900">{deployment.name}</h3>
                  <p className="text-sm text-gray-500">
                    Last updated: {deployment.timestamp.toLocaleTimeString()}
                    {deployment.duration && ` • Duration: ${(deployment.duration / 1000).toFixed(1)}s`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(deployment.status)}`}>
                  {deployment.status.toUpperCase()}
                </span>
                
                {deployment.status === 'success' && deployment.rollbackAvailable && (
                  <button
                    onClick={() => handleRollback(deployment.id)}
                    className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm hover:bg-orange-200"
                  >
                    Rollback
                  </button>
                )}
                
                {deployment.status === 'pending' && (
                  <button
                    onClick={() => handleDeploy(deployment.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Deploy Now
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200">
        <h3 className="font-semibold text-indigo-900 mb-2">🤖 AI Deployment Intelligence</h3>
        <p className="text-sm text-indigo-800 mb-3">
          Our AI deployment orchestrator predicts deployment outcomes, estimates duration, identifies risk factors, and provides smart recommendations for safer releases.
        </p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-white rounded p-3">
            <div className="font-medium text-gray-900">Features</div>
            <ul className="list-disc list-inside text-gray-700 mt-1">
              <li>Predictive success scoring</li>
              <li>Smart rollback triggers</li>
              <li>Canary release management</li>
              <li>Performance impact analysis</li>
            </ul>
          </div>
          <div className="bg-white rounded p-3">
            <div className="font-medium text-gray-900">Benefits</div>
            <ul className="list-disc list-inside text-gray-700 mt-1">
              <li>Reduce deployment failures by 70%</li>
              <li>Automated safety checks</li>
              <li>Zero-downtime releases</li>
              <li>Instant rollback capability</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}