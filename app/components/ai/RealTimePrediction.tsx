import React, { useEffect, useState } from 'react';

// Interface for real-time prediction
interface PredictionData {
  prediction: string;
  confidence: number;
  timestamp: string;
}

// Component for real-time predictions
const RealTimePrediction = () => {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  
  useEffect(() => {
    fetchPredictions();
  }, []);

  // Fetch real-time predictions
  const fetchPredictions = async () => {
    try {
      const response = await fetch('/api/ai-integration');
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Prediction error:', error);
    }
  };
  
  if (!prediction) {
    return <p>Loading real-time predictions...</p>;
  }
  
  return (
    <div className='prediction-display'>
      <h3>AI Prediction</h3>
      <p>Prediction: {prediction.prediction}</p>
      <p>Confidence: {prediction.confidence * 100}%</p>
      <p>Timestamp: {prediction.timestamp}</p>
    </div>
  );
};

export default RealTimePrediction;