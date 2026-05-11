'use client';

import { useState, useEffect } from 'react';

interface AnomalyType {
  type: string;
  count: number;
  severity: number;
}

interface DetectionModel {
  id: string;
  precision: number;
  recall: number;
  f1Score: number;
}

export default function SelfHealingAnomalyDetector() {
  const [anomalies, setAnomalies] = useState<AnomalyType[]>([
    { type: 'network', count: 23, severity: 12.4 },
    { type: 'performance', count: 17, severity: 8.7 },
    { type: 'security', count: 8, severity: 45.2 },
    { type: 'data-integrity', count: 5, severity: 67.8 },
    { type: 'resource', count: 31, severity: 5.3 }
  ]);

  const [models, setModels] = useState<DetectionModel[]>([
    { id: 'isolation-forest', precision: 94.7, recall: 92.3, f1Score: 93.5 },
    { id: 'autoencoder', precision: 89.2, recall: 94.8, f1Score: 91.9 },
    { id: 'lstm-anomaly', precision: 96.1, recall: 88.7, f1Score: 92.3 },
    { id: 'ensemble', precision: 97.4, recall: 95.2, f1Score: 96.3 }
  ]);

  const [healing, setHealing] = useState({
    detected: 84,
    healed: 79,
    healingRate: 94.0,
    avgResponseTime: 0.023
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setAnomalies(prev => prev.map(a => ({
        ...a,
        count: Math.max(0, a.count + Math.floor(Math.random() * 7) - 3),
        severity: Math.max(0, Math.min(100, a.severity + (Math.random() - 0.5) * 5))
      })));

      setModels(prev => prev.map(m => ({
        ...m,
        precision: Math.min(100, Math.max(70, m.precision + (Math.random() - 0.4) * 2)),
        recall: Math.min(100, Math.max(70, m.recall + (Math.random() - 0.4) * 2)),
        f1Score: Math.min(100, Math.max(70, m.f1Score + (Math.random() - 0.4) * 2))
      })));

      setHealing(prev => ({
        ...prev,
        detected: prev.detected + Math.floor(Math.random() * 5),
        healed: prev.healed + Math.floor(Math.random() * 4),
        healingRate: Math.min(100, Math.max(80, prev.healingRate + (Math.random() - 0.4) * 2)),
        avgResponseTime: Math.max(0.001, prev.avgResponseTime + (Math.random() - 0.5) * 0.005)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: number) => {
    if (severity > 50) return 'text-red-600';
    if (severity > 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-white to-rose-50 rounded-xl shadow-lg border border-rose-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-rose-900">
            <span className="text-3xl mr-2">🔧</span> Self-Healing Anomaly Detector
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Autonomous anomaly detection with self-healing responses
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            {healing.healingRate.toFixed(1)}% Healed
          </span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-rose-100">
          <h3 className="font-semibold text-rose-800 mb-3">Anomaly Types</h3>
          <div className="space-y-3">
            {anomalies.map((anomaly, idx) => (
              <div key={anomaly.type} className="p-3 bg-rose-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="capitalize text-gray-700">{anomaly.type}</span>
                  <span className={`text-lg font-bold ${getSeverityColor(anomaly.severity)}`}>
                    {anomaly.severity.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{anomaly.count} active</span>
                  <span>Severity</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur rounded-xl p-5 border border-rose-100">
          <h3 className="font-semibold text-rose-800 mb-3">Detection Models</h3>
          <div className="space-y-3">
            {models.map((model, idx) => (
              <div key={model.id} className="p-3 bg-rose-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-800">{model.id}</span>
                  <span className="text-sm font-bold text-rose-700">F1: {model.f1Score.toFixed(1)}%</span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs text-gray-500">
                  <span>P: {model.precision.toFixed(1)}%</span>
                  <span>R: {model.recall.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-rose-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Response Time:</span>
          <span className="font-semibold text-rose-800">{(healing.avgResponseTime * 1000).toFixed(2)}ms</span>
        </div>
        <div className="flex items-center justify-between text-sm mt-1">
          <span className="text-gray-500">Auto-Healing:</span>
          <span className="text-rose-600 font-semibold">Active</span>
        </div>
      </div>
    </div>
  );
}
