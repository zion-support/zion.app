import React from 'react';
import Head from 'next/head';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function ServicesPage() {
  const services = [
    {
      icon: '🤖',
      title: 'AI-Powered Automation',
      description: 'Intelligent systems that learn, adapt, and optimize your business processes automatically.',
      features: [
        'Machine Learning Models',
        'Natural Language Processing',
        'Predictive Analytics',
        'Intelligent Decision Making',
        'Automated Workflows'
      ],
      color: 'bg-gradient-to-br from-fuchsia-500 to-purple-600',
      textColor: 'text-fuchsia-400',
    },
    {
      icon: '☁️',
      title: 'Cloud Infrastructure',
      description: 'Scalable, secure, and high-performance cloud solutions designed for modern applications.',
      features: [
        'Multi-Cloud Strategy',
        'Auto-Scaling Systems',
        'Load Balancing',
        'Disaster Recovery',
        'Performance Optimization'
      ],
      color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
    },
    {
      icon: '🔒',
      title: 'Security & Compliance',
      description: 'Comprehensive security solutions that protect your data and ensure regulatory compliance.',
      features: [
        'Threat Detection',
        'Vulnerability Assessment',
        'Compliance Monitoring',
        'Data Encryption',
        'Access Control'
      ],
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      textColor: 'text-green-400',
    },
    {
      icon: '📊',
      title: 'Data Analytics',
      description: 'Transform your data into actionable insights with advanced analytics and visualization.',
      features: [
        'Real-time Analytics',
        'Business Intelligence',
        'Data Visualization',
        'Predictive Modeling',
        'Performance Metrics'
      ],
      color: 'bg-gradient-to-br from-orange-500 to-red-600',
      textColor: 'text-orange-400',
    },
    {
      icon: '🚀',
      title: 'DevOps & CI/CD',
      description: 'Streamline your development process with automated pipelines and deployment strategies.',
      features: [
        'Continuous Integration',
        'Automated Testing',
        'Deployment Automation',
        'Infrastructure as Code',
        'Monitoring & Alerting'
      ],
      color: 'bg-gradient-to-br from-indigo-500 to-purple-600',
      textColor: 'text-indigo-400',
    },
    {
      icon: '🌐',
      title: 'Digital Transformation',
      description: 'Modernize your business with cutting-edge digital solutions and strategic consulting.',
      features: [
        'Technology Strategy',
        'Process Optimization',
        'Change Management',
        'Digital Innovation',
        'Legacy Modernization'
      ],
      color: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      textColor: 'text-teal-400',
    },
    // NEW MICRO-SAAS, IT & AI SERVICES
    {
      icon: '🤖',
      title: 'AI Email Intelligence Suite',
      description: 'Intelligent email analysis, auto-responses, sentiment detection, and smart Reply-All automation for business email management.',
      features: [
        'Case-by-case email classification',
        'AI-powered response generation',
        'Smart Reply-All with CC routing',
        'Sentiment & urgency detection',
        'Automatic follow-up scheduling'
      ],
      color: 'bg-gradient-to-br from-amber-500 to-orange-600',
      textColor: 'text-amber-400',
    },
    {
      icon: '🔮',
      title: 'Predictive Lead Scoring AI',
      description: 'Machine learning models that analyze visitor behavior to predict and prioritize high-quality leads with 94% accuracy.',
      features: [
        'Behavioral pattern analysis',
        'Real-time lead scoring',
        'Conversion probability prediction',
        'Priority-based routing',
        'CRM integration (Salesforce, HubSpot)'
      ],
      color: 'bg-gradient-to-br from-pink-500 to-rose-600',
      textColor: 'text-pink-400',
    },
    {
      icon: '⚡',
      title: 'Autonomous CI/CD Guardian',
      description: 'Self-healing CI/CD pipelines that automatically detect build failures, fix syntax errors, and redeploy with zero downtime.',
      features: [
        'Automatic error detection & repair',
        'Self-healing build pipelines',
        'Smart rollback on failure',
        'Continuous optimization',
        'Multi-cloud deployment sync'
      ],
      color: 'bg-gradient-to-br from-violet-500 to-purple-600',
      textColor: 'text-violet-400',
    },
    {
      icon: '📱',
      title: 'Cross-Platform Sync Engine',
      description: 'Real-time bidirectional synchronization across email, calendar, CRM, and 50+ business tools with conflict resolution.',
      features: [
        'Gmail, Outlook, Yahoo sync',
        'Google Calendar two-way sync',
        'Salesforce/HubSpot integration',
        'Slack & Teams notifications',
        'Conflict-free merge logic'
      ],
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
    },
    {
      icon: '🧠',
      title: 'AI Knowledge Base Architect',
      description: 'Automatically indexes, summarizes, and serves relevant knowledge articles based on email context and user queries.',
      features: [
        'Semantic search engine',
        'Auto article suggestions',
        'Document ingestion & indexing',
        'Multi-language support',
        'Usage analytics dashboard'
      ],
      color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
      textColor: 'text-blue-400',
    },
    {
      icon: '🔔',
      title: 'Smart Notification Orchestrator',
      description: 'AI-powered notification system that intelligently routes, prioritizes, and summarizes alerts across all communication channels.',
      features: [
        'Smart priority ranking',
        'Deduplication engine',
        'Custom escalation rules',
        'Multi-channel delivery (SMS, Email, Push)',
        'Quiet hours & do-not-disturb'
      ],
      color: 'bg-gradient-to-br from-red-500 to-pink-600',
      textColor: 'text-red-400',
    },
    {
      icon: '🛡️',
      title: 'Autonomous Security Operations',
      description: '24/7 AI-driven SOC that monitors threats, auto-patches vulnerabilities, and responds to incidents in under 60 seconds.',
      features: [
        'Real-time threat detection',
        'Automated vulnerability patching',
        'Incident response automation',
        'Compliance report generation',
        'SIEM integration (Splunk, Datadog)'
      ],
      color: 'bg-gradient-to-br from-slate-600 to-gray-800',
      textColor: 'text-slate-300',
    },
    {
      icon: '📈',
      title: 'Revenue Intelligence Analytics',
      description: 'End-to-end revenue attribution and forecasting using AI that tracks every customer touchpoint from first contact to closed deal.',
      features: [
        'Multi-touch attribution modeling',
        'Revenue forecasting AI',
        'Churn prediction alerts',
        'Sales pipeline optimization',
        'Executive BI dashboards'
      ],
      color: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
    },
    {
      icon: '🌊',
      title: 'Cloud Cost Optimization AI',
      description: 'Intelligent cloud resource optimization that reduces AWS/Azure/GCP costs by 40% through automated right-sizing and scheduling.',
      features: [
        'Automatic resource right-sizing',
        'Scheduled scaling automation',
        'Reserved instance optimization',
        'Cost anomaly detection',
        'Multi-cloud cost comparison'
      ],
      color: 'bg-gradient-to-br from-green-500 to-emerald-600',
      textColor: 'text-green-400',
    },
    {
      icon: '🔗',
      title: 'API Integration Fabric',
      description: 'No-code integration platform connecting 200+ SaaS apps with intelligent data mapping, transformation, and real-time sync.',
      features: [
        '200+ pre-built connectors',
        'Visual data mapper',
        'Real-time & scheduled sync',
        'Webhook orchestration',
        'Error handling & retry logic'
      ],
      color: 'bg-gradient-to-br from-yellow-500 to-amber-600',
      textColor: 'text-yellow-400',
    },
    {
      icon: '🎯',
      title: 'AI-Powered Competitive Intelligence',
      description: 'Automated competitor monitoring, pricing analysis, and market trend detection with daily actionable insights delivered to your inbox.',
      features: [
        'Competitor pricing tracking',
        'Product feature monitoring',
        'Market trend detection',
        'Sentiment analysis on reviews',
        'Weekly intelligence reports'
      ],
      color: 'bg-gradient-to-br from-fuchsia-500 to-pink-600',
      textColor: 'text-fuchsia-400',
    },
    {
      icon: '💼',
      title: 'Autonomous Proposal Generator',
      description: 'AI that analyzes RFPs, RFIs, and client requirements to generate customized proposals, Statements of Work, and contracts in minutes.',
      features: [
        'Automatic requirement extraction',
        'Template-based proposal generation',
        'Pricing calculator integration',
        'Compliance check automation',
        'E-signature workflow (DocuSign)'
      ],
      color: 'bg-gradient-to-br from-purple-500 to-violet-600',
      textColor: 'text-purple-400',
    },
  ];

  const technologies = [
    { name: 'Next.js', category: 'Frontend' },
    { name: 'React', category: 'Frontend' },
    { name: 'Node.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'AWS', category: 'Cloud' },
    { name: 'Azure', category: 'Cloud' },
    { name: 'Docker', category: 'DevOps' },
    { name: 'Kubernetes', category: 'DevOps' },
    { name: 'TensorFlow', category: 'AI/ML' },
    { name: 'PyTorch', category: 'AI/ML' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
  ];

  return (
    <>
      <Head>
        <title>Services | Zion Tech Group - AI-Powered Solutions</title>
        <meta name="description" content="Discover our comprehensive range of AI-powered services including automation, cloud infrastructure, security, and digital transformation solutions." />
        <meta property="og:title" content="Services | Zion Tech Group" />
        <meta property="og:description" content="AI-powered solutions for modern businesses." />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(139,92,246,0.1),transparent_50%)]" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
            Our Services
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Comprehensive AI-powered solutions designed to transform your business and drive innovation
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              What We Offer
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              From AI automation to cloud infrastructure, we provide end-to-end solutions for modern businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="group hover:border-blue-400/30"
                style={{ animationDelay: `${(index * 0.1) + 0.2}s` }}
              >
                <div className={`w-16 h-16 ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className={`text-xl font-bold mb-4 text-center ${service.textColor}`}>
                  {service.title}
                </h3>
                <p className="text-gray-400 mb-6 text-center">
                  {service.description}
                </p>
                <ul className="space-y-2 text-sm text-gray-400">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <span className="text-blue-400 mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Technology Expertise
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We leverage cutting-edge technologies to deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {technologies.map((tech, index) => (
              <Card
                key={index}
                className="text-center group hover:border-blue-500/30"
                style={{ animationDelay: `${(index * 0.05) + 0.2}s` }}
              >
                <div className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {tech.name === 'Next.js' && '⚡'}
                  {tech.name === 'React' && '⚛️'}
                  {tech.name === 'Node.js' && '🟢'}
                  {tech.name === 'Python' && '🐍'}
                  {tech.name === 'AWS' && '☁️'}
                  {tech.name === 'Azure' && '🔷'}
                  {tech.name === 'Docker' && '🐳'}
                  {tech.name === 'Kubernetes' && '☸️'}
                  {tech.name === 'TensorFlow' && '🧠'}
                  {tech.name === 'PyTorch' && '🔥'}
                  {tech.name === 'PostgreSQL' && '🐘'}
                  {tech.name === 'MongoDB' && '🍃'}
                </div>
                <h3 className="font-semibold text-white mb-1">{tech.name}</h3>
                <p className="text-sm text-gray-400">{tech.category}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Our Process
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A proven methodology that ensures successful project delivery and maximum value
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', description: 'We analyze your needs and define project requirements' },
              { step: '02', title: 'Strategy', description: 'Develop a comprehensive plan tailored to your goals' },
              { step: '03', title: 'Development', description: 'Build and implement solutions using best practices' },
              { step: '04', title: 'Launch', description: 'Deploy and monitor for optimal performance' },
            ].map((process, index) => (
              <Card
                key={index}
                className="text-center group hover:border-blue-400/30"
                style={{ animationDelay: `${(index * 0.1) + 0.2}s` }}
              >
                <div className="text-4xl font-bold text-blue-400 mb-4">{process.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{process.title}</h3>
                <p className="text-gray-400">{process.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
                         Let&apos;s discuss how our services can transform your business and drive innovation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              href="/contact"
              variant="secondary"
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start a Project
            </Button>
            <Button
              href="/case-studies"
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              View Case Studies
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}