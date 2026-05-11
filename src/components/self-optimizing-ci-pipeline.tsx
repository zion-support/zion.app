'use client';

import React, { useState, useEffect } from 'react';

export default function SelfOptimizingCIPipeline() {
  const [optimizing, setOptimizing] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (optimizing) {
      timer = setTimeout(() => setOptimizing(false), 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [optimizing]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-emerald-800">
            <span className="text-3xl mr-2">🚀</span> Self-Optimizing CI Pipeline
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            AI-driven continuous integration with automated test optimization
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOptimizing(true)}
            className="px-4 py-2 bg-emerald-600 text-white rounded disabled:bg-emerald-400"
            disabled={optimizing}
          >
            {optimizing ? 'Optimizing...' : 'Optimize CI'}
          </button>
        </div>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Key Features</h3>
        <ul className="space-y-1">
          <li>AI-powered test selection and prioritization</li>
          <li>Automated dependency resolution and caching</li>
          <li>Real-time performance benchmarking</li>
          <li>Predictive failure analysis</li>
          <li>Zero-downtime deployment orchestration</li>
        </ul>
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Deployment Status</h3>
        <div className="flex items-center space-x-3">
          <div className={optimizing ? "w-8 h-2 bg-orange-500 rounded-full" : "w-8 h-2 bg-green-500 rounded-full"} />
          <span className="ml-2 font-medium">{optimizing ? 'Optimizing...' : 'Ready'}</span>
        </div>
      </div>
    </div>
  );
}