'use client';

import { useState } from 'react';

interface CustomerHealthMetrics {
  engagement: number;
  satisfaction: number;
  usage: number;
  support: number;
  growth: number;
}

interface CustomerData {
  name: string;
  industry: string;
  metrics: CustomerHealthMetrics;
  churnRisk: 'low' | 'medium' | 'high';
  healthScore: number;
  lastActivity: string;
  recommendations: string[];
}

export default function CustomerSuccessPlatform() {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Sample customer data
  const customers: CustomerData[] = [
    {
      name: 'Acme Corp',
      industry: 'Technology',
      metrics: { engagement: 85, satisfaction: 92, usage: 78, support: 88, growth: 70 },
      churnRisk: 'low',
      healthScore: 83,
      lastActivity: '2 days ago',
      recommendations: [
        'Schedule quarterly business review',
        'Introduce advanced features',
        'Request case study participation'
      ]
    },
    {
      name: 'GlobalTech Inc',
      industry: 'Finance',
      metrics: { engagement: 45, satisfaction: 60, usage: 40, support: 55, growth: 30 },
      churnRisk: 'high',
      healthScore: 46,
      lastActivity: '3 weeks ago',
      recommendations: [
        'URGENT: Schedule executive intervention call',
        'Offer dedicated success manager',
        'Provide custom training sessions',
        'Review pricing and value proposition'
      ]
    },
    {
      name: 'StartupXYZ',
      industry: 'SaaS',
      metrics: { engagement: 72, satisfaction: 78, usage: 65, support: 80, growth: 85 },
      churnRisk: 'medium',
      healthScore: 76,
      lastActivity: '5 days ago',
      recommendations: [
        'Check in on adoption progress',
        'Share relevant best practices',
        'Explore expansion opportunities'
      ]
    }
  ];

  const handleCustomerSelect = (customerName: string) => {
    setSelectedCustomer(customerName);
    setShowAnalysis(true);
  };

  const getChurnRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-400 bg-green-600/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/30';
      case 'high': return 'text-red-400 bg-red-600/20 border-red-500/30';
      default: return 'text-slate-400 bg-slate-600/20 border-slate-500/30';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const selectedCustomerData = customers.find(c => c.name === selectedCustomer);

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-3xl p-8 md:p-12 border border-purple-500/30">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          🌟 AI Customer Success Platform
        </h2>
        <p className="text-slate-300 text-lg">
          Predict churn, optimize engagement, and maximize customer lifetime value with AI-powered insights
        </p>
      </div>

      {/* Customer Selection */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-3">
          Select a Customer to Analyze:
        </label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {customers.map((customer) => (
            <button
              key={customer.name}
              onClick={() => handleCustomerSelect(customer.name)}
              className={`p-6 rounded-xl border text-left transition-all ${
                selectedCustomer === customer.name
                  ? 'bg-purple-600/30 border-purple-500'
                  : 'bg-slate-900/60 border-slate-700 hover:border-purple-500/50'
              }`}
            >
              <h3 className="text-lg font-bold text-white mb-2">{customer.name}</h3>
              <p className="text-slate-400 text-sm mb-3">{customer.industry}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-xs">Health Score:</span>
                <span className={`text-lg font-bold ${getHealthScoreColor(customer.healthScore)}`}>
                  {customer.healthScore}/100
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">Churn Risk:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getChurnRiskColor(customer.churnRisk)}`}>
                  {customer.churnRisk.toUpperCase()}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Customer Analysis */}
      {showAnalysis && selectedCustomerData && (
        <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">{selectedCustomerData.name}</h3>
              <p className="text-slate-400">{selectedCustomerData.industry} • Last activity: {selectedCustomerData.lastActivity}</p>
            </div>
            <div className={`px-4 py-2 rounded-full text-sm font-semibold border ${getChurnRiskColor(selectedCustomerData.churnRisk)}`}>
              {selectedCustomerData.churnRisk.toUpperCase()} CHURN RISK
            </div>
          </div>

          {/* Health Score Overview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-white">Overall Health Score</h4>
              <span className={`text-3xl font-bold ${getHealthScoreColor(selectedCustomerData.healthScore)}`}>
                {selectedCustomerData.healthScore}/100
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  selectedCustomerData.healthScore >= 80 ? 'bg-green-500' :
                  selectedCustomerData.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${selectedCustomerData.healthScore}%` }}
              />
            </div>
          </div>

          {/* Metrics Breakdown */}
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {Object.entries(selectedCustomerData.metrics).map(([key, value]) => (
              <div key={key} className="bg-slate-800/60 rounded-xl p-4">
                <div className="text-xs text-slate-400 mb-1 capitalize">{key}</div>
                <div className={`text-2xl font-bold ${getHealthScoreColor(value)}`}>{value}</div>
                <div className="w-full bg-slate-700 rounded-full h-1 mt-2">
                  <div
                    className={`h-1 rounded-full ${
                      value >= 80 ? 'bg-green-500' :
                      value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* AI Recommendations */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>🤖</span> AI-Powered Recommendations
            </h4>
            <div className="space-y-3">
              {selectedCustomerData.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border ${
                    rec.includes('URGENT')
                      ? 'bg-red-600/20 border-red-500/30'
                      : 'bg-purple-600/20 border-purple-500/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{rec.includes('URGENT') ? '🚨' : '💡'}</span>
                    <div>
                      <p className="text-white font-medium">{rec}</p>
                      <p className="text-slate-400 text-sm mt-1">
                        {rec.includes('URGENT')
                          ? 'High priority - immediate action required'
                          : 'Recommended next step for customer success'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`mailto:kleber@ziontechgroup.com?subject=Customer Success Analysis: ${selectedCustomerData.name}`}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all text-center"
            >
              📧 Request Full Analysis
            </a>
            <a
              href="/services/ai-powered-customer-success/"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all text-center"
            >
              🌟 Learn More About Platform
            </a>
          </div>
        </div>
      )}

      {!showAnalysis && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🌟</div>
          <p className="text-slate-400 text-lg">
            Select a customer above to see AI-powered success insights
          </p>
        </div>
      )}
    </div>
  );
}
