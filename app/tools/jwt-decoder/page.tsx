'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Copy, Check, AlertTriangle, Clock, User, Lock, Sparkles } from 'lucide-react';

interface JWTPart {
  value: string;
  decoded: Record<string, unknown>;
}

export default function JWTDecoder() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState<JWTPart | null>(null);
  const [payload, setPayload] = useState<JWTPart | null>(null);
  const [signature, setSignature] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const decodeJWT = () => {
    setError('');
    setIsValid(null);
    setHeader(null);
    setPayload(null);
    setSignature('');

    if (!token.trim()) {
      setError('Please enter a JWT token');
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        setError('Invalid JWT format. Expected 3 parts separated by dots.');
        return;
      }

      // Decode header
      const headerDecoded = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      setHeader({ value: parts[0], decoded: headerDecoded });

      // Decode payload
      const payloadDecoded = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      setPayload({ value: parts[1], decoded: payloadDecoded });

      // Set signature
      setSignature(parts[2]);

      // Check expiration
      const exp = payloadDecoded.exp;
      if (typeof exp === 'number') {
        const now = Math.floor(Date.now() / 1000);
        setIsValid(exp > now);
      } else {
        setIsValid(true);
      }
    } catch {
      setError('Failed to decode JWT. Please check the token format.');
      setIsValid(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getClaimValue = (key: string) => {
    if (!payload?.decoded) return null;
    return payload.decoded[key];
  };

  const commonClaims = [
    { key: 'sub', label: 'Subject', icon: User },
    {
      key: 'iat',
      label: 'Issued At',
      icon: Clock,
      transform: (v: unknown) => (typeof v === 'number' ? formatDate(v) : String(v)),
    },
    {
      key: 'exp',
      label: 'Expires',
      icon: Clock,
      transform: (v: unknown) => (typeof v === 'number' ? formatDate(v) : String(v)),
    },
    { key: 'iss', label: 'Issuer', icon: Key },
    { key: 'aud', label: 'Audience', icon: User },
    { key: 'role', label: 'Role', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-amber-600/20 text-amber-300 px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Free Tool</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            JWT{' '}
            <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Decoder
            </span>
          </h1>
          <p className="text-slate-300 max-w-xl mx-auto">
            Decode and inspect JWT tokens instantly. View header, payload, 
            and verify expiration status.
          </p>
        </motion.div>

        <div className="grid gap-6">
          {/* Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-700">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                Enter JWT Token
              </h3>
            </div>
            <div className="p-4 space-y-4">
              <textarea
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste your JWT token here..."
                className="w-full h-32 bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono text-sm"
              />
              <button
                onClick={decodeJWT}
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-xl font-semibold hover:from-amber-700 hover:to-orange-700 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Decode Token
              </button>
            </div>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 flex items-center gap-3"
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <p className="text-red-300">{error}</p>
            </motion.div>
          )}

          {/* Results */}
          {(header || payload) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Validity Status */}
              {isValid !== null && (
                <div className={`rounded-xl p-4 flex items-center gap-3 ${
                  isValid 
                    ? 'bg-green-500/20 border border-green-500/30' 
                    : 'bg-red-500/20 border border-red-500/30'
                }`}>
                  {isValid ? (
                    <Check className="w-6 h-6 text-green-400" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-400" />
                  )}
                  <div>
                    <p className={`font-semibold ${isValid ? 'text-green-400' : 'text-red-400'}`}>
                      {isValid ? 'Token is Valid' : 'Token is Expired or Invalid'}
                    </p>
                    <p className="text-sm text-slate-400">
                      {isValid ? 'The token has not expired and appears to be valid.' : 'The token has expired or is malformed.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Common Claims */}
              {payload && (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-700">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <User className="w-5 h-5 text-violet-400" />
                      Common Claims
                    </h3>
                  </div>
                  <div className="p-4 grid md:grid-cols-2 gap-3">
                    {commonClaims.map(({ key, label, icon: Icon, transform }) => {
                      const value = getClaimValue(key);
                      if (value === undefined || value === null) return null;
                      return (
                        <div key={key} className="flex items-center gap-3 bg-slate-700/30 rounded-lg p-3">
                          <Icon className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-slate-400 text-xs">{label}</p>
                            <p className="text-white font-medium">
                              {transform ? transform(value) : String(value)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Header */}
              {header && (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="text-white font-semibold">Header</h3>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(header.decoded, null, 2))}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-900/50 text-slate-300 text-sm font-mono overflow-x-auto">
                    {JSON.stringify(header.decoded, null, 2)}
                  </pre>
                </div>
              )}

              {/* Payload */}
              {payload && (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="text-white font-semibold">Payload</h3>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(payload.decoded, null, 2))}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <pre className="p-4 bg-slate-900/50 text-slate-300 text-sm font-mono overflow-x-auto">
                    {JSON.stringify(payload.decoded, null, 2)}
                  </pre>
                </div>
              )}

              {/* Signature */}
              {signature && (
                <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="text-white font-semibold">Signature</h3>
                    <button
                      onClick={() => copyToClipboard(signature)}
                      className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <p className="p-4 bg-slate-900/50 text-slate-400 text-sm font-mono break-all">
                    {signature}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}