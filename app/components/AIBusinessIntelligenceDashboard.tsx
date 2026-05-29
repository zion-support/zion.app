'use client';

import { useState, useEffect } from 'react';

interface MetricCard {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

interface ChartData {
  label: string;
  value: number;
}

export default function AIBusinessIntelligenceDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'email' | 'services'>('overview');
  const [metrics, setMetrics] = useState<MetricCard[]>([]);
  const [emailMetrics, setEmailMetrics] = useState<MetricCard[]>([]);
  const [serviceMetrics, setServiceMetrics] = useState<MetricCard[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Simulate real-time data
    setMetrics([
      { label: 'Total Revenue', value: '$2.4M', change: 23.5, icon: '💰', color: 'from-green-500 to-emerald-600' },
      { label: 'Active Clients', value: '847', change: 12.3, icon: '👥', color: 'from-blue-500 to-cyan-600' },
      { label: 'Services Deployed', value: '1,370', change: 8.7, icon: '🚀', color: 'from-purple-500 to-pink-600' },
      { label: 'Client Satisfaction', value: '98.5%', change: 2.1, icon: '⭐', color: 'from-yellow-500 to-orange-600' },
    ]);

    setEmailMetrics([
      { label: 'Emails Sent', value: '24,847', change: 15.2, icon: '📧', color: 'from-blue-500 to-indigo-600' },
      { label: 'Open Rate', value: '36.2%', change: 8.4, icon: '📬', color: 'from-green-500 to-teal-600' },
      { label: 'Reply Rate', value: '21.8%', change: 12.6, icon: '💬', color: 'from-purple-500 to-pink-600' },
      { label: 'Quality Score', value: '0.92', change: 5.3, icon: '✨', color: 'from-yellow-500 to-orange-600' },
    ]);

    setServiceMetrics([
      { label: 'AI Services', value: '642', change: 18.5, icon: '🧠', color: 'from-purple-500 to-indigo-600' },
      { label: 'IT Services', value: '328', change: 9.2, icon: '💻', color: 'from-blue-500 to-cyan-600' },
      { label: 'Cloud Services', value: '215', change: 14.7, icon: '☁️', color: 'from-sky-500 to-blue-600' },
      { label: 'Security Services', value: '185', change: 11.3, icon: '🔒', color: 'from-red-500 to-pink-600' },
    ]);

    setChartData([
      { label: 'Jan', value: 65 },
      { label: 'Feb', value: 72 },
      { label: 'Mar', value: 78 },
      { label: 'Apr', value: 85 },
      { label: 'May', value: 92 },
      { label: 'Jun', value: 98 },
    ]);
  }, []);

  const renderMetricCard = (metric: MetricCard, index: number) => (
    <div
      key={index}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center text-2xl`}>
          {metric.icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-semibold ${
          metric.change > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{metric.change > 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(metric.change)}%</span>
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
        {metric.value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {metric.label}
      </div>
    </div>
  );

  const renderChart = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
        Growth Trend (Last 6 Months)
      </h3>
      <div className="flex items-end justify-between h-64 gap-4">
        {chartData.map((data, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg relative overflow-hidden" style={{ height: '200px' }}>
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t-lg transition-all duration-500"
                style={{ height: `${data.value}%` }}
              />
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {data.label}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              {data.value}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmailInsights = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {emailMetrics.map((metric, index) => renderMetricCard(metric, index))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🧪 A/B Test Results
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Friendly Tone</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Winner • 23.5% reply rate</div>
              </div>
              <div className="text-2xl">🏆</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Professional Tone</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">16.7% reply rate</div>
              </div>
              <div className="text-2xl">📊</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div>
                <div className="font-semibold text-gray-900 dark:text-white">Urgent Tone</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">23.3% reply rate</div>
              </div>
              <div className="text-2xl">⚡</div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💡 AI Recommendations
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
              <div className="font-semibold text-gray-900 dark:text-white mb-1">Use Friendly Tone</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Friendly tone emails show 40% higher engagement. Apply to all customer communications.
              </div>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-500">
              <div className="font-semibold text-gray-900 dark:text-white mb-1">Optimize Send Time</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Emails sent between 9-11 AM EST show 25% higher open rates.
              </div>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-500">
              <div className="font-semibold text-gray-900 dark:text-white mb-1">Personalize Subject Lines</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Including recipient's name increases open rate by 18%.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServiceInsights = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {serviceMetrics.map((metric, index) => renderMetricCard(metric, index))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🔥 Top Performing Services
          </h3>
          <div className="space-y-3">
            {[
              { name: 'AI Email Coaching Platform', category: 'AI', growth: 45 },
              { name: 'Case-by-Case Email Analysis', category: 'AI', growth: 38 },
              { name: 'Cloud Migration Services', category: 'Cloud', growth: 32 },
              { name: 'Cybersecurity Assessment', category: 'Security', growth: 28 },
              { name: 'Data Analytics Platform', category: 'Data', growth: 25 },
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm">
                    {service.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {service.category}
                  </div>
                </div>
                <div className="text-green-600 font-bold text-sm">
                  +{service.growth}%
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📊 Service Distribution
          </h3>
          <div className="space-y-4">
            {[
              { name: 'AI Services', count: 642, color: 'bg-purple-500', percentage: 47 },
              { name: 'IT Services', count: 328, color: 'bg-blue-500', percentage: 24 },
              { name: 'Cloud Services', count: 215, color: 'bg-cyan-500', percentage: 16 },
              { name: 'Security Services', count: 185, color: 'bg-red-500', percentage: 13 },
            ].map((service, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {service.name}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {service.count} ({service.percentage}%)
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`${service.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${service.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-semibold mb-4">
            🚀 NEW: V85 AI Business Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            AI Business Intelligence Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real-time insights powered by AI. Track performance, optimize strategies, and make data-driven decisions.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'email', label: 'Email Intelligence', icon: '📧' },
            { id: 'services', label: 'Services Analytics', icon: '🚀' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => renderMetricCard(metric, index))}
            </div>
            {renderChart()}
          </div>
        )}

        {activeTab === 'email' && renderEmailInsights()}

        {activeTab === 'services' && renderServiceInsights()}

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Ready to Unlock AI-Powered Insights?</h2>
            <p className="text-lg mb-6 opacity-90">
              Get real-time business intelligence, email optimization, and service analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:kleber@ziontechgroup.com"
                className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                📧 Get Started Today
              </a>
              <a
                href="tel:+130****0950"
                className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors border-2 border-white"
              >
                📞 Call +1 302 464 0950
              </a>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>📍 364 E Main St STE 1008, Middletown, DE 19709</p>
          <p className="mt-2">Powered by V83 Case-by-Case Email Intelligence + V84 AI Coaching + V85 A/B Testing</p>
        </div>
      </div>
    </div>
  );
}
