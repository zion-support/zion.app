'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Cookie, AlertTriangle, Shield, ShieldCheck, ShieldAlert, Info } from 'lucide-react';

interface ParsedCookie {
  name: string;
  value: string;
  attributes: Record<string, string>;
  securityIssues: SecurityIssue[];
}

interface SecurityIssue {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  recommendation: string;
}

function parseSetCookie(header: string): ParsedCookie[] {
  const cookies: ParsedCookie[] = [];
  const parts = header.split(/,(?=[^;]*=)/g);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const segments = trimmed.split(';').map((s) => s.trim());
    const [nameValue, ...attrParts] = segments;
    const eqIdx = nameValue?.indexOf('=') ?? -1;

    if (eqIdx < 1) continue;

    const name = nameValue!.slice(0, eqIdx).trim();
    const value = nameValue!.slice(eqIdx + 1).trim();
    const attributes: Record<string, string> = {};
    const lowerAttrs: Record<string, string> = {};

    for (const attr of attrParts) {
      const aEq = attr.indexOf('=');
      if (aEq > 0) {
        const key = attr.slice(0, aEq).trim();
        const val = attr.slice(aEq + 1).trim();
        attributes[key] = val;
        lowerAttrs[key.toLowerCase()] = val.toLowerCase();
      } else {
        attributes[attr] = '';
        lowerAttrs[attr.toLowerCase()] = '';
      }
    }

    const securityIssues: SecurityIssue[] = analyzeSecurity(name, value, lowerAttrs);

    cookies.push({ name, value, attributes, securityIssues });
  }

  return cookies;
}

function parseCookieHeader(header: string): ParsedCookie[] {
  const cookies: ParsedCookie[] = [];
  const pairs = header.split(';').map((s) => s.trim());

  for (const pair of pairs) {
    const eqIdx = pair.indexOf('=');
    if (eqIdx < 1) continue;

    const name = pair.slice(0, eqIdx).trim();
    const value = pair.slice(eqIdx + 1).trim();
    cookies.push({ name, value, attributes: {}, securityIssues: [] });
  }

  return cookies;
}

function analyzeSecurity(name: string, _value: string, attrs: Record<string, string>): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  const hasSecure = 'secure' in attrs;
  const hasHttpOnly = 'httponly' in attrs;
  const samesite = attrs['samesite'] ?? '';
  const maxAge = attrs['max-age'];
  const expires = attrs['expires'];
  const domain = attrs['domain'];
  const path = attrs['path'];
  const isSessionCookie = !maxAge && !expires;

  // Check Secure flag
  if (!hasSecure) {
    issues.push({
      severity: 'warning',
      message: 'Missing Secure flag',
      recommendation: 'Add Secure flag to ensure the cookie is only sent over HTTPS connections.',
    });
  }

  // Check HttpOnly flag
  if (!hasHttpOnly) {
    issues.push({
      severity: 'warning',
      message: 'Missing HttpOnly flag',
      recommendation: 'Add HttpOnly flag to prevent JavaScript access and reduce XSS risk.',
    });
  }

  // Check SameSite
  if (!samesite) {
    issues.push({
      severity: 'info',
      message: 'No SameSite attribute set',
      recommendation: 'Consider setting SameSite=Lax or SameSite=Strict to protect against CSRF attacks.',
    });
  } else if (samesite === 'none' && !hasSecure) {
    issues.push({
      severity: 'critical',
      message: 'SameSite=None without Secure flag',
      recommendation: 'SameSite=None requires the Secure flag. Browsers will reject this cookie.',
    });
  }

  // Check for sensitive cookie names
  const sensitivePatterns = ['session', 'token', 'auth', 'jwt', 'sid', 'csrf', 'api_key', 'apikey', 'secret', 'password', 'credential'];
  const nameLower = name.toLowerCase();
  const isSensitive = sensitivePatterns.some((p) => nameLower.includes(p));

  if (isSensitive && !hasSecure) {
    issues.push({
      severity: 'critical',
      message: `Sensitive cookie "${name}" without Secure flag`,
      recommendation: 'Cookies with sensitive names should always have the Secure flag.',
    });
  }

  if (isSensitive && !hasHttpOnly) {
    issues.push({
      severity: 'critical',
      message: `Sensitive cookie "${name}" without HttpOnly flag`,
      recommendation: 'Sensitive cookies must have HttpOnly to prevent client-side script access.',
    });
  }

  // Check Max-Age duration
  if (maxAge) {
    const seconds = parseInt(maxAge, 10);
    if (!isNaN(seconds)) {
      const days = seconds / 86400;
      if (days > 365) {
        issues.push({
          severity: 'info',
          message: `Very long Max-Age: ${Math.round(days)} days`,
          recommendation: 'Consider shorter expiration times to reduce the window of exposure.',
        });
      }
    }
  }

  // Check domain scope
  if (domain && domain.startsWith('.')) {
    issues.push({
      severity: 'info',
      message: `Broad domain scope: ${domain}`,
      recommendation: 'Cookies with a leading dot in domain are sent to all subdomains. Use specific domains when possible.',
    });
  }

  // Check path
  if (path === '/' || !path) {
    if (isSensitive) {
      issues.push({
        severity: 'info',
        message: 'Cookie path is root (/)',
        recommendation: 'For sensitive cookies, restrict the path to the minimum required scope.',
      });
    }
  }

  // Session cookie note
  if (isSessionCookie && isSensitive) {
    issues.push({
      severity: 'info',
      message: 'Session cookie without explicit expiration',
      recommendation: 'Session cookies expire when the browser closes. Consider adding Max-Age for persistence control.',
    });
  }

  return issues;
}

function getSeverityColor(severity: string) {
  switch (severity) {
    case 'critical': return 'text-red-700 bg-red-50 border-red-200';
    case 'warning': return 'text-amber-700 bg-amber-50 border-amber-200';
    default: return 'text-blue-700 bg-blue-50 border-blue-200';
  }
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'critical': return <ShieldAlert className="w-4 h-4 text-red-500" />;
    case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    default: return <Info className="w-4 h-4 text-blue-500" />;
  }
}

function getSecurityScore(cookies: ParsedCookie[]): { score: number; label: string; color: string } {
  let totalIssues = 0;
  let criticalCount = 0;

  for (const cookie of cookies) {
    totalIssues += cookie.securityIssues.length;
    criticalCount += cookie.securityIssues.filter((i) => i.severity === 'critical').length;
  }

  if (totalIssues === 0) return { score: 100, label: 'Excellent', color: 'text-emerald-600' };
  if (criticalCount > 0) return { score: Math.max(10, 50 - criticalCount * 15), label: 'Needs attention', color: 'text-red-600' };
  if (totalIssues <= 2) return { score: 80, label: 'Good', color: 'text-emerald-600' };
  if (totalIssues <= 5) return { score: 60, label: 'Fair', color: 'text-amber-600' };
  return { score: 40, label: 'Poor', color: 'text-red-600' };
}

const EXAMPLES = [
  {
    label: 'Session cookie (typical)',
    value: 'Set-Cookie: session_id=abc123def456; Path=/; HttpOnly; Secure; SameSite=Lax',
  },
  {
    label: 'Auth token (insecure)',
    value: 'Set-Cookie: auth_token=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0; Path=/; Domain=.example.com; Max-Age=31536000',
  },
  {
    label: 'Multiple cookies',
    value: 'Set-Cookie: session=s3cr3t; Path=/; Secure; HttpOnly; SameSite=Strict\nSet-Cookie: preferences=theme:dark; Path=/; Max-Age=2592000; SameSite=Lax\nSet-Cookie: tracking=xyz789; Path=/; Domain=.example.com; SameSite=None',
  },
  {
    label: 'Cookie request header',
    value: 'Cookie: _ga=GA1.2.123456789.1234567890; session_id=abc123; theme=dark; lang=en',
  },
];

export default function CookieDecoderPage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'set-cookie' | 'cookie'>('set-cookie');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const cookies = input.trim() ? (mode === 'set-cookie' ? parseSetCookie(input) : parseCookieHeader(input)) : [];
  const securityScore = cookies.length > 0 ? getSecurityScore(cookies) : null;

  const totalIssues = cookies.reduce((sum, c) => sum + c.securityIssues.length, 0);
  const criticalCount = cookies.reduce((sum, c) => sum + c.securityIssues.filter((i) => i.severity === 'critical').length, 0);
  const warningCount = cookies.reduce((sum, c) => sum + c.securityIssues.filter((i) => i.severity === 'warning').length, 0);

  const copyValue = useCallback(async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  }, []);

  const loadExample = useCallback((value: string) => {
    setInput(value);
    if (value.startsWith('Cookie:')) {
      setMode('cookie');
      setInput(value.replace(/^Cookie:\s*/, ''));
    } else {
      setMode('set-cookie');
      setInput(value.replace(/^Set-Cookie:\s*/, ''));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Cookie className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Cookie Decoder & Analyzer</h1>
              <p className="text-slate-600">Parse HTTP cookies, inspect attributes, and audit security</p>
            </div>
          </div>
        </motion.div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setMode('set-cookie')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'set-cookie' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300'}`}
          >
            Set-Cookie (Response)
          </button>
          <button
            onClick={() => setMode('cookie')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${mode === 'cookie' ? 'bg-amber-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300'}`}
          >
            Cookie (Request)
          </button>
        </div>

        {/* Input */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            {mode === 'set-cookie' ? 'Paste Set-Cookie header(s)' : 'Paste Cookie header'}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === 'set-cookie'
              ? 'Set-Cookie: session_id=abc123; Path=/; HttpOnly; Secure; SameSite=Lax'
              : 'session_id=abc123; theme=dark; lang=en'}
            className="w-full h-32 px-4 py-3 border border-slate-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-y"
            spellCheck={false}
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs text-slate-500 self-center">Try an example:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => loadExample(ex.value)}
                className="text-xs px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* Security Summary */}
        {cookies.length > 0 && securityScore && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 mb-6">
            <div className="flex flex-wrap items-center gap-6 mb-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${securityScore.color}`}>{securityScore.score}</div>
                <div className="text-xs text-slate-500 mt-1">Security Score</div>
              </div>
              <div className="flex-1">
                <div className={`text-lg font-semibold ${securityScore.color}`}>{securityScore.label}</div>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all ${securityScore.score >= 80 ? 'bg-emerald-500' : securityScore.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${securityScore.score}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900">{cookies.length}</div>
                  <div className="text-xs text-slate-500">Cookies</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
                  <div className="text-xs text-slate-500">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">{warningCount}</div>
                  <div className="text-xs text-slate-500">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{totalIssues - criticalCount - warningCount}</div>
                  <div className="text-xs text-slate-500">Info</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Parsed Cookies */}
        {cookies.length > 0 && (
          <div className="space-y-4">
            {cookies.map((cookie, i) => (
              <motion.div
                key={`${cookie.name}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Cookie Header */}
                <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <Cookie className="w-4 h-4 text-amber-500" />
                    <span className="font-mono text-sm font-semibold text-slate-900">{cookie.name}</span>
                    {cookie.securityIssues.length === 0 && (
                      <span className="flex items-center gap-1 text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <ShieldCheck className="w-3 h-3" /> Secure
                      </span>
                    )}
                    {cookie.securityIssues.some((i) => i.severity === 'critical') && (
                      <span className="flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        <ShieldAlert className="w-3 h-3" /> Issues
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => copyValue(cookie.value, i)}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition"
                  >
                    {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    {copiedIndex === i ? 'Copied' : 'Copy value'}
                  </button>
                </div>

                <div className="p-5">
                  {/* Value */}
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Value</span>
                    <div className="mt-1 font-mono text-sm text-slate-800 bg-slate-50 px-3 py-2 rounded-lg break-all border border-slate-100">
                      {cookie.value || <span className="text-slate-400 italic">empty</span>}
                    </div>
                  </div>

                  {/* Attributes */}
                  {Object.keys(cookie.attributes).length > 0 && (
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Attributes</span>
                      <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.entries(cookie.attributes).map(([key, val]) => (
                          <div key={key} className="bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                            <div className="text-xs font-semibold text-slate-600">{key}</div>
                            <div className="text-sm font-mono text-slate-800">{val || <span className="text-emerald-600">true</span>}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Security Issues */}
                  {cookie.securityIssues.length > 0 && (
                    <div>
                      <span className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Security Analysis
                      </span>
                      <div className="mt-2 space-y-2">
                        {cookie.securityIssues.map((issue, j) => (
                          <div key={j} className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(issue.severity)}`}>
                            {getSeverityIcon(issue.severity)}
                            <div>
                              <div className="text-sm font-semibold">{issue.message}</div>
                              <div className="text-xs mt-1 opacity-80">{issue.recommendation}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!input.trim() && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 text-center">
            <Cookie className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-700">Paste a cookie header above</h3>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
              Decode Set-Cookie response headers or Cookie request headers. Analyze attributes like Secure, HttpOnly, SameSite, Max-Age, Domain, and Path. Get security recommendations for each cookie.
            </p>
          </div>
        )}

        {/* Reference */}
        <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-900 mb-3">Cookie Attribute Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              { attr: 'Secure', desc: 'Cookie only sent over HTTPS. Prevents interception on insecure connections.' },
              { attr: 'HttpOnly', desc: 'Cookie inaccessible to JavaScript (document.cookie). Mitigates XSS attacks.' },
              { attr: 'SameSite', desc: 'Controls cross-site request behavior. Strict=never cross-site, Lax=GET top-level only, None=always (requires Secure).' },
              { attr: 'Max-Age', desc: 'Cookie lifetime in seconds. Overrides Expires. Session cookie if absent.' },
              { attr: 'Expires', desc: 'Absolute expiration date/time. Superseded by Max-Age if both present.' },
              { attr: 'Domain', desc: 'Scope of the cookie. Leading dot (.example.com) includes all subdomains.' },
              { attr: 'Path', desc: 'URL path scope. Cookie sent only for requests matching this path prefix.' },
              { attr: 'Partitioned', desc: 'CHIPS: cookie stored in per-site partitioned storage. Required for third-party cookies in modern browsers.' },
            ].map((item) => (
              <div key={item.attr} className="bg-slate-50 p-3 rounded-lg">
                <span className="font-mono text-xs font-semibold text-amber-700">{item.attr}</span>
                <p className="text-xs text-slate-600 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
