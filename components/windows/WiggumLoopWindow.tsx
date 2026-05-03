"use client";

import { GitPullRequest, Check, X } from 'lucide-react';
import { useState } from 'react';

export function WiggumLoopWindow() {
  const [proposals, setProposals] = useState([
    { id: 1, title: 'Fix typo in auth.ts', file: 'src/auth.ts', diff: '+10 -2', type: 'bugfix', created: '3m ago' },
    { id: 2, title: 'Add error handling to API', file: 'src/api/routes.ts', diff: '+25 -5', type: 'enhancement', created: '15m ago' },
    { id: 3, title: 'Update dependencies', file: 'package.json', diff: '+8 -8', type: 'maintenance', created: '32m ago' },
  ]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'bugfix': return 'bg-red-100 text-red-700';
      case 'enhancement': return 'bg-blue-100 text-blue-700';
      case 'maintenance': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleApprove = (id: number) => {
    setProposals(proposals.filter(p => p.id !== id));
  };

  const handleReject = (id: number) => {
    setProposals(proposals.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <GitPullRequest className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Wiggum Loop</h2>
        <span className="ml-auto text-sm font-semibold text-purple-600">{proposals.length} pending</span>
      </div>

      <div className="bg-blue-50/80 backdrop-blur-sm rounded-lg p-3 border border-blue-200 mb-4">
        <p className="text-sm text-blue-800">
          Code change proposals from autonomous agents. Review and approve patches before they're applied.
        </p>
      </div>

      <div className="space-y-3">
        {proposals.map(proposal => (
          <div key={proposal.id} className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/60 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-gray-800">{proposal.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${getTypeColor(proposal.type)}`}>
                    {proposal.type}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-1 font-mono">{proposal.file}</div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-gray-600">{proposal.diff}</span>
                  <span className="text-gray-500">{proposal.created}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(proposal.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <Check className="w-4 h-4" />
                Apply Patch
              </button>
              <button
                onClick={() => handleReject(proposal.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors text-sm"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {proposals.length === 0 && (
        <div className="text-center py-12">
          <GitPullRequest className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No pending proposals</p>
        </div>
      )}
    </div>
  );
}
