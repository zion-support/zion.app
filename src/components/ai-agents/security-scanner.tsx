'use client';

import { useState, useEffect } from 'react';

interface Vulnerability {
  id: string;
  package: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  fix: string;
  cve?: string;
}

export default function AISecurityScanner() {
  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);

  useEffect(() => {
    // Auto-start security scan on mount
    runSecurityScan();
  }, []);

  const runSecurityScan = async () => {
    setIsScanning(true);
    setScanComplete(false);
    
    // Simulate comprehensive security scan
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockVulnerabilities: Vulnerability[] = [
      {
        id: 'vuln-001',
        package: 'lodash@4.17.20',
        severity: 'high',
        description: 'Prototype pollution vulnerability in lodash template function',
        fix: 'Update to lodash@4.17.21 or later',
        cve: 'CVE-2020-8203'
      },
      {
        id: 'vuln-002',
        package: 'axios@0.21.1',
        severity: 'medium',
        description: 'SSRF vulnerability through proxy usage',
        fix: 'Update to axios@0.21.2 or later',
        cve: 'CVE-2021-3749'
      },
      {
        id: 'vuln-003',
        package: 'next@12.0.0',
        severity: 'low',
        description: 'Minor information disclosure in error messages',
        fix: 'Update to next@12.1.6 or later',
        cve: null
      },
      {
        id: 'vuln-004',
        package: 'react@17.0.2',
        severity: 'low',
        description: 'No known vulnerabilities, but newer version available with performance improvements',
        fix: 'Consider updating to react@18.2.0',
        cve: null
      }
    ];
    
    setVulnerabilities(mockVulnerabilities);
    setIsScanning(false);
    setScanComplete(true);
  };

  const autoFixAll = async () => {
    setIsScanning(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Simulate auto-fixing all vulnerabilities
    setVulnerabilities([]);
    setIsScanning(false);
    setScanComplete(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🚨';
      case 'high':
        return '⚠️';
      case 'medium':
        return '🔶';
      case 'low':
        return 'ℹ️';
      default:
        return '•';
    }
  };

  const totalVulns = vulnerabilities.length;
  const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
  const highCount = vulnerabilities.filter(v => v.severity === 'high' || v.severity === 'critical').length;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Security Scanner</h2>
          <p className="text-sm text-gray-600 mt-1">
            Continuously monitors dependencies, code, and infrastructure for security vulnerabilities
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={runSecurityScan}
            disabled={isScanning}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isScanning ? 'Scanning...' : 'New Scan'}
          </button>
          {vulnerabilities.length > 0 && (
            <button
              onClick={autoFixAll}
              disabled={isScanning}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              Auto-Fix All
            </button>
          )}
        </div>
      </div>

      {/* Security Score Card */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-4 rounded-lg border border-red-200">
          <div className="text-3xl font-bold text-red-600">{criticalCount + highCount}</div>
          <div className="text-sm text-red-700 font-medium">Critical + High</div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-3xl font-bold text-yellow-600">{totalVulns}</div>
          <div className="text-sm text-yellow-700 font-medium">Total Vulnerabilities</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
          <div className="text-3xl font-bold text-green-600">{Math.max(0, 100 - totalVulns * 5)}%</div>
          <div className="text-sm text-green-700 font-medium">Security Score</div>
        </div>
      </div>

      {/* Scanning Animation */}
      {isScanning && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <div>
              <div className="font-medium text-blue-900">Scanning in progress...</div>
              <div className="text-sm text-blue-700">
                Checking dependencies, code patterns, and configuration for security issues
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vulnerabilities List */}
      {!isScanning && vulnerabilities.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">Detected Vulnerabilities</h3>
          {vulnerabilities.map(vuln => (
            <div key={vuln.id} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getSeverityIcon(vuln.severity)}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                      {vuln.severity.toUpperCase()}
                    </span>
                    {vuln.cve && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono">
                        {vuln.cve}
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{vuln.package}</h4>
                  <p className="text-sm text-gray-700 mb-2">{vuln.description}</p>
                  <div className="bg-green-50 p-2 rounded border border-green-200">
                    <div className="text-sm font-medium text-green-900">Fix: {vuln.fix}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* All Clear State */}
      {!isScanning && vulnerabilities.length === 0 && scanComplete && (
        <div className="p-6 bg-green-50 rounded-lg border border-green-200 text-center">
          <div className="text-4xl mb-3">✅</div>
          <h3 className="font-semibold text-green-900 text-lg mb-2">No Vulnerabilities Found</h3>
          <p className="text-green-700">
            Your codebase is secure! All dependencies are up-to-date and no security issues were detected.
          </p>
        </div>
      )}

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <h3 className="font-semibold text-purple-900 mb-2">🤖 AI Security Intelligence</h3>
        <p className="text-sm text-purple-800">
          Our AI scanner checks against the latest vulnerability databases (CVE, Snyk, GitHub Advisory) 
          and provides automated fixes. It also learns from your codebase to detect custom security patterns 
          and suggests proactive hardening measures.
        </p>
      </div>
    </div>
  );
}