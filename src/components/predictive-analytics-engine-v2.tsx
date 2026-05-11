'use client';

import { useState, useEffect } from 'react';

interface PredictionModel {
  id: string;
  accuracy: number;
  confidence: number;
  lastUpdate: number;
}

interface ForecastMetric {
  horizon: string;
  accuracy: number;
  samples: number;
}

export default function PredictiveAnalyticsEngineV2() {
  const [models, setModels] = useState<PredictionModel[]>([
    { id: 'demand-forecast', accuracy: 94.7, confidence: 92.3, lastUpdate: Date.now() - 300000 },
    { id: 'anomaly-prediction', accuracy: 89.2, confidence: 86.8, lastUpdate: Date.now() - 180000 },
    { id: 'trend-analysis', accuracy: 96.1, confidence: 94.5, lastUpdate: Date.now() - 420000 },
    { id: 'risk-assessment', accuracy: 91.8, confidence: 88.4, lastUpdate: Date.now() - 240000 }
  ]);

  const [forecasts, setForecasts] = useState<ForecastMetric[]>([
    { horizon: '1h', accuracy: 97.4, samples: 12457 },
    { horizon: '24h', accuracy: 94.2, samples: 8234 },
    { horizon: '7d', accuracy: 88.7, samples: 4521 },
    { horizon: '30d', accuracy: 82.3, samples: 1892 }
  ]);

  const [globalScore, setGlobalScore] = useState(93.4);

  useEffect(() => {
    const interval = setInterval(() => {
      setModels(prev => prev.map(m => ({
        ...m,
        accuracy: Math.min(100, Math.max(70, m.accuracy + (Math.random() - 0.35) * 2)),
        confidence: Math.min(100, Math.max(60, m.confidence + (Math.random() - 0.4) * 3)),
        lastUpdate: Date.now()
      })));

      setForecasts(prev => prev.map(f => ({
        ...f,
        accuracy: Math.min(100, Math.max(60, f.accuracy + (Math.random() - 0.4) * 2)),
        samples: f.samples + Math.floor(Math.random() * 100)
      })));

      setGlobalScore(Math.min(100, Math.max(70, globalScore + (Math.random() - 0.35) * 1.5)));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg border border-orange-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-orange-900">
            <span className="text-3xl mr-2">📈</span> Predictive Analytics Engine v2
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Multi-horizon forecasting with real-time model adaptation
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold">
            Score: {globalScore.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-orange-100">
          <h3 className="font-semibold text-orange-800 mb-3">Active Models</h3>
          <div className="space-y-3">
            {models.map((model, idx) => (
              <div key={model.id} className="p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800 capitalize text-sm">{model.id.replace(/-/g, ' ')}</span>
                  <span className="text-xs text-gray-500">{Math.floor((Date.now() - model.lastUpdate) / 60000)}m ago</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-xs text-gray-500">Accuracy: </span>
                    <span className="text-sm font-bold text-orange-700">{model.accuracy.toFixed(1)}%</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Confidence: </span>
                    <span className="text-sm font-bold text-orange-700">{model.confidence.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-orange-100">
          <h3 className="font-semibold text-orange-800 mb-3">Forecast Accuracy by Horizon</h3>
          <div className="space-y-3">
            {forecasts.map((forecast, idx) => (
              <div key={forecast.horizon} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <span className="font-medium text-gray-800">{forecast.horizon}</span>
                  <div className="text-xs text-gray-500">{forecast.samples.toLocaleString()} samples</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-orange-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-600" style={{ width: `${forecast.accuracy}%` }} />
                  </div>
                  <span className="text-lg font-bold text-orange-700">{forecast.accuracy.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-orange-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Prediction Status:</span>
          <span className="font-semibold text-orange-800">Live Forecasting</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Models Active:</span>
          <span className="text-orange-600 font-semibold">{models.length}</span>
        </div>
      </div>
    </div>
  );
}
