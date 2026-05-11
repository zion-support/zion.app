'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Globe, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface ServiceHealth {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: number;
  latency: number;
  region: string;
}

const services: ServiceHealth[] = [
  { name: 'AI Voice API', status: 'operational', uptime: 99.99, latency: 45, region: 'US-East' },
  { name: 'ML Engine', status: 'operational', uptime: 99.95, latency: 120, region: 'US-West' },
  { name: 'Chatbot Platform', status: 'operational', uptime: 99.98, latency: 35, region: 'EU-Central' },
  { name: 'Analytics Engine', status: 'degraded', uptime: 98.50, latency: 250, region: 'US-East' },
  { name: 'Document AI', status: 'operational', uptime: 99.90, latency: 85, region: 'US-East' },
  { name: 'Recommendation Engine', status: 'operational', uptime: 99.99, latency: 25, region: 'Global' },
  { name: 'Security Scanner', status: 'operational', uptime: 100, latency: 15, region: 'Global' },
  { name: 'Translation API', status: 'operational', uptime: 99.85, latency: 95, region: 'Asia-Pacific' },
];

export default function AIServiceHealthMonitor() {
  const [isLoading, setIsLoading] = useState(true);
  const [healthData] = useState<ServiceHealth[]>(services);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'down':
        return <XCircle className="w-4 h-4 text-red-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'bg-green-500/20 text-green-400';
      case 'degraded':
        return 'bg-amber-500/20 text-amber-400';
      case 'down':
        return 'bg-red-500/20 text-red-400';
    }
  };

  const overallHealth = healthData.filter(s => s.status === 'operational').length / healthData.length * 100;

  const getLatencyColor = (latency: number) => {
    if (latency < 50) return 'text-green-400';
    if (latency < 150) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">AI Service Health</h3>
            <p className="text-slate-400 text-sm">Real-time status monitoring</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{overallHealth.toFixed(1)}%</div>
          <p className="text-slate-400 text-xs">Overall Health</p>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-slate-800/50 rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-slate-700 rounded-lg" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-700 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-slate-700 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {healthData.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/50 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(service.status)}
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-medium">{service.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {service.region}
                    </span>
                    <span className="text-xs text-slate-500">
                      {service.uptime.toFixed(2)}% uptime
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className={`font-medium ${getLatencyColor(service.latency)}`}>
                  {service.latency}ms
                </span>
                <p className="text-xs text-slate-500">latency</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Last updated: Just now
        </div>
        <button className="text-sm text-blue-400 hover:text-blue-300">
          View detailed dashboard →
        </button>
      </div>
    </div>
  );
}