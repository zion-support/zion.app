'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { allServices } from '../../app/data/servicesData';

// ── Quiz Questions ──
const QUESTIONS = [
  {
    id: 'industry',
    question: 'What industry is your business in?',
    questionPt: 'Em qual setor sua empresa atua?',
    options: [
      { value: 'technology-&-saas', label: 'Technology / SaaS', emoji: '💻' },
      { value: 'financial-services-&-fintech', label: 'Financial Services / FinTech', emoji: '💳' },
      { value: 'healthcare-&-life-sciences', label: 'Healthcare / Life Sciences', emoji: '🏥' },
      { value: 'retail-&-e-commerce', label: 'Retail / E-Commerce', emoji: '🛒' },
      { value: 'manufacturing-&-industrial', label: 'Manufacturing / Industrial', emoji: '🏗️' },
      { value: 'education-&-research', label: 'Education / Research', emoji: '🎓' },
      { value: 'logistics-&-supply-chain', label: 'Logistics / Supply Chain', emoji: '🚚' },
      { value: 'media-&-entertainment', label: 'Media / Entertainment', emoji: '🎬' },
      { value: 'energy-&-utilities', label: 'Energy / Utilities', emoji: '⚡' },
      { value: 'legal-&-compliance', label: 'Legal / Compliance', emoji: '⚖️' },
      { value: 'other', label: 'Other / Not listed', emoji: '🌐' },
    ],
  },
  {
    id: 'challenge',
    question: 'What is your biggest operational challenge?',
    questionPt: 'Qual é o seu maior desafio operacional?',
    options: [
      { value: 'manual-processes', label: 'Too many manual, repetitive tasks', emoji: '🔄' },
      { value: 'data-insights', label: 'Lack of data-driven insights', emoji: '📊' },
      { value: 'customer-experience', label: 'Improving customer experience', emoji: '😊' },
      { value: 'cost-reduction', label: 'Reducing operational costs', emoji: '💰' },
      { value: 'security-compliance', label: 'Security & compliance gaps', emoji: '🔐' },
      { value: 'scaling', label: 'Scaling infrastructure / systems', emoji: '📈' },
      { value: 'ai-adoption', label: 'Adopting AI / automation', emoji: '🤖' },
    ],
  },
  {
    id: 'team-size',
    question: 'How many people are in your team?',
    questionPt: 'Quantas pessoas estão na sua equipe?',
    options: [
      { value: 'solo', label: 'Just me / Freelancer', emoji: '👤' },
      { value: 'small', label: '2–10 people', emoji: '👥' },
      { value: 'medium', label: '11–50 people', emoji: '🏢' },
      { value: 'large', label: '51–200 people', emoji: '🏬' },
      { value: 'enterprise', label: '200+ people', emoji: '🌆' },
    ],
  },
  {
    id: 'budget',
    question: 'What is your approximate monthly budget for technology services?',
    questionPt: 'Qual é o seu orçamento mensal aproximado para serviços de tecnologia?',
    options: [
      { value: 'starter', label: 'Under $500/mo', emoji: '🌱' },
      { value: 'growth', label: '$500 – $2,000/mo', emoji: '📈' },
      { value: 'scale', label: '$2,000 – $10,000/mo', emoji: '🚀' },
      { value: 'enterprise', label: '$10,000+/mo', emoji: '💎' },
      { value: 'exploring', label: 'Just exploring options', emoji: '🔍' },
    ],
  },
  {
    id: 'timeline',
    question: 'When do you need a solution?',
    questionPt: 'Quando você precisa de uma solução?',
    options: [
      { value: 'asap', label: 'ASAP — we have an urgent need', emoji: '🔥' },
      { value: 'month', label: 'Within 1–3 months', emoji: '📅' },
      { value: 'quarter', label: 'This quarter', emoji: '📆' },
      { value: 'exploring', label: 'Just exploring for now', emoji: '🔭' },
    ],
  },
];

// ── Industry → category mapping ──
const INDUSTRY_CATS: Record<string, string> = {
  'technology-&-saas': 'it',
  'financial-services-&-fintech': 'ai',
  'healthcare-&-life-sciences': 'ai',
  'retail-&-e-commerce': 'ai',
  'manufacturing-&-industrial': 'automation',
  'education-&-research': 'ai',
  'logistics-&-supply-chain': 'data',
  'media-&-entertainment': 'ai',
  'energy-&-utilities': 'data',
  'legal-&-compliance': 'ai',
  'other': 'ai',
};

// ── Challenge → category boost ──
const CHALLENGE_BOOST: Record<string, string[]> = {
  'manual-processes': ['automation', 'ai'],
  'data-insights': ['data', 'ai'],
  'customer-experience': ['ai', 'automation'],
  'cost-reduction': ['cloud', 'automation'],
  'security-compliance': ['security', 'it'],
  'scaling': ['cloud', 'it'],
  'ai-adoption': ['ai', 'automation'],
};

// ── Budget → pricing tier filter ──
const BUDGET_TIERS: Record<string, { min: number; max: number; label: string }> = {
  'starter': { min: 0, max: 500, label: 'Starter' },
  'growth': { min: 200, max: 2000, label: 'Growth' },
  'scale': { min: 1000, max: 10000, label: 'Scale' },
  'enterprise': { min: 5000, max: 99999, label: 'Enterprise' },
  'exploring': { min: 0, max: 99999, label: 'All' },
};

interface QuizResult {
  services: any[];
  score: number;
  category: string;
  categoryLabel: string;
  estimatedROI: string;
  recommendedTier: string;
}

function parsePrice(pricing: Record<string, string>): number {
  const firstPrice = Object.values(pricing || {})[0] || '';
  const match = firstPrice.match(/\$?([\d,]+)/);
  if (match) return parseInt(match[1].replace(/,/g, ''), 10);
  return 0;
}

function calculateResults(answers: Record<string, string>): QuizResult {
  const allSvcs = allServices;
  const industryCat = INDUSTRY_CATS[answers.industry] || 'ai';
  const challengeBoost = CHALLENGE_BOOST[answers.challenge] || [];
  const budgetTier = BUDGET_TIERS[answers.budget] || BUDGET_TIERS['exploring'];

  // Score each service
  const scored = allSvcs.map((s: any) => {
    let score = 0;
    const sCat = s.category || '';

    // Industry match (strong signal)
    if (sCat === industryCat) score += 30;

    // Challenge match
    if (challengeBoost.includes(sCat)) score += 20;

    // Popular services get a boost
    if (s.popular) score += 15;

    // Price match
    const price = parsePrice(s.pricing);
    if (price >= budgetTier.min && price <= budgetTier.max) score += 10;

    // Feature richness
    score += Math.min((s.features?.length || 0) * 2, 10);
    score += Math.min((s.benefits?.length || 0) * 2, 10);

    return { ...s, _score: score };
  });

  // Sort and take top 5
  const topServices = scored
    .sort((a: any, b: any) => b._score - a._score)
    .slice(0, 5);

  // Calculate overall match score
  const avgScore = topServices.reduce((sum: number, s: any) => sum + s._score, 0) / topServices.length;
  const matchScore = Math.min(Math.round((avgScore / 80) * 100), 98);

  // Estimate ROI based on challenge + budget
  const roiMap: Record<string, string> = {
    'manual-processes': '40–60% time savings within 3 months',
    'data-insights': '25–40% improvement in decision speed',
    'customer-experience': '30–50% increase in satisfaction scores',
    'cost-reduction': '20–35% operational cost reduction',
    'security-compliance': '90%+ compliance gap closure',
    'scaling': '3–5x infrastructure capacity without proportional cost increase',
    'ai-adoption': '50–70% faster time-to-value on AI initiatives',
  };

  const catLabels: Record<string, string> = {
    ai: 'AI & Machine Learning',
    it: 'IT & Infrastructure',
    cloud: 'Cloud Solutions',
    security: 'Security & Compliance',
    data: 'Data & Analytics',
    automation: 'Process Automation',
  };

  return {
    services: topServices,
    score: matchScore,
    category: industryCat,
    categoryLabel: catLabels[industryCat] || 'Technology Services',
    estimatedROI: roiMap[answers.challenge] || 'Significant operational improvement',
    recommendedTier: budgetTier.label,
  };
}

export default function ServiceMatchQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [started, setStarted] = useState(false);

  const currentQ = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;
  const progress = started ? Math.round(((step + (showResults ? 1 : 0)) / QUESTIONS.length) * 100) : 0;

  const results = useMemo(() => {
    if (showResults && Object.keys(answers).length === QUESTIONS.length) {
      return calculateResults(answers);
    }
    return null;
  }, [showResults, answers]);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (isLast) {
      setShowResults(true);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 0) {
      setStep(step - 1);
    } else {
      setStarted(false);
      setAnswers({});
    }
  };

  const handleRestart = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
    setStarted(true);
  };

  // ── Not started ──
  if (!started) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(120,50,200,0.12),transparent_60%)]" />
        <div className="container-page relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 text-sm mb-6">
              <span>✨</span> Free Interactive Tool
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Find Your Perfect Service Match
            </h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Answer 5 quick questions and get an instant, personalized service recommendation
              with estimated ROI — powered by our AI matching engine.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setStarted(true)}
                className="btn-primary text-lg px-10 py-4 bg-gradient-to-r from-purple-600 to-emerald-600 hover:from-purple-500 hover:to-emerald-500"
              >
                🚀 Start the Quiz — It's Free
              </button>
              <Link href="/services/" className="btn-secondary text-lg px-10 py-4">
                Browse All Services →
              </Link>
            </div>
            <p className="text-slate-500 text-sm mt-4">Takes 30 seconds · No sign-up required · Instant results</p>
          </div>
        </div>
      </section>
    );
  }

  // ── Results ──
  if (showResults && results) {
    return (
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(52,211,153,0.08),transparent_60%)]" />
        <div className="container-page relative">
          <div className="max-w-4xl mx-auto">
            {/* Score Card */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/30 border border-emerald-500/30 text-emerald-300 text-sm mb-6">
                <span>🎯</span> Your Personalized Results
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                We Found Your Best Matches
              </h2>

              {/* Match Score */}
              <div className="inline-flex flex-col items-center bg-slate-900/80 border border-slate-700/50 rounded-2xl p-8 mb-8">
                <div className="relative w-32 h-32 mb-4">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#1e293b" strokeWidth="8" />
                    <circle cx="60" cy="60" r="52" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                      strokeDasharray={`${(results.score / 100) * 327} 327`} strokeLinecap="round" />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{results.score}%</span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">Match Score</p>
                <p className="text-emerald-400 text-sm font-medium mt-1">
                  Recommended: {results.categoryLabel}
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10">
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-2xl mb-1">📊</div>
                  <div className="text-sm font-semibold text-white">Estimated ROI</div>
                  <div className="text-xs text-slate-400 mt-1">{results.estimatedROI}</div>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-sm font-semibold text-white">Recommended Tier</div>
                  <div className="text-xs text-slate-400 mt-1">{results.recommendedTier}</div>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-sm font-semibold text-white">Time to Value</div>
                  <div className="text-xs text-slate-400 mt-1">2–4 weeks typical</div>
                </div>
              </div>
            </div>

            {/* Recommended Services */}
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              🏆 Top {results.services.length} Recommended Services
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {results.services.map((service: any, i: number) => (
                <Link
                  key={service.id}
                  href={`/services/${service.id}`}
                  className="glass-card flex flex-col gap-3 p-5 hover:border-purple-500/40 group transition-all relative"
                >
                  {i === 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                      #1 MATCH
                    </span>
                  )}
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors leading-snug">
                        {service.title}
                      </h4>
                      <p className="text-slate-400 text-xs mt-1 line-clamp-2">{service.description}</p>
                    </div>
                  </div>
                  <div className="mt-auto pt-2 border-t border-slate-700/40 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500">Match: {Math.min(Math.round(service._score / 80 * 100), 99)}%</span>
                    <span className="text-purple-300 text-xs font-semibold">
                      From {Object.values(service.pricing as Record<string, string>)[0]}/mo
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/configurator/" className="btn-primary text-lg px-10 py-4 bg-gradient-to-r from-purple-600 to-emerald-600">
                  ⚡ Get Your Free Custom Proposal
                </Link>
                <Link href="/contact/" className="btn-secondary text-lg px-10 py-4">
                  📞 Talk to Our Team
                </Link>
              </div>
              <button onClick={handleRestart} className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
                ↩ Retake the quiz
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ── Quiz Question ──
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(120,50,200,0.08),transparent_60%)]" />
      <div className="container-page relative">
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-400">Question {step + 1} of {QUESTIONS.length}</span>
              <span className="text-sm text-slate-400">{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2">{currentQ.question}</h3>
            <p className="text-slate-400 text-sm">Select the option that best describes your situation</p>
          </div>

          {/* Options */}
          <div className="grid gap-3">
            {currentQ.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-purple-500/40 hover:bg-slate-800/80 transition-all text-left group"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{opt.emoji}</span>
                <span className="text-slate-200 group-hover:text-white transition-colors font-medium">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Back */}
          <div className="mt-6 text-center">
            <button onClick={handleBack} className="text-slate-500 text-sm hover:text-slate-300 transition-colors">
              ← Back
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
