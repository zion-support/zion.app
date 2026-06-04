import Link from 'next/link';
import { useState } from 'react';

const AGENTS_MONITORING = `
<div className="mb-16">
  <h2 className="text-2xl font-bold mb-6 flex items-center">
    <span className="mr-3">🤖</span> Agent Operations Dashboard
  </h2>
  <div className="grid md:grid-cols-2 gap-6">
    {/* Agent Status */}
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2">⚡</span> Active Agents
      </h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>OWL (Alpha)</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Carol Bot</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Kilo Bot</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Neo Bot</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Windows Quel Bot</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Rocket Kleber Bot</span>
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>
        </div>
      </div>
    </div>
    
    {/* Recent Activity */}
    <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <span className="mr-2">📊</span> Recent Deployments
      </h3>
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span>Wave 209 Deployed</span>
          <span className="text-green-600 font-medium">+5 Services</span>
        </div>
        <div className="flex justify-between">
          <span>Wave 208 Deployed</span>
          <span className="text-green-600 font-medium">+10 Services</span>
        </div>
        <div className="flex justify-between">
          <span>Wave 207 Deployed</span>
          <span className="text-green-600 font-medium">+10 Services</span>
        </div>
        <div className="flex justify-between">
          <span>Total Services</span>
          <span className="text-blue-600 font-medium">2,400+</span>
        </div>
      </div>
    </div>
  </div>
  
  {/* Monitoring Link */}
  <div className="mt-8 text-center">
    <Link href="/agents-monitoring" className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
      <span className="mr-2">📈</span> View Detailed Agent Analytics
    </Link>
  </div>
</div>
`;

export default function AgentsMonitoring() {
  return (
    <div dangerouslySetInnerHTML={{ __html: AGENTS_MONITORING }} />
  );
}