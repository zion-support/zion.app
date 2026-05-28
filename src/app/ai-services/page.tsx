import React from 'react';

export default function AIServices() {
  return (
    <div className="min-h-screen bg-slate-900 text-white py-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-emerald-400 mb-8">AI Services</h1>
        <p className="text-gray-300 mb-4">
          Our AI services include machine learning models, natural language processing,
          computer vision, and predictive analytics solutions.
        </p>
        <ul className="text-gray-300 list-disc list-inside">
          <li>Custom AI Model Development</li>
          <li>LLM Integration & Fine-tuning</li>
          <li>Predictive Analytics</li>
          <li>Process Automation</li>
        </ul>
      </div>
    </div>
  );
}