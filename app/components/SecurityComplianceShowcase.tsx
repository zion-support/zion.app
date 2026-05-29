'use client';

import { useState } from 'react';

export default function SecurityComplianceShowcase() {
  const [activeTab, setActiveTab] = useState<'phishing' | 'dlp' | 'compliance' | 'training'>('phishing');

  const features = [
    {
      icon: '🎣',
      title: 'Phishing Detection',
      description: 'AI-powered threat analysis with auto-quarantine',
      stats: '90% attack reduction',
      color: 'from-red-500 to-orange-600'
    },
    {
      icon: '🔒',
      title: 'Data Loss Prevention',
      description: 'Detect and block PII, PHI, financial data, credentials',
      stats: '100% DLP coverage',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: '📋',
      title: 'Compliance Monitoring',
      description: 'GDPR, HIPAA, SOC 2, PCI DSS compliance checks',
      stats: '4 frameworks supported',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: '🎯',
      title: 'Security Training',
      description: 'Phishing simulations with awareness scoring',
      stats: 'Bronze to Platinum certification',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const complianceFrameworks = [
    {
      name: 'GDPR',
      fullName: 'General Data Protection Regulation',
      icon: '🇪🇺',
      checks: ['PII consent verification', 'Data minimization', 'Lawful basis documentation', 'Right to erasure'],
      color: 'from-blue-500 to-indigo-600'
    },
    {
      name: 'HIPAA',
      fullName: 'Health Insurance Portability and Accountability Act',
      icon: '🏥',
      checks: ['PHI encryption', 'Business Associate Agreements', 'Access controls', 'Audit trails'],
      color: 'from-green-500 to-teal-600'
    },
    {
      name: 'SOC 2',
      fullName: 'Service Organization Control 2',
      icon: '🔐',
      checks: ['Security controls', 'Availability monitoring', 'Processing integrity', 'Confidentiality'],
      color: 'from-purple-500 to-violet-600'
    },
    {
      name: 'PCI DSS',
      fullName: 'Payment Card Industry Data Security Standard',
      icon: '💳',
      checks: ['Card data protection', 'Network security', 'Access control', 'Vulnerability management'],
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  const threatExamples = [
    {
      type: 'Phishing Email',
      level: 'HIGH',
      score: '0.70',
      indicators: ['Urgency tactics', 'Suspicious links', 'Impersonation attempt'],
      action: 'Auto-quarantined',
      color: 'bg-red-500'
    },
    {
      type: 'DLP Violation',
      level: 'CRITICAL',
      score: '8 violations',
      indicators: ['SSN detected', 'Credit card exposed', 'Credentials shared'],
      action: 'Blocked & redacted',
      color: 'bg-orange-500'
    },
    {
      type: 'Compliance Check',
      level: 'MEDIUM',
      score: 'HIPAA non-compliant',
      indicators: ['PHI in unencrypted email', 'Missing BAA reference'],
      action: 'Flagged for review',
      color: 'bg-yellow-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container-page">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-full px-6 py-2 mb-6">
            <span className="text-2xl">🛡️</span>
            <span className="text-red-300 font-semibold">V86: Security & Compliance Guardian</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            AI Email Security &<br />Compliance Guardian
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Protect against phishing, prevent data loss, ensure compliance, and train your team.
            Enterprise-grade security for email communications.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-red-500/50 transition-all"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
              <div className="text-red-400 font-semibold text-sm">✓ {feature.stats}</div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'phishing', label: '🎣 Phishing Detection' },
            { id: 'dlp', label: '🔒 Data Loss Prevention' },
            { id: 'compliance', label: '📋 Compliance' },
            { id: 'training', label: '🎯 Security Training' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                  : 'bg-slate-800 text-gray-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mb-16">
          {activeTab === 'phishing' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Real-Time Threat Detection Examples</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {threatExamples.map((example, index) => (
                  <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-bold text-white">{example.type}</h4>
                      <span className={`${example.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                        {example.level}
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm mb-4">
                      <div className="font-semibold mb-2">Threat Score: {example.score}</div>
                      <div className="space-y-1">
                        {example.indicators.map((indicator, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-red-400">⚠️</span>
                            <span>{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-700">
                      <div className="text-green-400 font-semibold text-sm">
                        ✓ {example.action}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-8 mt-8">
                <h4 className="text-xl font-bold text-white mb-4">How It Works</h4>
                <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                  <div>
                    <div className="font-semibold text-white mb-2">1. Analyze Sender</div>
                    <p className="text-sm">Check domain reputation, detect spoofing, verify authenticity</p>
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-2">2. Scan Content</div>
                    <p className="text-sm">Detect phishing keywords, urgency tactics, social engineering</p>
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-2">3. Inspect Links</div>
                    <p className="text-sm">Analyze URLs, detect shorteners, check for malicious domains</p>
                  </div>
                  <div>
                    <div className="font-semibold text-white mb-2">4. Auto-Response</div>
                    <p className="text-sm">Quarantine high-risk emails, warn users, generate reports</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'dlp' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Data Loss Prevention Coverage</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4">Sensitive Data Detection</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-xl">
                        🆔
                      </div>
                      <div>
                        <div className="font-semibold text-white">SSN & National IDs</div>
                        <div className="text-sm text-gray-400">Pattern: XXX-XX-XXXX</div>
                        <div className="text-xs text-red-400 mt-1">Action: Auto-block</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center text-xl">
                        💳
                      </div>
                      <div>
                        <div className="font-semibold text-white">Credit Card Numbers</div>
                        <div className="text-sm text-gray-400">Visa, MasterCard, Amex patterns</div>
                        <div className="text-xs text-red-400 mt-1">Action: Auto-block</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-xl">
                        🔑
                      </div>
                      <div>
                        <div className="font-semibold text-white">Credentials & API Keys</div>
                        <div className="text-sm text-gray-400">Passwords, tokens, secrets</div>
                        <div className="text-xs text-yellow-400 mt-1">Action: Warn & redact</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-xl">
                        🏥
                      </div>
                      <div>
                        <div className="font-semibold text-white">Protected Health Info (PHI)</div>
                        <div className="text-sm text-gray-400">Medical records, diagnoses, prescriptions</div>
                        <div className="text-xs text-yellow-400 mt-1">Action: Warn & log</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4">DLP Actions</h4>
                  <div className="space-y-4">
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-red-400 text-xl">🚫</span>
                        <span className="font-semibold text-white">Blocked</span>
                      </div>
                      <p className="text-sm text-gray-300">High-confidence sensitive data (SSN, credit cards) prevents email from being sent</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400 text-xl">✏️</span>
                        <span className="font-semibold text-white">Redacted</span>
                      </div>
                      <p className="text-sm text-gray-300">Medium-confidence data automatically masked (e.g., ***-**-6789)</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-400 text-xl">⚠️</span>
                        <span className="font-semibold text-white">Warned</span>
                      </div>
                      <p className="text-sm text-gray-300">User receives warning but can proceed with caution</p>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-400 text-xl">📝</span>
                        <span className="font-semibold text-white">Logged</span>
                      </div>
                      <p className="text-sm text-gray-300">Low-risk data logged for audit trail and compliance</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Compliance Framework Support</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {complianceFrameworks.map((framework, index) => (
                  <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-green-500/50 transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${framework.color} flex items-center justify-center text-3xl shadow-lg`}>
                        {framework.icon}
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-white">{framework.name}</h4>
                        <p className="text-sm text-gray-400">{framework.fullName}</p>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      {framework.checks.map((check, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="text-green-400">✓</span>
                          <span>{check}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-8 mt-8">
                <h4 className="text-xl font-bold text-white mb-4">Compliance Benefits</h4>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
                    <div className="text-gray-300">Regulatory Compliance</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400 mb-2">24/7</div>
                    <div className="text-gray-300">Automated Monitoring</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400 mb-2">0</div>
                    <div className="text-gray-300">Compliance Violations</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'training' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-6">Security Awareness Training</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4">Phishing Simulations</h4>
                  <div className="space-y-4">
                    <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">Easy</span>
                        <span className="text-green-400 text-sm">Obvious phishing</span>
                      </div>
                      <p className="text-sm text-gray-300">"You won a prize! Click here to claim"</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">Medium</span>
                        <span className="text-yellow-400 text-sm">Moderate sophistication</span>
                      </div>
                      <p className="text-sm text-gray-300">"Urgent: Verify your account"</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-white">Hard</span>
                        <span className="text-red-400 text-sm">Highly realistic</span>
                      </div>
                      <p className="text-sm text-gray-300">"Invoice #INV-2024-0892" (looks legitimate)</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h4 className="text-xl font-bold text-white mb-4">Certification Levels</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                      <div className="text-2xl">🥉</div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">Bronze</div>
                        <div className="text-xs text-gray-400">Awareness Score: &lt;70%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-400/10 border border-gray-400/30 rounded-lg">
                      <div className="text-2xl">🥈</div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">Silver</div>
                        <div className="text-xs text-gray-400">Awareness Score: 70-85%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="text-2xl">🥇</div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">Gold</div>
                        <div className="text-xs text-gray-400">Awareness Score: 85-95%</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                      <div className="text-2xl">💎</div>
                      <div className="flex-1">
                        <div className="font-semibold text-white">Platinum</div>
                        <div className="text-xs text-gray-400">Awareness Score: &gt;95%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-red-400 mb-2">90%</div>
            <div className="text-gray-300 text-sm">Phishing Attack Reduction</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">100%</div>
            <div className="text-gray-300 text-sm">DLP Coverage</div>
          </div>
          <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">4</div>
            <div className="text-gray-300 text-sm">Compliance Frameworks</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">500%</div>
            <div className="text-gray-300 text-sm">ROI Improvement</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-white mb-4">
              Protect Your Organization Today
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Enterprise-grade email security and compliance. Reduce phishing attacks by 90% and ensure 100% regulatory compliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:kleber@ziontechgroup.com?subject=V86%20Security%20%26%20Compliance%20Guardian%20Inquiry"
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-lg transition-all shadow-lg hover:shadow-red-500/50 inline-flex items-center justify-center gap-2"
              >
                <span>🛡️</span>
                <span>Get Security Assessment</span>
              </a>
              <a
                href="tel:+130****0950"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-4 px-8 rounded-lg transition-all border border-slate-700 inline-flex items-center justify-center gap-2"
              >
                <span>📞</span>
                <span>+1 302 464 0950</span>
              </a>
            </div>
          </div>
          <p className="text-gray-400 text-sm">
            📧 kleber@ziontechgroup.com | 📍 364 E Main St STE 1008, Middletown, DE 19709
          </p>
        </div>
      </div>
    </section>
  );
}
