'use client';

import { useState } from 'react';

interface TodoItem {
  id: string;
  text: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  aiSuggestion?: string;
}

export default function AITaskOptimizer() {
  const [tasks, setTasks] = useState<TodoItem[]>([
    { id: '1', text: 'Deploy production build', priority: 'high', completed: false, aiSuggestion: 'Consider running staging tests first' },
    { id: '2', text: 'Update documentation', priority: 'medium', completed: false, aiSuggestion: 'Auto-generate API docs from types' },
    { id: '3', text: 'Review pull requests', priority: 'high', completed: false, aiSuggestion: 'Use AI code reviewer for initial pass' },
    { id: '4', text: 'Update dependencies', priority: 'low', completed: false, aiSuggestion: 'Can be automated with Dependabot' },
  ]);
  const [newTask, setNewTask] = useState('');
  const [suggestedOrder, setSuggestedOrder] = useState<string[]>([]);

  const aiPrioritize = () => {
    const sorted = [...tasks]
      .filter((t) => !t.completed)
      .sort((a, b) => {
        const p = { high: 0, medium: 1, low: 2 };
        return p[a.priority] - p[b.priority];
      });
    setSuggestedOrder(sorted.map((t) => t.id));
  };

  const toggleComplete = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: newTask, priority: 'medium', completed: false }]);
    setNewTask('');
  };

  const progress = tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">AI Task Optimizer</h2>
          <p className="text-sm text-gray-600 mt-1">Smart prioritization and productivity insights</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">{progress}%</div>
          <div className="text-xs text-gray-500">Completion</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>

      {/* Add Task */}
      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add
        </button>
      </div>

      {/* AI Optimize Button */}
      <button
        onClick={aiPrioritize}
        className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 font-semibold"
      >
        🤖 AI Prioritize Tasks
      </button>

      {/* Task List */}
      <div className="space-y-2 mb-4">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`p-3 rounded-lg border flex items-start space-x-3 ${
              suggestedOrder.length > 0 && suggestedOrder[0] === task.id
                ? 'border-purple-400 bg-purple-50'
                : task.completed
                ? 'border-green-200 bg-green-50 opacity-60'
                : 'border-gray-200 bg-white'
            }`}
          >
            <button onClick={() => toggleComplete(task.id)} className="mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center">
              {task.completed && <span className="text-green-600">✓</span>}
            </button>
            <div className="flex-1">
              <p className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.text}</p>
              {task.aiSuggestion && (
                <p className="text-xs text-gray-500 mt-1 italic">💡 {task.aiSuggestion}</p>
              )}
              <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded ${
                task.priority === 'high' ? 'bg-red-100 text-red-700' :
                task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {task.priority}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Insights */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 mt-4">
        <h3 className="font-semibold text-blue-900 mb-2">AI Productivity Insights</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• High priority tasks should be tackled first</li>
          <li>• Automate repetitive low priority tasks</li>
          <li>• Consider batching similar tasks together</li>
        </ul>
      </div>
    </div>
  );
}
