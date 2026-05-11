'use client';

import { FormEvent, useState } from 'react';
import { motion } from 'framer-motion';

const cannedExamples: Record<string, string> = {
  react:
    'React hooks let you manage state and lifecycle behavior in function components. Start with useState for local state and useEffect for side effects like fetching data.',
  api:
    'An API defines how one software system talks to another. REST uses resource endpoints and HTTP verbs, while GraphQL uses a schema and client-defined queries.',
  css:
    'Flexbox is best for one-dimensional layout, Grid is best for two-dimensional layout. Use Grid for page structure and Flexbox inside components.',
};

export default function AIConceptExplainer() {
  const [concept, setConcept] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);

  const buildExplanation = (value: string): string => {
    const key = value.toLowerCase();
    if (key.includes('react')) return cannedExamples.react;
    if (key.includes('api') || key.includes('graphql') || key.includes('rest')) return cannedExamples.api;
    if (key.includes('css') || key.includes('grid') || key.includes('flexbox')) return cannedExamples.css;
    return `Here is a concise overview of "${value}": define the core concept, identify why it exists, map practical use cases, and compare it with adjacent alternatives.`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!concept.trim()) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setExplanation(buildExplanation(concept.trim()));
    setLoading(false);
  };

  return (
    <motion.div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">AI Concept Explainer</h1>
        <p className="mb-6 text-gray-600">Enter a technical concept and get a plain-language explanation.</p>

        <form onSubmit={handleSubmit} className="mb-6 rounded-xl bg-white p-6 shadow">
          <textarea
            value={concept}
            onChange={(e) => setConcept(e.target.value)}
            placeholder="e.g. React hooks, REST API, CSS Grid"
            className="mb-4 h-28 w-full resize-none rounded-lg border border-gray-300 px-4 py-3"
          />
          <button
            type="submit"
            disabled={loading || !concept.trim()}
            className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Explaining...' : 'Explain Concept'}
          </button>
        </form>

        {explanation && <div className="rounded-xl bg-white p-6 text-gray-800 shadow">{explanation}</div>}
      </div>
    </motion.div>
  );
}