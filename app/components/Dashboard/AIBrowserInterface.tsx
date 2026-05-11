"use client";

interface Metric {
  id: number;
  metric: string;
  percentage: number;
  value: number;
}

// Fetch real-time AI product metrics
async function fetchLiveMetrics(): Promise<{ metrics: Metric[] }> {
  const response = await fetch('/api/ai/live-data');
  const data = await response.json();
  return data;
}

const AIBrowserInterface = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  
  // Initialize data
  useEffect(() => {
    fetchMetrics();
  }, []);

  // Realtime fetch function
  const fetchMetrics = async () => {
    try {
      const data = await fetchLiveMetrics();
      setMetrics(data.metrics);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  // Set up periodic updates
  useEffect(() => {
    const interval = setInterval(fetchMetrics, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='dashboard'>
      <h2>AI Product Intelligence</h2>
      {metrics.length > 0 && (
        <div className='metrics-grid'>
          {metrics.map((metric) => (
            <div key={metric.id} className='metric-card'>
              <h3>{metric.metric}</h3>
              <p>Score: {metric.value}</p>
              <div className='progress-bar'>
                <div 
                  className='progress-fill' 
                  style={{ width: `${metric.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AIBrowserInterface;