'use client';

import { useState, useEffect } from 'react';

interface KnowledgeNode {
  id: string;
  relevance: number;
  connections: number;
  lastAccess: number;
}

interface GraphMetric {
  totalNodes: number;
  edges: number;
  clustering: number;
  density: number;
}

export default function DynamicKnowledgeGraphEngine() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([
    { id: 'quantum-computing', relevance: 94.2, connections: 47, lastAccess: Date.now() - 120000 },
    { id: 'neural-networks', relevance: 89.7, connections: 38, lastAccess: Date.now() - 240000 },
    { id: 'fractal-theory', relevance: 82.4, connections: 29, lastAccess: Date.now() - 180000 },
    { id: 'entropy-optimization', relevance: 76.8, connections: 21, lastAccess: Date.now() - 300000 },
    { id: 'consciousness-models', relevance: 71.3, connections: 15, lastAccess: Date.now() - 420000 }
  ]);

  const [metrics, setMetrics] = useState<GraphMetric>({
    totalNodes: 2847,
    edges: 12894,
    clustering: 0.847,
    density: 0.0032
  });

  const [evolution, setEvolution] = useState({ cycles: 847, growth: 12.4 });

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        relevance: Math.min(100, Math.max(30, n.relevance + (Math.random() - 0.4) * 3)),
        connections: Math.max(1, n.connections + Math.floor(Math.random() * 5) - 2),
        lastAccess: Date.now()
      })));

      setMetrics(prev => ({
        totalNodes: prev.totalNodes + Math.floor(Math.random() * 20),
        edges: prev.edges + Math.floor(Math.random() * 50),
        clustering: Math.min(1, Math.max(0.5, prev.clustering + (Math.random() - 0.5) * 0.02)),
        density: Math.min(0.01, Math.max(0.001, prev.density + (Math.random() - 0.5) * 0.0002))
      }));

      setEvolution(prev => ({
        cycles: prev.cycles + 1,
        growth: Math.max(0, prev.growth + (Math.random() - 0.5) * 2)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-white to-teal-50 rounded-xl shadow-lg border border-teal-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-teal-900">
            <span className="text-3xl mr-2">🔗</span> Dynamic Knowledge Graph Engine
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Self-evolving knowledge connections with relevance scoring
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
            {metrics.totalNodes.toLocaleString()} Nodes
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-teal-100">
          <h3 className="font-semibold text-teal-800 mb-3">Active Knowledge Nodes</h3>
          <div className="space-y-3">
            {nodes.map((node, idx) => (
              <div key={node.id} className="p-3 bg-teal-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800 capitalize text-sm">{node.id.replace(/-/g, ' ')}</span>
                  <span className="text-sm font-bold text-teal-700">{node.relevance.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{node.connections} connections</span>
                  <span>{Math.floor((Date.now() - node.lastAccess) / 60000)}m ago</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-teal-100">
          <h3 className="font-semibold text-teal-800 mb-3">Graph Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <span className="text-gray-700">Total Edges</span>
              <span className="text-lg font-bold text-teal-700">{metrics.edges.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <span className="text-gray-700">Clustering Coeff</span>
              <span className="text-lg font-bold text-teal-700">{(metrics.clustering * 100).toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <span className="text-gray-700">Graph Density</span>
              <span className="text-lg font-bold text-teal-700">{(metrics.density * 100).toFixed(2)}%</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
              <span className="text-gray-700">Evolution Cycles</span>
              <span className="text-lg font-bold text-teal-700">{evolution.cycles}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-teal-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Graph Growth:</span>
          <span className="font-semibold text-teal-800">{evolution.growth.toFixed(1)}% / cycle</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Status:</span>
          <span className="text-teal-600 font-semibold">Self-Evolving</span>
        </div>
      </div>
    </div>
  );
}
