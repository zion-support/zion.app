'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'completed';
  role: string;
  efficiency: number;
  lastActive: string;
}

export default function MultiAgentCoordinator() {
  const [agents, setAgents] = useState<Agent[]>([
    {
      id: 'agent-001',
      name: 'Quantum Crypto Agent',
      status: 'active',
      role: 'Security & Encryption',
      efficiency: 98,
      lastActive: '2 minutes ago'
    },
    {
      id: 'agent-002',
      name: 'Self-Healing System',
      status: 'active',
      role: 'System Recovery',
      efficiency: 97,
      lastActive: '5 minutes ago'
    },
    {
      id: 'agent-003',
      name: 'Learning Engine',
      status: 'active',
      role: 'Knowledge Acquisition',
      efficiency: 95,
      lastActive: '3 minutes ago'
    },
    {
      id: 'agent-004',
      name: 'Innovation Agent',
      status: 'pending',
      role: 'Idea Generation',
      efficiency: 0,
      lastActive: 'Never'
    },
    {
      id: 'agent-005',
      name: 'Performance Analyzer',
      status: 'pending',
      role: 'Optimization',
      efficiency: 0,
      lastActive: 'Never'
    }
  ]);

  const [coordinatorStatus, setCoordinatorStatus] = useState({
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    avgEfficiency: 0,
    coordinationScore: 94
  });

  // Simulate autonomous coordination
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => {
        const updated = prev.map(agent => {
          if (agent.status === 'pending' && Math.random() > 0.7) {
            return {
              ...agent,
              status: 'active',
              efficiency: Math.floor(Math.random() * 10) + 90,
              lastActive: 'Just now'
            };
          }
          return agent;
        });
        
        setCoordinatorStatus({
          totalAgents: updated.length,
          activeAgents: updated.filter(a => a.status === 'active').length,
          avgEfficiency: Math.round(updated.filter(a => a.status === 'active').reduce((sum, a) => sum + a.efficiency, 0) / Math.max(1, updated.filter(a => a.status === 'active').length)),
          coordinationScore: 92 + Math.floor(Math.random() * 8)
        });
        
        return updated;
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 95) return 'text-green-600';
    if (efficiency >= 90) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg border border-purple-100">
      <div className="mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span>🤝</span> Multi-Agent Coordination Framework
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Autonomous coordination across distributed AI agents for optimal performance
        </p>
      </div>

      {/* Coordinator Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">{coordinatorStatus.activeAgents}/{coordinatorStatus.totalAgents}</div>
          <div className="text-xs text-purple-500">Active Agents</div>
        </div>
        <div className="bg-indigo-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-indigo-600">{coordinatorStatus.avgEfficiency}%</div>
          <div className="text-xs text-indigo-500">Avg Efficiency</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-emerald-600">{coordinatorStatus.coordinationScore}%</div>
          <div className="text-xs text-emerald-500">Coordination</div>
        </div>
        <div className="bg-amber-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-amber-600">Auto</div>
          <div className="text-xs text-amber-500">Scheduling</div>
        </div>
      </div>

      {/* Agent Status Grid */}
      <div className="grid gap-3">
        <h3 className="text-sm font-semibold text-gray-700">Agent Status</h3>
        {agents.map(agent => (
          <div key={agent.id} className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium text-gray-800">{agent.name}</div>
                  <div className="text-xs text-gray-500">{agent.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {agent.status}
                  </span>
                  {agent.status === 'active' && (
                    <div className={`text-xs font-medium ${getEfficiencyColor(agent.efficiency)} mt-1`}>
                      {agent.efficiency}% efficiency
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {agent.lastActive}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Coordination Insights */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
        <h3 className="text-sm font-semibold text-purple-800 mb-2">Coordination Insights</h3>
        <ul className="text-sm text-purple-700 space-y-1">
          <li>• Agents self-organize based on workload distribution</li>
          <li>• Dynamic resource allocation across all services</li>
          <li>• Real-time efficiency optimization with predictive scheduling</li>
          <li>• Autonomous failure detection and agent redeployment</li>
        </ul>
      </div>
    </div>
  );
}