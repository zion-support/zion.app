import React from 'react';

export default function V511V515Showcase() {
  const engines = [
    {
      version: 'V511',
      name: 'Crisis Communication Engine',
      icon: '🚨',
      description: 'Detect crisis signals from emails and coordinate multi-stakeholder responses with automated escalation chains',
      features: ['Crisis signal detection', '5 severity levels', '8 stakeholder templates', 'Escalation automation', 'Post-crisis analysis'],
      color: 'from-red-500 to-orange-500'
    },
    {
      version: 'V512',
      name: 'Sales Funnel Optimizer',
      icon: '🎯',
      description: 'Track conversations through 8 sales stages and generate personalized nurturing sequences',
      features: ['8-stage tracking', 'Deal health scoring', 'Nurturing sequences', 'Pipeline velocity', 'Conversion optimization'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      version: 'V513',
      name: 'Knowledge Graph Builder',
      icon: '🧠',
      description: 'Build interactive knowledge graphs from emails with entity extraction and semantic search',
      features: ['8 entity types', '10 relationship types', 'Semantic search', 'Visualization', 'Knowledge gap detection'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      version: 'V514',
      name: 'Customer Health Monitor',
      icon: '💚',
      description: 'Track customer health with churn prediction, NPS scoring, and expansion opportunity detection',
      features: ['5-tier health status', '6 signal types', 'Churn prediction', 'NPS prediction', 'Lifecycle tracking'],
      color: 'from-teal-500 to-cyan-500'
    },
    {
      version: 'V515',
      name: 'Regulatory Compliance Scanner',
      icon: '⚖️',
      description: 'Scan emails for 8 regulatory frameworks with industry-specific rules and audit trail generation',
      features: ['8 frameworks (GDPR/HIPAA/SOX/FINRA)', 'Industry detection', 'Risk assessment', 'Audit trails', 'Remediation guidance'],
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            V511-V515: Advanced Business Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Crisis management, sales optimization, knowledge graphs, customer health, and regulatory compliance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {engines.map((engine, idx) => (
            <div
              key={engine.version}
              className={`bg-gradient-to-br ${engine.color} p-6 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-300`}
            >
              <div className="text-5xl mb-4">{engine.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {engine.version}: {engine.name}
              </h3>
              <p className="text-gray-100 mb-4 text-sm">{engine.description}</p>
              <ul className="space-y-2">
                {engine.features.map((feature, i) => (
                  <li key={i} className="text-gray-200 text-sm flex items-start">
                    <span className="mr-2">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-slate-800 rounded-xl p-8 shadow-2xl">
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            🏆 Platform Stats
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">315+</div>
              <div className="text-gray-300">Email Engines</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">2,321+</div>
              <div className="text-gray-300">Total Services</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">8</div>
              <div className="text-gray-300">Regulatory Frameworks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">8</div>
              <div className="text-gray-300">Sales Stages</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-400 mb-2">100%</div>
              <div className="text-gray-300">Reply-All Enforced</div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your Business Intelligence?
          </h3>
          <p className="text-gray-100 mb-6">
            315 engines. 2,321 services. Infinite possibilities.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-white text-sm">
            <div>📞 +1 302 464 0950</div>
            <div>✉️ kleber@ziontechgroup.com</div>
            <div>📍 364 E Main St STE 1008, Middletown DE 19709</div>
          </div>
        </div>
      </div>
    </section>
  );
}
