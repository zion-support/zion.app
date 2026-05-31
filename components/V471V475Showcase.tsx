// components/V471V475Showcase.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Bot, 
  Link, 
  Shield,
  CheckCircle,
  ArrowRight,
  Zap,
  Clock,
  Users,
  BarChart3,
  AlertTriangle
} from 'lucide-react';

const engines = [
  {
    version: 'V471',
    name: 'Email Sentiment Tracking Over Time',
    icon: TrendingUp,
    color: 'from-blue-500 to-cyan-500',
    description: 'Track sentiment evolution across email threads to identify relationship health and escalation risks.',
    features: [
      'Sentiment timeline analysis',
      'Relationship health scoring',
      'Escalation risk prediction',
      'Trend analysis and alerts'
    ],
    benefits: [
      'Prevent customer churn',
      'Early warning for escalations',
      'Data-driven communication'
    ]
  },
  {
    version: 'V472',
    name: 'Email Priority Queue Manager',
    icon: Target,
    color: 'from-purple-500 to-pink-500',
    description: 'AI-powered email prioritization that automatically sorts inbox by urgency, importance, and business value.',
    features: [
      'Smart priority scoring (0-100)',
      'Urgency detection',
      'Importance analysis',
      'Queue position management'
    ],
    benefits: [
      'Focus on what matters most',
      'Never miss critical emails',
      'Improve response times'
    ]
  },
  {
    version: 'V473',
    name: 'Email Auto-Responder Intelligence',
    icon: Bot,
    color: 'from-green-500 to-emerald-500',
    description: 'Smart out-of-office and auto-reply system with context-aware responses and intelligent routing.',
    features: [
      'Context-aware auto-replies',
      'Business hours detection',
      'Vacation mode management',
      'Emergency escalation routing'
    ],
    benefits: [
      '24/7 professional communication',
      'Automatic emergency routing',
      'Never leave customers waiting'
    ]
  },
  {
    version: 'V474',
    name: 'Email Integration Hub',
    icon: Link,
    color: 'from-orange-500 to-red-500',
    description: 'Connects email with CRM, project management, and business tools for seamless workflow automation.',
    features: [
      'CRM synchronization',
      'Project management integration',
      'Task creation automation',
      'Webhook triggers'
    ],
    benefits: [
      'Eliminate manual data entry',
      'Seamless workflow automation',
      'Save hours of work'
    ]
  },
  {
    version: 'V475',
    name: 'Email Compliance Checker',
    icon: Shield,
    color: 'from-indigo-500 to-blue-500',
    description: 'Real-time email compliance validation for GDPR, HIPAA, PCI-DSS, SOX, and other regulations.',
    features: [
      'PII detection and redaction',
      'Multi-framework compliance',
      'Compliance scoring (0-100)',
      'Audit trail generation'
    ],
    benefits: [
      'Avoid compliance violations',
      'Protect sensitive data',
      'Reduce legal risk'
    ]
  }
];

const V471V475Showcase: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-white mb-4">
            Latest: V471-V475 Email Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five powerful new engines for sentiment tracking, priority management, auto-responses, integrations, and compliance
          </p>
        </motion.div>

        {/* Engine Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine, index) => {
            const Icon = engine.icon;
            return (
              <motion.div
                key={engine.version}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105"
              >
                <div className={`inline-block p-3 rounded-lg bg-gradient-to-r ${engine.color} mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
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
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
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
                        <ArrowRight className="w-4 h-4 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
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
                <TrendingUp className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Sentiment Intelligence</h4>
              <p className="text-gray-300 text-sm">Track relationship health and prevent churn</p>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-purple-500/20 mb-4">
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Smart Prioritization</h4>
              <p className="text-gray-300 text-sm">Focus on what matters, respond faster</p>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-green-500/20 mb-4">
                <Zap className="w-8 h-8 text-green-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Automation</h4>
              <p className="text-gray-300 text-sm">24/7 intelligent responses and integrations</p>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-4 rounded-full bg-indigo-500/20 mb-4">
                <Shield className="w-8 h-8 text-indigo-400" />
              </div>
              <h4 className="text-white font-semibold mb-2">Compliance</h4>
              <p className="text-gray-300 text-sm">GDPR, HIPAA, PCI-DSS compliance built-in</p>
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
              <Users className="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold mb-1">Reply-All Enforcement</h4>
                <p className="text-gray-200 text-sm">All engines enforce reply-all for multi-recipient emails</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <BarChart3 className="w-6 h-6 text-white flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-white font-semibold mb-1">Case-by-Case Analysis</h4>
                <p className="text-gray-200 text-sm">Each email analyzed individually with AI</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-white flex-shrink-0 mt-1" />
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
              <p className="text-lg">📞 <strong>Call:</strong> +1 302 464 0950</p>
              <p className="text-lg">✉️ <strong>Email:</strong> kleber@ziontechgroup.com</p>
              <p className="text-lg">📍 <strong>Visit:</strong> 364 E Main St STE 1008, Middletown DE 19709</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default V471V475Showcase;
