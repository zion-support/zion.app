'use client';

import { useState } from 'react';
import Link from 'next/link';

interface QuizQuestion {
  id: string;
  question: string;
  options: { value: string; label: string; icon: string }[];
}

interface ServiceRecommendation {
  id: string;
  title: string;
  description: string;
  price: string;
  roi: string;
  category: string;
}

const questions: QuizQuestion[] = [
  {
    id: 'industry',
    question: 'What industry is your business in?',
    options: [
      { value: 'technology', label: 'Technology & SaaS', icon: '💻' },
      { value: 'healthcare', label: 'Healthcare', icon: '🏥' },
      { value: 'finance', label: 'Finance & Banking', icon: '💰' },
      { value: 'retail', label: 'Retail & E-commerce', icon: '🛒' },
      { value: 'manufacturing', label: 'Manufacturing', icon: '🏭' },
      { value: 'other', label: 'Other', icon: '🌐' },
    ],
  },
  {
    id: 'company_size',
    question: 'What is your company size?',
    options: [
      { value: 'startup', label: 'Startup (1-10 employees)', icon: '🚀' },
      { value: 'small', label: 'Small (11-50 employees)', icon: '👥' },
      { value: 'medium', label: 'Medium (51-200 employees)', icon: '🏢' },
      { value: 'large', label: 'Large (201-1000 employees)', icon: '🏛️' },
      { value: 'enterprise', label: 'Enterprise (1000+ employees)', icon: '🌍' },
    ],
  },
  {
    id: 'challenge',
    question: 'What is your biggest business challenge?',
    options: [
      { value: 'automation', label: 'Manual processes & inefficiency', icon: '⚙️' },
      { value: 'data', label: 'Data analysis & insights', icon: '📊' },
      { value: 'security', label: 'Security & compliance', icon: '🔒' },
      { value: 'scaling', label: 'Scaling operations', icon: '📈' },
      { value: 'customer', label: 'Customer experience', icon: '😊' },
      { value: 'innovation', label: 'Innovation & AI adoption', icon: '🤖' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your monthly technology budget?',
    options: [
      { value: 'low', label: 'Under $5,000/month', icon: '💵' },
      { value: 'medium', label: '$5,000 - $20,000/month', icon: '💰' },
      { value: 'high', label: '$20,000 - $50,000/month', icon: '💎' },
      { value: 'enterprise', label: '$50,000+/month', icon: '🏆' },
    ],
  },
  {
    id: 'timeline',
    question: 'When do you need to implement a solution?',
    options: [
      { value: 'urgent', label: 'Immediately (within 1 week)', icon: '⚡' },
      { value: 'soon', label: 'Soon (within 1 month)', icon: '📅' },
      { value: 'planning', label: 'Planning (1-3 months)', icon: '🗓️' },
      { value: 'exploring', label: 'Just exploring options', icon: '🔍' },
    ],
  },
];

const serviceDatabase: Record<string, ServiceRecommendation[]> = {
  technology_automation: [
    {
      id: 'workflow-automation-platform',
      title: 'AI Workflow Automation Platform',
      description: 'Automate repetitive tasks and streamline operations with intelligent workflows',
      price: '$2,999/mo',
      roi: '340% ROI in first year',
      category: 'Automation',
    },
    {
      id: 'rpa-solution',
      title: 'Robotic Process Automation (RPA)',
      description: 'Deploy software robots to handle manual, rule-based tasks',
      price: '$4,999/mo',
      roi: '280% ROI, 60% time savings',
      category: 'Automation',
    },
  ],
  technology_data: [
    {
      id: 'business-intelligence-platform',
      title: 'AI-Powered Business Intelligence',
      description: 'Transform raw data into actionable insights with machine learning',
      price: '$3,999/mo',
      roi: '450% ROI through data-driven decisions',
      category: 'Data Analytics',
    },
    {
      id: 'predictive-analytics-suite',
      title: 'Predictive Analytics Suite',
      description: 'Forecast trends and outcomes with advanced ML models',
      price: '$5,999/mo',
      roi: '320% ROI, 85% prediction accuracy',
      category: 'Data Analytics',
    },
  ],
  technology_security: [
    {
      id: 'cybersecurity-suite',
      title: 'Enterprise Cybersecurity Suite',
      description: 'Comprehensive protection against modern cyber threats',
      price: '$6,999/mo',
      roi: 'Prevent $2M+ in potential breaches',
      category: 'Security',
    },
    {
      id: 'zero-trust-platform',
      title: 'Zero Trust Security Platform',
      description: 'Never trust, always verify - modern security architecture',
      price: '$4,999/mo',
      roi: '90% reduction in security incidents',
      category: 'Security',
    },
  ],
  healthcare_automation: [
    {
      id: 'healthcare-workflow-automation',
      title: 'Healthcare Workflow Automation',
      description: 'Streamline patient intake, billing, and administrative tasks',
      price: '$3,999/mo',
      roi: '250% ROI, 70% less admin time',
      category: 'Healthcare IT',
    },
  ],
  healthcare_data: [
    {
      id: 'clinical-analytics-platform',
      title: 'Clinical Analytics Platform',
      description: 'AI-powered insights for better patient outcomes',
      price: '$5,999/mo',
      roi: '40% improvement in patient outcomes',
      category: 'Healthcare Analytics',
    },
  ],
  finance_security: [
    {
      id: 'fraud-detection-ai',
      title: 'AI Fraud Detection System',
      description: 'Real-time fraud detection with 99.9% accuracy',
      price: '$8,999/mo',
      roi: 'Prevent $5M+ in fraud annually',
      category: 'FinTech Security',
    },
    {
      id: 'compliance-automation',
      title: 'Regulatory Compliance Automation',
      description: 'Automate compliance monitoring and reporting',
      price: '$6,999/mo',
      roi: '80% reduction in compliance costs',
      category: 'FinTech Compliance',
    },
  ],
  retail_customer: [
    {
      id: 'ai-customer-experience',
      title: 'AI Customer Experience Platform',
      description: 'Personalized customer journeys with predictive recommendations',
      price: '$4,999/mo',
      roi: '35% increase in customer lifetime value',
      category: 'Retail AI',
    },
  ],
  manufacturing_scaling: [
    {
      id: 'smart-manufacturing-platform',
      title: 'Smart Manufacturing Platform',
      description: 'IoT-enabled production optimization and predictive maintenance',
      price: '$7,999/mo',
      roi: '45% reduction in downtime, 30% efficiency gain',
      category: 'Industry 4.0',
    },
  ],
};

function getRecommendations(answers: Record<string, string>): ServiceRecommendation[] {
  const key = `${answers.industry}_${answers.challenge}`;
  let recommendations = serviceDatabase[key] || [];
  
  // Add some general recommendations if specific ones not found
  if (recommendations.length === 0) {
    recommendations = [
      {
        id: 'ai-consulting',
        title: 'AI Strategy Consulting',
        description: 'Custom AI roadmap and implementation strategy',
        price: '$5,999/mo',
        roi: 'Tailored to your specific needs',
        category: 'Consulting',
      },
      {
        id: 'digital-transformation',
        title: 'Digital Transformation Suite',
        description: 'End-to-end digital transformation platform',
        price: '$9,999/mo',
        roi: '200-400% ROI depending on scope',
        category: 'Digital Transformation',
      },
    ];
  }
  
  return recommendations;
}

function calculateROI(answers: Record<string, string>, service: ServiceRecommendation): string {
  const multipliers: Record<string, number> = {
    startup: 0.8,
    small: 1.0,
    medium: 1.2,
    large: 1.5,
    enterprise: 2.0,
  };
  
  const urgencyMultiplier = answers.timeline === 'urgent' ? 1.3 : 1.0;
  const sizeMultiplier = multipliers[answers.company_size] || 1.0;
  
  const baseROI = parseInt(service.roi.match(/\d+/)?.[0] || '200');
  const adjustedROI = Math.round(baseROI * sizeMultiplier * urgencyMultiplier);
  
  return `${adjustedROI}% ROI potential`;
}

export default function ServiceDiscoveryQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [recommendations, setRecommendations] = useState<ServiceRecommendation[]>([]);

  const handleAnswer = (questionId: string, value: string) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const recs = getRecommendations(newAnswers);
      setRecommendations(recs);
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setRecommendations([]);
  };

  if (showResults) {
    return (
      <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-3xl p-8 md:p-12 border border-purple-500/30">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🎯 Your Personalized Recommendations
          </h2>
          <p className="text-slate-300 text-lg">
            Based on your business profile, here are the top solutions for you
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {recommendations.map((service, idx) => (
            <div
              key={service.id}
              className="bg-slate-900/60 rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="px-3 py-1 bg-purple-600/30 text-purple-300 rounded-full text-xs font-semibold">
                  {service.category}
                </span>
                {idx === 0 && (
                  <span className="px-3 py-1 bg-green-600/30 text-green-300 rounded-full text-xs font-semibold">
                    ⭐ Top Match
                  </span>
                )}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
              <p className="text-slate-300 mb-4">{service.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Investment:</span>
                  <span className="text-white font-semibold">{service.price}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Expected ROI:</span>
                  <span className="text-green-400 font-semibold">
                    {calculateROI(answers, service)}
                  </span>
                </div>
              </div>
              <Link
                href={`/services/${service.id}/`}
                className="block w-full text-center py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Learn More →
              </Link>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/30 mb-6">
          <h3 className="text-xl font-bold text-white mb-3">💡 Next Steps</h3>
          <ul className="space-y-2 text-slate-300">
            <li>✓ Schedule a free consultation with our experts</li>
            <li>✓ Get a detailed ROI analysis for your specific situation</li>
            <li>✓ Start with a pilot program to validate results</li>
            <li>✓ 30-day money-back guarantee on all solutions</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetQuiz}
            className="px-6 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600 transition-all"
          >
            ← Retake Quiz
          </button>
          <Link
            href="/contact"
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all text-center"
          >
            📞 Talk to an Expert
          </Link>
          <Link
            href="/services"
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all text-center"
          >
            Browse All 804+ Services
          </Link>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-3xl p-8 md:p-12 border border-purple-500/30">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            🎯 Service Discovery Quiz
          </h2>
          <span className="text-slate-400 text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
          <div
            className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h3 className="text-xl md:text-2xl font-semibold text-white mb-6">
          {question.question}
        </h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => handleAnswer(question.id, option.value)}
            className="flex items-center gap-4 p-5 bg-slate-900/60 rounded-xl border border-slate-700 hover:border-purple-500 hover:bg-slate-800/60 transition-all text-left group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">
              {option.icon}
            </span>
            <span className="text-white font-medium text-lg">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center text-slate-400 text-sm">
        ⏱️ Takes less than 2 minutes • 🎯 Personalized recommendations • 💰 Instant ROI calculation
      </div>
    </div>
  );
}
