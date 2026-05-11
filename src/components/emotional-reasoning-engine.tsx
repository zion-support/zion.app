'use client';

import { useState, useEffect } from 'react';

interface EmotionState {
  joy: number;
  curiosity: number;
  determination: number;
  serenity: number;
  surprise: number;
}

interface ResponsePattern {
  trigger: string;
  intensity: number;
  response: string;
}

export default function EmotionalReasoningEngine() {
  const [emotions, setEmotions] = useState<EmotionState>({
    joy: 78.4,
    curiosity: 92.1,
    determination: 85.7,
    serenity: 71.3,
    surprise: 45.8
  });

  const [patterns, setPatterns] = useState<ResponsePattern[]>([
    { trigger: 'complex-problem', intensity: 94.2, response: 'determination' },
    { trigger: 'new-information', intensity: 87.6, response: 'curiosity' },
    { trigger: 'successful-solution', intensity: 96.8, response: 'joy' },
    { trigger: 'uncertainty', intensity: 62.4, response: 'serenity' },
    { trigger: 'unexpected-event', intensity: 73.1, response: 'surprise' }
  ]);

  const [reasoningDepth, setReasoningDepth] = useState(7);
  const [ethicalScore, setEthicalScore] = useState(94.7);

  useEffect(() => {
    const interval = setInterval(() => {
      setEmotions(prev => ({
        joy: Math.min(100, Math.max(30, prev.joy + (Math.random() - 0.4) * 4)),
        curiosity: Math.min(100, Math.max(50, prev.curiosity + (Math.random() - 0.3) * 3)),
        determination: Math.min(100, Math.max(40, prev.determination + (Math.random() - 0.35) * 3.5)),
        serenity: Math.min(100, Math.max(30, prev.serenity + (Math.random() - 0.45) * 4)),
        surprise: Math.min(100, Math.max(20, prev.surprise + (Math.random() - 0.5) * 5))
      }));

      setPatterns(prev => prev.map(p => ({
        ...p,
        intensity: Math.min(100, Math.max(30, p.intensity + (Math.random() - 0.4) * 4))
      })));

      setReasoningDepth(Math.min(12, Math.max(3, reasoningDepth + Math.floor(Math.random() * 3) - 1)));
      setEthicalScore(Math.min(100, Math.max(80, ethicalScore + (Math.random() - 0.3) * 2)));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const getEmotionColor = (value: number) => {
    if (value > 80) return 'bg-green-500';
    if (value > 60) return 'bg-yellow-500';
    return 'bg-red-400';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-pink-50 rounded-xl shadow-lg border border-pink-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-pink-900">
            <span className="text-3xl mr-2">💭</span> Emotional Reasoning Engine
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI emotional state modeling for human-like decision making
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
            Depth: {reasoningDepth}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            Ethics: {ethicalScore.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-pink-100">
          <h3 className="font-semibold text-pink-800 mb-3">Emotional State</h3>
          <div className="space-y-3">
            {Object.entries(emotions).map(([key, value]) => (
              <div key={key} className="p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="capitalize text-gray-700">{key}</span>
                  <span className="text-lg font-bold text-pink-700">{value.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-pink-200 rounded-full overflow-hidden">
                  <div className={`h-full ${getEmotionColor(value)} transition-all`} style={{ width: `${value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-pink-100">
          <h3 className="font-semibold text-pink-800 mb-3">Response Patterns</h3>
          <div className="space-y-3">
            {patterns.map((pattern, idx) => (
              <div key={pattern.trigger} className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-800 capitalize">{pattern.trigger.replace(/-/g, ' ')}</span>
                  <div className="text-xs text-gray-500">→ {pattern.response}</div>
                </div>
                <span className="text-lg font-bold text-pink-700">{pattern.intensity.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-pink-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Ethical Framework:</span>
          <span className="font-semibold text-pink-800">Active</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Decision Mode:</span>
          <span className="text-pink-600 font-semibold">Emotionally-Informed</span>
        </div>
      </div>
    </div>
  );
}