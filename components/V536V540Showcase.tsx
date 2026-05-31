import React from 'react';
import { Brain, MessageSquare, FileText, Paperclip, Calendar } from 'lucide-react';

const V536V540Showcase: React.FC = () => {
  const engines = [
    {
      version: 'V536',
      name: 'Intent Classifier',
      icon: Brain,
      description: 'Automatically detect sender intent to provide targeted, relevant responses',
      features: ['12 intent categories', 'Confidence scoring', 'Urgency detection', 'Action recommendations'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      version: 'V537',
      name: 'Response Generator',
      icon: MessageSquare,
      description: 'Generate contextually appropriate draft responses based on intent and context',
      features: ['Context-aware responses', 'Multiple style options', 'Personalization', 'Tone matching'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      version: 'V538',
      name: 'Thread Summarizer',
      icon: FileText,
      description: 'Summarize long email threads with key points, decisions, and action items',
      features: ['Thread summaries', 'Key point extraction', 'Decision tracking', 'Action items'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      version: 'V539',
      name: 'Attachment Analyzer',
      icon: Paperclip,
      description: 'Analyze attachments to extract key information and identify important data',
      features: ['Multi-format support', 'Content extraction', 'Summarization', 'Security scanning'],
      color: 'from-orange-500 to-red-500'
    },
    {
      version: 'V540',
      name: 'Meeting Scheduler',
      icon: Calendar,
      description: 'Detect meeting requests and schedule with optimal time slots',
      features: ['Meeting detection', 'Smart scheduling', 'Calendar integration', 'Auto-invitations'],
      color: 'from-indigo-500 to-violet-500'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            V536-V540: Advanced Email Intelligence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Intent detection, smart responses, thread summaries, attachment analysis, and intelligent meeting scheduling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {engines.map((engine, idx) => {
            const Icon = engine.icon;
            return (
              <div
                key={engine.version}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${engine.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {engine.version}: {engine.name}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{engine.description}</p>
                <ul className="space-y-2">
                  {engine.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start">
                      <span className="mr-2 text-green-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Transform Your Email Intelligence?
          </h3>
          <p className="text-lg mb-6">
            340 engines. 2,446 services. Infinite possibilities.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div>📞 +1 302 464 0950</div>
            <div>✉️ kleber@ziontechgroup.com</div>
            <div>📍 364 E Main St STE 1008, Middletown DE 19709</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V536V540Showcase;
