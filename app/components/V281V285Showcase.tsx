import React from 'react';

const V281V285Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V281',
      name: 'Sentiment Evolution Tracker',
      icon: '🧠',
      description: 'Track sentiment changes throughout email threads with mood shift detection and conversation outcome prediction',
      features: ['Sentiment tracking', 'Mood shift detection', 'Outcome prediction', 'Escalation risk analysis']
    },
    {
      version: 'V282',
      name: 'Compliance Guardian Pro',
      icon: '⚖️',
      description: 'Real-time compliance checking for GDPR, HIPAA, SOX, CCPA with auto-redaction and audit trails',
      features: ['Multi-framework compliance', 'Auto-redaction', 'Audit trails', 'Risk scoring']
    },
    {
      version: 'V283',
      name: 'Knowledge Graph Builder',
      icon: '🕸️',
      description: 'Build knowledge graphs from email conversations with relationship mapping and semantic search',
      features: ['Entity extraction', 'Relationship mapping', 'Topic clustering', 'Semantic indexing']
    },
    {
      version: 'V284',
      name: 'Priority Decay Engine',
      icon: '⏰',
      description: 'Dynamic priority adjustment with automatic escalation for aging emails',
      features: ['Priority decay', 'Auto-escalation', 'Reminder generation', 'Action determination']
    },
    {
      version: 'V285',
      name: 'Intelligence Orchestrator',
      icon: '🎭',
      description: 'Coordinate multiple email engines with intelligent routing and unified intelligence',
      features: ['Multi-engine coordination', 'Intelligent routing', 'Unified intelligence', 'Orchestrated responses']
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container-page">
        <div className="text-center mb-12">
          <h2 className="section-heading">Email Intelligence V281-V285</h2>
          <p className="section-subheading">
            Advanced email analysis with sentiment tracking, compliance checking, knowledge graphs, 
            priority management, and intelligent orchestration
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {engines.map((engine) => (
            <div key={engine.version} className="card hover:shadow-xl transition-shadow">
              <div className="text-5xl mb-4">{engine.icon}</div>
              <div className="text-sm font-semibold text-indigo-600 mb-2">{engine.version}</div>
              <h3 className="text-xl font-bold mb-3">{engine.name}</h3>
              <p className="text-gray-600 mb-4">{engine.description}</p>
              <ul className="space-y-2">
                {engine.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-gray-700">
                    <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-center">Key Capabilities</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-lg mb-2">🔍 Case-by-Case Analysis</h4>
              <p className="text-gray-600">
                Each email is analyzed individually to determine the most appropriate action based on content, 
                context, sentiment, compliance requirements, and priority.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">📧 Reply-All Enforcement</h4>
              <p className="text-gray-600">
                All engines enforce reply-all for multi-recipient emails, ensuring everyone stays informed 
                and conversations remain transparent.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">🤖 Intelligent Automation</h4>
              <p className="text-gray-600">
                Automatic escalation, compliance checking, sentiment tracking, and knowledge building 
                without manual intervention.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-lg mb-2">🎯 Context-Aware Actions</h4>
              <p className="text-gray-600">
                Engines understand context, relationships, and business impact to take the most 
                appropriate action for each situation.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <a href="/services" className="btn-primary">
            View All 1,374 Services
          </a>
        </div>
      </div>
    </section>
  );
};

export default V281V285Showcase;
