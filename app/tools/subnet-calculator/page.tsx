'use client';

import { useState, useCallback, useMemo } from 'react';
import { Copy, Check, Network, AlertTriangle, Info } from 'lucide-react';

type CopyTarget = 'network' | 'broadcast' | 'first' | 'last' | 'all' | null;

export default function SubnetCalculator() {
  const [cidrInput, setCidrInput] = useState('192.168.1.0/24');
  const [copied, setCopied] = useState<CopyTarget>(null);
  const [error, setError] = useState('');

  const copyToClipboard = useCallback((text: string, target: CopyTarget) => {
    navigator.clipboard.writeText(text);
    setCopied(target);
    setTimeout(() => setCopied(null), 2000);
  }, []);

  const parseIp = useCallback((ip: string): number | null => {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) return null;
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
  }, []);

  const ipToString = useCallback((num: number): string => {
    return [
      (num >>> 24) & 0xff,
      (num >>> 16) & 0xff,
      (num >>> 8) & 0xff,
      num & 0xff,
    ].join('.');
  }, []);

  const ipToBinary = useCallback((num: number): string => {
    return [
      ((num >>> 24) & 0xff).toString(2).padStart(8, '0'),
      ((num >>> 16) & 0xff).toString(2).padStart(8, '0'),
      ((num >>> 8) & 0xff).toString(2).padStart(8, '0'),
      (num & 0xff).toString(2).padStart(8, '0'),
    ].join('.');
  }, []);

  const result = useMemo(() => {
    setError('');
    const trimmed = cidrInput.trim();
    if (!trimmed) return null;

    const slashIdx = trimmed.indexOf('/');
    if (slashIdx === -1) {
      setError('Enter an IP with CIDR notation (e.g. 192.168.1.0/24)');
      return null;
    }

    const ipPart = trimmed.substring(0, slashIdx);
    const prefixStr = trimmed.substring(slashIdx + 1);
    const prefix = parseInt(prefixStr, 10);

    if (isNaN(prefix) || prefix < 0 || prefix > 32) {
      setError('Prefix must be between 0 and 32');
      return null;
    }

    const ipNum = parseIp(ipPart);
    if (ipNum === null) {
      setError('Invalid IP address format');
      return null;
    }

    const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
    const wildcardMask = (~mask) >>> 0;
    const network = (ipNum & mask) >>> 0;
    const broadcast = (network | wildcardMask) >>> 0;
    const totalHosts = wildcardMask + 1;
    const usableHosts = prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);
    const firstHost = prefix >= 31 ? network : (network + 1) >>> 0;
    const lastHost = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;

    // IP class
    const firstOctet = (ipNum >>> 24) & 0xff;
    let ipClass = 'Unknown';
    if (firstOctet < 128) ipClass = 'A';
    else if (firstOctet < 192) ipClass = 'B';
    else if (firstOctet < 224) ipClass = 'C';
    else if (firstOctet < 240) ipClass = 'D (Multicast)';
    else ipClass = 'E (Reserved)';

    // Private / special ranges
    const isPrivate =
      (firstOctet === 10) ||
      (firstOctet === 172 && (((ipNum >>> 16) & 0xff) >= 16 && ((ipNum >>> 16) & 0xff) <= 31)) ||
      (firstOctet === 192 && (((ipNum >>> 16) & 0xff) === 168));
    const isLoopback = firstOctet === 127;
    const isLinkLocal = firstOctet === 169 && (((ipNum >>> 16) & 0xff) === 254);

    // Subnet split info
    const splitInto2 = prefix < 32 ? `${prefix + 1}` : 'N/A';
    const splitInto4 = prefix < 31 ? `${prefix + 2}` : 'N/A';

    return {
      ip: ipPart,
      prefix,
      mask: ipToString(mask),
      maskBinary: ipToBinary(mask),
      wildcardMask: ipToString(wildcardMask),
      network: ipToString(network),
      networkBinary: ipToBinary(network),
      broadcast: ipToString(broadcast),
      firstHost: ipToString(firstHost),
      lastHost: ipToString(lastHost),
      totalHosts,
      usableHosts,
      ipClass,
      isPrivate,
      isLoopback,
      isLinkLocal,
      splitInto2,
      splitInto4,
    };
  }, [cidrInput, parseIp, ipToString, ipToBinary]);

  const commonPrefixes = [
    { prefix: '/8', hosts: '16,777,214', mask: '255.0.0.0', note: 'Class A' },
    { prefix: '/16', hosts: '65,534', mask: '255.255.0.0', note: 'Class B' },
    { prefix: '/24', hosts: '254', mask: '255.255.255.0', note: 'Class C' },
    { prefix: '/25', hosts: '126', mask: '255.255.255.128', note: 'Half /24' },
    { prefix: '/26', hosts: '62', mask: '255.255.255.192', note: 'Quarter /24' },
    { prefix: '/27', hosts: '30', mask: '255.255.255.224', note: '⅛ /24' },
    { prefix: '/28', hosts: '14', mask: '255.255.255.240', note: '1/16 /24' },
    { prefix: '/29', hosts: '6', mask: '255.255.255.248', note: 'Point-to-point' },
    { prefix: '/30', hosts: '2', mask: '255.255.255.252', note: 'PPP link' },
    { prefix: '/31', hosts: '2', mask: '255.255.255.254', note: 'RFC 3021' },
    { prefix: '/32', hosts: '1', mask: '255.255.255.255', note: 'Single host' },
  ];

  const examples = [
    '192.168.1.0/24',
    '10.0.0.0/8',
    '172.16.0.0/12',
    '192.168.100.0/26',
    '10.0.5.128/25',
    '203.0.113.0/28',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4">
            <Network className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">IP Subnet Calculator</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Enter any IP address with CIDR notation to instantly calculate network address, broadcast, host range, 
            subnet mask, and more. Perfect for network planning and troubleshooting.
          </p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">IP Address / CIDR</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={cidrInput}
              onChange={(e) => setCidrInput(e.target.value)}
              placeholder="e.g. 192.168.1.0/24"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg font-mono focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>
          {error && (
            <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 mr-1 self-center">Try:</span>
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setCidrInput(ex)}
                className="px-2 py-1 text-xs font-mono bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded transition"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <>
            {/* Network Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Network Information</h2>
                <button
                  onClick={() => {
                    const text = [
                      `IP/CIDR: ${result.ip}/${result.prefix}`,
                      `Network: ${result.network}`,
                      `Broadcast: ${result.broadcast}`,
                      `First Host: ${result.firstHost}`,
                      `Last Host: ${result.lastHost}`,
                      `Usable Hosts: ${result.usableHosts}`,
                      `Subnet Mask: ${result.mask}`,
                      `Wildcard Mask: ${result.wildcardMask}`,
                    ].join('\n');
                    copyToClipboard(text, 'all');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                >
                  {copied === 'all' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'all' ? 'Copied!' : 'Copy All'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Network Address */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide">Network Address</span>
                    <button
                      onClick={() => copyToClipboard(result.network, 'network')}
                      className="p-1 hover:bg-blue-100 rounded transition"
                    >
                      {copied === 'network' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
                    </button>
                  </div>
                  <p className="text-lg font-mono font-semibold text-blue-900">{result.network}/{result.prefix}</p>
                  <p className="text-xs font-mono text-blue-500 mt-1 break-all">{result.networkBinary}</p>
                </div>

                {/* Broadcast */}
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">Broadcast Address</span>
                    <button
                      onClick={() => copyToClipboard(result.broadcast, 'broadcast')}
                      className="p-1 hover:bg-orange-100 rounded transition"
                    >
                      {copied === 'broadcast' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-orange-400" />}
                    </button>
                  </div>
                  <p className="text-lg font-mono font-semibold text-orange-900">{result.broadcast}</p>
                </div>

                {/* First Host */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-green-600 uppercase tracking-wide">First Usable Host</span>
                    <button
                      onClick={() => copyToClipboard(result.firstHost, 'first')}
                      className="p-1 hover:bg-green-100 rounded transition"
                    >
                      {copied === 'first' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-green-400" />}
                    </button>
                  </div>
                  <p className="text-lg font-mono font-semibold text-green-900">{result.firstHost}</p>
                </div>

                {/* Last Host */}
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-green-600 uppercase tracking-wide">Last Usable Host</span>
                    <button
                      onClick={() => copyToClipboard(result.lastHost, 'last')}
                      className="p-1 hover:bg-green-100 rounded transition"
                    >
                      {copied === 'last' ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-green-400" />}
                    </button>
                  </div>
                  <p className="text-lg font-mono font-semibold text-green-900">{result.lastHost}</p>
                </div>
              </div>

              {/* Mask Details */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Subnet Mask</span>
                  <p className="text-base font-mono font-semibold text-gray-900 mt-1">{result.mask}</p>
                  <p className="text-xs font-mono text-gray-400 mt-1 break-all">{result.maskBinary}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Wildcard Mask</span>
                  <p className="text-base font-mono font-semibold text-gray-900 mt-1">{result.wildcardMask}</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Subnet Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                  <p className="text-2xl font-bold text-indigo-700">{result.totalHosts.toLocaleString()}</p>
                  <p className="text-xs text-indigo-500 mt-1">Total Addresses</p>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-2xl font-bold text-green-700">{result.usableHosts.toLocaleString()}</p>
                  <p className="text-xs text-green-500 mt-1">Usable Hosts</p>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-100">
                  <p className="text-2xl font-bold text-purple-700">/{result.prefix}</p>
                  <p className="text-xs text-purple-500 mt-1">Prefix Length</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-100">
                  <p className="text-2xl font-bold text-amber-700">Class {result.ipClass}</p>
                  <p className="text-xs text-amber-500 mt-1">IP Class</p>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {result.isPrivate && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">🔒 Private (RFC 1918)</span>
                )}
                {result.isLoopback && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">🔄 Loopback</span>
                )}
                {result.isLinkLocal && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">🔗 Link-Local</span>
                )}
                {result.prefix === 32 && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">📍 Single Host</span>
                )}
                {result.prefix === 31 && (
                  <span className="px-2.5 py-1 text-xs font-medium bg-teal-100 text-teal-700 rounded-full">↔️ Point-to-Point (RFC 3021)</span>
                )}
              </div>
            </div>

            {/* Subnet Splitting */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Subnet Splitting</h2>
              <p className="text-sm text-gray-500 mb-4">
                Split this subnet into smaller subnets by extending the prefix length.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
                  <span className="text-xs font-medium text-teal-600 uppercase tracking-wide">Split into 2 subnets</span>
                  <p className="text-base font-mono font-semibold text-teal-900 mt-1">/{result.splitInto2} ({(result.usableHosts > 0 ? Math.floor(result.usableHosts / 2) : result.totalHosts > 1 ? Math.floor(result.totalHosts / 2) : 0).toLocaleString()} hosts each)</p>
                </div>
                <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-100">
                  <span className="text-xs font-medium text-cyan-600 uppercase tracking-wide">Split into 4 subnets</span>
                  <p className="text-base font-mono font-semibold text-cyan-900 mt-1">/{result.splitInto4} ({(result.usableHosts > 0 ? Math.floor(result.usableHosts / 4) : result.totalHosts > 3 ? Math.floor(result.totalHosts / 4) : 0).toLocaleString()} hosts each)</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Reference Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Reference: Common CIDR Prefixes</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Prefix</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Mask</th>
                  <th className="text-right py-2 px-3 text-xs font-medium text-gray-500 uppercase">Usable Hosts</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-gray-500 uppercase">Note</th>
                </tr>
              </thead>
              <tbody>
                {commonPrefixes.map((row) => (
                  <tr
                    key={row.prefix}
                    className={`border-b border-gray-50 hover:bg-blue-50 cursor-pointer transition ${
                      result && `/${result.prefix}` === row.prefix ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => {
                      const base = cidrInput.split('/')[0] || '10.0.0.0';
                      setCidrInput(`${base}${row.prefix}`);
                    }}
                  >
                    <td className="py-2 px-3 font-mono font-semibold text-blue-700">{row.prefix}</td>
                    <td className="py-2 px-3 font-mono text-gray-600">{row.mask}</td>
                    <td className="py-2 px-3 font-mono text-gray-900 text-right">{row.hosts}</td>
                    <td className="py-2 px-3 text-gray-500">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">About CIDR Notation</p>
              <p className="text-blue-700">
                CIDR (Classless Inter-Domain Routing) notation expresses an IP address and its associated routing prefix.
                The number after the slash indicates how many bits are used for the network portion.
                For example, /24 means the first 24 bits are the network, leaving 8 bits for hosts (256 addresses, 254 usable).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
