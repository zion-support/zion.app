'use client';

import { motion } from 'framer-motion';

export default function V531V535Showcase() {
  const engines = [
    {
      version: 'V531',
      name: 'Context Memory',
      icon: '🧠',
      description: 'Remember and apply context from previous conversations for more relevant responses',
      features: ['Conversation history tracking', 'Context recall', 'Relationship memory', 'Commitment tracking', 'Personalization']
    },
    {
      version: 'V532',
      name: 'Tone Adapter',
      icon: '🎭',
      description: 'Automatically adjust email tone based on recipient relationship and context',
      features: ['6 tone styles', 'Relationship detection', 'Cultural awareness', 'Emotional intelligence', 'Tone optimization']
    },
    {
      version: 'V533',
      name: 'Urgency Escalator',
      icon: '🚨',
      description: 'Detect urgent emails and escalate with priority handling and SLA tracking',
      features: ['Urgency detection', 'Priority scoring', 'SLA tracking', 'Intelligent escalation', 'Team routing']
    },
    {
      version: 'V534',
      name: 'Follow-up Scheduler',
      icon: '📅',
      description: 'Automatically schedule follow-up emails based on response patterns and optimal timing',
      features: ['Smart scheduling', 'Optimal timing', 'Sequence management', 'Response tracking', 'Personalization']
    },
    {
      version: 'V535',
      name: 'Insight Extractor',
      icon: '💡',
      description: 'Extract key insights, facts, and action items from emails for easy reference',
      features: ['Fact extraction', 'Action item detection', 'Decision tracking', 'Knowledge indexing', 'Searchable insights']
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            V531-V535: Next-Gen Email Intelligence
          </h2>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Advanced engines that remember context, adapt tone, escalate urgency, schedule follow-ups, and extract insights
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine, idx) => (
            <motion.div
              key={engine.version}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-purple-400 transition-all"
            >
              <div className="text-5xl mb-4">{engine.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {engine.version}: {engine.name}
              </h3>
              <p className="text-purple-200 mb-4">{engine.description}</p>
              <ul className="space-y-2">
                {engine.features.map((feature, i) => (
                  <li key={i} className="text-purple-100 text-sm flex items-start">
                    <span className="mr-2 text-green-400">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 max-w-4xl mx-auto"
        >
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            Why Choose V531-V535?
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">🧠</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">Contextual Intelligence</h4>
                  <p className="text-purple-200 text-sm">Remember past conversations and build on them</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🎭</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">Adaptive Communication</h4>
                  <p className="text-purple-200 text-sm">Match tone to relationship and context</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🚨</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">Priority Management</h4>
                  <p className="text-purple-200 text-sm">Never miss urgent emails again</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-2xl mr-3">📅</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">Automated Follow-ups</h4>
                  <p className="text-purple-200 text-sm">Improve response rates with smart scheduling</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">💡</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">Knowledge Extraction</h4>
                  <p className="text-purple-200 text-sm">Turn emails into searchable insights</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">✅</span>
                <div>
                  <h4 className="text-white font-semibold mb-1">Reply-All Enforced</h4>
                  <p className="text-purple-200 text-sm">100% transparency in all communications</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-8 py-4 text-white font-bold text-lg">
            335 Engines | 2,421 Services | All Reply-All Enforced
          </div>
        </motion.div>
      </div>
    </section>
  );
}
