'use client';

export default function PredictiveMaintenanceEngine() {
  const [systems, setSystems] = React.useState([
    { id: 'api', name: 'API Gateway', health: 97 },
    { id: 'database', name: 'Database Cluster', health: 93 },
    { id: 'cache', name: 'Cache Service', health: 95 },
    { id: 'worker', name: 'Background Workers', health: 98 },
    { id: 'load-balancer', name: 'Load Balancer', health: 99 },
  ]);

  const [issues, setIssues] = React.useState([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  React.useEffect(() => {
    const fetchIssues = async () => {
      setIsAnalyzing(true);
      const mockIssues = [
        { system: 'database', risk: 'high', description: 'Connection pool saturation detected' },
        { system: 'cache', risk: 'medium', description: 'Cache hit rate below 85%' },
        { system: 'worker', risk: 'low', description: 'Queue depth increasing' },
      ];
      setIssues(mockIssues);
      setIsAnalyzing(false);
    };

    fetchIssues();
  }, []);

  const predictedFailures = systems
    .filter(system => system.health < 95)
    .map(system => ({
      ...system,
      risk: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      predictedFailureTime: new Date(Date.now() + Math.random() * 86400000).toISOString().split('T')[0],
    })
    .filter(system => system.risk !== 'low');

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🔮</span> Predictive Maintenance Engine
          </h2>
          <p className="text-sm text-gray-500">AI-driven failure prediction and proactive optimization</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded text-sm font-medium">
            {isAnalyzing ? 'Analyzing' : 'Analyzed'}
          </span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-800 mb-2">System Health Overview</h3>
        <div className="grid grid-cols-3 gap-3">
          {systems.map(system => (
            <div key={system.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-10 h-3 rounded-full">
                  <div 
                    className="h-3 rounded-full"
                    style={{ 
                      width: `${system.health}%`,
                      backgroundColor: system.health >= 95 ? '#4caf50' : system.health >= 90 ? '#ffeb3b' : '#f44336'
                    }}
                  ></div>
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-600">{system.name}</div>
                  <div className="text-xs font-medium text-gray-700 mt-1">{system.health}% health</div>
                </div>
              </div>
              {issues.some(i => i.system === system.id) && (
                <div className="mt-2 flex items-center">
                  <div className="w-full bg-red-100 rounded-full h-1.5">
                    <div 
                      className="h-1.5 bg-red-500 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                  <div className="ml-2 text-xs text-red-600">⚠️ Issue detected</div>
                </div>
              />
              </div>
            </div>
          ))}
      </div>

      {issues.length > 0 && (
        <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <h3 className="font-semibold text-yellow-800 mb-2">
            🚨 Predicted Issues
            {issues.length > 0 ? ' Detected' : ' None'}
          </h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            {issues.map((issue, index) => (
              <li key={index}>
                <span className="font-medium">{issue.system}</span>: 
                <span className="ml-2 text-red-600">{issue.description}</span>
                <span className="ml-2 text-xs text-red-500">({issue.risk} risk)</span>
              </ul>
            ))}
          </ul>
        </div>
      </div>

      {isAnalyzing && (
        <div className="mt-6 p-3 bg-indigo-50 rounded-lg">
          <div className="text-sm text-indigo-700">
            Analyzing system telemetry for predictive insights...
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={() => {
            setIsAnalyzing(!isAnalyzing);
            if (!isAnalyzing) {
              const interval = setInterval(() => {
                setIsAnalyzing(true);
                setTimeout(() => {
                  setIsAnalyzing(false);
                  clearInterval(interval);
                }, 5000);
              }, 5000);
            }
          }}
          disabled={isAnalyzing}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isAnalyzing ? 'Analyzing...' : 'Initiate Predictive Analysis'}
        </button>
      </div>
    </div>
  );
}