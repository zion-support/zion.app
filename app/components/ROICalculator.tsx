'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ROIResult {
  annualSavings: number;
  monthlyROI: number;
  paybackMonths: number;
  breakdown: { label: string; savings: number; icon: string }[];
}

const SERVICE_PRESETS: Record<string, {
  label: string;
  emoji: string;
  description: string;
  metrics: { key: string; label: string; unit: string; default: number; multiplier: number }[];
}> = {
  'ai-document-processing': {
    label: 'AI Document Processing',
    emoji: '📄',
    description: 'Automated invoice, contract, and form processing',
    metrics: [
      { key: 'docs_per_month', label: 'Documents processed/month', unit: 'docs', default: 500, multiplier: 3.5 },
      { key: 'cost_per_doc', label: 'Current cost per document', unit: '$', default: 8, multiplier: 1 },
      { key: 'employees', label: 'Staff doing data entry', unit: 'people', default: 3, multiplier: 2500 },
    ],
  },
  'ai-customer-support': {
    label: 'AI Customer Support',
    emoji: '🤖',
    description: 'AI chatbots + intelligent ticket routing',
    metrics: [
      { key: 'tickets_per_month', label: 'Support tickets/month', unit: 'tickets', default: 1000, multiplier: 4 },
      { key: 'cost_per_ticket', label: 'Cost per ticket (human)', unit: '$', default: 12, multiplier: 1 },
      { key: 'resolution_time_hrs', label: 'Avg resolution time (hours)', unit: 'hrs', default: 8, multiplier: 75 },
    ],
  },
  'cloud-cost-optimization': {
    label: 'Cloud Cost Optimization',
    emoji: '☁️',
    description: 'Reduce AWS/Azure/GCP spend by 25-40%',
    metrics: [
      { key: 'monthly_cloud_spend', label: 'Monthly cloud spend', unit: '$', default: 10000, multiplier: 0.30 },
      { key: 'waste_percentage', label: 'Estimated waste %', unit: '%', default: 30, multiplier: 1 },
      { key: 'engineering_hours', label: 'Eng hours on cost mgmt/month', unit: 'hrs', default: 20, multiplier: 150 },
    ],
  },
  'security-monitoring': {
    label: 'Security Monitoring (SOC)',
    emoji: '🔐',
    description: '24/7 security operations center',
    metrics: [
      { key: 'incidents_per_month', label: 'Security incidents/month', unit: 'incidents', default: 50, multiplier: 500 },
      { key: 'response_time_hrs', label: 'Current response time (hours)', unit: 'hrs', default: 24, multiplier: 2000 },
      { key: 'breach_cost_risk', label: 'Potential breach cost', unit: '$', default: 500000, multiplier: 0.002 },
    ],
  },
  'automation-workflows': {
    label: 'Workflow Automation',
    emoji: '⚙️',
    description: 'RPA + AI process automation',
    metrics: [
      { key: 'manual_hours', label: 'Manual process hours/month', unit: 'hrs', default: 200, multiplier: 45 },
      { key: 'error_rate', label: 'Current error rate %', unit: '%', default: 5, multiplier: 500 },
      { key: 'processes', label: 'Number of repetitive processes', unit: 'processes', default: 10, multiplier: 800 },
    ],
  },
  'data-analytics': {
    label: 'Data Analytics Platform',
    emoji: '📊',
    description: 'Business intelligence + predictive analytics',
    metrics: [
      { key: 'reports_per_month', label: 'Reports generated/month', unit: 'reports', default: 50, multiplier: 200 },
      { key: 'decision_latency_days', label: 'Decision latency (days)', unit: 'days', default: 14, multiplier: 5000 },
      { key: 'data_analysts', label: 'Data analysts on team', unit: 'people', default: 3, multiplier: 3000 },
    ],
  },
};

function calculateROI(serviceKey: string, inputs: Record<string, number>): ROIResult {
  const preset = SERVICE_PRESETS[serviceKey];
  if (!preset) return { annualSavings: 0, monthlyROI: 0, paybackMonths: 0, breakdown: [] };

  const breakdown: { label: string; savings: number; icon: string }[] = [];
  let totalMonthly = 0;

  switch (serviceKey) {
    case 'ai-document-processing': {
      const automationSavings = (inputs.docs_per_month || 500) * (inputs.cost_per_doc || 8) * 0.8;
      const laborSavings = (inputs.employees || 3) * 2500 * 0.6;
      breakdown.push({ label: 'Processing automation savings', savings: Math.round(automationSavings), icon: '🤖' });
      breakdown.push({ label: 'Labor reallocation value', savings: Math.round(laborSavings), icon: '👥' });
      breakdown.push({ label: 'Error reduction savings', savings: Math.round(automationSavings * 0.1), icon: '✅' });
      totalMonthly = automationSavings + laborSavings + automationSavings * 0.1;
      break;
    }
    case 'ai-customer-support': {
      const ticketSavings = (inputs.tickets_per_month || 1000) * (inputs.cost_per_ticket || 12) * 0.6;
      const timeSavings = (inputs.resolution_time_hrs || 8) * 75 * 0.5;
      breakdown.push({ label: 'Automated ticket resolution', savings: Math.round(ticketSavings), icon: '🎫' });
      breakdown.push({ label: 'Faster resolution = retained revenue', savings: Math.round(timeSavings), icon: '⚡' });
      breakdown.push({ label: 'Customer satisfaction uplift', savings: Math.round(ticketSavings * 0.15), icon: '😊' });
      totalMonthly = ticketSavings + timeSavings + ticketSavings * 0.15;
      break;
    }
    case 'cloud-cost-optimization': {
      const cloudSavings = (inputs.monthly_cloud_spend || 10000) * (inputs.waste_percentage || 30) / 100 * 0.8;
      const engSavings = (inputs.engineering_hours || 20) * 150;
      breakdown.push({ label: 'Cloud waste elimination', savings: Math.round(cloudSavings), icon: '☁️' });
      breakdown.push({ label: 'Engineering time recovered', savings: Math.round(engSavings), icon: '👨‍💻' });
      breakdown.push({ label: 'Rightsizing + reserved instances', savings: Math.round(cloudSavings * 0.3), icon: '📐' });
      totalMonthly = cloudSavings + engSavings + cloudSavings * 0.3;
      break;
    }
    case 'security-monitoring': {
      const incidentSavings = (inputs.incidents_per_month || 50) * 500 * 0.7;
      const responseSavings = (inputs.response_time_hrs || 24) * 2000 * 0.01;
      const breachReduction = (inputs.breach_cost_risk || 500000) * 0.002;
      breakdown.push({ label: 'Faster incident resolution', savings: Math.round(incidentSavings), icon: '🚨' });
      breakdown.push({ label: 'Reduced response time cost', savings: Math.round(responseSavings), icon: '⏱️' });
      breakdown.push({ label: 'Breach risk reduction (monthly)', savings: Math.round(breachReduction), icon: '🛡️' });
      totalMonthly = incidentSavings + responseSavings + breachReduction;
      break;
    }
    case 'automation-workflows': {
      const laborSavings = (inputs.manual_hours || 200) * 45 * 0.7;
      const errorSavings = (inputs.error_rate || 5) * 500;
      const processSavings = (inputs.processes || 10) * 800 * 0.5;
      breakdown.push({ label: 'Manual labor eliminated', savings: Math.round(laborSavings), icon: '🦾' });
      breakdown.push({ label: 'Error cost reduction', savings: Math.round(errorSavings), icon: '🎯' });
      breakdown.push({ label: 'Process throughput increase', savings: Math.round(processSavings), icon: '📈' });
      totalMonthly = laborSavings + errorSavings + processSavings;
      break;
    }
    case 'data-analytics': {
      const reportSavings = (inputs.reports_per_month || 50) * 200 * 0.8;
      const latencySavings = (inputs.decision_latency_days || 14) * 5000 * 0.01;
      const analystSavings = (inputs.data_analysts || 3) * 3000 * 0.4;
      breakdown.push({ label: 'Automated reporting', savings: Math.round(reportSavings), icon: '📊' });
      breakdown.push({ label: 'Faster decisions value', savings: Math.round(latencySavings), icon: '🧠' });
      breakdown.push({ label: 'Analyst productivity boost', savings: Math.round(analystSavings), icon: '👩‍🔬' });
      totalMonthly = reportSavings + latencySavings + analystSavings;
      break;
    }
    default:
      break;
  }

  const annualSavings = Math.round(totalMonthly * 12);
  const estimatedInvestment = totalMonthly * 0.3; // Assume service costs ~30% of savings
  const monthlyROI = estimatedInvestment > 0 ? Math.round((totalMonthly / estimatedInvestment) * 100) : 0;
  const paybackMonths = totalMonthly > 0 ? Math.ceil(estimatedInvestment / totalMonthly) : 0;

  return {
    annualSavings,
    monthlyROI,
    paybackMonths,
    breakdown: breakdown.map(b => ({ ...b, savings: Math.round(b.savings * 12) })),
  };
}

export default function ROICalculator() {
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);

  const preset = selectedService ? SERVICE_PRESETS[selectedService] : null;

  const roi = useMemo(() => {
    if (!selectedService) return null;
    return calculateROI(selectedService, inputs);
  }, [selectedService, inputs]);

  const handleInputChange = (key: string, value: string) => {
    const num = parseFloat(value) || 0;
    setInputs(prev => ({ ...prev, [key]: num }));
    if (showResults) setShowResults(false);
  };

  const calculate = () => {
    setShowResults(true);
  };

  const reset = () => {
    setSelectedService(null);
    setInputs({});
    setShowResults(false);
  };

  const formatCurrency = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
    return `$${n.toLocaleString()}`;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/30 border border-green-500/30 text-green-300 text-sm mb-4">
            <span>💰</span> Free ROI Calculator
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Calculate Your Potential Savings
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Select a service category, enter your current metrics, and see how much you could save
            with Zion Tech Group&apos;s AI-powered solutions.
          </p>
        </div>

        {/* Service Selection */}
        {!selectedService && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {Object.entries(SERVICE_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setSelectedService(key)}
                className="text-left p-5 rounded-xl border border-slate-700 bg-slate-800/50 hover:border-green-500/50 hover:bg-slate-800 transition-all group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{preset.emoji}</span>
                  <h3 className="text-sm font-semibold text-white group-hover:text-green-300 transition-colors">
                    {preset.label}
                  </h3>
                </div>
                <p className="text-xs text-slate-500">{preset.description}</p>
              </button>
            ))}
          </div>
        )}

        {/* Input Form */}
        {selectedService && preset && !showResults && (
          <div className="max-w-lg mx-auto">
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{preset.emoji}</span>
                  <h3 className="text-lg font-bold text-white">{preset.label}</h3>
                </div>
                <button onClick={reset} className="text-slate-500 hover:text-white text-sm">
                  ← Back
                </button>
              </div>

              <div className="space-y-4">
                {preset.metrics.map(metric => (
                  <div key={metric.key}>
                    <label className="block text-sm text-slate-300 mb-1">{metric.label}</label>
                    <div className="flex items-center gap-2">
                      {metric.unit === '$' && <span className="text-slate-500">$</span>}
                      <input
                        type="number"
                        value={inputs[metric.key] ?? metric.default}
                        onChange={e => handleInputChange(metric.key, e.target.value)}
                        className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:border-green-500 focus:outline-none"
                      />
                      {metric.unit !== '$' && <span className="text-xs text-slate-500">{metric.unit}</span>}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={calculate}
                className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:opacity-90 transition-all"
              >
                📊 Calculate My ROI
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && roi && preset && (
          <div className="max-w-2xl mx-auto">
            {/* Big Number */}
            <div className="text-center mb-8">
              <p className="text-sm text-slate-400 mb-2">Estimated Annual Savings</p>
              <p className="text-5xl md:text-6xl font-bold text-green-400">
                {formatCurrency(roi.annualSavings)}
              </p>
              <p className="text-sm text-slate-500 mt-2">per year with {preset.label}</p>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
                <p className="text-2xl font-bold text-white">{roi.monthlyROI}%</p>
                <p className="text-xs text-slate-400 mt-1">Monthly ROI</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
                <p className="text-2xl font-bold text-white">{roi.paybackMonths}mo</p>
                <p className="text-xs text-slate-400 mt-1">Payback Period</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 text-center">
                <p className="text-2xl font-bold text-white">{formatCurrency(Math.round(roi.annualSavings / 12))}</p>
                <p className="text-xs text-slate-400 mt-1">Monthly Savings</p>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-6 mb-8">
              <h4 className="text-sm font-semibold text-white mb-4">💡 Savings Breakdown (Annual)</h4>
              <div className="space-y-3">
                {roi.breakdown.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{item.icon}</span>
                      <span className="text-sm text-slate-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-green-400">{formatCurrency(item.savings)}</span>
                  </div>
                ))}
                <div className="border-t border-slate-700 pt-3 mt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">Total Annual Savings</span>
                    <span className="text-lg font-bold text-green-400">{formatCurrency(roi.annualSavings)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center space-y-4">
              <p className="text-sm text-slate-400">
                Ready to start saving? Get a personalized proposal with exact pricing.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-full hover:opacity-90 transition-all"
                >
                  📧 Get Custom Proposal
                </Link>
                <a
                  href="tel:+13024640950"
                  className="px-8 py-3 bg-slate-800 border border-slate-700 text-white font-semibold rounded-full hover:bg-slate-700 transition-all"
                >
                  ☎ +1 302 464 0950
                </a>
              </div>
              <button onClick={reset} className="text-xs text-slate-500 hover:text-green-400 mt-4 block mx-auto">
                🔄 Calculate for another service
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
