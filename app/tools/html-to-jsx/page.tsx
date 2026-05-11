'use client';

import { useState, useCallback } from 'react';
import { Copy, Check, Code, ArrowRight, RotateCcw } from 'lucide-react';

function convertHtmlToJsx(html: string): { jsx: string; warnings: string[] } {
  const warnings: string[] = [];
  let result = html;

  // class -> className
  if (/\bclass\s*=/i.test(result)) {
    result = result.replace(/\bclass\s*=/gi, 'className=');
    warnings.push('Converted class → className');
  }

  // for -> htmlFor
  if (/\bfor\s*=/i.test(result)) {
    result = result.replace(/\bfor\s*=/gi, 'htmlFor=');
    warnings.push('Converted for → htmlFor');
  }

  // tabindex -> tabIndex
  if (/\btabindex\s*=/i.test(result)) {
    result = result.replace(/\btabindex\s*=/gi, 'tabIndex=');
    warnings.push('Converted tabindex → tabIndex');
  }

  // readonly -> readOnly
  if (/\breadonly\b/i.test(result)) {
    result = result.replace(/\breadonly\b/gi, 'readOnly');
    warnings.push('Converted readonly → readOnly');
  }

  // maxlength -> maxLength
  if (/\bmaxlength\s*=/i.test(result)) {
    result = result.replace(/\bmaxlength\s*=/gi, 'maxLength=');
    warnings.push('Converted maxlength → maxLength');
  }

  // autocomplete -> autoComplete
  if (/\bautocomplete\s*=/i.test(result)) {
    result = result.replace(/\bautocomplete\s*=/gi, 'autoComplete=');
    warnings.push('Converted autocomplete → autoComplete');
  }

  // autofocus -> autoFocus
  if (/\bautofocus\b/i.test(result)) {
    result = result.replace(/\bautofocus\b/gi, 'autoFocus');
    warnings.push('Converted autofocus → autoFocus');
  }

  // enctype -> encType
  if (/\benctype\s*=/i.test(result)) {
    result = result.replace(/\benctype\s*=/gi, 'encType=');
    warnings.push('Converted enctype → encType');
  }

  // novalidate -> noValidate
  if (/\bnovalidate\b/i.test(result)) {
    result = result.replace(/\bnovalidate\b/gi, 'noValidate');
    warnings.push('Converted novalidate → noValidate');
  }

  // colspan -> colSpan
  if (/\bcolspan\s*=/i.test(result)) {
    result = result.replace(/\bcolspan\s*=/gi, 'colSpan=');
    warnings.push('Converted colspan → colSpan');
  }

  // rowspan -> rowSpan
  if (/\browspan\s*=/i.test(result)) {
    result = result.replace(/\browspan\s*=/gi, 'rowSpan=');
    warnings.push('Converted rowspan → rowSpan');
  }

  // Cellpadding/cellspacing
  if (/\bcellpadding\s*=/i.test(result)) {
    result = result.replace(/\bcellpadding\s*=/gi, 'cellPadding=');
    warnings.push('Converted cellpadding → cellPadding');
  }
  if (/\bcellspacing\s*=/i.test(result)) {
    result = result.replace(/\bcellspacing\s*=/gi, 'cellSpacing=');
    warnings.push('Converted cellspacing → cellSpacing');
  }

  // attribute=""
  if (/\\&\\s/i.test(result)) {
    result = result.replace(/\\&\\s/gi, '\\&amp; ');
    warnings.push('Escaped ampersands');
  }

  // Inline style string -> object
  const styleRegex = /\sstyle\s*=\s*"([^"]*)"/gi;
  const styleMatches: RegExpExecArray[] = [];
  let styleMatch;
  while ((styleMatch = styleRegex.exec(result)) !== null) {
    styleMatches.push(styleMatch);
  }
  if (styleMatches.length > 0) {
    for (const match of styleMatches) {
      const styleStr = match[1];
      const cssObj = convertStyleString(styleStr);
      result = result.replace(match[0], ` style={${cssObj}}`);
    }
    warnings.push('Converted style strings → style objects');
  }

  // Self-closing void elements that aren't self-closed
  const voidElements = ['input', 'br', 'hr', 'img', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
  for (const tag of voidElements) {
    const unclosedRegex = new RegExp(`<${tag}\\b([^>]*)(?<!/)>`, 'gi');
    result = result.replace(unclosedRegex, `<${tag}$1 />`);
  }

  // HTML comments -> JSX comments
  if (/<!--/.test(result)) {
    result = result.replace(/<!--([\s\S]*?)-->/g, '{/* $1 */}');
    warnings.push('Converted HTML comments → JSX comments');
  }

  if (warnings.length === 0 && html === result) {
    warnings.push('No changes needed — your HTML is already JSX-compatible!');
  }

  return { jsx: result, warnings: Array.from(new Set(warnings)) };
}

function convertStyleString(style: string): string {
  const props: string[] = [];
  const declarations = style.split(';').filter(d => d.trim());
  for (const decl of declarations) {
    const colonIdx = decl.indexOf(':');
    if (colonIdx === -1) continue;
    const prop = decl.substring(0, colonIdx).trim();
    const value = decl.substring(colonIdx + 1).trim();
    if (!prop || !value) continue;
    // Convert kebab-case to camelCase
    const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    // Check if value is numeric
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && /^[0-9.]+(px|em|rem|%|vh|vw|pt)?$/i.test(value)) {
      props.push(`${camelProp}: ${numericValue}`);
    } else {
      props.push(`${camelProp}: '${value.replace(/'/g, "\\'")}'`);
    }
  }
  return `{ ${props.join(', ')} }`;
}

export default function HtmlToJsxConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleConvert = useCallback(() => {
    if (!input.trim()) return;
    const { jsx, warnings: w } = convertHtmlToJsx(input);
    setOutput(jsx);
    setWarnings(w);
  }, [input]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleClear = useCallback(() => {
    setInput('');
    setOutput('');
    setWarnings([]);
  }, []);

  const examples = [
    {
      label: 'Form',
      html: '<div class="form-group">\n  <label for="email">Email</label>\n  <input type="email" class="input" id="email" autocomplete="off" />\n  <button class="btn" style="background-color: #3b82f6; color: white">Submit</button>\n</div>',
    },
    {
      label: 'Table',
      html: '<table class="data-table">\n  <tr>\n    <th colspan="2">Header</th>\n  </tr>\n  <tr>\n    <td>Cell 1</td>\n    <td>Cell 2</td>\n  </tr>\n</table>',
    },
    {
      label: 'Image + Link',
      html: '<a href="/about" class="nav-link">\n  <img src="/logo.png" alt="Logo" class="logo" />\n  <span>Home</span>\n</a>\n<!-- Navigation ends -->',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white">
              <Code className="w-5 h-5" />
            </div>
            HTML to JSX Converter
          </h1>
          <p className="mt-2 text-slate-600">
            Paste HTML and instantly convert it to React JSX syntax. Handles className, htmlFor, inline styles, self-closing tags, and more.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">HTML Input</label>
              <div className="flex gap-2">
                <button onClick={handleClear} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                  <RotateCcw className="w-3 h-3" /> Clear
                </button>
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your HTML here..."
              className="w-full h-64 rounded-lg border border-slate-300 bg-white p-4 font-mono text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none resize-none"
              spellCheck={false}
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => { setInput(ex.html); const { jsx, warnings: w } = convertHtmlToJsx(ex.html); setOutput(jsx); setWarnings(w); }}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition"
                >
                  {ex.label} example
                </button>
              ))}
            </div>
            <button
              onClick={handleConvert}
              className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition"
            >
              Convert to JSX <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">JSX Output</label>
              {output && (
                <button onClick={handleCopy} className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1">
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </div>
            <pre className="w-full h-64 rounded-lg border border-slate-300 bg-white p-4 font-mono text-sm text-slate-800 shadow-sm overflow-auto whitespace-pre-wrap">
              {output || <span className="text-slate-400">JSX output will appear here...</span>}
            </pre>
            {warnings.length > 0 && (
              <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-xs font-semibold text-amber-800 mb-1">Conversions Applied</p>
                <ul className="text-xs text-amber-700 space-y-0.5">
                  {warnings.map((w, i) => (
                    <li key={i}>• {w}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Conversion Reference */}
        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">What Gets Converted</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm">
            {[
              ['class=', 'className='],
              ['for=', 'htmlFor='],
              ['tabindex=', 'tabIndex='],
              ['readonly', 'readOnly'],
              ['maxlength=', 'maxLength='],
              ['style="..."', 'style={{...}}'],
              ['<!-- comment -->', '{/* comment */}'],
              ['<br>', '<br />'],
              ['<img ...>', '<img ... />'],
              ['colspan=', 'colSpan='],
              ['autocomplete=', 'autoComplete='],
              ['novalidate', 'noValidate'],
            ].map(([from, to]) => (
              <div key={from} className="flex items-center gap-2 rounded-lg bg-slate-50 p-2">
                <code className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">{from}</code>
                <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
                <code className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">{to}</code>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
