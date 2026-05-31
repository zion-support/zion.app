import React from 'react';

export default function V901V905Showcase() {
  const engines = [
    {
      id: 'V901',
      name: 'Real-Time Data Streaming Engine',
      icon: '🌊',
      description: 'High-throughput event streaming with sub-second latency, supporting Kafka, RabbitMQ, and MQTT protocols',
      capabilities: [
        'Sub-100ms processing latency',
        'Windowed aggregations (tumbling, sliding, session)',
        '100,000+ events/sec throughput',
        'Exactly-once delivery semantics',
        'Schema validation and evolution',
        '99.99% availability guarantee'
      ]
    },
    {
      id: 'V902',
      name: 'Custom Dashboard Generator',
      icon: '📊',
      description: 'Drag-and-drop dashboard builder with 50+ widget types, real-time data binding, and responsive design',
      capabilities: [
        '50+ widget types (charts, KPIs, tables, maps)',
        'Drag-and-drop layout builder',
        'Real-time data binding',
        'Interactive filters and drill-downs',
        'Export to PDF/PNG',
        'Scheduled email reports'
      ]
    },
    {
      id: 'V903',
      name: 'Data Pipeline Orchestrator',
      icon: '🔄',
      description: 'Enterprise ETL/ELT platform with 200+ connectors, visual pipeline builder, and automated scheduling',
      capabilities: [
        '200+ data source connectors',
        'Visual pipeline builder',
        'Cron-based scheduling',
        '15+ transformation types',
        '100K+ rows/sec throughput',
        'Exactly-once delivery guarantee'
      ]
    },
    {
      id: 'V904',
      name: 'Data Visualization Engine',
      icon: '🎨',
      description: 'Interactive visualization library with 30+ chart types, custom theming, and export capabilities',
      capabilities: [
        '30+ chart types (line, bar, pie, heatmap, network)',
        'Custom themes and branding',
        'Interactive exploration',
        'Export to PNG/SVG/PDF/HTML',
        'Responsive design',
        'Accessibility compliant'
      ]
    },
    {
      id: 'V905',
      name: 'Analytics Automation Engine',
      icon: '⚡',
      description: 'Automated analytics with scheduled reports, threshold alerts, anomaly detection, and multi-channel delivery',
      capabilities: [
        'Scheduled report generation',
        'Threshold-based alerting',
        'Anomaly detection (statistical)',
        'Multi-channel delivery (email, Slack, Teams)',
        'Data quality monitoring',
        'Automated insight distribution'
      ]
    }
  ];

  const services = [
    { category: 'Data Streaming', count: 6, icon: '🌊' },
    { category: 'Dashboards & BI', count: 6, icon: '📊' },
    { category: 'Data Integration', count: 6, icon: '🔄' },
    { category: 'Data Visualization', count: 6, icon: '🎨' },
    { category: 'Analytics Automation', count: 6, icon: '⚡' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Advanced Analytics & BI Suite
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five cutting-edge AI engines powering real-time data streaming, custom dashboards, 
            data pipelines, visualizations, and analytics automation — with 30 new services.
          </p>
        </div>

        {/* Engine Showcase */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine) => (
            <div key={engine.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-white/40 transition-all">
              <div className="text-5xl mb-4">{engine.icon}</div>
              <div className="text-sm font-mono text-purple-300 mb-2">{engine.id}</div>
              <h3 className="text-xl font-bold text-white mb-3">{engine.name}</h3>
              <p className="text-gray-300 text-sm mb-4">{engine.description}</p>
              <ul className="space-y-2">
                {engine.capabilities.slice(0, 4).map((capability, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{capability}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Services Overview */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-12">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">30 New Analytics Services</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {services.map((service, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl mb-2">{service.icon}</div>
                <div className="text-white font-semibold mb-1">{service.category}</div>
                <div className="text-purple-300 text-sm">{service.count} services</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">905</div>
            <div className="text-gray-400 text-sm">Total AI Engines</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">4,327</div>
            <div className="text-gray-400 text-sm">Total Services</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">100K+</div>
            <div className="text-gray-400 text-sm">Events/Sec</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">&lt;100ms</div>
            <div className="text-gray-400 text-sm">Latency</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <a href="/services?category=Advanced%20Analytics" className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg">
            Explore Analytics Services →
          </a>
        </div>
      </div>
    </section>
  );
}
