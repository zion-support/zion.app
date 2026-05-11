'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, Shield, AlertTriangle, Search, Info, Hash } from 'lucide-react';

interface HashType {
  name: string;
  length: number;
  charset: 'hex-lower' | 'hex-upper' | 'hex-mixed' | 'base64' | 'bcrypt' | 'unix-md5' | 'unix-sha' | 'alphanumeric';
  regex?: RegExp;
  security: 'broken' | 'weak' | 'deprecated' | 'acceptable' | 'strong';
  description: string;
  examples: string[];
  notes: string;
}

const HASH_TYPES: HashType[] = [
  {
    name: 'CRC32',
    length: 8,
    charset: 'hex-lower',
    security: 'broken',
    description: 'Cyclic Redundancy Check — 32-bit checksum, not a cryptographic hash',
    examples: ['a]1b2c3d'],
    notes: 'Used for data integrity only. Not collision-resistant. Do NOT use for security.',
  },
  {
    name: 'MD2',
    length: 32,
    charset: 'hex-lower',
    security: 'broken',
    description: 'Message Digest 2 — 128-bit hash, obsolete since 2004',
    examples: ['d41d8cd98f00b204e9800998ecf8427e'],
    notes: 'Broken. Vulnerable to preimage attacks. Should never be used.',
  },
  {
    name: 'MD4',
    length: 32,
    charset: 'hex-lower',
    security: 'broken',
    description: 'Message Digest 4 — 128-bit hash, broken collision resistance',
    examples: ['31d6cfe0d16ae931b73c59d7e0c089c0'],
    notes: 'Broken. Collision attacks trivial. Replaced by MD5 (also broken).',
  },
  {
    name: 'MD5',
    length: 32,
    charset: 'hex-lower',
    security: 'broken',
    description: 'Message Digest 5 — 128-bit hash, widely used but cryptographically broken',
    examples: ['d41d8cd98f00b204e9800998ecf8427e'],
    notes: 'Collision attacks are trivial. Still used for checksums but NOT for security.',
  },
  {
    name: 'MySQL 3.x',
    length: 16,
    charset: 'hex-upper',
    security: 'broken',
    description: 'Old MySQL password hash — 2 × 32-bit values',
    examples: ['67452301EFCDAB89'],
    notes: 'Very weak. Easily brute-forced. Replaced in MySQL 4.1+.',
  },
  {
    name: 'NTLM',
    length: 32,
    charset: 'hex-lower',
    security: 'weak',
    description: 'NT LAN Manager hash — MD4 of UTF-16LE encoded password',
    examples: ['aad3b435b51404eeaad3b435b51404ee'],
    notes: 'No salt. Vulnerable to rainbow tables. Use NTLMv2 if NTLM is required.',
  },
  {
    name: 'SHA-1',
    length: 40,
    charset: 'hex-lower',
    security: 'deprecated',
    description: 'Secure Hash Algorithm 1 — 160-bit hash, deprecated since 2011',
    examples: ['da39a3ee5e6b4b0d3255bfef95601890afd80709'],
    notes: 'SHAttered attack demonstrated real-world collision in 2017. Migrate to SHA-256+.',
  },
  {
    name: 'SHA-224',
    length: 56,
    charset: 'hex-lower',
    security: 'acceptable',
    description: 'SHA-2 truncated to 224 bits',
    examples: ['d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f'],
    notes: 'Acceptable but rarely used. Prefer SHA-256 for most applications.',
  },
  {
    name: 'SHA-256',
    length: 64,
    charset: 'hex-lower',
    security: 'strong',
    description: 'SHA-2 256-bit — industry standard for hashing',
    examples: ['e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    notes: 'Gold standard for hashing. Use with salt (HMAC) for password storage alternatives.',
  },
  {
    name: 'SHA-384',
    length: 96,
    charset: 'hex-lower',
    security: 'strong',
    description: 'SHA-2 384-bit — strong, used in high-security applications',
    examples: ['38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b'],
    notes: 'Very strong. Used where longer hash outputs are required.',
  },
  {
    name: 'SHA-512',
    length: 128,
    charset: 'hex-lower',
    security: 'strong',
    description: 'SHA-2 512-bit — strongest of the SHA-2 family',
    examples: ['cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e'],
    notes: 'Excellent security margin. Slightly slower on 32-bit systems.',
  },
  {
    name: 'RIPEMD-160',
    length: 40,
    charset: 'hex-lower',
    security: 'acceptable',
    description: 'RACE Integrity Primitives Evaluation MD 160-bit',
    examples: ['9c1185a5c5e9fc54612808977ee8f548b2258d31'],
    notes: 'Used in Bitcoin addresses. Acceptable security but SHA-256 is more widely supported.',
  },
  {
    name: 'bcrypt',
    length: 60,
    charset: 'bcrypt',
    regex: /^\$2[aby]?\$\d+\$.{53}$/,
    security: 'strong',
    description: 'Adaptive password hashing with cost factor — gold standard for passwords',
    examples: ['$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW'],
    notes: 'Industry standard for password storage. Adjustable work factor. Resists GPU attacks.',
  },
  {
    name: 'scrypt',
    length: -1,
    charset: 'unix-md5',
    regex: /^\$scrypt\$.*$/,
    security: 'strong',
    description: 'Memory-hard key derivation — resistant to hardware brute-force',
    examples: ['$scrypt$ln=16,r=8,p=1$aM15r7XW2nsPQWilpLQWgg$...'],
    notes: 'Memory-hard, resists ASIC/GPU attacks. Used in cryptocurrency (Litecoin).',
  },
  {
    name: 'Argon2',
    length: -1,
    charset: 'unix-md5',
    regex: /^\$argon2(id|d|i)\$.*$/,
    security: 'strong',
    description: 'Modern password hashing — winner of the Password Hashing Competition',
    examples: ['$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$...'],
    notes: 'State of the art. Memory-hard, time-hard, parallelism-hard. Recommended for new projects.',
  },
  {
    name: 'Unix MD5',
    length: -1,
    charset: 'unix-md5',
    regex: /^\$1\$.{8}\$.{22}$/,
    security: 'weak',
    description: 'FreeBSD/Linux MD5-based password hash',
    examples: ['$1$saltstri$YTwgAChQdJ8QhS8gp7/Jq0'],
    notes: 'Weak by modern standards. Migrate to bcrypt, scrypt, or Argon2.',
  },
  {
    name: 'Unix SHA-256',
    length: -1,
    charset: 'unix-sha',
    regex: /^\$5\$.{0,16}\$.{43}$/,
    security: 'acceptable',
    description: 'SHA-256 based Unix crypt with rounds parameter',
    examples: ['$5$rounds=5000$saltstri$hash...'],
    notes: 'Acceptable but bcrypt/Argon2 are stronger for password storage.',
  },
  {
    name: 'Unix SHA-512',
    length: -1,
    charset: 'unix-sha',
    regex: /^\$6\$.{0,16}\$.{86}$/,
    security: 'acceptable',
    description: 'SHA-512 based Unix crypt — default on modern Linux',
    examples: ['$6$rounds=5000$saltstri$hash...'],
    notes: 'Default on most Linux distros. Acceptable, but bcrypt/Argon2 resist GPU attacks better.',
  },
  {
    name: 'MySQL 5+',
    length: 40,
    charset: 'hex-lower',
    security: 'weak',
    description: 'MySQL 4.1+ password hash — double SHA-1',
    examples: ['*6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9'],
    notes: 'The leading * indicates MySQL format. Weak — no salt, fast to brute-force.',
  },
  {
    name: 'BLAKE2b',
    length: 128,
    charset: 'hex-lower',
    security: 'strong',
    description: 'BLAKE2b — faster than MD5, more secure than SHA-3',
    examples: ['786a02f742015903c6c6fd852552d272912f4740e15847618a86e217f71f5419d25e1031afee585313896444934eb04b903a685b1448b755d56f701afe9be2ce'],
    notes: 'Excellent speed and security. Used in WireGuard VPN, Zcash.',
  },
  {
    name: 'BLAKE2s',
    length: 64,
    charset: 'hex-lower',
    security: 'strong',
    description: 'BLAKE2s — optimized for 8-32 bit platforms',
    examples: ['69217a3079908094e11121d042354a7c1f55b6482ca1a51e1b250dfd1ed0eef9'],
    notes: 'Compact variant of BLAKE2. Good for constrained environments.',
  },
  {
    name: 'SHA-3 (256)',
    length: 64,
    charset: 'hex-lower',
    security: 'strong',
    description: 'SHA-3 256-bit — NIST standard based on Keccak sponge construction',
    examples: ['a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a'],
    notes: 'Different internal structure from SHA-2. Safe fallback if SHA-2 is ever broken.',
  },
  {
    name: 'SHA-3 (512)',
    length: 128,
    charset: 'hex-lower',
    security: 'strong',
    description: 'SHA-3 512-bit — highest security in SHA-3 family',
    examples: ['a69f73cca23a9ac5c8b567dc185a756e97c982164fe25859e0d1dcc1475c80a615b2123af1f5f94c11e3e9402c3ac558f500199d95b6d3e301758586281dcd26'],
    notes: 'Highest security margin. Slightly slower than SHA-256.',
  },
];

function detectCharset(input: string): HashType['charset'] | null {
  if (/^\$2[aby]?\$\d+\$/.test(input)) return 'bcrypt';
  if (/^\$1\$/.test(input)) return 'unix-md5';
  if (/^\$5\$/.test(input) || /^\$6\$/.test(input)) return 'unix-sha';
  if (/^\$scrypt\$/.test(input) || /^\$argon2/.test(input)) return 'unix-md5';
  if (/^\*[0-9a-fA-F]{40}$/.test(input)) return 'hex-lower';
  if (/^[0-9a-f]+$/.test(input)) return 'hex-lower';
  if (/^[0-9A-F]+$/.test(input)) return 'hex-upper';
  if (/^[A-Za-z0-9+/=]+$/.test(input) && input.length % 4 === 0) return 'base64';
  return null;
}

function identifyHash(input: string): { type: HashType; confidence: number }[] {
  const trimmed = input.trim();
  if (!trimmed) return [];

  const results: { type: HashType; confidence: number }[] = [];
  const detectedCharset = detectCharset(trimmed);
  const len = trimmed.length;

  for (const hashType of HASH_TYPES) {
    let confidence = 0;

    // Check regex first
    if (hashType.regex && hashType.regex.test(trimmed)) {
      results.push({ type: hashType, confidence: 99 });
      continue;
    }

    // Check length match
    if (hashType.length > 0 && len === hashType.length) {
      confidence += 50;
    } else if (hashType.length > 0 && Math.abs(len - hashType.length) <= 2) {
      confidence += 20;
    } else if (hashType.length > 0) {
      continue; // Length doesn't match, skip
    }

    // Check charset match
    if (detectedCharset) {
      if (hashType.charset === detectedCharset) {
        confidence += 30;
      } else if (
        (hashType.charset === 'hex-lower' && detectedCharset === 'hex-mixed') ||
        (hashType.charset === 'hex-upper' && detectedCharset === 'hex-mixed')
      ) {
        confidence += 15;
      }
    }

    // Special cases
    if (hashType.name === 'MySQL 5+' && trimmed.startsWith('*') && len === 41) {
      confidence = 95;
    }

    if (hashType.name === 'MD5' && len === 32 && /^[0-9a-f]+$/i.test(trimmed)) {
      confidence = Math.max(confidence, 85);
    }

    if (hashType.name === 'SHA-1' && len === 40 && /^[0-9a-f]+$/i.test(trimmed)) {
      confidence = Math.max(confidence, 85);
    }

    if (hashType.name === 'SHA-256' && len === 64 && /^[0-9a-f]+$/i.test(trimmed)) {
      confidence = Math.max(confidence, 85);
    }

    if (hashType.name === 'SHA-512' && len === 128 && /^[0-9a-f]+$/i.test(trimmed)) {
      confidence = Math.max(confidence, 85);
    }

    if (confidence > 10) {
      results.push({ type: hashType, confidence });
    }
  }

  // Sort by confidence descending
  return results.sort((a, b) => b.confidence - a.confidence);
}

const SECURITY_COLORS: Record<HashType['security'], { bg: string; text: string; label: string }> = {
  broken: { bg: 'bg-red-100', text: 'text-red-700', label: 'Broken' },
  weak: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Weak' },
  deprecated: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Deprecated' },
  acceptable: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Acceptable' },
  strong: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Strong' },
};

export default function HashIdentifier() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<{ type: HashType; confidence: number }[]>([]);
  const [copiedName, setCopiedName] = useState<string | null>(null);

  const handleIdentify = useCallback(() => {
    const identified = identifyHash(input);
    setResults(identified);
  }, [input]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setInput(text.trim());
      const identified = identifyHash(text.trim());
      setResults(identified);
    } catch {
      // clipboard access denied
    }
  };

  const copyType = async (name: string) => {
    await navigator.clipboard.writeText(name);
    setCopiedName(name);
    setTimeout(() => setCopiedName(null), 2000);
  };

  const quickExamples = [
    { label: 'MD5', value: 'd41d8cd98f00b204e9800998ecf8427e' },
    { label: 'SHA-1', value: 'da39a3ee5e6b4b0d3255bfef95601890afd80709' },
    { label: 'SHA-256', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855' },
    { label: 'bcrypt', value: '$2b$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW' },
    { label: 'MySQL 5+', value: '*6BB4837EB74329105EE4568DDA7DC67ED2CA2AD9' },
    { label: 'NTLM', value: 'aad3b435b51404eeaad3b435b51404ee' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
              <Hash className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Hash Identifier</h1>
            <p className="mt-2 text-slate-600">
              Identify hash types from their format, length, and structure — with security analysis
            </p>
          </div>
        </motion.div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <label className="mb-2 block text-sm font-semibold text-slate-700">Paste a hash to identify</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleIdentify()}
              placeholder="e.g. d41d8cd98f00b204e9800998ecf8427e"
              className="flex-1 rounded-lg border border-slate-200 px-4 py-3 font-mono text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              spellCheck={false}
            />
            <button
              onClick={handlePaste}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              Paste
            </button>
            <button
              onClick={handleIdentify}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              <Search className="h-4 w-4" />
              Identify
            </button>
          </div>

          {/* Quick examples */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-xs text-slate-500 py-1">Try:</span>
            {quickExamples.map((ex) => (
              <button
                key={ex.label}
                onClick={() => {
                  setInput(ex.value);
                  setResults(identifyHash(ex.value));
                }}
                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 transition"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-semibold text-slate-900">
              {results.length} possible match{results.length !== 1 ? 'es' : ''} found
            </h2>

            {results.map(({ type, confidence }, i) => {
              const sec = SECURITY_COLORS[type.security];
              return (
                <div
                  key={`${type.name}-${i}`}
                  className={`rounded-2xl border bg-white p-5 shadow-sm transition ${
                    i === 0 ? 'border-indigo-300 ring-2 ring-indigo-100' : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-indigo-500" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-slate-900">{type.name}</h3>
                          {i === 0 && (
                            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
                              Most likely
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sec.bg} ${sec.text}`}>
                            {sec.label}
                          </span>
                          <span className="text-xs text-slate-500">{confidence}% confidence</span>
                          {type.length > 0 && (
                            <span className="text-xs text-slate-400">• {type.length} chars</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => copyType(type.name)}
                      className="flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                    >
                      {copiedName === type.name ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {copiedName === type.name ? 'Copied!' : 'Copy name'}
                    </button>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">{type.description}</p>

                  <div className="mt-3 rounded-lg bg-slate-50 p-3">
                    <div className="flex items-start gap-2">
                      <Info className="mt-0.5 h-4 w-4 text-slate-400 shrink-0" />
                      <p className="text-xs text-slate-600">{type.notes}</p>
                    </div>
                  </div>

                  {type.security === 'broken' && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-red-500 shrink-0" />
                      <p className="text-xs text-red-700">
                        <strong>Do not use for security purposes.</strong> This algorithm has known attacks and provides no real protection.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        {/* No results */}
        {input && results.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center"
          >
            <AlertTriangle className="mx-auto h-8 w-8 text-amber-500" />
            <h3 className="mt-2 font-semibold text-amber-800">No matches found</h3>
            <p className="mt-1 text-sm text-amber-700">
              The input doesn&apos;t match any known hash format. Check for extra spaces, line breaks, or encoding issues.
            </p>
          </motion.div>
        )}

        {/* Reference Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Hash Length Reference</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {HASH_TYPES.filter((h) => h.length > 0)
              .sort((a, b) => a.length - b.length)
              .map((h) => {
                const sec = SECURITY_COLORS[h.security];
                return (
                  <div key={h.name} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm text-slate-800">{h.name}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sec.bg} ${sec.text}`}>
                        {sec.label}
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">{h.length} hex characters</span>
                  </div>
                );
              })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
