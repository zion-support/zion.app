import React, { useEffect, useState } from 'react';

// Interface for analytics data
interface AnalyticsData {
  timestamp: string;
  engagementScore: number;
  conversionRate: number;
  userSatisfaction: number;
  featureAdoption: Record<string, number>;
}

// Interface for predictive insights
interface PredictiveInsight {
  id: number;
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  recommendation: string;
}

// Fetch analytics data from API
async function fetchAnalyticsData(): Promise<{
  analytics: AnalyticsData[];
  insights: PredictiveInsight[];
}> {
  const response = await fetch('/api/ai/analytics');
  const data = await response.json();
  return data;
}

const AnalyticsPanel = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [insights, setInsights] = useState<PredictiveInsight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize data
  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await fetchAnalyticsData();
      setAnalytics(data.analytics);
      setInsights(data.insights);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set up periodic updates
  useEffect(() => {
    const interval = setInterval(fetchAnalytics, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className='analytics-panel'>
        <h2>AI Analytics & Insights</h2>
        <p>Loading intelligent analytics...</p>
      </div>
    );
  }

  // Calculate latest metrics
  const latestAnalytics = analytics[analytics.length - 1] || {
    engagementScore: 0,
    conversionRate: 0,
    userSatisfaction: 0,
    featureAdoption: {},
    timestamp: new Date().toISOString()
  };

  return (
    <div className='analytics-panel'>
      <h2>AI Analytics & Insights</h2>
      
      {/* Key Metrics */}
      <div className='metrics-summary'>
        <div className='metric-item'>
          <h3>Engagement Score</h3>
          <p>{Math.round(latestAnalytics.engagementScore * 100)}%</p>
        </div>
        <div className='metric-item'>
          <h3>Conversion Rate</h3>
          <p>{Math.round(latestAnalytics.conversionRate * 100)}%</p>
        </div>
        <div className='metric-item'>
          <h3>User Satisfaction</h3>
          <p>{Math.round(latestAnalytics.userSatisfaction * 100)}%</p>
        </div>
      </div>
      
      {/* Feature Adoption */}
      <div className='adoption-section'>
        <h3>Feature Adoption Rates</h3>
        <div className='adoption-grid'>
          {Object.entries(latestAnalytics.featureAdoption).map(([feature, rate]) => (
            <div key={feature} className='adoption-item'>
              <span>{feature}</span>
              <div className='adoption-bar'>
                <div 
                  className='adoption-fill' 
                  style={{ width: `${rate * 100}%` }}
                ></div>
              </div>
              <p>{Math.round(rate * 100)}%</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Predictive Insights */}
      <div className='insights-section'>
        <h3>AI Predictive Insights</h3>
        {insights.length > 0 ? (
          <div className='insights-list'>
            {insights.map((insight) => (
              <div key={insight.id} className='insight-card'>
                <h4>{insight.title}</h4>
                <p>{insight.description}</p>
                <div className='insight-meta'>
                  <span className={`confidence-${insight.impact.toLowerCase()}`}>
                    Confidence: {Math.round(insight.confidence * 100)}%
                  </span>
                  <span className={`impact-${insight.impact}`}>
                    Impact: {insight.impact}
                  </span>
                </div>
                <p className='insight-recommendation'><strong>Recommendation:</strong> {insight.recommendation}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>Generating predictive insights based on usage patterns...</p>
        )}
      </div>
      
      {/* Trend Chart */}
      <div className='trend-chart'>
        <h3>Engagement Trend (Last 24h)</h3>
        <div className='chart-placeholder'>
          {/* In a real implementation, this would render an actual chart */}
          <div className='trend-line'>
            {analytics.slice(-10).map((point, index) => (
              <div key={index} className='trend-point' 
                   style={{ 
                     height: `${Math.round(point.engagementScore * 80)}px`,
                     backgroundColor: 'var(--accent-color)'
                   }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;