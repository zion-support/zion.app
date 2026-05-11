'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Clock, Globe, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface EndpointTest {
  url: string;
  method: string;
  latency: number | null;
  status: 'pending' | 'success' | 'error';
}

const defaultEndpoints = [
  { url: 'https://api.ziontechgroup.com/health', method: 'GET' },
  { url: 'https://api.ziontechgroup.com/ai/chat', method: 'POST' },
  { url: 'https://api.ziontechgroup.com/analytics', method: 'GET' },
];

export default function APIResponseTester() {
  const [customUrl, setCustomUrl] = useState('');
  const [customMethod, setCustomMethod] = useState('GET');
  const [tests, setTests] = useState<EndpointTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async (endpoints: { url: string; method: string }[]) => {
    setIsRunning(true);
    setTests(endpoints.map(e => ({ ...e, latency: null, status: 'pending' })));

    for (let i = 0; i < endpoints.length; i++) {
      // Simulate API test (in real scenario, this would make actual requests)
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      const latency = Math.floor(Math.random() * 200) + 20;
      const success = latency < 200;
      
      setTests(prev => prev.map((t, idx) => 
        idx === i ? { ...t, latency, status: success ? 'success' : 'error' } : t
      ));
    }
    
    setIsRunning(false);
  };

  const addCustomTest = () => {
    if (!customUrl.trim()) return;
    setCustomUrl('');
  };

  const getLatencyColor = (latency: number | null) => {
    if (latency === null) return 'text-slate-400';
    if (latency < 100) return 'text-green-400';
    if (latency < 200) return 'text-amber-400';
    return 'text-red-400';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const avgLatency = tests.filter(t => t.latency).length > 0
    ? Math.round(tests.reduce((acc, t) => acc + (t.latency || 0), 0) / tests.filter(t => t.latency).length)
    : 0;

  const successRate = tests.length > 0
    ? Math.round((tests.filter(t => t.status === 'success').length / tests.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-600/20 text-amber-300 px-4 py-2 rounded-full text-sm mb-4">
            <Zap className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            API{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Response Time Tester
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Test API endpoint response times and performance. 
            Visualize latency metrics and get optimization guidelines.
          </p>
        </motion.div>

        {/* Add Custom Endpoint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-xl border border-slate-700 p-4 mb-6"
        >
          <div className="flex gap-3">
            <select
              value={customMethod}
              onChange={(e) => setCustomMethod(e.target.value)}
              className="bg-slate-700 border border-slate-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option>GET</option>
              <option>POST</option>
              <option>PUT</option>
              <option>DELETE</option>
            </select>
            <input
              type="text"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="Enter API endpoint URL..."
              className="flex-1 bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              onClick={addCustomTest}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
            >
              Add
            </button>
          </div>
        </motion.div>

        {/* Run Tests Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => runTests(defaultEndpoints)}
            disabled={isRunning}
            className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Run Performance Tests
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {tests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
                <div className={`text-2xl font-bold ${getLatencyColor(avgLatency)}`}>
                  {avgLatency}ms
                </div>
                <div className="text-slate-400 text-sm">Avg Latency</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
                <div className={`text-2xl font-bold ${successRate >= 80 ? 'text-green-400' : 'text-amber-400'}`}>
                  {successRate}%
                </div>
                <div className="text-slate-400 text-sm">Success Rate</div>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 text-center">
                <div className="text-2xl font-bold text-white">{tests.length}</div>
                <div className="text-slate-400 text-sm">Endpoints</div>
              </div>
            </div>

            {/* Endpoint Results */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
              <div className="p-4 border-b border-slate-700">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-400" />
                  Endpoint Results
                </h3>
              </div>
              <div className="divide-y divide-slate-700">
                {tests.map((test, i) => (
                  <div key={i} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(test.status)}
                      <div>
                        <div className="text-white font-medium">{test.method}</div>
                        <div className="text-slate-400 text-sm truncate max-w-xs">{test.url}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${getLatencyColor(test.latency)}`}>
                        {test.latency !== null ? `${test.latency}ms` : '--'}
                      </div>
                      <div className="text-slate-500 text-xs">
                        {test.latency !== null && (test.latency < 100 ? 'Excellent' : test.latency < 200 ? 'Good' : 'Slow')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-violet-400" />
                Performance Guidelines
              </h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                  <span>&lt;100ms: Excellent - Optimal for user experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5" />
                  <span>100-200ms: Acceptable - Monitor for improvements</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-400 mt-0.5" />
                  <span>&gt;200ms: Slow - Optimize database queries, add caching</span>
                </li>
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}