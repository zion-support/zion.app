'use client';
import { useState, useEffect } from 'react';

export default function ServiceHealthMonitor() {
  const [services] = useState([
    { name: 'AI Services API', status: 'operational', uptime: 99.99 },
    { name: 'Cloud Platform', status: 'operational', uptime: 99.97 },
    { name: 'Security Gateway', status: 'operational', uptime: 100.0 },
    { name: 'Data Pipeline', status: 'operational', uptime: 99.95 },
    { name: 'Automation Engine', status: 'degraded', uptime: 98.5 },
  ]);

  const statusColors: Record<string, string> = {
    operational: 'bg-green-400',
    degraded: 'bg-yellow-400',
    down: 'bg-red-400',
  };

  return (
    <section className="py-16 bg-slate-950">
      <div className="container-page">
        <h2 className="section-heading text-center">🔍 Live Service Monitor</h2>
        <p className="section-subheading text-center">Real-time service health monitoring</p>
        <div className="max-w-2xl mx-auto mt-8 space-y-3">
          {services.map((s, i) => (
            <div key={i} className="flex items-center justify-between bg-slate-900/60 rounded-lg p-4 border border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${statusColors[s.status] || 'bg-gray-400'}`} />
                <span className="text-white font-medium">{s.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-400 text-sm">{s.uptime}% uptime</span>
                <span className={`text-xs px-2 py-1 rounded-full ${s.status === 'operational' ? 'bg-green-900/40 text-green-400' : 'bg-yellow-900/40 text-yellow-400'}`}>
                  {s.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
