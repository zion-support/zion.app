'use client';

import { useState, useEffect } from 'react';

interface ResourceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  gpuUtilization?: number;
}

interface OptimizationJob {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  type: 'cpu-tune' | 'memory-optimize' | 'disk-cleanup' | 'network-optimize' | 'gpu-boost';
  priority: 'low' | 'medium' | 'high';
  efficiencyGain: number;
  completionTime: Date;
}

export default function ResourceOptimizer() {
  const [metrics, setMetrics] = useState<ResourceMetrics>({
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
    networkIn: 100,
    networkOut: 50,
  });
  const [jobs, setJobs] = useState<OptimizationJob[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics({
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        diskUsage: Math.random() * 100,
        networkIn: Math.random() * 1000,
        networkOut: Math.random() * 500,
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const runOptimization = () => {
    setIsOptimizing(true);
    const newJobs: OptimizationJob[] = [
      {
        id: '1',
        name: 'CPU Tuning',
        description: 'Optimize CPU allocation for better performance',
        status: 'completed',
        type: 'cpu-tune',
        priority: 'high',
        efficiencyGain: 15,
        completionTime: new Date(),
      },
      {
        id: '2',
        name: 'Memory Optimization',
        description: 'Reduce memory footprint by clearing unused allocations',
        status: 'in-progress',
        type: 'memory-optimize',
        priority: 'medium',
        efficiencyGain: 10,
        completionTime: new Date(),
      },
    ];
    setJobs(newJobs);
    setTimeout(() => setIsOptimizing(false), 2000);
  };

  const getMetricColor = (value: number) => {
    if (value < 50) return 'text-green-600';
    if (value < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">⚡</span>
            Resource Optimizer
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered resource optimization and performance tuning
          </p>
        </div>
        <button
          onClick={runOptimization}
          disabled={isOptimizing}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium disabled:opacity-50"
        >
          {isOptimizing ? 'Optimizing...' : '🚀 Run Optimization'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">CPU Usage</div>
          <div className={`text-2xl font-bold ${getMetricColor(metrics.cpuUsage)}`}>
            {metrics.cpuUsage.toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Memory</div>
          <div className={`text-2xl font-bold ${getMetricColor(metrics.memoryUsage)}`}>
            {metrics.memoryUsage.toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Disk</div>
          <div className={`text-2xl font-bold ${getMetricColor(metrics.diskUsage)}`}>
            {metrics.diskUsage.toFixed(1)}%
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Network In</div>
          <div className="text-2xl font-bold text-blue-600">
            {metrics.networkIn.toFixed(0)} MB/s
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Network Out</div>
          <div className="text-2xl font-bold text-purple-600">
            {metrics.networkOut.toFixed(0)} MB/s
          </div>
        </div>
      </div>

      {jobs.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3">Optimization Results</h3>
          <div className="space-y-2">
            {jobs.map(job => (
              <div key={job.id} className="flex items-center justify-between bg-white rounded p-3">
                <div>
                  <div className="font-medium">{job.name}</div>
                  <div className="text-sm text-gray-600">{job.description}</div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    job.status === 'completed' ? 'bg-green-100 text-green-800' :
                    job.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                  <div className="text-sm text-green-600 mt-1">
                    +{job.efficiencyGain}% efficiency
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
