'use client';

import { useState, useEffect, useRef } from 'react';

interface SkillTreeNode {
  id: string;
  type: 'data' | 'transformer' | 'generator' | 'interpreter' | 'validator';
  name: string;
  description: string;
  strengths: string[];
  dependencies: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  confidence: number;
  autoRun?: boolean;
}

interface SkillExecution {
  id: string;
  nodeId: string;
  status: 'waiting' | 'running' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  output: string;
  metrics: Record<string, number>;
}

export default function SkillOrchestrator() {
  const [nodes, setNodes] = useState<SkillTreeNode[]>([
    {
      id: 'data-collection',
      type: 'data',
      name: 'Data Collector',
      description: 'Scrapes and aggregates external APIs for fresh data',
      strengths: ['API Integration', 'Web Scraping', 'API Authentication'],
      dependencies: [],
      difficulty: 'beginner',
      confidence: 95
    },
    {
      id: 'data-validation',
      type: 'validator',
      name: 'Data Validator',
      description: 'Ensures data quality and consistency',
      strengths: ['Schema Validation', 'Anomaly Detection', 'Normalization'],
      dependencies: ['data-collection'],
      difficulty: 'intermediate',
      confidence: 92
    },
    {
      id: 'pattern-analyzer',
      type: 'transformer',
      name: 'Pattern Analyzer',
      description: 'Identifies data patterns and generates insights',
      strengths: ['ML Inference', 'Statistical Analysis', 'Visualization'],
      dependencies: ['data-validation'],
      difficulty: 'advanced',
      confidence: 89
    },
    {
      id: 'strategy-generator',
      type: 'generator',
      name: 'Strategy Generator',
      description: 'Creates execution strategies based on pattern analysis',
      strengths: ['Strategy Planning', 'Risk Assessment', 'Prioritization'],
      dependencies: ['pattern-analyzer'],
      difficulty: 'advanced',
      confidence: 87
    },
    {
      id: 'execution-manager',
      type: 'interpreter',
      name: 'Execution Manager',
      description: 'Runs selected strategies and monitors performance',
      strengths: ['Orchestration', 'Resource Allocation', 'Error Handling'],
      dependencies: ['strategy-generator'],
      difficulty: 'intermediate',
      confidence: 90
    },
    {
      id: 'skill-tuner',
      type: 'validator',
      name: 'Skill Tuner',
      description: 'Optimizes skill parameters based on performance feedback',
      strengths: ['Hyperparameter Tuning', 'A/B Testing', 'Performance Tuning'],
      dependencies: ['execution-manager'],
      difficulty: 'advanced',
      confidence: 91
    },
    {
      id: 'feedback-collector',
      type: 'interpreter',
      name: 'Feedback Collector',
      description: 'Gathers user and system feedback to improve future executions',
      strengths: ['Feedback Analysis', 'Sentiment Analysis', 'Recommendation Generation'],
      dependencies: ['execution-manager'],
      difficulty: 'beginner',
      confidence: 88
    },
    {
      id: 'auto-improvement',
      type: 'generator',
      name: 'Auto-Improvement Suggester',
      description: 'Suggests new skills or improvements based on historical performance',
      strengths: ['Skill Development', 'Innovation Suggestions', 'Future Planning'],
      dependencies: ['feedback-collector', 'strategy-generator'],
      difficulty: 'advanced',
      confidence: 93
    }
  ]);

  const [executions, setExecutions] = useState<SkillExecution[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<any>(null);

  // Create visualization data
  useEffect(() => {
    const nodesForGraph = nodes.map(node => ({
      id: node.id,
      label: `${node.name} (${node.difficulty})`,
      type: node.type,
      color: {
        beginner: { background: '#4CAF50', text: '#FFFFFF' },
        intermediate: { background: '#3F51B5', text: '#FFFFFF' },
        advanced: { background: '#9C27B0', text: '#FFFFFF' }
      }[node.difficulty],
      ...node
    }));

    setGraphData({ nodes: graphData?.nodes || graphData || nodesForGraph });
  }, [nodes]);

  const startExecution = async (nodeId: string) => {
    if (!selectedNode) return;
    
    if (nodeId !== selectedNode) {
      setSelectedNode(nodeId);
      return;
    }

    setIsRunning(true);
    const newExecution: SkillExecution = {
      id: Date.now().toString(),
      nodeId,
      status: 'running',
      startTime: Date.now(),
      output: '',
      metrics: {
        duration: 0,
        cpuUsage: 0,
        memoryUsage: 0,
        successRate: 0
      }
    };

    setExecutions(prev => [...prev, newExecution]);

    // Simulate execution
    const duration = 3000 + Math.floor(Math.random() * 5000);
    const success = Math.random() > 0.2;

    setTimeout(async () => {
      const executionIndex = executions.findIndex(e => e.id === newExecution.id);
      const successRate = Math.random();
      
      setExecutions(prev => {
        const updated = [...prev];
        updated[executionIndex].status = 'completed';
        updated[executionIndex].endTime = Date.now();
        updated[executionIndex].metrics.duration = duration;
        updated[executionIndex].metrics.successRate = successRate;
        
        // Update node confidence based on success
        const updatedNodes = nodes.map(node => 
          node.id === nodeId 
            ? {...node, confidence: Math.min(100, node.confidence + (success ? 5 : -3))}
            : node
        );
        setNodes(updatedNodes);
        
        updated[executionIndex].metrics.successRate = successRate;
        updated[executionIndex].output = success 
          ? `Execution successful! Confidence increased to ${updatedNodes.find(n => n.id === nodeId).confidence.toFixed(1)}`
          : 'Execution failed. Check logs for details.';
        
        updated[executionIndex].status = 'completed';
        return updated;
      });

      setExecutions(prev => prev);
      setIsRunning(false);
    }, duration);

    return newExecution;
  };

  const getNodeStatus = (nodeId: string) => {
    const execution = executions.find(e => e.nodeId === nodeId);
    if (!execution) return 'pending';
    return execution.status;
  };

  const getNodeProgress = (nodeId: string) => {
    const execution = executions.find(e => e.nodeId === nodeId);
    if (!execution) return 0;
    const progress = (Date.now() - execution.startTime) / 5000; // Simulate progress
    return Math.min(1, progress);
  };

  const getNodeColor = (node: SkillTreeNode) => {
    const difficultyColor = {
      beginner: '#4CAF50',
      intermediate: '#3F51B5',
      advanced: '#9C27B0'
    }[node.difficulty] || '#9E9E9C';

    const statusColor = {
      pending: '#9E9E9C',
      running: '#FF9800',
      completed: '#4CAF50',
      failed: '#F44336'
    }[getNodeStatus(node.id)];

    return {
      background: `#E0E0FF`,
      text: statusColor,
      border: `1px solid ${statusColor}`
    };
  };

  const canExecute = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    const hasPendingDependencies = node.dependencies.some(depId => 
      getNodeStatus(depId) === 'running' || getNodeStatus(depId) === 'waiting'
    );
    return !hasPendingDependencies;
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🧬</span>
            AI Skill Orchestrator
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Autonomous orchestration of AI skill execution with dependency management
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            disabled={!canExecute(selectedNode || '')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium disabled:opacity-50"
          >
            {isRunning ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Running Skills...
              </span>
            ) : (
              '▶️ Execute Selected Skills'
            )}
          </button>
          <div className="text-right">
            <span className="font-medium text-blue-600">{selectedNode || 'Click to select'}</span>
            <span className="text-xs text-gray-500">(Click node to view details)</span>
          </div>
          <button
            onClick={() => setSelectedNode(null)}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Clear Selection
          </button>
        </div>
      </div>

      {/* Skills TreeView */}
      <div className="mb-8">
        {selectedNode && (
          <div className="bg-gray-50 rounded-lg p-4 mb-3">
            <h3 className="font-semibold text-blue-800 mb-2">
              Selected Skill: {nodes.find(n => n.id === selectedNode)?.name || 'None'}
            </h3>
            <p className="text-sm text-gray-600">
              {nodes.find(n => n.id === selectedNode)?.description || 'No description'}
              <div className="mt-1 flex items-center gap-2">
                <span className={`mr-2 text-xs px-2 py-1 rounded ${getNodeColor(nodes.find(n => n.id === selectedNode)!).background}`}>
                  {nodes.find(n => n.id === selectedNode)?.status || 'pending'}
                </span>
                <span className="ml-2 font-medium">{nodes.find(n => n.id === selectedNode)?.difficulty}</span>
              </div>
            </div>
          </div>
        )}

        {nodes.map(node => (
          <div
            key={node.id}
            onClick={() => canExecute(node.id) && setSelectedNode(node.id)}
            className={`rounded-xl p-3 mb-2 cursor-pointer ${getNodeColor(node).background}`}
          >
            <div className="w-12 h-12 flex items-center justify-center">
              <span className={`text-sm ${getNodeColor(node).text}`}>
                {node.type[0].toUpperCase()}
              </span>
            </div>
            <p className="font-medium text-slate-900 mt-2">{node.name}</p>
            <p className="text-xs text-gray-600">{node.description}</p>
            {node.dependencies.length > 0 && (
              <div className="mt-1 flex items-center text-xs text-gray-500 gap-1">
                {node.dependencies.map(depId => {
                  const depNode = nodes.find(d => d.id === depId);
                  return depNode ? `${depNode.name.slice(0, 1)} ` : '';
                })}
              </div>
            )}
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm {getNodeStatus(node.id) === 'running' ? 'text-red-600' : 'text-gray-600'}">
                Status: {getNodeStatus(node.id)}
              </span>
              <span className="text-sm font-medium">
                {Math.random() > 0.7 ? '📈' : '✅'}
              </span>
            </div>
          </div>
        ))}

        {nodes.length > 0 && !selectedNode && (
          <div className="text-center mt-4">
            <p className="text-gray-500">Select a skill node to execute</p>
          </div>
        )}
      </div>

      {/* Execution Auto-Queue */}
      {executions.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Executing Skills</h3>
          <div className="space-y-2">
            {executions.map(exec => {
              const progress = exec.status === 'running' 
                ? Math.min(1, (Date.now() - exec.startTime) / 5000)
                : 1;
              
              return (
                <div key={exec.id} className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      {exec.nodeId} - {exec.status === 'running' ? 'Running...' : exec.status}
                    </p>
                    <div className="mt-1 w-full bg-blue-100 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500" 
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    {exec.status === 'running' ? 'Duration: ' + formatDuration(Date.now() - exec.startTime) : 'Completed'}
                  </div>
                </div>
              )}
            )}
          </div>
        </div>
      )}

      {/* Skills Visualization */}
      {graphData && (
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">Knowledge Graph Visualization</h3>
          <div id="graph-visualization">
            {/* Simple visualization - in real impl would use a library */}
            {nodes.map(node => (
              <div key={node.id} className="node">
                <div 
                  className="w-20 h-20 rounded-full 
                    " 
                  style={{
                    backgroundColor: getNodeColor(node).background,
                    border: `2px solid ${getNodeColor(node).border}`
                  }}
                >
                  {renderSkillIcon(node.type)}
                </div>
                <div className="mt-1 text-xs text-gray-500 center"> 
                  {node.name.split(' ')[0]}
                </div>
              </div>
            ))}
            <div className="mt-4">
              <span className="text-xs text-gray-500">
                {nodes.length} nodes • {executions.length} executions
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Improvement Suggestion */}
      {nodes.find(n => n.id === 'auto-improvement') && (
        <div className="mt-8">
          <h3 className="font-semibold text-lg mb-2">🤖 Auto-Improvement Suggestion</h3>
          <p className="text-sm text-gray-600">
            AI detects opportunity: {" "}
            <span className="text-blue-600 font-medium">
              Add new skill integration based on performance trends
            </span>
          </p>
          <button
            onClick={autoImprove}
            disabled={!canExecute('auto-improvement')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {isRunning ? 'Improving...' : 'Apply Improvement'}
          </button>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center">
          <span className="mr-2">📊</span>
          System Intelligence Metrics
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Total Executions</span>
              <span className="text-indigo-600 font-bold">{executions.length}</span>
            </div>
            <div className="w-full bg-indigo-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${Math.min(100, executions.length * 10)}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Completed skill runs in last 30 days
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Success Rate</span>
              <span className="text-yellow-600 font-bold">
                {(executions.filter(e => e.status === 'completed').length / executions.length * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-yellow-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-yellow-500" style={{ width: `${Math.min(100, executions.filter(e => e.status === 'completed').length / executions.length * 100)}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Successfully completed executions
            </p>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Avg. Execution Time</span>
              <span className="text-teal-600 font-bold">
                {Math.round(executions.reduce((sum, e) => sum + e.metrics.duration, 0) / executions.length)}
              </s>
            </div>
            <div className="w-full bg-teal-100 rounded-full h-2">
              <div className="h-2 rounded-full bg-teal-500" style={{ width: `${Math.min(100, avgDuration)}%` }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Mean time to completion
            </p>
          </div>
        </div>

        <div className="mt-6 bg-white bg-opacity-70 rounded-lg p-4 border border-indigo-200">
          <h4 className="font-medium text-indigo-900 mb-2">Orchestration Engine</h4>
          <ul className="text-sm text-indigo-800 space-y-1">
            <li>• <strong>Dependency Resolution:</strong> Orders execution based on requirements</li>
            <li><strong>Parallel Execution:</strong> Runs independent skills simultaneously</li>
            <li><strong>Resource Management:</strong> Allocates compute based on skill intensity</li>
            <li><strong>Error Handling:</strong> Automatically retries or fails gracefully</li>
            <li><strong>Continuous Learning:</strong> Improves execution strategy based on outcomes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
  return `${seconds}s`;
}

function renderSkillIcon(type: string): string {
  const icons: Record<string, string> = {
    data: '📥',
    validator: '✅',
    transformer: '🔄',
    generator: '⚡',
    interpreter: '▶️',
  };
  return icons[type] || '❓';
}

function autoImprove() {
  // Auto-queue improvement suggestion
}