'use client';

import { useState } from 'react';

interface FinancialMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  change: number;
  aiInsight?: string;
}

export default function AIFinancialAdvisor() {
  const [metrics, setMetrics] = useState<FinancialMetric[]>([
    {
      id: '1',
      name: 'Monthly Revenue',
      value: 125000,
      target: 150000,
      change: 8.5,
      aiInsight: 'AI suggests cross-selling strategy to reach target by next quarter'
    },
    {
      id: '2',
      name: 'Customer Acquisition Cost',
      value: 45,
      target: 35,
      change: -12,
      aiInsight: 'Cost reduced through automated marketing optimization'
    },
    {
      id: '3',
      name: 'Customer Lifetime Value',
      value: 2850,
      target: 3200,
      change: 6.2,
      aiInsight: 'AI identifies upsell opportunities with high-value segments'
    },
    {
      id: '4',
      name: 'Monthly Recurring Revenue',
      value: 98000,
      target: 110000,
      target: 110000,
      change: 4.3,
      aiInsight: 'Steady growth - consider retention-focused campaigns'
    }
  ]);

  const [newGoal, setNewGoal] = useState({ metric: '', value: '' });

  const getPerformanceColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 100) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getPerformanceBar = (value: number, target: number) => {
    const percentage = Math.min((value / target) * 100, 100);
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
        <div
          className={`h-2 rounded-full ${
            percentage >= 100 ? 'bg-green-500' :
            percentage >= 80 ? 'bg-blue-500' :
            percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const addNewGoal = () => {
    if (newGoal.metric && newGoal.value) {
      setMetrics([...metrics, {
        id: Date.now().toString(),
        name: newGoal.metric,
        value: Number(newGoal.value),
        target: Number(newGoal.value) * 1.25,
        change: 0,
        aiInsight: 'AI will analyze this metric and provide insights'
      }]);
      setNewGoal({ metric: '', value: '' });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Financial Advisor</h2>
          <p className="text-sm text-gray-600 mt-1">Smart financial insights and performance tracking</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">
            {metrics.length} Metrics
          </div>
          <div className="text-xs text-gray-500">Active Goals</div>
        </div>
      </div>

      {/* Add New Goal */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-3">Set New Financial Goal</h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newGoal.metric}
            onChange={(e) => setNewGoal({...newGoal, metric: e.target.value})}
            placeholder="e.g., Monthly Revenue"
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            value={newGoal.value}
            onChange={(e) => setNewGoal({...newGoal, value: e.target.value})}
            placeholder="Target value"
            className="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addNewGoal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Goal
          </button>
        </div>
      </div>

      {/* Financial Metrics */}
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{metric.name}</h3>
                <div className={`text-xl font-bold ${getPerformanceColor(metric.value, metric.target)}`}>
                  {formatCurrency(metric.value)}
                </div>
                <div className="text-sm text-gray-600">
                  Target: {formatCurrency(metric.target)}
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-semibold ${
                  metric.change > 0 ? 'text-green-600' : metric.change < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </span>
                <div className="text-xs text-gray-500">vs last month</div>
              </div>
            </div>
            
            {getPerformanceBar(metric.value, metric.target)}
            
            {metric.aiInsight && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">🤖</span>
                  <div>
                    <div className="text-xs font-semibold text-blue-900 mb-1">AI Insight</div>
                    <p className="text-sm text-blue-800">{metric.aiInsight}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* AI Recommendations */}
      <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 via-white to-purple-50 rounded-lg border border-indigo-200">
        <h3 className="font-semibold text-indigo-900 mb-3">🎯 AI Financial Recommendations</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-3 bg-white rounded-lg border border-indigo-100">
            <h4 className="font-medium text-indigo-800 mb-1">Revenue Optimization</h4>
            <p className="text-sm text-indigo-700">AI identifies 3 high-value customer segments for targeted upselling campaigns</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-100">
            <h4 className="font-medium text-indigo-800 mb-1">Cost Reduction</h4>
            <p className="text-sm text-indigo-700">Automated workflow could save $2,300/month in operational costs</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-100">
            <h4 className="font-medium text-indigo-800 mb-1">Growth Prediction</h4>
            <p className="text-sm text-indigo-700">AI forecasts 15% revenue growth with current strategy</p>
          </div>
          <div className="p-3 bg-white rounded-lg border border-indigo-100">
            <h4 className="font-medium text-indigo-800 mb-1">Risk Assessment</h4>
            <p className="text-sm text-indigo-700">Low risk profile - financial metrics within healthy ranges</p>
          </div>
        </div>
      </div>
    </div>
  );
}