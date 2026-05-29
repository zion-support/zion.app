'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';

interface ProposalData {
  clientName: string;
  clientEmail: string;
  companyName: string;
  industry: string;
  projectType: string;
  services: string[];
  budget: string;
  timeline: string;
  description: string;
}

const serviceOptions = [
  { id: 'ai-email-intelligence', name: 'AI Email Intelligence Platform', price: 599 },
  { id: 'ai-proposal-generator', name: 'AI Proposal Generator', price: 899 },
  { id: 'ai-customer-success', name: 'AI Customer Success Portal', price: 1499 },
  { id: 'ai-contract-intelligence', name: 'AI Contract Intelligence', price: 1199 },
  { id: 'ai-competitive-intelligence', name: 'AI Competitive Intelligence', price: 1799 },
  { id: 'ai-talent-acquisition', name: 'AI Talent Acquisition Platform', price: 2399 },
  { id: 'ai-financial-forecasting', name: 'AI Financial Forecasting Engine', price: 2999 },
  { id: 'ai-supply-chain', name: 'AI Supply Chain Optimization', price: 4499 },
  { id: 'ai-quality-control', name: 'AI Quality Control Vision', price: 8999 },
  { id: 'ai-predictive-maintenance', name: 'AI Predictive Maintenance', price: 5999 },
  { id: 'zero-trust-security', name: 'Zero Trust Network Access', price: 2999 },
  { id: 'cloud-cost-optimization', name: 'Cloud Cost Optimization', price: 1499 },
  { id: 'kubernetes-autoscaling', name: 'Kubernetes Autoscaling Intelligence', price: 2399 },
  { id: 'data-governance', name: 'Data Governance Automation', price: 3899 },
  { id: 'real-time-streaming', name: 'Real-Time Data Streaming', price: 5999 },
];

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 
  'Education', 'Government', 'Energy', 'Transportation', 'Real Estate',
  'Media & Entertainment', 'Telecommunications', 'Other'
];

const projectTypes = [
  'AI/ML Implementation', 'Cloud Migration', 'Security Enhancement',
  'Data Analytics', 'Process Automation', 'Digital Transformation',
  'Custom Development', 'Consulting & Strategy'
];

export default function ProposalGeneratorPage() {
  const [step, setStep] = useState(1);
  const [proposalData, setProposalData] = useState<ProposalData>({
    clientName: '',
    clientEmail: '',
    companyName: '',
    industry: '',
    projectType: '',
    services: [],
    budget: '',
    timeline: '',
    description: '',
  });
  const [generated, setGenerated] = useState(false);

  const totalCost = useMemo(() => {
    return proposalData.services.reduce((sum, serviceId) => {
      const service = serviceOptions.find(s => s.id === serviceId);
      return sum + (service?.price || 0);
    }, 0);
  }, [proposalData.services]);

  const handleInputChange = (field: keyof ProposalData, value: string) => {
    setProposalData(prev => ({ ...prev, [field]: value }));
  };

  const handleServiceToggle = (serviceId: string) => {
    setProposalData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleGenerate = () => {
    setGenerated(true);
  };

  const handleReset = () => {
    setStep(1);
    setGenerated(false);
    setProposalData({
      clientName: '',
      clientEmail: '',
      companyName: '',
      industry: '',
      projectType: '',
      services: [],
      budget: '',
      timeline: '',
      description: '',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🤖 AI Proposal Generator
          </h1>
          <p className="text-lg text-gray-600">
            Generate customized, professional proposals in minutes with AI-powered intelligence
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {!generated ? (
          <>
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-center space-x-4">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                      step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {s}
                    </div>
                    {s < 4 && (
                      <div className={`w-16 h-1 mx-2 ${
                        step > s ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-4 text-sm text-gray-600">
                {step === 1 && 'Step 1: Client Information'}
                {step === 2 && 'Step 2: Project Details'}
                {step === 3 && 'Step 3: Select Services'}
                {step === 4 && 'Step 4: Review & Generate'}
              </div>
            </div>

            {/* Step 1: Client Information */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Client Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={proposalData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      value={proposalData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={proposalData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Acme Corporation"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry *
                    </label>
                    <select
                      value={proposalData.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select your industry</option>
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => setStep(2)}
                  disabled={!proposalData.clientName || !proposalData.clientEmail || !proposalData.companyName || !proposalData.industry}
                  className="mt-8 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Continue →
                </button>
              </div>
            )}

            {/* Step 2: Project Details */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Project Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Type *
                    </label>
                    <select
                      value={proposalData.projectType}
                      onChange={(e) => handleInputChange('projectType', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select project type</option>
                      {projectTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Range *
                    </label>
                    <select
                      value={proposalData.budget}
                      onChange={(e) => handleInputChange('budget', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select budget range</option>
                      <option value="<$10k">Less than $10,000/month</option>
                      <option value="$10k-$50k">$10,000 - $50,000/month</option>
                      <option value="$50k-$100k">$50,000 - $100,000/month</option>
                      <option value="$100k+">$100,000+/month</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Timeline *
                    </label>
                    <select
                      value={proposalData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select timeline</option>
                      <option value="1-3 months">1-3 months</option>
                      <option value="3-6 months">3-6 months</option>
                      <option value="6-12 months">6-12 months</option>
                      <option value="12+ months">12+ months</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Description
                    </label>
                    <textarea
                      value={proposalData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your project goals, challenges, and requirements..."
                    />
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!proposalData.projectType || !proposalData.budget || !proposalData.timeline}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Select Services */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold mb-6">Select Services</h2>
                <p className="text-gray-600 mb-6">
                  Choose the services you need. You can select multiple services.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {serviceOptions.map(service => (
                    <div
                      key={service.id}
                      onClick={() => handleServiceToggle(service.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        proposalData.services.includes(service.id)
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            ${service.price.toLocaleString()}/month
                          </p>
                        </div>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          proposalData.services.includes(service.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200'
                        }`}>
                          {proposalData.services.includes(service.id) && '✓'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {proposalData.services.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">
                        {proposalData.services.length} service{proposalData.services.length > 1 ? 's' : ''} selected
                      </span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${totalCost.toLocaleString()}/month
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={proposalData.services.length === 0}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Continue →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Generate */}
            {step === 4 && (
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Review Your Proposal</h2>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Client Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-600">Name:</span> <span className="font-medium">{proposalData.clientName}</span></div>
                      <div><span className="text-gray-600">Email:</span> <span className="font-medium">{proposalData.clientEmail}</span></div>
                      <div><span className="text-gray-600">Company:</span> <span className="font-medium">{proposalData.companyName}</span></div>
                      <div><span className="text-gray-600">Industry:</span> <span className="font-medium">{proposalData.industry}</span></div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Project Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-gray-600">Type:</span> <span className="font-medium">{proposalData.projectType}</span></div>
                      <div><span className="text-gray-600">Budget:</span> <span className="font-medium">{proposalData.budget}</span></div>
                      <div><span className="text-gray-600">Timeline:</span> <span className="font-medium">{proposalData.timeline}</span></div>
                    </div>
                    {proposalData.description && (
                      <div className="mt-4">
                        <span className="text-gray-600 text-sm">Description:</span>
                        <p className="mt-1 text-sm">{proposalData.description}</p>
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Selected Services ({proposalData.services.length})</h3>
                    <div className="space-y-2">
                      {proposalData.services.map(serviceId => {
                        const service = serviceOptions.find(s => s.id === serviceId);
                        return service ? (
                          <div key={serviceId} className="flex justify-between items-center">
                            <span className="text-sm">{service.name}</span>
                            <span className="font-semibold">${service.price.toLocaleString()}/mo</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                    <div className="border-t mt-4 pt-4 flex justify-between items-center">
                      <span className="font-semibold text-lg">Total Investment:</span>
                      <span className="text-2xl font-bold text-blue-600">
                        ${totalCost.toLocaleString()}/month
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleGenerate}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    🚀 Generate Proposal
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Generated Proposal */
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Your Proposal is Ready!
              </h2>
              <p className="text-gray-600">
                A customized proposal has been generated for {proposalData.companyName}
              </p>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Executive Summary</h3>
              <p className="mb-4">
                Dear {proposalData.clientName},
              </p>
              <p className="mb-4">
                Thank you for considering Zion Tech Group for your {proposalData.projectType.toLowerCase()} needs. 
                Based on your requirements in the {proposalData.industry} industry, we've crafted a comprehensive 
                solution that addresses your specific challenges and goals.
              </p>
              <p>
                Our proposed solution includes {proposalData.services.length} cutting-edge services 
                designed to deliver measurable results within your {proposalData.timeline} timeline.
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Proposed Solution</h3>
              <div className="space-y-3">
                {proposalData.services.map(serviceId => {
                  const service = serviceOptions.find(s => s.id === serviceId);
                  return service ? (
                    <div key={serviceId} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{service.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            Enterprise-grade solution with full support and integration
                          </p>
                        </div>
                        <span className="font-bold text-blue-600">
                          ${service.price.toLocaleString()}/mo
                        </span>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold mb-1">Total Investment</h3>
                  <p className="text-sm text-gray-600">Monthly subscription • Cancel anytime</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-600">
                    ${totalCost.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">per month</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="text-4xl mb-2">⚡</div>
                <h4 className="font-semibold mb-1">Fast Implementation</h4>
                <p className="text-sm text-gray-600">Go live in {proposalData.timeline}</p>
              </div>
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="text-4xl mb-2">🎯</div>
                <h4 className="font-semibold mb-1">Proven Results</h4>
                <p className="text-sm text-gray-600">Industry-leading ROI</p>
              </div>
              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <div className="text-4xl mb-2">🤝</div>
                <h4 className="font-semibold mb-1">Dedicated Support</h4>
                <p className="text-sm text-gray-600">24/7 expert assistance</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">Next Steps</h3>
              <ol className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">1</span>
                  <span>Our team will contact you within 24 hours to schedule a detailed consultation</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">2</span>
                  <span>We'll refine the proposal based on your specific requirements and feedback</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">3</span>
                  <span>Once approved, we'll begin implementation and provide ongoing support</span>
                </li>
              </ol>
            </div>

            <div className="text-center space-y-4">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleReset}
                  className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Create Another Proposal
                </button>
                <a
                  href="mailto:kleber@ziontechgroup.com?subject=Proposal Request - ${proposalData.companyName}"
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  📧 Contact Us
                </a>
              </div>
              <p className="text-sm text-gray-600">
                Questions? Call us at <a href="tel:+13024640950" className="text-blue-600 font-semibold">+1 302 464 0950</a>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
