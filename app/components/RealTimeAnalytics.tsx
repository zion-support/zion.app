'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Eye, Clock, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';

interface AnalyticsData {
  visitors: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: { page: string; views: number }[];
}

const MOCK_DATA: AnalyticsData = {
  visitors: 1247,
  pageViews: 3892,
  avgSessionDuration: 245,
  bounceRate: 32.5,
  topPages: [
    { page: '/ai', views: 892 },
    { page: '/', views: 756 },
    { page: '/contact', views: 423 },
    { page: '/pricing', views: 312 },
    { page: '/blog', views: 287 }
  ]
};

export default function RealTimeAnalytics() {
  const [data, setData] = useState<AnalyticsData>(MOCK_DATA);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        visitors: prev.visitors + Math.floor(Math.random() * 5),
        pageViews: prev.pageViews + Math.floor(Math.random() * 12)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const stats = [
    { label: 'Visitors Today', value: data.visitors.toLocaleString(), icon: Users, change: +12.5, color: 'violet' },
    { label: 'Page Views', value: data.pageViews.toLocaleString(), icon: Eye, change: +8.3, color: 'blue' },
    { label: 'Avg. Session', value: formatDuration(data.avgSessionDuration), icon: Clock, change: +5.2, color: 'emerald' },
    { label: 'Bounce Rate', value: `${data.bounceRate}%`, icon: TrendingUp, change: -3.1, color: 'amber' }
  ];

  return (
    <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">Real-Time Analytics</h3>
        <span className="flex items-center gap-1 text-green-400 text-sm">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900/50 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              <span className={`flex items-center text-xs ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                {Math.abs(stat.change)}%
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-medium text-slate-400 mb-3">Top Pages</h4>
        <div className="space-y-2">
          {data.topPages.map((page) => (
            <div key={page.page} className="flex items-center justify-between">
              <span className="text-slate-300 text-sm">{page.page}</span>
              <span className="text-violet-400 font-medium">{page.views}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
