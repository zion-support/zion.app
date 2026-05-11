'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, ArrowRight } from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'maintenance';
  latency: number;
  uptime: number;
}

const aiServices: ServiceStatus[] = [
  { name: 'Voice AI', status: 'operational', latency: 45, uptime: 99.99 },
  { name: 'Chatbot API', status: 'operational', latency: 32, uptime: 99.98 },
  { name: 'ML Engine', status: 'operational', latency: 120, uptime: 99.95 },
  { name: 'Document AI', status: 'operational', latency: 85, uptime: 99.90 },
  { name: 'Analytics', status: 'degraded', latency: 250, uptime: 98.50 },
  { name: 'Translation', status: 'operational', latency: 95, uptime: 99.85 },
  { name: 'Image Recognition', status: 'operational', latency: 78, uptime: 99.92 },
  { name: 'Recommendation', status: 'operational', latency: 25, uptime: 99.99 },
];

export default function AIStatusDashboard() {
  const [services] = useState<ServiceStatus[]>(aiServices);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-500';
      case 'degraded': return 'bg-amber-500';
      case 'maintenance': return 'bg-blue-500';
    }
  };

  const getLatencyColor = (latency: number) => {
    if (latency < 100) return 'text-green-400';
    if (latency < 200) return 'text-amber-400';
    return 'text-red-400';
  };

  const operationalCount = services.filter(s => s.status === 'operational').length;
  const overallUptime = (services.reduce((acc, s) => acc + s.uptime, 0) / services.length).toFixed(2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Hero */}
      <section className="relative py-16 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-violet-600/20 text-violet-300 px-4 py-2 rounded-full text-sm mb-4">
              <Cpu className="w-4 h-4" />
              <span>Real-time Status</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              AI Services{' '}
              <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                Status Dashboard
              </span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto">
              Monitor the real-time health and performance of all Zion AI services.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center"
            >
              <div className="text-3xl font-bold text-white">{operationalCount}/{services.length}</div>
              <div className="text-slate-400 text-sm">Services Operational</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center"
            >
              <div className="text-3xl font-bold text-green-400">{overallUptime}%</div>
              <div className="text-slate-400 text-sm">Overall Uptime</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center"
            >
              <div className="text-3xl font-bold text-blue-400">200+</div>
              <div className="text-slate-400 text-sm">AI Capabilities</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <Brain className="w-6 h-6 text-violet-400" />
            Active Services
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service, index) => (
              <motion.div
                key={service.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-violet-500/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                    <span className="text-white font-medium">{service.name}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    service.status === 'operational' ? 'bg-green-500/20 text-green-400' :
                    service.status === 'degraded' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {service.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">
                    Latency: <span className={getLatencyColor(service.latency)}>{service.latency}ms</span>
                  </span>
                  <span className="text-slate-400">
                    Uptime: <span className="text-green-400">{service.uptime}%</span>
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Need Custom AI Integration?</h2>
            <p className="text-white/80 mb-6">Connect with our AI experts for custom implementations.</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-violet-600 rounded-full font-semibold hover:bg-slate-100 transition-colors"
             data-cta-event="cta_contact" data-cta-label="page">
              Contact Us <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}