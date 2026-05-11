'use client';

export default function InnovationIdeas() {
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Innovation Ideas</h2>
      <ul className="space-y-4">
        <li>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-600 rounded-full"></div>
            <div>
              <h3 className="text-gray-800 font-semibold">Autonomous Deployment Engine</h3>
              <p className="text-gray-600">Automatically deploys new AI components to production</p>
            <div>
          </div>
        </li>
        <li>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            <div>
              <h3 className="text-gray-800">Knowledge Graph Enhancer</h3>
              <p className="text-gray-600">Improves entity relationships for better context understanding</p>
            </div>
          </div>
        </li>
        <li>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
            <div>
              <h3 className="text-gray-800">AI Component Catalog</h3>
              <p className="text-gray-600">Centralized registry for all AI components</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}