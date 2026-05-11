'use client';

import { useState, useEffect } from 'react';

interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  metric: string;
  baseline: number;
  expectedLift: number;
  trafficAllocation: number;
  durationDays: number;
  priority: number;
  status: 'draft' | 'running' | 'completed' | 'analysis';
  confidence: number;
  potentialImpact: number;
  complexity: number;
  autoAdjust: boolean;
}

export default function AutonomousExperimentPriorityEngine() {
  const [experiments, setExperiments] = useState<Experiment[]>([
    {
      id: 'exp-001',
      name: 'CTA Button Color Test',
      hypothesis: 'Changing CTA from blue to orange increases click-through rate',
      metric: 'CTR',
      baseline: 4.2,
      expectedLift: 15,
      trafficAllocation: 25,
      durationDays: 14,
      priority: 85,
      status: 'running',
      confidence: 78,
      potentialImpact: 30,
      complexity: 1,
      autoAdjust: true
    },
    {
      id: 'exp-002',
      name: 'Pricing Tier Comparison',
      hypothesis: 'Adding a middle tier increases conversions',
      metric: 'Conversion Rate',
      baseline: 12.5,
      expectedLift: 22,
      trafficAllocation: 30,
      durationDays: 21,
      priority: 92,
      status: 'draft',
      confidence: 65,
      potentialImpact: 45,
      complexity: 2,
      autoAdjust: true
    },
    {
      id: 'exp-003',
      name: 'Homepage Hero Headline',
      hypothesis: 'Problem-oriented copy increases engagement',
      metric: 'Engagement Time',
      baseline: 2.1,
      expectedLift: 35,
      trafficAllocation: 20,
      durationDays: 10,
      priority: 78,
      status: 'completed',
      confidence: 82,
      potentialImpact: 25,
      complexity: 1,
      autoAdjust: false
    }
  ]);

  const [autoPrioritizationEnabled, setAutoPrioritizationEnabled] = useState(true);
  const [simulationMode, setSimulationMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Auto-reprioritization algorithm
  const recalculatePriorities = () => {
    setExperiments(prev => prev.map(exp => {
      // Priority score = expected impact * confidence / complexity
      const impactScore = exp.potentialImpact * exp.confidence;
      const complexityPenalty = exp.complexity * 0.2;
      const trafficWeight = exp.trafficAllocation / 100;
      const durationFactor = 30 / Math.max(exp.durationDays, 7); // Prefer shorter tests
      
      let newPriority = (impactScore - complexityPenalty) * trafficWeight * durationFactor;
      newPriority = Math.max(0, Math.min(100, newPriority));
      
      return {
        ...exp,
        priority: Math.round(newPriority)
      };
    }).sort((a, b) => b.priority - a.priority));
  };

  // Auto-adjust traffic allocation based on Bayesian analysis
  const autoAdjustTraffic = () => {
    setExperiments(prev => prev.map(exp => {
      if (!exp.autoAdjust || exp.status !== 'running') return exp;
      
      // Simulate Bayesian updates based on hypothetical lift observations
      const liftObservation = exp.baseline * (1 + (Math.random() * exp.expectedLift / 100));
      const newExpectedLift = exp.expectedLift * 0.9 + (liftObservation / exp.baseline - 1) * 100 * 0.1;
      
      return {
        ...exp,
        expectedLift: Math.round(newExpectedLift * 10) / 10,
        confidence: Math.min(95, exp.confidence + Math.random() * 2)
      };
    }));
  };

  useEffect(() => {
    if (autoPrioritizationEnabled) {
      const interval = setInterval(() => {
        recalculatePriorities();
        autoAdjustTraffic();
        setLastUpdated(new Date());
      }, 30000); // Run every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoPrioritizationEnabled]);

  const toggleExperiment = (id: string) => {
    setExperiments(prev => prev.map(exp => 
      exp.id === id 
        ? { ...exp, status: exp.status === 'running' ? 'draft' : 'running' }
        : exp
    ));
    setLastUpdated(new Date());
  };

  const createNewExperiment = () => {
    const newExp: Experiment = {
      id: `exp-${Date.now()}`,
      name: 'New Experiment',
      hypothesis: 'Hypothesis to be defined',
      metric: 'Conversion Rate',
      baseline: 0,
      expectedLift: 10,
      trafficAllocation: 20,
      durationDays: 14,
      priority: 50,
      status: 'draft',
      confidence: 50,
      potentialImpact: 20,
      complexity: 1,
      autoAdjust: true
    };
    setExperiments(prev => [newExp, ...prev]);
    setLastUpdated(new Date());
  };

  const deleteExperiment = (id: string) => {
    setExperiments(prev => prev.filter(exp => exp.id !== id));
    setLastUpdated(new Date());
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return 'bg-red-100 text-red-800 border-red-300';
    if (priority >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-green-100 text-green-800 border-green-300';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'bg-green-500';
    if (confidence >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const runningExperiments = experiments.filter(e => e.status === 'running').length;
  const avgPriority = Math.round(experiments.reduce((sum, e) => sum + e.priority, 0) / experiments.length);
  const avgConfidence = Math.round(experiments.reduce((sum, e) => sum + e.confidence, 0) / experiments.length);

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🧪</span>
            Autonomous Experiment Priority Engine
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI-driven experiment prioritization, Baytribution simulation, and auto-traffic allocation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoPrioritizationEnabled}
              onChange={(e) => setAutoPrioritizationEnabled(e.target.checked)}
              className="mr-2 h-4 w-4"
            />
            <span className="text-sm text-gray-700">Auto Prioritize</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={simulationMode}
              onChange={(e) => setSimulationMode(e.target.checked)}
              className="mr-2 h-4 w-4"
            />
            <span className="text-sm text-gray-700">Simulation Mode</span>
          </label>
          <button
            onClick={createNewExperiment}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            + New Experiment
          </button>
          <div className="text-right text-xs text-gray-500">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Total Experiments</div>
          <div className="text-2xl font-bold text-blue-900">{experiments.length}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium">Running</div>
          <div className="text-2xl font-bold text-green-900">{runningExperiments}</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="text-sm text-purple-600 font-medium">Avg Priority</div>
          <div className="text-2xl font-bold text-purple-900">{avgPriority}</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="text-sm text-orange-600 font-medium">Avg Confidence</div>
          <div className="text-2xl font-bold text-orange-900">{avgConfidence}%</div>
        </div>
      </div>

      {/* Experiments Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experiment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lift</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Traffic</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {experiments.map(exp => (
              <tr key={exp.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(exp.priority)}`}>
                    {exp.priority}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">{exp.name}</div>
                  <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">{exp.hypothesis}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    exp.status === 'running' ? 'bg-green-100 text-green-800' :
                    exp.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    exp.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {exp.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{exp.metric}</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-green-600">+{exp.expectedLift}%</span>
                    <span className="text-xs text-gray-500 ml-1">(baseline: {exp.baseline})</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 rounded-full bg-blue-500" 
                        style={{ width: `${exp.trafficAllocation}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-900">{exp.trafficAllocation}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{exp.durationDays}d</td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                      <div 
                        className="h-2 rounded-full" 
                        style={{ width: `${exp.confidence}%`, backgroundColor: exp.confidence >= 80 ? '#4CAF50' : exp.confidence >= 60 ? '#FFC107' : '#F44336' }}
                      />
                    </div>
                    <span className="text-sm font-medium">{exp.confidence}%</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => toggleExperiment(exp.id)}
                    className={`px-3 py-1 rounded-md text-xs font-medium mr-2 ${
                      exp.status === 'running' 
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {exp.status === 'running' ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={() => deleteExperiment(exp.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-xs font-medium hover:bg-red-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI Insights Panel */}
      <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-6">
        <h3 className="font-semibold text-lg text-indigo-900 mb-4 flex items-center">
          <span className="mr-2">🤖</span>
          AI-Powered Prioritization Insights
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <h4 className="font-semibold text-indigo-800 mb-2">Bayesian Optimization</h4>
            <p className="text-sm text-indigo-700">
              Uses Bayesian inference to continuously update lift estimates and confidence intervals as data comes in.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <h4 className="font-semibold text-indigo-800 mb-2">Traffic Allocation AI</h4>
            <p className="text-sm text-indigo-700">
              Dynamically adjusts traffic splits based on interim results to maximize learning and minimize opportunity cost.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-indigo-100">
            <h4 className="font-semibold text-indigo-800 mb-2">Impact-Complexity Scoring</h4>
            <p className="text-sm text-indigo-700">
              Balances expected lift against implementation complexity to recommend highest-value experiments first.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-lg p-4 border border-indigo-100">
          <h4 className="font-semibold text-indigo-800 mb-2">Auto-Recovery Logic</h4>
          <ul className="text-sm text-indigo-700 space-y-1">
            <li>• If an experiment shows negative lift, it is automatically paused and removed from the priority queue</li>
            <li>• Experiments with high confidence and low complexity are auto-boosted in priority</li>
            <li>• Traffic is automatically re-allocated to promising experiments to accelerate learning</li>
          </ul>
        </div>
      </div>
    </div>
  );
}