import React from 'react';
import { motion } from 'framer-motion';

const V476V480Showcase = () => {
  const engines = [
    {
      version: 'V476',
      name: 'Email Thread Summarizer Pro',
      icon: '📋',
      color: 'from-blue-500 to-indigo-600',
      description: 'Generate executive summaries of long email threads with key decisions, action items, and timeline.',
      features: [
        'Thread analysis and summarization',
        'Decision extraction',
        'Action item tracking',
        'Timeline generation'
      ],
      benefits: [
        'Save hours reading long threads',
        'Never miss important decisions',
        'Track action items automatically'
      ]
    },
    {
      version: 'V477',
      name: 'Email Attachment Intelligence',
      icon: '📎',
      color: 'from-red-500 to-orange-600',
      description: 'Scan attachments for malware and sensitive data, extract text from documents, and auto-categorize files.',
      features: [
        'Malware scanning and detection',
        'Sensitive data detection',
        'Text extraction from documents',
        'Security risk assessment'
      ],
      benefits: [
        'Protect against malware',
        'Prevent data leaks',
        'Quick document preview'
      ]
    },
    {
      version: 'V478',
      name: 'Email Follow-up Automation',
      icon: '⏰',
      color: 'from-green-500 to-emerald-600',
      description: 'Track emails that need follow-up, send automatic reminders, and generate smart follow-up messages.',
      features: [
        'Follow-up detection and tracking',
        'Automatic reminder scheduling',
        'Smart message generation',
        'Priority-based timing'
      ],
      benefits: [
        'Never forget to follow up',
        'Improve response rates',
        'Save time on manual tracking'
      ]
    },
    {
      version: 'V479',
      name: 'Email A/B Testing Platform',
      icon: '🧪',
      color: 'from-purple-500 to-pink-600',
      description: 'Test subject lines and email content to optimize performance with statistical analysis.',
      features: [
        'Subject line variant generation',
        'Performance tracking',
        'Statistical significance analysis',
        'Automatic winner selection'
      ],
      benefits: [
        'Optimize email performance',
        'Data-driven decisions',
        'Increase engagement rates'
      ]
    },
    {
      version: 'V480',
      name: 'Email Knowledge Base Builder',
      icon: '📚',
      color: 'from-cyan-500 to-blue-600',
      description: 'Extract knowledge from emails and build a searchable knowledge base with intelligent suggestions.',
      features: [
        'Knowledge extraction',
        'Topic clustering',
        'Searchable knowledge base',
        'Pattern recognition'
      ],
      benefits: [
        'Build organizational knowledge',
        'Quick information retrieval',
        'Reduce knowledge silos'
      ]
    }
  ];

  const contactInfo = {
    phone: '+1 302 464 0950',
    email: 'kleber@ziontechgroup.com',
    address: '364 E Main St STE 1008, Middletown DE 19709'
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Latest: V476-V480 Email Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five powerful new engines for thread summarization, attachment intelligence, follow-up automation, A/B testing, and knowledge management
          </p>
        </motion.div>

        {/* Engine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine, index) => (
            <motion.div
              key={engine.version}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
            >
              <div className={`inline-block p-3 rounded-lg bg-gradient-to-r ${engine.color} mb-4`}>
                <span className="text-4xl">{engine.icon}</span>
              </div>
              
              <div className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-3">
                {engine.version}
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-3">
                {engine.name}
              </h3>
              
              <p className="text-gray-300 mb-4">
                {engine.description}
              </p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Key Features:</h4>
                <ul className="space-y-1">
                  {engine.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start">
                      <span className="text-green-400 mr-2 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-400 mb-2">Benefits:</h4>
                <ul className="space-y-1">
                  {engine.benefits.map((benefit, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start">
                      <span className="text-blue-400 mr-2 mt-0.5">→</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20 mb-16"
        >
          <h3 className="text-3xl font-bold text-white mb-8 text-center">
            Why These Engines Matter
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-blue-500/20 mb-4">
                <span className="text-3xl">⏱️</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Save Time</h4>
              <p className="text-gray-300 text-sm">Summarize threads in seconds, not hours</p>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-red-500/20 mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Stay Secure</h4>
              <p className="text-gray-300 text-sm">Scan attachments for malware and sensitive data</p>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-green-500/20 mb-4">
                <span className="text-3xl">📈</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Improve Results</h4>
              <p className="text-gray-300 text-sm">A/B test and optimize email performance</p>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-purple-500/20 mb-4">
                <span className="text-3xl">🧠</span>
              </div>
              <h4 className="text-white font-semibold mb-2">Build Knowledge</h4>
              <p className="text-gray-300 text-sm">Extract and organize organizational knowledge</p>
            </div>
          </div>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-16"
        >
          <h3 className="text-3xl font-bold text-white mb-6 text-center">
            Key Features Across All Engines
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">✉️</span>
              <div>
                <h4 className="text-white font-semibold mb-1">Reply-All Enforcement</h4>
                <p className="text-gray-200 text-sm">All engines enforce reply-all for multi-recipient emails</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔍</span>
              <div>
                <h4 className="text-white font-semibold mb-1">Case-by-Case Analysis</h4>
                <p className="text-gray-200 text-sm">Each email analyzed individually with AI</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="text-2xl">⚡</span>
              <div>
                <h4 className="text-white font-semibold mb-1">Real-Time Processing</h4>
                <p className="text-gray-200 text-sm">Instant insights and actionable recommendations</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Email Intelligence?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of professionals using AI-powered email management
          </p>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 inline-block">
            <div className="space-y-3 text-left text-gray-200">
              <p className="text-lg">📞 <strong>Call:</strong> {contactInfo.phone}</p>
              <p className="text-lg">✉️ <strong>Email:</strong> {contactInfo.email}</p>
              <p className="text-lg">📍 <strong>Visit:</strong> {contactInfo.address}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default V476V480Showcase;
