'use client';

import React from 'react';

interface GraphNode {
  id: string;
  label: string;
  type: 'ai-agent' | 'service' | 'data' | 'user';
  connections: number;
  activity: number;
}

interface GraphEdge {
  from: string;
  to: string;
  weight: number;
  label: string;
}

const nodes: GraphNode[] = [
  { id: 'brain', label: 'Autonomous Brain', type: 'ai-agent', connections: 34, activity: 98 },
  { id: 'learning', label: 'Learning Engine', type: 'ai-agent', connections: 12, activity: 95 },
  { id: 'quantum', label: 'Quantum Crypto', type: 'service', connections: 8, activity: 100 },
  { id: 'healing', label: 'Self-Healing System', type: 'ai-agent', connections: 15, activity: 97 },
  { id: 'pipeline', label: 'CI/CD Pipeline', type: 'service', connections: 10, activity: 99 },
  { id: 'graph', label: 'Knowledge Graph', type: 'data', connections: 45, activity: 92 },
  { id: 'dashboard', label: 'Improvement Dashboard', type: 'service', connections: 6, activity: 94 },
  { id: 'innovation', label: 'Innovation Agent', type: 'ai-agent', connections: 9, activity: 96 },
  { id: 'pm2', label: 'PM2 Orchestrator', type: 'service', connections: 34, activity: 100 },
  { id: 'deploy', label: 'Deploy Orchestrator', type: 'service', connections: 7, activity: 93 },
];

export default function AutonomousKnowledgeGraph() {
  const getTypeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'ai-agent': return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      case 'service': return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'data': return 'bg-amber-100 text-amber-700 border-amber-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const connections: GraphEdge[] = [
    { from: 'brain', to: 'learning', weight: 0.95, label: 'controls' },
    { from: 'brain', to: 'quantum', weight: 0.90, label: 'secures' },
    { from: 'brain', to: 'healing', weight: 0.88, label: 'coordinates' },
    { from: 'brain', to: 'graph', weight: 0.92, label: 'updates' },
    { from: 'learning', to: 'graph', weight: 0.97, label: 'trains' },
    { from: 'healing', to: 'pm2', weight: 0.99, label: 'monitors' },
    { from: 'healing', to: 'pipeline', weight: 0.85, label: 'protects' },
    { from: 'deploy', to: 'pipeline', weight: 0.93, label: 'orchestrates' },
    { from: 'deploy', to: 'quantum', weight: 0.80, label: 'secures' },
    { from: 'innovation', to: 'learning', weight: 0.87, label: 'feeds' },
    { from: 'innovation', to: 'brain', weight: 0.91, label: 'reports' },
    { from: 'dashboard', to: 'brain', weight: 0.89, label: 'displays' },
    { from: 'dashboard', to: 'pm2', weight: 0.94, label: 'shows' },
    { from: 'quantum', to: 'pipeline', weight: 0.86, label: 'protects' },
    { from: 'quantum', to: 'deploy', weight: 0.84, label: 'signs' },
  ];

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>🧠</span> Autonomous Knowledge Graph
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Real-time topology of AI agents, services, and data with relationship mapping
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-indigo-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-indigo-600">{nodes.length}</div>
          <div className="text-xs text-indigo-500">Active Nodes</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-600">{connections.length}</div>
          <div className="text-xs text-emerald-500">Relationships</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-600">
            {Math.round(nodes.reduce((a, b) => a + b.activity, 0) / nodes.length)}%
          </div>
          <div className="text-xs text-amber-500">Avg Activity</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">34</div>
          <div className="text-xs text-purple-500">PM2 Agents</div>
        </div>
      </div>

      {/* Node Map */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-6">
        {nodes.map(node => (
          <div key={node.id} className={`rounded-lg p-3 border ${getTypeColor(node.type)}`}>
            <div className="font-semibold text-sm">{node.label}</div>
            <div className="text-xs mt-1 opacity-75">{node.connections} connections</div>
            <div className="w-full bg-gray-300 rounded-full h-1.5 mt-2">
              <div
                className={`h-1.5 rounded-full ${node.activity >= 95 ? 'bg-green-500' : node.activity >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${node.activity}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Top Relationships */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-sm mb-3">Key Relationships</h3>
        <div className="space-y-2">
          {connections
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 6)
            .map((edge, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600 font-mono">{nodes.find(n => n.id === edge.from)?.label}</span>
                  <span className="text-gray-400">→</span>
                  <span className="text-gray-600 font-mono">{nodes.find(n => n.id === edge.to)?.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded">{edge.label}</span>
                  <span className="text-xs font-mono text-indigo-600 w-10 text-right">{Math.round(edge.weight * 100)}%</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
