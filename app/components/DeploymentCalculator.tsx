'use client';

import { useState } from 'react';

interface DeploymentEstimate {
  service: string;
  timeline: string;
  teamSize: string;
  complexity: 'Low' | 'Medium' | 'High' | 'Complex';
  prerequisites: string[];
  integrations: string[];
  estimatedCost: string;
}

const deploymentData: Record<string, DeploymentEstimate> = {
  // AI Services
  'ai-chatbot-builder': {
    service: 'AI Chatbot Builder',
    timeline: '2-3 weeks',
    teamSize: '2-3 people',
    complexity: 'Medium',
    prerequisites: ['Website or app access', 'FAQ/knowledge base', 'Brand guidelines'],
    integrations: ['CRM system', 'Help desk', 'Analytics platform'],
    estimatedCost: '$2,500 - $5,000',
  },
  'ai-video-generator': {
    service: 'AI Video Generator',
    timeline: '1-2 weeks',
    teamSize: '1-2 people',
    complexity: 'Low',
    prerequisites: ['Brand assets', 'Script templates', 'Voice preferences'],
    integrations: ['Content management system', 'Social media platforms'],
    estimatedCost: '$1,500 - $3,000',
  },
  'ai-customer-support': {
    service: 'AI Customer Support Platform',
    timeline: '3-4 weeks',
    teamSize: '3-4 people',
    complexity: 'High',
    prerequisites: ['Support ticket history', 'Knowledge base', 'Escalation workflows'],
    integrations: ['Help desk software', 'CRM', 'Email system', 'Live chat'],
    estimatedCost: '$5,000 - $10,000',
  },
  'ai-recruitment-platform': {
    service: 'AI Recruitment Platform',
    timeline: '4-6 weeks',
    teamSize: '3-5 people',
    complexity: 'High',
    prerequisites: ['Job descriptions', 'Resume database', 'Interview process'],
    integrations: ['ATS system', 'HR software', 'Calendar', 'Email'],
    estimatedCost: '$8,000 - $15,000',
  },
  
  // Micro-SaaS
  'micro-saas-ai-invoice-processor': {
    service: 'AI Invoice Processor',
    timeline: '1-2 weeks',
    teamSize: '1-2 people',
    complexity: 'Low',
    prerequisites: ['Accounting software access', 'Invoice templates', 'Approval workflows'],
    integrations: ['QuickBooks', 'Xero', 'SAP', 'Email system'],
    estimatedCost: '$1,000 - $2,500',
  },
  'micro-saas-ai-meeting-summarizer': {
    service: 'AI Meeting Summarizer',
    timeline: '1 week',
    teamSize: '1 person',
    complexity: 'Low',
    prerequisites: ['Video conferencing platform', 'Calendar access'],
    integrations: ['Zoom', 'Teams', 'Google Meet', 'Calendar', 'Note-taking apps'],
    estimatedCost: '$500 - $1,500',
  },
  'micro-saas-crm-automation': {
    service: 'AI CRM Automation',
    timeline: '2-3 weeks',
    teamSize: '2 people',
    complexity: 'Medium',
    prerequisites: ['CRM access', 'Sales process documentation', 'Email templates'],
    integrations: ['Salesforce', 'HubSpot', 'Pipedrive', 'Email', 'Calendar'],
    estimatedCost: '$2,000 - $4,000',
  },
  
  // Cloud & DevOps
  'cloud-multi-cloud-management': {
    service: 'Multi-Cloud Management Platform',
    timeline: '6-8 weeks',
    teamSize: '4-6 people',
    complexity: 'Complex',
    prerequisites: ['Cloud accounts', 'Infrastructure documentation', 'Security policies'],
    integrations: ['AWS', 'Azure', 'GCP', 'Monitoring tools', 'CI/CD pipelines'],
    estimatedCost: '$15,000 - $30,000',
  },
  'devops-ci-cd-platform': {
    service: 'CI/CD Automation Platform',
    timeline: '4-6 weeks',
    teamSize: '3-4 people',
    complexity: 'High',
    prerequisites: ['Code repositories', 'Test suites', 'Deployment environments'],
    integrations: ['GitHub', 'GitLab', 'Jenkins', 'Docker', 'Kubernetes'],
    estimatedCost: '$8,000 - $15,000',
  },
  
  // Security
  'security-zero-trust-architecture': {
    service: 'Zero Trust Security Architecture',
    timeline: '8-12 weeks',
    teamSize: '5-8 people',
    complexity: 'Complex',
    prerequisites: ['Network diagrams', 'User directory', 'Security policies'],
    integrations: ['Identity provider', 'Firewall', 'VPN', 'SIEM', 'Endpoint protection'],
    estimatedCost: '$25,000 - $50,000',
  },
  'ai-powered-cybersecurity-monitor': {
    service: 'AI Cybersecurity Monitor',
    timeline: '3-4 weeks',
    teamSize: '2-3 people',
    complexity: 'Medium',
    prerequisites: ['Network access', 'Security logs', 'Alert thresholds'],
    integrations: ['SIEM', 'Firewall', 'Endpoint protection', 'Email security'],
    estimatedCost: '$5,000 - $10,000',
  },
  
  // Data & Analytics
  'data-real-time-analytics': {
    service: 'Real-Time Analytics Platform',
    timeline: '4-6 weeks',
    teamSize: '3-4 people',
    complexity: 'High',
    prerequisites: ['Data sources', 'KPI definitions', 'Dashboard requirements'],
    integrations: ['Databases', 'APIs', 'Data warehouses', 'BI tools'],
    estimatedCost: '$8,000 - $15,000',
  },
  'data-machine-learning-platform': {
    service: 'Machine Learning Platform',
    timeline: '6-10 weeks',
    teamSize: '4-6 people',
    complexity: 'Complex',
    prerequisites: ['Training data', 'ML use cases', 'Infrastructure requirements'],
    integrations: ['Data lakes', 'Feature stores', 'Model registries', 'Monitoring'],
    estimatedCost: '$15,000 - $30,000',
  },
  
  // Automation
  'automation-workflow-orchestrator': {
    service: 'Workflow Orchestration Platform',
    timeline: '3-5 weeks',
    teamSize: '2-4 people',
    complexity: 'Medium',
    prerequisites: ['Process documentation', 'Business rules', 'Integration endpoints'],
    integrations: ['APIs', 'Databases', 'SaaS applications', 'Legacy systems'],
    estimatedCost: '$5,000 - $12,000',
  },
  'automation-rpa-platform': {
    service: 'RPA Automation Platform',
    timeline: '4-8 weeks',
    teamSize: '3-5 people',
    complexity: 'High',
    prerequisites: ['Process documentation', 'Application access', 'Test environments'],
    integrations: ['Desktop applications', 'Web applications', 'Databases', 'APIs'],
    estimatedCost: '$10,000 - $25,000',
  },
};

export default function DeploymentCalculator() {
  const [selectedService, setSelectedService] = useState<string>('');
  const [estimate, setEstimate] = useState<DeploymentEstimate | null>(null);

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    setEstimate(deploymentData[serviceId] || null);
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low':
        return 'text-green-400 bg-green-600/20 border-green-500/30';
      case 'Medium':
        return 'text-blue-400 bg-blue-600/20 border-blue-500/30';
      case 'High':
        return 'text-yellow-400 bg-yellow-600/20 border-yellow-500/30';
      case 'Complex':
        return 'text-red-400 bg-red-600/20 border-red-500/30';
      default:
        return 'text-slate-400 bg-slate-600/20 border-slate-500/30';
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-3xl p-8 md:p-12 border border-purple-500/30">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          🚀 Service Deployment Calculator
        </h2>
        <p className="text-slate-300 text-lg">
          Estimate deployment timelines, team requirements, and costs for any service
        </p>
      </div>

      {/* Service Selection */}
      <div className="mb-8">
        <label className="block text-white font-semibold mb-3">
          Select a Service:
        </label>
        <select
          value={selectedService}
          onChange={(e) => handleServiceSelect(e.target.value)}
          className="w-full px-6 py-4 bg-slate-900/60 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
        >
          <option value="">-- Choose a service --</option>
          <optgroup label="AI Services">
            <option value="ai-chatbot-builder">AI Chatbot Builder</option>
            <option value="ai-video-generator">AI Video Generator</option>
            <option value="ai-customer-support">AI Customer Support Platform</option>
            <option value="ai-recruitment-platform">AI Recruitment Platform</option>
          </optgroup>
          <optgroup label="Micro-SaaS Products">
            <option value="micro-saas-ai-invoice-processor">AI Invoice Processor</option>
            <option value="micro-saas-ai-meeting-summarizer">AI Meeting Summarizer</option>
            <option value="micro-saas-crm-automation">AI CRM Automation</option>
          </optgroup>
          <optgroup label="Cloud & DevOps">
            <option value="cloud-multi-cloud-management">Multi-Cloud Management Platform</option>
            <option value="devops-ci-cd-platform">CI/CD Automation Platform</option>
          </optgroup>
          <optgroup label="Security">
            <option value="security-zero-trust-architecture">Zero Trust Security Architecture</option>
            <option value="ai-powered-cybersecurity-monitor">AI Cybersecurity Monitor</option>
          </optgroup>
          <optgroup label="Data & Analytics">
            <option value="data-real-time-analytics">Real-Time Analytics Platform</option>
            <option value="data-machine-learning-platform">Machine Learning Platform</option>
          </optgroup>
          <optgroup label="Automation">
            <option value="automation-workflow-orchestrator">Workflow Orchestration Platform</option>
            <option value="automation-rpa-platform">RPA Automation Platform</option>
          </optgroup>
        </select>
      </div>

      {/* Deployment Estimate */}
      {estimate && (
        <div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">{estimate.service}</h3>
            <div
              className={`px-4 py-2 rounded-full text-sm font-semibold border ${getComplexityColor(
                estimate.complexity
              )}`}
            >
              {estimate.complexity} Complexity
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Timeline */}
            <div className="bg-slate-800/60 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">⏱️</span>
                <h4 className="text-lg font-bold text-white">Deployment Timeline</h4>
              </div>
              <p className="text-2xl font-bold text-purple-400">{estimate.timeline}</p>
              <p className="text-sm text-slate-400 mt-2">
                From kickoff to production deployment
              </p>
            </div>

            {/* Team Size */}
            <div className="bg-slate-800/60 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">👥</span>
                <h4 className="text-lg font-bold text-white">Team Size</h4>
              </div>
              <p className="text-2xl font-bold text-blue-400">{estimate.teamSize}</p>
              <p className="text-sm text-slate-400 mt-2">
                Engineers, consultants, and project managers
              </p>
            </div>

            {/* Cost Estimate */}
            <div className="bg-slate-800/60 rounded-xl p-6 md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">💰</span>
                <h4 className="text-lg font-bold text-white">Estimated Implementation Cost</h4>
              </div>
              <p className="text-3xl font-bold text-green-400">{estimate.estimatedCost}</p>
              <p className="text-sm text-slate-400 mt-2">
                One-time setup and configuration (excludes monthly subscription)
              </p>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="mb-6">
            <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span>📋</span> Prerequisites
            </h4>
            <ul className="space-y-2">
              {estimate.prerequisites.map((prereq, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-300">
                  <span className="text-green-400 mt-1">✓</span>
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Integrations */}
          <div className="mb-8">
            <h4 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
              <span>🔌</span> Common Integrations
            </h4>
            <div className="flex flex-wrap gap-2">
              {estimate.integrations.map((integration, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-full text-sm"
                >
                  {integration}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={`mailto:kleber@ziontechgroup.com?subject=Deployment Inquiry: ${estimate.service}`}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all text-center"
            >
              📧 Request Detailed Quote
            </a>
            <a
              href="/services"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all text-center"
            >
              🔍 Explore All 975+ Services
            </a>
          </div>
        </div>
      )}

      {!estimate && selectedService === '' && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🚀</div>
          <p className="text-slate-400 text-lg">
            Select a service above to see deployment estimates
          </p>
        </div>
      )}
    </div>
  );
}
