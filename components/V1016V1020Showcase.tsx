import React from 'react';

const V1016V1020Showcase: React.FC = () => {
  const engines = [
    {
      id: 'V1016',
      name: 'Email Design Optimizer',
      icon: '🎨',
      description: 'AI analyzes email HTML/CSS layout, colors, fonts, and responsive design for maximum engagement.',
      features: ['Responsive design check', 'Accessibility compliance', 'Font optimization', 'CTA analysis'],
      benefit: '+25% click-through rate',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'V1017',
      name: 'Smart Scheduling Assistant',
      icon: '📅',
      description: 'AI finds optimal meeting times across timezones, checks calendar availability, and sends invites automatically.',
      features: ['Timezone intelligence', 'Calendar integration', 'Auto-scheduling', 'Conflict resolution'],
      benefit: 'Save 3 hours/week',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'V1018',
      name: 'Email Search Intelligence',
      icon: '🔍',
      description: 'Semantic search across all emails with AI understanding context, not just keywords.',
      features: ['Semantic search', 'Natural language queries', 'Context understanding', 'Smart filtering'],
      benefit: 'Find any email in seconds',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'V1019',
      name: 'Email ROI Tracker',
      icon: '💰',
      description: 'Track revenue generated from email campaigns, calculate ROI, and optimize for profitability.',
      features: ['Revenue tracking', 'ROI calculation', 'Campaign analytics', 'Conversion tracking'],
      benefit: 'Maximize email ROI',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'V1020',
      name: 'Email Security Guardian',
      icon: '🛡️',
      description: 'Advanced phishing detection, malware scanning, link verification, and data loss prevention.',
      features: ['Phishing detection', 'Malware scanning', 'Link verification', 'Data loss prevention'],
      benefit: 'Block 99.9% threats',
      color: 'from-red-500 to-rose-500'
    }
  ];

  const services = [
    { name: 'Email Design Optimizer', price: '$89/mo', icon: '🎨' },
    { name: 'Email Accessibility Audit', price: '$129/mo', icon: '♿' },
    { name: 'Responsive Email Builder', price: '$149/mo', icon: '📱' },
    { name: 'Email CTA Optimizer', price: '$79/mo', icon: '🎯' },
    { name: 'Email Rendering Tester', price: '$99/mo', icon: '🖥️' },
    { name: 'Smart Scheduling Assistant', price: '$119/mo', icon: '📅' },
    { name: 'Meeting Coordinator Pro', price: '$159/mo', icon: '🤝' },
    { name: 'Calendar Intelligence', price: '$99/mo', icon: '🧠' },
    { name: 'Timezone Meeting Optimizer', price: '$89/mo', icon: '🌍' },
    { name: 'Meeting Agenda Generator', price: '$69/mo', icon: '📋' },
    { name: 'Email Search Intelligence', price: '$139/mo', icon: '🔍' },
    { name: 'Email Knowledge Base', price: '$179/mo', icon: '📚' },
    { name: 'Email Thread Summarizer', price: '$89/mo', icon: '📝' },
    { name: 'Email Attachment Search', price: '$119/mo', icon: '📎' },
    { name: 'Email Timeline View', price: '$99/mo', icon: '📊' },
    { name: 'Email ROI Tracker', price: '$199/mo', icon: '💰' },
    { name: 'Email Attribution Engine', price: '$229/mo', icon: '🎯' },
    { name: 'Email Campaign Analytics', price: '$169/mo', icon: '📈' },
    { name: 'Email Revenue Dashboard', price: '$189/mo', icon: '📊' },
    { name: 'Email Cost Optimizer', price: '$149/mo', icon: '💵' },
    { name: 'Email Security Guardian', price: '$249/mo', icon: '🛡️' },
    { name: 'Phishing Detection Pro', price: '$199/mo', icon: '🎣' },
    { name: 'Email Malware Scanner', price: '$179/mo', icon: '🦠' },
    { name: 'Email DLP Solution', price: '$269/mo', icon: '🔒' },
    { name: 'Email Authentication Checker', price: '$129/mo', icon: '✅' }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            V1016-V1020: Advanced Email Intelligence
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Five breakthrough engines that optimize design, schedule meetings intelligently, search semantically, 
            track ROI precisely, and secure emails with enterprise-grade protection.
          </p>
          <div className="mt-6 inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3">
            <span className="text-green-400 font-semibold">✓ All engines enforce reply-all</span>
            <span className="text-white">|</span>
            <span className="text-blue-400 font-semibold">✓ Case-by-case analysis</span>
          </div>
        </div>

        {/* Engines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {engines.map((engine) => (
            <div
              key={engine.id}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all hover:scale-105"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${engine.color} mb-4`}>
                <span className="text-3xl">{engine.icon}</span>
              </div>
              <div className="text-sm font-mono text-gray-400 mb-2">{engine.id}</div>
              <h3 className="text-2xl font-bold text-white mb-3">{engine.name}</h3>
              <p className="text-gray-300 mb-4">{engine.description}</p>
              <ul className="space-y-2 mb-4">
                {engine.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-white/20">
                <div className="text-sm text-gray-400 mb-1">Key Benefit</div>
                <div className="text-lg font-semibold text-white">{engine.benefit}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Services Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-white text-center mb-8">
            25 New Professional Services
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {services.map((service, idx) => (
              <div
                key={idx}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/30 transition-all hover:scale-105"
              >
                <div className="text-3xl mb-2">{service.icon}</div>
                <div className="text-sm font-semibold text-white mb-1">{service.name}</div>
                <div className="text-xs text-gray-400">{service.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Case-by-Case Analysis Demo */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            🔍 Case-by-Case Analysis in Action
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Example: Email Design Analysis</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <div>
                    <div className="text-white font-medium">Responsive Design: Passed</div>
                    <div className="text-sm text-gray-400">Mobile-optimized layout detected</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-yellow-400 text-xl">⚠</span>
                  <div>
                    <div className="text-white font-medium">Accessibility: Needs Improvement</div>
                    <div className="text-sm text-gray-400">Add alt text to 3 images</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">✗</span>
                  <div>
                    <div className="text-white font-medium">CTA Optimization: Failed</div>
                    <div className="text-sm text-gray-400">Button contrast too low (2.1:1)</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Example: Security Scan</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">🚨</span>
                  <div>
                    <div className="text-white font-medium">Phishing Detected: Critical</div>
                    <div className="text-sm text-gray-400">Suspicious link to bit.ly/verify-account</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-400 text-xl">🚨</span>
                  <div>
                    <div className="text-white font-medium">Spoofing Detected: Critical</div>
                    <div className="text-sm text-gray-400">SPF authentication failed</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-green-400 text-xl">✓</span>
                  <div>
                    <div className="text-white font-medium">Action: Block Email</div>
                    <div className="text-sm text-gray-400">Quarantined and reported to security team</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Email Intelligence?
          </h3>
          <p className="text-xl text-gray-100 mb-6">
            Get V1016-V1020 engines and 25 professional services for your business
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📞</span>
              <a href="tel:+13024640950" className="text-lg hover:underline">+1 302 464 0950</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✉️</span>
              <a href="mailto:kleber@ziontechgroup.com" className="text-lg hover:underline">kleber@ziontechgroup.com</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <span className="text-lg">364 E Main St STE 1008, Middletown, DE 19709</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default V1016V1020Showcase;
