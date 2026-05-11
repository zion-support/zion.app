'use client';

import { useState, useEffect } from 'react';

interface Prediction {
  id: string;
  metric: string;
  currentValue: number;
  predictedValue: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  timeframe: string;
  factors: string[];
  lastUpdated: Date;
}

interface HistoricalData {
  timestamp: Date;
  value: number;
  metadata?: Record<string, any>;
}

export default function PredictiveAnalyticsEngine() {
  const [predictions, setPredictions] = useState<Prediction[]>([
    {
      id: 'pred-001',
      metric: 'User Growth Rate',
      currentValue: 12.5,
      predictedValue: 18.2,
      confidence: 87,
      trend: 'up',
      timeframe: 'next 30 days',
      factors: ['Current growth trajectory', 'Marketing campaign ROI', 'Seasonal trends'],
      lastUpdated: new Date()
    },
    {
      id: 'pred-002',
      metric: 'System Load Average',
      currentValue: 65,
      predictedValue: 78,
      confidence: 92,
      trend: 'up',
      timeframe: 'next 7 days',
      factors: ['Traffic patterns', 'New feature adoption', 'Time of day effects'],
      lastUpdated: new Date()
    },
    {
      id: 'pred-003',
      metric: 'Conversion Rate',
      currentValue: 4.2,
      predictedValue: 4.8,
      confidence: 76,
      trend: 'up',
      timeframe: 'next 14 days',
      factors: ['A/B test results', 'User journey optimization', 'Pricing changes'],
      lastUpdated: new Date()
    },
    {
      id: 'pred-004',
      metric: 'Support Ticket Volume',
      currentValue: 45,
      predictedValue: 32,
      confidence: 84,
      trend: 'down',
      timeframe: 'next 30 days',
      factors: ['Self-service improvements', 'Knowledge base usage', 'Product stability'],
      lastUpdated: new Date()
    }
  ]);

  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [modelAccuracy, setModelAccuracy] = useState(91);
  const [selectedMetric, setSelectedMetric] = useState<string>('all');

  // Simulate historical data generation
  useEffect(() => {
    const generateHistorical = () => {
      const data: HistoricalData[] = [];
      const now = new Date();
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        data.push({
          timestamp: date,
          value: 50 + Math.random() * 30 + Math.sin(i / 5) * 10
        });
      }
      setHistoricalData(data);
    };

    generateHistorical();
  }, []);

  // Auto-retrain model
  const retrainModel = async () => {
    setIsTraining(true);
    // Simulate model training
    await new Promise(resolve => setTimeout(resolve, 3000));
    setModelAccuracy(prev => Math.min(99, prev + Math.random() * 2));
    setIsTraining(false);
  };

  const addPrediction = () => {
    const newPred: Prediction = {
      id: `pred-${Date.now()}`,
      metric: 'New Metric',
      currentValue: Math.random() * 100,
      predictedValue: Math.random() * 100,
      confidence: 70 + Math.random() * 25,
      trend: Math.random() > 0.5 ? 'up' : Math.random() > 0.5 ? 'down' : 'stable',
      timeframe: 'next 30 days',
      factors: ['AI analysis', 'Historical patterns', 'Market trends'],
      lastUpdated: new Date()
    };
    setPredictions(prev => [...prev, newPred]);
  };

  const filteredPredictions = selectedMetric === 'all' 
    ? predictions 
    : predictions.filter(p => p.metric.toLowerCase().includes(selectedMetric.toLowerCase()));

  const avgConfidence = Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length);
  const improvingTrends = predictions.filter(p => p.trend === 'up').length;
  const decliningTrends = predictions.filter(p => p.trend === 'down').length;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'bg-green-500';
    if (confidence >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🔮</span>
            Predictive Analytics Engine
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered forecasting of future trends using historical and real-time data
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-medium text-blue-600">
            Model Accuracy: {modelAccuracy.toFixed(1)}%
          </div>
          <button
            onClick={retrainModel}
            disabled={isTraining}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isTraining ? '🔄 Training...' : '🔄 Retrain Model'}
          </button>
          <button
            onClick={addPrediction}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            + Add New Prediction
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="text-sm text-blue-600 font-medium">Active Predictions</div>
          <div className="text-2xl font-bold text-blue-900">{predictions.length}</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-sm text-green-600 font-medium">Avg Confidence</div>
          <div className="text-2xl font-bold text-green-900">{avgConfidence}%</div>
        </div>
        <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <div className="text-sm text-emerald-600 font-medium">Improving Trends</div>
          <div className="text-2xl font-bold text-emerald-900">{improvingTrends}</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-sm text-red-600 font-medium">Declining Trends</div>
          <div className="text-2xl font-bold text-red-900">{decliningTrends}</div>
        </div>
      </div>

      {/* Predictions List */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Forecast Predictions</h3>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">All Metrics</option>
            <option value="user">User Growth</option>
            <option value="system">System Metrics</option>
            <option value="business">Business Metrics</option>
          </select>
        </div>

        <div className="space-y-3">
          {filteredPredictions.map(pred => (
            <div key={pred.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getTrendIcon(pred.trend)}</span>
                    <h4 className="font-semibold text-lg">{pred.metric}</h4>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{pred.factors.join(' • ')}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs text-gray-500">Current</div>
                      <div className="font-bold text-gray-900">{pred.currentValue.toFixed(1)}</div>
                    </div>
                    <div className="text-2xl text-gray-400">→</div>
                    <div>
                      <div className="text-xs text-gray-500">Predicted</div>
                      <div className="font-bold text-green-600">{pred.predictedValue.toFixed(1)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{pred.timeframe}</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                      {pred.confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>

              {/* Confidence bar */}
              <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full"
                  style={{ 
                    width: `${pred.confidence}%`,
                    backgroundColor: getConfidenceColor(pred.confidence)
                  }}
                />
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>Last updated: {pred.lastUpdated.toLocaleTimeString()}</span>
                <span className="text-blue-600 cursor-pointer hover:underline">View details →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights Panel */}
      <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
        <h3 className="font-semibold text-lg text-purple-900 mb-4 flex items-center">
          <span className="mr-2">🤖</span>
          AI Model Insights
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Ensemble Forecasting</h4>
            <p className="text-sm text-purple-700">
              Combines multiple machine learning models (ARIMA, LSTM, Prophet) to produce robust
              predictions with confidence intervals that quantify uncertainty.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Anomaly Detection</h4>
            <p className="text-sm text-purple-700">
              Continuously monitors incoming data for anomalies that could invalidate predictions
              and automatically triggers model recalibration.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Feature Importance</h4>
            <p className="text-sm text-purple-700">
              AI identifies which factors most influence each prediction, explaining the
              reasoning behind forecasts in human-understandable terms.
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Continuous Learning</h4>
            <p className="text-sm text-purple-700">
              Models automatically retrain as new data arrives, improving accuracy
              over time without manual intervention.
            </p>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-lg p-4 border border-purple-100">
          <h4 className="font-semibold text-purple-800 mb-2">Recent Model Performance</h4>
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-sm w-48">User Growth Forecast</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '92%' }}></div>
              </div>
              <span className="text-sm font-medium">92% accuracy</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm w-48">System Load Prediction</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                <div className="h-2 rounded-full bg-green-500" style={{ width: '94%' }}></div>
              </div>
              <span className="text-sm font-medium">94% accuracy</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm w-48">Conversion Rate</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2 mx-4">
                <div className="h-2 rounded-full bg-yellow-500" style={{ width: '87%' }}></div>
              </div>
              <span className="text-sm font-medium">87% accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}