import React, { useEffect, useState } from 'react';

// Interface for prediction result
interface PredictionResult {
  userId: string;
  predictedBehaviors: Record<string, number>;
  confidence: number;
  recommendations: string[];
}

// Component to display predictive suggestions
const PredictiveSuggestion = ({ userId }: { userId: string }) => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPrediction();
  }, [userId]);

  // Fetch prediction data from API
  const fetchPrediction = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/behavior-prediction?userId=${userId}&activityType=browsing&timeFrame=day`);
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Error fetching prediction:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='prediction-suggestion'>
        <h3>AI Prediction Mode</h3>
        <p>Analyzing user behavior patterns...</p>
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  // Generate recommendations based on behavior prediction
  const recommendationItems = prediction.recommendations.map((rec, index) => (
    <li key={index}>{rec}</li>
  ));

  return (
    <div className='prediction-suggestion'>
      <h3>AI Prediction Mode</h3>
      <p>Confidence: {Math.round(prediction.confidence * 100)}%</p>
      
      <div className='behavior-breakdown'>
        <h4>Behavior Prediction</h4>
        {Object.entries(prediction.predictedBehaviors).map(([behavior, probability]) => (
          <div key={behavior} className='behavior-item'>
            <span>{behavior}</span>
            <div className='probability-bar'>
              <div 
                className='probability-fill' 
                style={{ width: `${probability * 100}%` }}
              />
            </div>
            <span>{Math.round(probability * 100)}%</span>
          </div>
        ))}
      </div>

      {recommendationItems.length > 0 && (
        <div className='recommendations'>
          <h4>AI Recommendations</h4>
          <ul>{recommendationItems}</ul>
        </div>
      )}
    </div>
  );
};

export default PredictiveSuggestion;