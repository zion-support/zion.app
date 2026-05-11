'use client';

import { useState } from 'react';

export default function READMEGenerator() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [features, setFeatures] = useState('');
  const [installation, setInstallation] = useState('');
  const [usage, setUsage] = useState('');
  const [license, setLicense] = useState('MIT');
  const [generatedReadme, setGeneratedReadme] = useState('');

  const generateReadme = () => {
    const readme = `# ${projectName || 'Project Name'}

${projectDescription || 'A brief description of the project.'}

## Features

${features || '- Feature 1\n- Feature 2\n- Feature 3'}

## Installation

\`\`\`bash
${installation || 'npm install'}
\`\`\`

## Usage

\`\`\`bash
${usage || 'npm start'}
\`\`\`

## License

This project is licensed under the ${license} License.
`;

    setGeneratedReadme(readme);
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI README Generator
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Generate professional README files for your projects instantly.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="space-y-6">
            {/* Project Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Awesome Project"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe what your project does..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features (one per line)
              </label>
              <textarea
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                placeholder="- User authentication\n- Data validation\n- API integration"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Installation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Installation Instructions
              </label>
              <textarea
                value={installation}
                onChange={(e) => setInstallation(e.target.value)}
                placeholder="npm install\nor\nyarn add"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Usage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Instructions
              </label>
              <textarea
                value={usage}
                onChange={(e) => setUsage(e.target.value)}
                placeholder="npm start\nor\nnode index.js"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* License */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">
                License
              </label>
              <select
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="MIT">MIT</option>
                <option value="GPL-3.0">GPL-3.0</option>
                <option value="Apache-2.0">Apache-2.0</option>
                <option value="BSD-3-Clause">BSD-3-Clause</option>
                <option value="ISC">ISC</option>
              </select>
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <button
                onClick={generateReadme}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Generate README
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        {generatedReadme && (
          <div className="mt-8 bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Generated README
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="whitespace-pre-wrap text-sm text-gray-800">{generatedReadme}</pre>
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedReadme);
                  alert('README copied to clipboard!');
                }}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}