'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileJson, Copy, Check, AlertTriangle, CheckCircle2, XCircle, Sparkles, RotateCcw } from 'lucide-react';

interface ValidationError {
  path: string;
  message: string;
  keyword: string;
}

function validateJsonSchema(data: unknown, schema: unknown, path = ''): ValidationError[] {
  const errors: ValidationError[] = [];
  const s = schema as Record<string, unknown>;

  if (typeof s !== 'object' || s === null) return errors;

  // type check
  if (s.type) {
    const expected = s.type as string;
    const actual = Array.isArray(data) ? 'array' : typeof data;
    if (expected === 'integer') {
      if (typeof data !== 'number' || !Number.isInteger(data)) {
        errors.push({ path: path || '/', message: `Expected integer, got ${actual}`, keyword: 'type' });
      }
    } else if (expected === 'number') {
      if (typeof data !== 'number') {
        errors.push({ path: path || '/', message: `Expected number, got ${actual}`, keyword: 'type' });
      }
    } else if (expected === 'array') {
      if (!Array.isArray(data)) {
        errors.push({ path: path || '/', message: `Expected array, got ${actual}`, keyword: 'type' });
      }
    } else if (expected === 'object') {
      if (typeof data !== 'object' || data === null || Array.isArray(data)) {
        errors.push({ path: path || '/', message: `Expected object, got ${actual}`, keyword: 'type' });
      }
    } else if (actual !== expected) {
      errors.push({ path: path || '/', message: `Expected ${expected}, got ${actual}`, keyword: 'type' });
    }
  }

  // enum check
  if (s.enum && Array.isArray(s.enum)) {
    const found = s.enum.some((v: unknown) => JSON.stringify(v) === JSON.stringify(data));
    if (!found) {
      errors.push({ path: path || '/', message: `Value must be one of: ${s.enum.map(String).join(', ')}`, keyword: 'enum' });
    }
  }

  // const check
  if ('const' in s) {
    if (JSON.stringify(data) !== JSON.stringify(s.const)) {
      errors.push({ path: path || '/', message: `Value must be ${JSON.stringify(s.const)}`, keyword: 'const' });
    }
  }

  // string validations
  if (typeof data === 'string') {
    if (typeof s.minLength === 'number' && data.length < s.minLength) {
      errors.push({ path: path || '/', message: `String length ${data.length} is less than minimum ${s.minLength}`, keyword: 'minLength' });
    }
    if (typeof s.maxLength === 'number' && data.length > s.maxLength) {
      errors.push({ path: path || '/', message: `String length ${data.length} exceeds maximum ${s.maxLength}`, keyword: 'maxLength' });
    }
    if (typeof s.pattern === 'string') {
      try {
        if (!new RegExp(s.pattern).test(data)) {
          errors.push({ path: path || '/', message: `String does not match pattern "${s.pattern}"`, keyword: 'pattern' });
        }
      } catch { /* invalid regex */ }
    }
    if (s.format === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data)) {
      errors.push({ path: path || '/', message: 'Invalid email format', keyword: 'format' });
    }
    if (s.format === 'uri' && !/^https?:\/\/.+/.test(data)) {
      errors.push({ path: path || '/', message: 'Invalid URI format', keyword: 'format' });
    }
    if (s.format === 'date' && !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
      errors.push({ path: path || '/', message: 'Invalid date format (expected YYYY-MM-DD)', keyword: 'format' });
    }
  }

  // number validations
  if (typeof data === 'number') {
    if (typeof s.minimum === 'number' && data < s.minimum) {
      errors.push({ path: path || '/', message: `${data} is less than minimum ${s.minimum}`, keyword: 'minimum' });
    }
    if (typeof s.maximum === 'number' && data > s.maximum) {
      errors.push({ path: path || '/', message: `${data} exceeds maximum ${s.maximum}`, keyword: 'maximum' });
    }
    if (typeof s.multipleOf === 'number' && data % s.multipleOf !== 0) {
      errors.push({ path: path || '/', message: `${data} is not a multiple of ${s.multipleOf}`, keyword: 'multipleOf' });
    }
  }

  // object validations
  if (typeof data === 'object' && data !== null && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    const props = (s.properties || {}) as Record<string, unknown>;
    const required = (s.required || []) as string[];
    const additional = s.additionalProperties;

    // required check
    for (const req of required) {
      if (!(req in obj)) {
        errors.push({ path: `${path || '/'}.${req}`, message: `Required property "${req}" is missing`, keyword: 'required' });
      }
    }

    // properties validation
    for (const [key, propSchema] of Object.entries(props)) {
      if (key in obj) {
        errors.push(...validateJsonSchema(obj[key], propSchema, `${path || '/'}.${key}`));
      }
    }

    // additionalProperties
    if (additional === false) {
      const allowedKeys = new Set(Object.keys(props));
      for (const key of Object.keys(obj)) {
        if (!allowedKeys.has(key)) {
          errors.push({ path: `${path || '/'}.${key}`, message: `Additional property "${key}" is not allowed`, keyword: 'additionalProperties' });
        }
      }
    }

    // minProperties / maxProperties
    const objKeys = Object.keys(obj);
    if (typeof s.minProperties === 'number' && objKeys.length < s.minProperties) {
      errors.push({ path: path || '/', message: `Object has ${objKeys.length} properties, minimum is ${s.minProperties}`, keyword: 'minProperties' });
    }
    if (typeof s.maxProperties === 'number' && objKeys.length > s.maxProperties) {
      errors.push({ path: path || '/', message: `Object has ${objKeys.length} properties, maximum is ${s.maxProperties}`, keyword: 'maxProperties' });
    }
  }

  // array validations
  if (Array.isArray(data)) {
    if (typeof s.minItems === 'number' && data.length < s.minItems) {
      errors.push({ path: path || '/', message: `Array has ${data.length} items, minimum is ${s.minItems}`, keyword: 'minItems' });
    }
    if (typeof s.maxItems === 'number' && data.length > s.maxItems) {
      errors.push({ path: path || '/', message: `Array has ${data.length} items, maximum is ${s.maxItems}`, keyword: 'maxItems' });
    }
    if (s.uniqueItems === true) {
      const seen = new Set<string>();
      for (let i = 0; i < data.length; i++) {
        const key = JSON.stringify(data[i]);
        if (seen.has(key)) {
          errors.push({ path: `${path || '/'}[${i}]`, message: 'Duplicate items not allowed', keyword: 'uniqueItems' });
        }
        seen.add(key);
      }
    }
    const items = s.items;
    if (items && typeof items === 'object') {
      for (let i = 0; i < data.length; i++) {
        errors.push(...validateJsonSchema(data[i], items, `${path || '/'}[${i}]`));
      }
    }
  }

  // allOf / anyOf / oneOf
  if (Array.isArray(s.allOf)) {
    for (let i = 0; i < (s.allOf as unknown[]).length; i++) {
      errors.push(...validateJsonSchema(data, (s.allOf as unknown[])[i], `${path}/allOf[${i}]`));
    }
  }
  if (Array.isArray(s.anyOf)) {
    const anyPass = (s.anyOf as unknown[]).some((sub: unknown) => validateJsonSchema(data, sub, '').length === 0);
    if (!anyPass) {
      errors.push({ path: path || '/', message: 'Value does not match any of the schemas in anyOf', keyword: 'anyOf' });
    }
  }
  if (Array.isArray(s.oneOf)) {
    const passing = (s.oneOf as unknown[]).filter((sub: unknown) => validateJsonSchema(data, sub, '').length === 0);
    if (passing.length === 0) {
      errors.push({ path: path || '/', message: 'Value does not match any schema in oneOf', keyword: 'oneOf' });
    } else if (passing.length > 1) {
      errors.push({ path: path || '/', message: 'Value matches more than one schema in oneOf', keyword: 'oneOf' });
    }
  }

  // not
  if (s.not && typeof s.not === 'object') {
    const notErrors = validateJsonSchema(data, s.not, '');
    if (notErrors.length === 0) {
      errors.push({ path: path || '/', message: 'Value should NOT match the "not" schema', keyword: 'not' });
    }
  }

  return errors;
}

const EXAMPLE_SCHEMA = `{
  "type": "object",
  "required": ["name", "email", "age"],
  "properties": {
    "name": {
      "type": "string",
      "minLength": 2,
      "maxLength": 50
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    },
    "tags": {
      "type": "array",
      "items": { "type": "string" },
      "uniqueItems": true
    }
  },
  "additionalProperties": false
}`;

const EXAMPLE_DATA = `{
  "name": "Alice",
  "email": "alice@example.com",
  "age": 30,
  "tags": ["developer", "designer"]
}`;

export default function JsonSchemaValidator() {
  const [schemaText, setSchemaText] = useState(EXAMPLE_SCHEMA);
  const [dataText, setDataText] = useState(EXAMPLE_DATA);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [schemaError, setSchemaError] = useState('');
  const [copied, setCopied] = useState(false);

  const validate = useCallback(() => {
    setSchemaError('');
    setErrors([]);
    setIsValid(null);

    let schema: unknown;
    let data: unknown;

    try {
      schema = JSON.parse(schemaText);
    } catch {
      setSchemaError('Invalid JSON Schema: ' + 'Check your JSON syntax');
      setIsValid(false);
      return;
    }

    try {
      data = JSON.parse(dataText);
    } catch {
      setSchemaError('Invalid JSON Data: ' + 'Check your JSON syntax');
      setIsValid(false);
      return;
    }

    const validationErrors = validateJsonSchema(data, schema);
    setErrors(validationErrors);
    setIsValid(validationErrors.length === 0);
  }, [schemaText, dataText]);

  const copyErrors = () => {
    const text = errors.map(e => `${e.path}: ${e.message} (${e.keyword})`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setSchemaText(EXAMPLE_SCHEMA);
    setDataText(EXAMPLE_DATA);
    setErrors([]);
    setIsValid(null);
    setSchemaError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-600/20 text-emerald-400 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Free Developer Tool
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <FileJson className="w-10 h-10 text-emerald-400" />
            JSON Schema Validator
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Validate JSON data against JSON Schema (Draft 2020-12 subset). Supports type checking,
            required properties, string/number constraints, arrays, nested objects, allOf/anyOf/oneOf, and more.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Schema Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-slate-300 mb-2">
              JSON Schema
            </label>
            <textarea
              value={schemaText}
              onChange={(e) => setSchemaText(e.target.value)}
              className="w-full h-80 bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Paste your JSON Schema here..."
              spellCheck={false}
            />
          </motion.div>

          {/* Data Input */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <label className="block text-sm font-medium text-slate-300 mb-2">
              JSON Data
            </label>
            <textarea
              value={dataText}
              onChange={(e) => setDataText(e.target.value)}
              className="w-full h-80 bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              placeholder="Paste your JSON data here..."
              spellCheck={false}
            />
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <button
            onClick={validate}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <CheckCircle2 className="w-5 h-5" />
            Validate
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
          {errors.length > 0 && (
            <button
              onClick={copyErrors}
              className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-semibold transition"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied!' : 'Copy Errors'}
            </button>
          )}
        </div>

        {/* Results */}
        {schemaError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-900/30 border border-red-700 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-2 text-red-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Parse Error</span>
            </div>
            <p className="text-red-300 mt-1 text-sm">{schemaError}</p>
          </motion.div>
        )}

        {isValid === true && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-900/30 border border-emerald-700 rounded-xl p-6 text-center mb-6"
          >
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-emerald-300">Valid!</h3>
            <p className="text-emerald-400/80 text-sm mt-1">JSON data conforms to the schema.</p>
          </motion.div>
        )}

        {isValid === false && errors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                {errors.length} Validation Error{errors.length !== 1 ? 's' : ''}
              </h3>
            </div>
            <div className="space-y-3">
              {errors.map((err, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-slate-900 border border-red-800/50 rounded-xl p-4 flex items-start gap-3"
                >
                  <div className="w-8 h-8 bg-red-600/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <XCircle className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <code className="text-sm text-red-300 font-mono bg-red-900/30 px-2 py-0.5 rounded">
                        {err.path}
                      </code>
                      <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                        {err.keyword}
                      </span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">{err.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { title: 'Type Checking', desc: 'string, number, integer, boolean, array, object' },
            { title: 'Constraints', desc: 'min/max, pattern, format, enum, uniqueItems' },
            { title: 'Composition', desc: 'allOf, anyOf, oneOf, not support' },
            { title: '100% Client-Side', desc: 'No data leaves your browser. Fully private.' },
          ].map((f, i) => (
            <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <h4 className="text-sm font-semibold text-emerald-400">{f.title}</h4>
              <p className="text-xs text-slate-400 mt-1">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
