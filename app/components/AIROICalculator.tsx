'use client';

import { useState, useEffect } from 'react';
import { Calculator, Zap, ArrowRight, Loader2 } from 'lucide-react';

interface ROICalculatorProps {
  defaultService?: string;
}

const services = [
  { id: 'ai-chatbot', name: 'AI Chatbot', savings: 72000, efficiency: 85, implementationCost: 5000 },
  { id: 'ai-analytics', name: 'AI Analytics', savings: 96000, efficiency: 92, implementationCost: 8000 },
  { id: 'ai-automation', name: 'Workflow Automation', savings: 48000, efficiency: 78, implementationCost: 6000 },
  { id: 'ai-security', name: 'AI Security', savings: 120000, efficiency: 95, implementationCost: 10000 },
  { id: 'ai-voice', name: 'Voice AI Assistant', savings: 36000, efficiency: 72, implementationCost: 4000 },
  { id: 'ai-ml', name: 'Machine Learning Platform', savings: 144000, efficiency: 88, implementationCost: 15000 },
];

export default function AIROICalculator({ defaultService }: ROICalculatorProps) {
  const [selectedService, setSelectedService] = useState(defaultService || 'ai-chatbot');
  const [employees, setEmployees] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [hoursSaved, setHoursSaved] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  const service = services.find(s => s.id === selectedService) || services[0];

  useEffect(() => {
    setIsCalculating(true);
    const timer = setTimeout(() => {
      const savedPerEmployee = service.savings / 10;
      setHoursSaved(Math.round((savedPerEmployee * employees) / hourlyRate));
      setIsCalculating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedService, employees, hourlyRate, service]);

  const annualSavings = service.savings * (employees / 10);
  const efficiency = service.efficiency;
  const roi = ((annualSavings - service.implementationCost) / service.implementationCost) * 100;
  const paybackPeriod = (service.implementationCost / annualSavings) * 12;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-bold text-lg">AI ROI Calculator</h3>
          <p className="text-slate-400 text-sm">Estimate your return on investment</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Service Selection */}
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">Select AI Service</label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Employees */}
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">
            Number of Employees: <span className="text-green-400">{employees}</span>
          </label>
          <input
            type="range"
            min="1"
            max="500"
            value={employees}
            onChange={(e) => setEmployees(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>1</span>
            <span>500</span>
          </div>
        </div>

        {/* Hourly Rate */}
        <div>
          <label className="text-slate-300 text-sm font-medium block mb-2">
            Average Hourly Rate ($): <span className="text-green-400">${hourlyRate}</span>
          </label>
          <input
            type="range"
            min="20"
            max="200"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>$20</span>
            <span>$200</span>
          </div>
        </div>

        {/* Results */}
        <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Annual Savings</span>
            <span className="text-green-400 font-bold text-xl">
              {isCalculating ? <Loader2 className="w-5 h-5 animate-spin inline" /> : `$${annualSavings.toLocaleString()}`}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Efficiency Gain</span>
            <span className="text-blue-400 font-bold">{efficiency}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">ROI</span>
            <span className="text-amber-400 font-bold">{roi.toFixed(0)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm">Payback Period</span>
            <span className="text-purple-400 font-bold">{paybackPeriod.toFixed(1)} months</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-slate-700">
            <span className="text-slate-400 text-sm">Hours Saved/Year</span>
            <span className="text-white font-bold">{hoursSaved.toLocaleString()} hrs</span>
          </div>
        </div>

        {/* CTA */}
        <a
          href="/contact"
          className="block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4" />
          Get Full Analysis
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
