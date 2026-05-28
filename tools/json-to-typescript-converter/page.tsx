import { useState } from 'react';

export default function JsonToTypescriptConverterPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [tsOutput, setTsOutput] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertJsonToTs = (json: string): string => {
    try {
      const parsed = JSON.parse(json);
      return jsonToTs(parsed, '');
    } catch (e) {
      throw new Error('Invalid JSON input', { cause: e });
    }
  };

  const jsonToTs = (obj: any, indent: string): string => {
    if (obj === null) {
      return 'null';
    }
    if (typeof obj === 'string') {
      return 'string';
    }
    if (typeof obj === 'number') {
      return 'number';
    }
    if (typeof obj === 'boolean') {
      return 'boolean';
    }
    if (Array.isArray(obj)) {
      if (obj.length === 0) {
        return 'any[]';
      }
      const itemType = jsonToTs(obj[0], indent);
      // Check if all items are the same type (simplistic)
      const allSame = obj.every((item: any) => {
        try {
          return jsonToTs(item, indent) === itemType;
        } catch {
          return false;
        }
      });
      return allSame ? `${itemType}[]` : 'any[]';
    }
    if (typeof obj === 'object') {
      const properties = Object.keys(obj).map(key => {
        const propType = jsonToTs(obj[key], indent + '  ');
        // Optional if value can be undefined/null? We'll keep required for simplicity
        return `${indent}  ${key}: ${propType};`;
      });
      return `{\n${properties.join('\n')}\n${indent}}`;
    }
    return 'any';
  };

  const handleConvert = () => {
    setError(null);
    setIsConverting(true);
    try {
      const output = convertJsonToTs(jsonInput);
      setTsOutput(output);
    } catch (e: any) {
      setError(e.message);
      setTsOutput('');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">JSON to TypeScript Converter</h1>
      <p className="mb-4">Convert JSON data to TypeScript interfaces instantly with AI-powered type inference.</p>
      <div className="border rounded-lg p-6 mb-6">
        <div className="mb-4">
          <label htmlFor="json-input" className="block text-sm font-medium text-slate-700 mb-2">
            JSON Input
          </label>
          <textarea
            id="json-input"
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full p-3 border border-slate-300 rounded-lg bg-slate-50 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-48 resize-y"
            placeholder='Paste your JSON here...'
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleConvert}
            disabled={isConverting || !jsonInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isConverting ? 'Converting...' : 'Convert to TypeScript'}
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600">{error}</p>
        )}
      </div>
      {tsOutput && (
        <div className="border rounded-lg p-6">
          <div className="mb-3 flex justify-between items-start">
            <h2 className="text-lg font-semibold text-slate-900">TypeScript Output</h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(tsOutput);
                alert('Copied to clipboard!');
              }}
              className="px-3 py-1 bg-slate-200 text-slate-800 rounded hover:bg-slate-300 text-xs"
            >
              Copy
            </button>
          </div>
          <pre className="bg-slate-50 p-4 rounded overflow-auto text-slate-900">{tsOutput}</pre>
        </div>
      )}
      {!tsOutput && !error && !jsonInput && (
        <p className="text-slate-500">Tool implementation coming soon.</p>
      )}
    </div>
  );
}