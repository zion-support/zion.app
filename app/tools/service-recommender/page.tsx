// app/tools/service-recommender/page.tsx
'use client';
import { pingTool } from '@/data/tools_ping_client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { allServices, type Service } from '../../data/servicesData';

const questions = [
  { id: 'category', label: 'What area do you need help with?', options: ['AI & Automation', 'IT Infrastructure', 'Cloud & DevOps', 'Data & Analytics', 'Cybersecurity'] },
  { id: 'budget',  label: 'What is your monthly budget?', options: ['Under $5,000', '$5,000 – $20,000', '$20,000 – $100,000', '$100,000+'] },
  { id: 'timeline',label: 'When do you need to go live?', options: ['ASAP', '1–3 months', '3–6 months', '6+ months'] },
];

export default function ServiceRecommenderPage() {
  useEffect(() => { pingTool('service-recommender'); }, []);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [recommendations, setRecommendations] = useState<Service[]>([]);

  const handleAnswer = (qid: string, value: string) => {
    const next = { ...answers, [qid]: value };
    setAnswers(next);
    if (Object.keys(next).length === questions.length) {
      const catKey = Object.keys(next).find((k) => k === 'category');
      const cat = catKey ? next[catKey] : '';
      const catMap: Record<string, string> = {
        'AI & Automation': 'ai',
        'IT Infrastructure': 'it',
        'Cloud & DevOps': 'cloud',
        'Data & Analytics': 'data',
        'Cybersecurity': 'security',
      };
      const matched = allServices.filter(
        (s: Service) => s.category === (catMap[cat] || 'ai')
      ).slice(0, 6);
      setRecommendations(matched);
    }
  };

  return (
    <div className="container-page py-16">
      <h1 className="text-4xl font-bold text-white mb-4">Service Recommender</h1>
      <p className="text-slate-400 mb-12 max-w-2xl">
        Answer a few questions and we&apos;ll match you with the right AI, IT, or Cloud solution from our catalog of 416+ services.
      </p>

      {recommendations.length === 0 ? (
        <div className="max-w-xl space-y-8">
          {questions.map((q) => (
            <div key={q.id}>
              <label className="block text-white font-medium mb-3">{q.label}</label>
              <div className="flex flex-wrap gap-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(q.id, opt)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                      answers[q.id] === opt
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-slate-400 mb-6">Based on your answers, we recommend:</p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((service: Service) => (
              <Link key={service.id} href={`/services/${service.id}`} className="glass-card">
                <div className="text-2xl mb-2" aria-hidden="true">{service.icon}</div>
                <h3 className="font-semibold text-white text-sm">{service.title}</h3>
                <p className="text-slate-400 text-xs mt-1 line-clamp-2">{service.description}</p>
                <span className="text-purple-400 text-xs mt-2 inline-block">View details →</span>
              </Link>
            ))}
          </div>
          <button
            onClick={() => { setAnswers({}); setRecommendations([]); }}
            className="mt-8 px-6 py-2 rounded-full border border-slate-600 text-sm text-slate-300 hover:border-purple-500"
          >
            Start Over
          </button>
        </div>
      )}
    </div>
  );
}
