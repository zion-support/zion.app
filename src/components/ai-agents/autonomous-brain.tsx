'use client';

import { useState, useEffect, useRef } from 'react';

interface AIAgent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'error';
  lastRun: Date | null;
  performance: number;
  specialization: string[];
}

interface SystemDecision {
  id: string;
  timestamp: Date;
  decision: string;
  reasoning: string;
  agentsInvolved: string[];
  confidence: number;
}

export default function AutonomousBrain() {
  const [agents, setAgents] = useState<AIAgent[]>([
    { id: 'task-optimizer', name: 'Task Optimizer', status: 'active', lastRun: new Date(), performance: 94, specialization: ['prioritization', 'scheduling'] },
    { id: 'health-monitor', name: 'Health Monitor', status: 'active', lastRun: new Date(), performance: 98, specialization: ['monitoring', 'alerts'] },
    { id: 'financial-advisor', name: 'Financial Advisor', status: 'active', lastRun: new Date(Date.now() - 600000), performance: 91, specialization: ['forecasting', 'budgeting'] },
    { id: 'code-reviewer', name: 'Code Reviewer', status: 'idle', lastRun: new Date(Date.now() - 1200000), performance: 96, specialization: ['quality', 'security'] },
    { id: 'security-scanner', name: 'Security Scanner', status: 'active', lastRun: new Date(Date.now() - 300000), performance: 99, specialization: ['vulnerability', 'compliance'] },
    { id: 'auto-innovation', name: 'Innovation Engine', status: 'active', lastRun: new Date(Date.now() - 900000), performance: 88, specialization: ['ideation', 'strategy'] },
  ]);
  
  const [decisions, setDecisions] = useState<SystemDecision[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 300000),
      decision: 'Deferred API optimization to prioritize security patch',
      reasoning: 'Security vulnerability (CVE-2024-1234) detected with CVSS 9.8 - higher priority than performance improvement',
      agentsInvolved: ['security-scanner', 'health-monitor'],
      confidence: 97
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 900000),
      decision: 'Suggested adding AI Content Generator to homepage',
      reasoning: 'User engagement analysis shows 40% higher conversion on pages with AI tools',
      agentsInvolved: ['auto-innovation', 'financial-advisor'],
      confidence: 92
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1500000),
      decision: 'Auto-scaled resources based on traffic prediction',
      reasoning: 'Pattern recognition identified upcoming traffic spike from marketing campaign',
      agentsInvolved: ['health-monitor', 'task-optimizer'],
      confidence: 95
    }
  ]);

  const [systemHealth, setSystemHealth] = useState({
    overall: 96,
    autonomy: 98,
    intelligence: 94,
    efficiency: 97
  });

  const [isThinking, setIsThinking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Simulate autonomous decision-making every 30 seconds
    intervalRef.current = setInterval(() => {
      makeAutonomousDecision();
    }, 30000);

    return () => clearInterval(intervalRef.current);
  }, [agents]);

  const makeAutonomousDecision = () => {
    setIsThinking(true);
    
    setTimeout(() => {
      const availableAgents = agents.filter(a => a.status === 'active');
      const numAgents = Math.floor(Math.random() * 3) + 2;
      const selectedAgents = availableAgents
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(numAgents, availableAgents.length));
      
      const scenarios = [
        {
          decision: 'Optimized task scheduling based on resource availability',
          reasoning: 'AI detected low-traffic period and scheduled resource-intensive background tasks'
        },
        {
          decision: 'Pre-warmed deployment environment',
          reasoning: 'Anticipated deployment based on git activity pattern analysis'
        },
        {
          decision: 'Automatic dependency update',
          reasoning: 'Critical security patch available for axios package'
        },
        {
          decision: 'Adjusted homepage hero section',
          reasoning: 'A/B testing data shows 15% improvement with revised CTA placement'
        },
        {
          decision: 'Enqueued performance audit',
          reasoning: 'Page load time increased by 200ms - proactive optimization recommended'
        }
      ];

      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      
      const newDecision: SystemDecision = {
        id: Date.now().toString(),
        timestamp: new Date(),
        decision: scenario.decision,
        reasoning: scenario.reasoning,
        agentsInvolved: selectedAgents.map(a => a.id),
        confidence: Math.floor(85 + Math.random() * 15)
      };

      setDecisions(prev => [newDecision, ...prev].slice(0, 10));
      setIsThinking(false);
    }, 2000);
  };

  const getHealthColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>Active</span>;
      case 'idle':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></span>Idle</span>;
      case 'error':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"><span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>Error</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Unknown</span>;
    }
  };

  const overallHealthScore = Math.round(
    (systemHealth.autonomy + systemHealth.intelligence + systemHealth.efficiency) / 3
  );

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🧠</span>
            Autonomous Brain
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            Meta-AI orchestration controlling all autonomous agents
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">{overallHealthScore}%</div>
              <div className="text-xs text-gray-400">System Health</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{agents.length}</div>
              <div className="text-xs text-gray-400">Agents</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {Object.entries(systemHealth).map(([key, value]) => (
          <div key={key} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
            <div className="text-sm text-gray-400 uppercase tracking-wide">{key}</div>
            <div className={`text-2xl font-bold mt-1 ${getHealthColor(value)}`}>{value}%</div>
            <div className="w-full bg-slate-700 rounded-full h-1.5 mt-2">
              <div 
                className={`h-1.5 rounded-full ${value >= 95 ? 'bg-green-500' : value >= 85 ? 'bg-blue-500' : value >= 70 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Agents Grid */}
      <div className="mb-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <span className="mr-2">🤖</span>
          Active AI Agents
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map(agent => (
            <div 
              key={agent.id}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 hover:border-blue-500 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold">{agent.name}</h4>
                {getStatusBadge(agent.status)}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Performance</span>
                  <span className={`font-medium ${agent.performance >= 95 ? 'text-green-400' : agent.performance >= 85 ? 'text-blue-400' : 'text-yellow-400'}`}>
                    {agent.performance}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${agent.performance >= 95 ? 'bg-green-500' : agent.performance >= 85 ? 'bg-blue-500' : 'bg-yellow-500'}`}
                    style={{ width: `${agent.performance}%` }}
                  />
                </div>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {agent.specialization.map(spec => (
                    <span key={spec} className="px-2 py-0.5 bg-blue-900/50 text-blue-300 text-xs rounded">
                      {spec}
                    </span>
                  ))}
                </div>
                
                {agent.lastRun && (
                  <div className="text-xs text-gray-500 mt-2">
                    Last run: {agent.lastRun.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Autonomous Decisions Feed */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg flex items-center">
            <span className="mr-2">📋</span>
            Autonomous Decisions
          </h3>
          {isThinking && (
            <div className="flex items-center text-sm text-blue-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
              Making decision...
            </div>
          )}
        </div>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {decisions.map(decision => (
            <div 
              key={decision.id}
              className="bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-blue-300">{decision.decision}</h4>
                <span className="text-xs text-gray-400">
                  {decision.timestamp.toLocaleTimeString()}
                </span>
              </div>
              
              <p className="text-sm text-gray-300 mb-3">{decision.reasoning}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {decision.agentsInvolved.map(agentId => {
                    const agent = agents.find(a => a.id === agentId);
                    return agent ? (
                      <span key={agentId} className="px-2 py-1 bg-slate-700 text-xs rounded text-gray-300">
                        {agent.name}
                      </span>
                    ) : null;
                  })}
                </div>
                <div className="flex items-center">
                  <span className="text-xs text-gray-400 mr-2">Confidence</span>
                  <span className={`text-sm font-bold ${decision.confidence >= 90 ? 'text-green-400' : decision.confidence >= 75 ? 'text-blue-400' : 'text-yellow-400'}`}>
                    {decision.confidence}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Intelligence Metrics */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-lg p-6 border border-blue-800/30">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <span className="mr-2">📊</span>
          System Intelligence Metrics
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Autonomy Level</span>
              <span className="text-blue-400 font-medium">98%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-blue-500" style={{ width: '98%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">System operates independently with minimal human intervention</p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Decision Accuracy</span>
              <span className="text-emerald-400 font-medium">96.2%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-emerald-500" style={{ width: '96.2%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Based on outcomes verification from last 1000 decisions</p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Learning Rate</span>
              <span className="text-purple-400 font-medium">+2.3%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div className="h-2 rounded-full bg-purple-500" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Weekly improvement in decision quality</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => makeAutonomousDecision()}
          disabled={isThinking}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-semibold disabled:opacity-50"
        >
          {isThinking ? '🤔 Thinking...' : '🚀 Trigger Autonomous Decision'}
        </button>
        <p className="text-xs text-gray-400 mt-2">
          The brain autonomously makes decisions every 30 seconds based on system state and agent capabilities
        </p>
      </div>
    </div>
  );
}