'use client';

import { useState } from 'react';

const engines = [
  {
    id: 'V891',
    name: 'Genomic Analysis Pipeline',
    icon: '🧬',
    description: 'Comprehensive genomic sequencing analysis with variant calling, gene expression profiling, pharmacogenomics, and clinical interpretation for precision medicine.',
    features: ['Whole Genome/Exome Sequencing', 'Variant Calling (SNP/INDEL/CNV)', 'Gene Expression Profiling', 'Pharmacogenomics Analysis', 'Clinical Report Generation', 'Drug Response Prediction'],
    metrics: { samples: '100K+', accuracy: '99.9%', variants: '50K+', reports: 'Real-time' }
  },
  {
    id: 'V892',
    name: 'Drug Discovery AI Platform',
    icon: '🧪',
    description: 'Accelerate drug discovery through molecular docking, ADMET prediction, virtual screening, and lead optimization using advanced AI/ML algorithms.',
    features: ['Molecular Docking', 'ADMET Prediction', 'Virtual Screening', 'Lead Optimization', 'Target Identification', 'Drug Repurposing'],
    metrics: { compounds: '10M+', targets: '1000+', hits: '95%', time: '10x faster' }
  },
  {
    id: 'V893',
    name: 'Clinical Trial Optimization',
    icon: '🏥',
    description: 'Optimize clinical trial design, patient recruitment, site selection, and adaptive trial management using AI/ML for faster, more efficient trials.',
    features: ['Patient Matching', 'Site Selection', 'Adaptive Trial Design', 'Recruitment Analytics', 'Diversity Tracking', 'Cost Optimization'],
    metrics: { trials: '500+', enrollment: '85%', time: '40% faster', cost: '35% reduction' }
  },
  {
    id: 'V894',
    name: 'Telemedicine & Remote Monitoring',
    icon: '📱',
    description: 'Comprehensive telemedicine platform with virtual consultations, remote patient monitoring, e-prescriptions, and care coordination.',
    features: ['Video Consultations', 'Remote Monitoring', 'E-Prescriptions', 'Care Coordination', 'Patient Portal', 'Mobile App'],
    metrics: { visits: '1M+', satisfaction: '95%', savings: '60%', access: '24/7' }
  },
  {
    id: 'V895',
    name: 'Health Data Analytics',
    icon: '📊',
    description: 'Population health management with predictive analytics, quality metrics, cost optimization, and clinical decision support for value-based care.',
    features: ['Risk Stratification', 'Predictive Analytics', 'Quality Metrics', 'Cost Analytics', 'Clinical Decision Support', 'Population Health'],
    metrics: { patients: '10M+', predictions: '90%', savings: '$50M', outcomes: '25% better' }
  }
];

const domains = [
  { name: 'Genomics', icon: '🧬', count: 6, color: 'from-blue-500 to-cyan-500' },
  { name: 'Drug Discovery', icon: '🧪', count: 6, color: 'from-purple-500 to-pink-500' },
  { name: 'Clinical Trials', icon: '🏥', count: 6, color: 'from-green-500 to-emerald-500' },
  { name: 'Telemedicine', icon: '📱', count: 6, color: 'from-orange-500 to-red-500' },
  { name: 'Health Analytics', icon: '📊', count: 6, color: 'from-indigo-500 to-violet-500' }
];

export default function V891V895Showcase() {
  const [activeEngine, setActiveEngine] = useState(0);
  const engine = engines[activeEngine];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full px-6 py-2 mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-300 text-sm font-semibold tracking-wide">V891-V895 • BIOINFORMATICS & HEALTHTECH SUITE</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Bioinformatics & HealthTech <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Intelligence</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            5 breakthrough AI engines powering the future of precision medicine, drug discovery, clinical trials, telemedicine, and population health — with 30 new services and 4,267+ total solutions.
          </p>
        </div>

        {/* Domain Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-16">
          {domains.map((domain) => (
            <div key={domain.name} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 text-center hover:border-blue-500/50 transition-all">
              <div className="text-3xl mb-2">{domain.icon}</div>
              <div className="text-white font-semibold text-sm">{domain.name}</div>
              <div className={`text-transparent bg-gradient-to-r ${domain.color} bg-clip-text font-bold text-lg`}>{domain.count} services</div>
            </div>
          ))}
        </div>

        {/* Engine Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {engines.map((eng, i) => (
            <button
              key={eng.id}
              onClick={() => setActiveEngine(i)}
              className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                i === activeEngine
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              <span className="mr-2">{eng.icon}</span>
              {eng.id}: {eng.name.split(' ').slice(0, 3).join(' ')}
            </button>
          ))}
        </div>

        {/* Active Engine Detail */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{engine.icon}</span>
                <div>
                  <div className="text-blue-400 font-mono text-sm">{engine.id}</div>
                  <h3 className="text-2xl font-bold text-white">{engine.name}</h3>
                </div>
              </div>
              <p className="text-gray-300 text-lg mb-6">{engine.description}</p>
              
              {/* Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(engine.metrics).map(([key, value]) => (
                  <div key={key} className="bg-white/5 rounded-lg p-3">
                    <div className="text-blue-400 font-bold text-lg">{value}</div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide">{key}</div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 text-lg">Key Features</h4>
              <div className="space-y-3">
                {engine.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
                      <span className="text-blue-400 text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl">
                <div className="text-blue-300 font-semibold text-sm mb-1">📧 Reply-All Enforcement</div>
                <div className="text-gray-400 text-sm">All email communications are automatically analyzed and reply-all is enforced for multi-recipient messages.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-400">895</div>
            <div className="text-gray-400 text-sm mt-1">AI Email Engines</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-400">4,267+</div>
            <div className="text-gray-400 text-sm mt-1">Total Services</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-400">30</div>
            <div className="text-gray-400 text-sm mt-1">New HealthTech Services</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-400">5</div>
            <div className="text-gray-400 text-sm mt-1">New AI Engines</div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="inline-block bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 max-w-2xl">
            <h3 className="text-2xl font-bold text-white mb-3">Ready to Transform Healthcare with AI?</h3>
            <p className="text-gray-300 mb-6">Contact our HealthTech experts for a personalized consultation and discover how our Bioinformatics & HealthTech solutions can revolutionize patient care and outcomes.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a href="tel:+13024640950" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all">
                📞 +1 302 464 0950
              </a>
              <a href="mailto:kleber@ziontechgroup.com" className="bg-white/5 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all border border-white/10">
                ✉️ kleber@ziontechgroup.com
              </a>
            </div>
            <p className="text-gray-500 text-xs mt-4">364 E Main St STE 1008, Middletown DE 19709</p>
          </div>
        </div>
      </div>
    </section>
  );
}
