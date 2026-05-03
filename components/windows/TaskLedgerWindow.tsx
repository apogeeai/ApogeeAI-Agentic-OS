"use client";

import { FileText } from 'lucide-react';

export function TaskLedgerWindow() {
  const tasks = [
    { id: 't_1847', agent: 'Writer', state: 'running', cost: 0.43, created: '2026-03-14 10:23' },
    { id: 't_1846', agent: 'Research', state: 'completed', cost: 0.89, created: '2026-03-14 10:15' },
    { id: 't_1845', agent: 'Editor', state: 'completed', cost: 0.21, created: '2026-03-14 10:02' },
    { id: 't_1844', agent: 'Writer', state: 'failed', cost: 0.12, created: '2026-03-14 09:58' },
    { id: 't_1843', agent: 'Research', state: 'running', cost: 0.67, created: '2026-03-14 09:45' },
    { id: 't_1842', agent: 'Publisher', state: 'completed', cost: 0.05, created: '2026-03-14 09:30' },
  ];

  const getStateColor = (state: string) => {
    switch (state) {
      case 'running': return 'text-blue-700 bg-blue-100';
      case 'completed': return 'text-green-700 bg-green-100';
      case 'failed': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Task Ledger</h2>
      </div>

      <div className="bg-white/60 backdrop-blur-sm rounded-lg border border-white/60 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white/80 border-b border-white/60">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Task ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Agent</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">State</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-700">Cost ($)</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-700">Created</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, i) => (
              <tr key={task.id} className={`border-b border-white/40 ${i % 2 === 0 ? 'bg-white/20' : 'bg-white/10'} hover:bg-white/30 transition-colors`}>
                <td className="py-3 px-4 text-sm font-mono text-gray-700">{task.id}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{task.agent}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold px-2 py-1 rounded ${getStateColor(task.state)}`}>
                    {task.state}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-700 text-right font-mono">${task.cost.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm text-gray-600 font-mono">{task.created}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 text-sm">
        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 flex-1 border border-white/60">
          <div className="text-gray-600">Total Tasks</div>
          <div className="text-2xl font-bold text-gray-800">{tasks.length}</div>
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 flex-1 border border-white/60">
          <div className="text-gray-600">Total Cost</div>
          <div className="text-2xl font-bold text-gray-800">${tasks.reduce((sum, t) => sum + t.cost, 0).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
