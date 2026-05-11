'use client';

import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RotateCcw, Terminal, Code2, AlertCircle, ChevronDown, Braces } from 'lucide-react';

type OutputStyle = 'fetch' | 'axios' | 'node-fetch';

interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string | null;
  queryParams: Record<string, string>;
}

function parseCurl(curl: string): ParsedCurl {
  const cleaned = curl.replace(/\\\n/g, ' ').trim();

  if (!/^curl\s/i.test(cleaned)) {
    throw new Error('Input must start with "curl"');
  }

  let method = 'GET';
  const headers: Record<string, string> = {};
  let body: string | null = null;
  let url = '';

  // Tokenize respecting quotes
  const tokens: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let escape = false;

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i];
    if (escape) {
      current += ch;
      escape = false;
      continue;
    }
    if (ch === '\\') {
      escape = true;
      continue;
    }
    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if (ch === ' ' && !inSingle && !inDouble) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    current += ch;
  }
  if (current) tokens.push(current);

  // Skip 'curl' token
  let i = 0;
  while (i < tokens.length && tokens[i].toLowerCase() === 'curl') i++;

  while (i < tokens.length) {
    const t = tokens[i];

    if (t === '-X' || t === '--request') {
      method = (tokens[++i] ?? 'GET').toUpperCase();
    } else if (t === '-H' || t === '--header') {
      const hdr = tokens[++i] ?? '';
      const colonIdx = hdr.indexOf(':');
      if (colonIdx > 0) {
        headers[hdr.slice(0, colonIdx).trim()] = hdr.slice(colonIdx + 1).trim();
      }
    } else if (t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-binary' || t === '--data-urlencode') {
      body = tokens[++i] ?? '';
      if (!headers['Content-Type'] && !headers['content-type']) {
        try {
          JSON.parse(body);
          headers['Content-Type'] = 'application/json';
        } catch {
          if (body.includes('=') && !body.startsWith('{')) {
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
          }
        }
      }
      if (method === 'GET') method = 'POST';
    } else if (t === '-b' || t === '--cookie') {
      const cookie = tokens[++i] ?? '';
      headers['Cookie'] = cookie;
    } else if (t === '-A' || t === '--user-agent') {
      headers['User-Agent'] = tokens[++i] ?? '';
    } else if (t === '-u' || t === '--user') {
      const creds = tokens[++i] ?? '';
      headers['Authorization'] = 'Basic ' + btoa(creds);
    } else if (t === '-k' || t === '--insecure') {
      // skip
    } else if (t === '-L' || t === '--location') {
      // skip
    } else if (t === '-s' || t === '--silent' || t === '-S' || t === '--show-error' || t === '-f' || t === '--fail' || t === '-v' || t === '--verbose' || t === '-i' || t === '--include') {
      // skip flags
    } else if (!t.startsWith('-') && !url) {
      url = t;
    }

    i++;
  }

  // Parse query params from URL
  const queryParams: Record<string, string> = {};
  try {
    const parsedUrl = new URL(url);
    parsedUrl.searchParams.forEach((v, k) => {
      queryParams[k] = v;
    });
  } catch {
    // not a full URL
  }

  return { method, url, headers, body, queryParams };
}

function generateFetchCode(parsed: ParsedCurl): string {
  const lines: string[] = [];
  const opts: string[] = [];

  opts.push(`  method: '${parsed.method}'`);

  if (Object.keys(parsed.headers).length > 0) {
    lines.push(`const headers = ${JSON.stringify(parsed.headers, null, 2).split('\n').map((l, i) => i === 0 ? l : '  ' + l).join('\n')};`);
    opts.push('  headers');
  }

  if (parsed.body) {
    const ct = parsed.headers['Content-Type'] || parsed.headers['content-type'] || '';
    if (ct.includes('json')) {
      try {
        JSON.parse(parsed.body);
        opts.push(`  body: JSON.stringify(${parsed.body})`);
      } catch {
        opts.push(`  body: JSON.stringify(${JSON.stringify(parsed.body)})`);
      }
    } else {
      opts.push(`  body: '${parsed.body.replace(/'/g, "\\'")}'`);
    }
  }

  lines.push('');
  lines.push(`const response = await fetch('${parsed.url}', {`);
  lines.push(opts.join(',\n'));
  lines.push('});');
  lines.push('');
  lines.push('const data = await response.json();');
  lines.push('console.log(data);');

  if (Object.keys(parsed.headers).length > 0) {
    return lines.join('\n');
  }

  // Inline headers if simple
  return lines.join('\n').replace('  headers', `  headers: ${JSON.stringify(parsed.headers, null, 4).split('\n').map((l, i) => i === 0 ? l : '    ' + l).join('\n')}`);
}

function generateAxiosCode(parsed: ParsedCurl): string {
  const config: Record<string, unknown> = {
    method: parsed.method.toLowerCase(),
    url: parsed.url,
  };

  if (Object.keys(parsed.headers).length > 0) {
    config.headers = parsed.headers;
  }

  if (parsed.body) {
    const ct = parsed.headers['Content-Type'] || parsed.headers['content-type'] || '';
    if (ct.includes('json')) {
      try {
        config.data = JSON.parse(parsed.body);
      } catch {
        config.data = parsed.body;
      }
    } else {
      config.data = parsed.body;
    }
  }

  const configStr = JSON.stringify(config, null, 2)
    .split('\n')
    .map((l, i) => (i === 0 ? '' : '  ') + l)
    .join('\n');

  return `const response = await axios(${configStr});\nconsole.log(response.data);`;
}

function generateNodeFetchCode(parsed: ParsedCurl): string {
  const lines: string[] = ["import fetch from 'node-fetch';", ''];

  if (Object.keys(parsed.headers).length > 0) {
    lines.push(`const headers = ${JSON.stringify(parsed.headers, null, 2)};`);
  }

  const opts: string[] = [];
  opts.push(`  method: '${parsed.method}'`);
  if (Object.keys(parsed.headers).length > 0) {
    opts.push('  headers');
  }
  if (parsed.body) {
    const ct = parsed.headers['Content-Type'] || parsed.headers['content-type'] || '';
    if (ct.includes('json')) {
      try {
        opts.push(`  body: JSON.stringify(${parsed.body})`);
      } catch {
        opts.push(`  body: JSON.stringify(${JSON.stringify(parsed.body)})`);
      }
    } else {
      opts.push(`  body: '${parsed.body.replace(/'/g, "\\'")}'`);
    }
  }

  lines.push('');
  lines.push(`const response = await fetch('${parsed.url}', {`);
  lines.push(opts.join(',\n'));
  lines.push('});');
  lines.push('');
  lines.push('const data = await response.json();');
  lines.push('console.log(data);');

  return lines.join('\n');
}

const EXAMPLES = [
  {
    label: 'GET with headers',
    curl: `curl -H "Authorization: Bearer token123" -H "Accept: application/json" https://api.example.com/users`,
  },
  {
    label: 'POST JSON',
    curl: `curl -X POST https://api.example.com/users -H "Content-Type: application/json" -d '{"name":"John","email":"john@example.com"}'`,
  },
  {
    label: 'POST form data',
    curl: `curl -X POST https://api.example.com/login -d "username=admin&password=secret"`,
  },
  {
    label: 'Basic auth',
    curl: `curl -u "user:pass" https://api.example.com/data`,
  },
  {
    label: 'Cookie + User-Agent',
    curl: `curl -b "session=abc123" -A "Mozilla/5.0" https://example.com/dashboard`,
  },
];

export default function CurlToJavascript() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [style, setStyle] = useState<OutputStyle>('fetch');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [parsed, setParsed] = useState<ParsedCurl | null>(null);
  const outputRef = useRef<HTMLTextAreaElement>(null);

  const convert = useCallback(() => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      setParsed(null);
      return;
    }

    try {
      const p = parseCurl(input);
      setParsed(p);

      let code: string;
      switch (style) {
        case 'axios':
          code = generateAxiosCode(p);
          break;
        case 'node-fetch':
          code = generateNodeFetchCode(p);
          break;
        default:
          code = generateFetchCode(p);
      }
      setOutput(code);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to parse curl command');
      setOutput('');
      setParsed(null);
    }
  }, [input, style]);

  const handleInputChange = (value: string) => {
    setInput(value);
    setError('');
    if (!value.trim()) {
      setOutput('');
      setParsed(null);
      return;
    }
    try {
      const p = parseCurl(value);
      setParsed(p);
      let code: string;
      switch (style) {
        case 'axios': code = generateAxiosCode(p); break;
        case 'node-fetch': code = generateNodeFetchCode(p); break;
        default: code = generateFetchCode(p);
      }
      setOutput(code);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid curl command');
      setOutput('');
      setParsed(null);
    }
  };

  const handleStyleChange = (newStyle: OutputStyle) => {
    setStyle(newStyle);
    if (parsed) {
      let code: string;
      switch (newStyle) {
        case 'axios': code = generateAxiosCode(parsed); break;
        case 'node-fetch': code = generateNodeFetchCode(parsed); break;
        default: code = generateFetchCode(parsed);
      }
      setOutput(code);
    }
  };

  const copyOutput = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
    setParsed(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-full px-4 py-1.5 mb-4">
            <Terminal className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-orange-300">Developer Tool</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
            Curl to JavaScript Converter
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Paste a curl command and instantly get JavaScript code using Fetch API, Axios, or Node Fetch.
            Supports headers, auth, cookies, POST data, and more.
          </p>
        </motion.div>

        {/* Examples */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 justify-center mb-8"
        >
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleInputChange(ex.curl)}
              className="px-3 py-1.5 text-xs rounded-lg bg-gray-800/60 border border-gray-700/50 text-gray-300 hover:bg-gray-700/60 hover:border-orange-500/30 transition-all"
            >
              {ex.label}
            </button>
          ))}
        </motion.div>

        {/* Style selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex justify-center gap-2 mb-6"
        >
          {([
            { key: 'fetch' as OutputStyle, label: 'Fetch API', icon: Braces },
            { key: 'axios' as OutputStyle, label: 'Axios', icon: Code2 },
            { key: 'node-fetch' as OutputStyle, label: 'Node Fetch', icon: Terminal },
          ]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleStyleChange(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                style === key
                  ? 'bg-orange-500/20 border border-orange-500/40 text-orange-300'
                  : 'bg-gray-800/40 border border-gray-700/40 text-gray-400 hover:bg-gray-700/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </motion.div>

        {/* Main panels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {/* Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-orange-400" />
                Curl Command
              </label>
              <button
                onClick={clear}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear
              </button>
            </div>
            <textarea
              value={input}
              onChange={(e) => handleInputChange(e.target.value)}
              placeholder={`curl -X POST https://api.example.com/users \\\n  -H "Content-Type: application/json" \\\n  -d '{"name":"John"}'`}
              className="w-full h-72 bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 font-mono text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500/40 resize-none"
              spellCheck={false}
            />
          </div>

          {/* Output */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-green-400" />
                JavaScript Output
              </label>
              {output && (
                <button
                  onClick={copyOutput}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-green-400 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-green-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </button>
              )}
            </div>
            <textarea
              ref={outputRef}
              value={output}
              readOnly
              placeholder="JavaScript code will appear here..."
              className="w-full h-72 bg-gray-900/80 border border-gray-700/50 rounded-xl p-4 font-mono text-sm text-green-300/90 placeholder:text-gray-700 resize-none"
            />
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span className="text-sm text-red-300">{error}</span>
          </motion.div>
        )}

        {/* Parsed details */}
        {parsed && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 bg-gray-900/50 border border-gray-700/30 rounded-xl p-6"
          >
            <h3 className="text-sm font-semibold text-gray-300 mb-4 flex items-center gap-2">
              <Braces className="w-4 h-4 text-blue-400" />
              Parsed Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <span className="text-xs text-gray-500 block mb-1">Method</span>
                <span className={`text-sm font-mono font-bold ${
                  parsed.method === 'GET' ? 'text-green-400' :
                  parsed.method === 'POST' ? 'text-blue-400' :
                  parsed.method === 'PUT' ? 'text-yellow-400' :
                  parsed.method === 'DELETE' ? 'text-red-400' :
                  parsed.method === 'PATCH' ? 'text-purple-400' : 'text-gray-300'
                }`}>
                  {parsed.method}
                </span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3 sm:col-span-2 lg:col-span-1">
                <span className="text-xs text-gray-500 block mb-1">URL</span>
                <span className="text-sm font-mono text-gray-300 break-all">{parsed.url}</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <span className="text-xs text-gray-500 block mb-1">Headers</span>
                <span className="text-sm font-mono text-gray-300">{Object.keys(parsed.headers).length}</span>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-3">
                <span className="text-xs text-gray-500 block mb-1">Body</span>
                <span className="text-sm font-mono text-gray-300">{parsed.body ? 'Yes' : 'None'}</span>
              </div>
            </div>

            {Object.keys(parsed.headers).length > 0 && (
              <div className="mt-4">
                <span className="text-xs text-gray-500 block mb-2">Headers</span>
                <div className="space-y-1">
                  {Object.entries(parsed.headers).map(([k, v]) => (
                    <div key={k} className="flex gap-2 text-sm font-mono">
                      <span className="text-purple-400">{k}:</span>
                      <span className="text-gray-400">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[
            { icon: '⚡', title: 'Instant Conversion', desc: 'Real-time parsing as you type — no button click needed' },
            { icon: '🔐', title: 'Auth Support', desc: 'Handles Basic Auth, Bearer tokens, cookies, and custom headers' },
            { icon: '📦', title: 'Multiple Outputs', desc: 'Generate Fetch API, Axios, or Node Fetch code instantly' },
          ].map((f) => (
            <div key={f.title} className="bg-gray-900/40 border border-gray-800/50 rounded-xl p-5 text-center">
              <div className="text-2xl mb-2">{f.icon}</div>
              <h3 className="text-sm font-semibold text-gray-200 mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
