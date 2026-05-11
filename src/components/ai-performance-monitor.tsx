import { useState, useEffect } from 'react';

interface PerformanceMetrics {
  lighthouseScore: number;
  loadTime: number;
  bundleSize: number;
  issues: string[];
  suggestions: string[];
}

export default function AIPerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    startMonitoring();
  }, []);

  const startMonitoring = async () => {
    setIsMonitoring(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const mockMetrics: PerformanceMetrics = {
      lighthouseScore: 82,
      loadTime: 2.4,
      bundleSize: 1.2,
      issues: [
        'Render-blocking resources detected',
        'Unused CSS found',
        'Large image files not optimized'
      ],
      suggestions: [
        'Implement lazy loading for images',
        'Remove unused CSS rules',
        'Compress and serve images in WebP format',
        'Enable browser caching'
      ]
    };
    
    setMetrics(mockMetrics);
    setIsMonitoring(false);
  };

  const autoOptimize = async () => {
    setIsMonitoring(true);
    await new Promise(resolve => setTimeout(resolve, 1800));
    setMetrics(prev => prev ? {
      ...prev,
      lighthouseScore: Math.min(prev.lighthouseScore + 12, 100),
      loadTime: Math.max(prev.loadTime - 0.8, 0.5),
      bundleSize: Math.max(prev.bundleSize - 0.4, 0.3),
      issues: [],
      suggestions: [...prev.suggestions, 'All performance issues resolved']
    } : null);
    setIsMonitoring(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">AI Performance Monitor</h2>
      {isMonitoring ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
          <span>AI is analyzing performance...</span>
        </div>
      ) : metrics ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-medium">Performance Score: {metrics.lighthouseScore}/100</span>
              <p className="text-sm text-gray-600">Load Time: {metrics.loadTime}s | Bundle: {metrics.bundleSize}MB</p>
            </div>
            <button
              onClick={autoOptimize}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Auto-Optimize
            </button>
          </div>
          
          {metrics.issues.length > 0 && (
            <div className="bg-yellow-50 p-3 rounded">
              <h3 className="font-medium text-yellow-800">Performance Issues:</h3>
              <ul className="list-disc list-inside text-yellow-700">
                {metrics.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="bg-blue-50 p-3 rounded">
            <h3 className="font-medium text-blue-800">AI Optimization Suggestions:</h3>
            <ul className="list-disc list-inside text-blue-700">
              {metrics.suggestions.map((suggestion, i) => (
                <li key={suggestion}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  );
}