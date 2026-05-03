"use client";

import { Inbox, Check, X } from 'lucide-react';
import { useState } from 'react';

export function ApprovalInboxWindow() {
  const [approvals, setApprovals] = useState([
    { id: 1, task: 'Publish: "The Future of AI Agents"', agent: 'Publisher', reason: 'High-impact content, requires human review', created: '5m ago' },
    { id: 2, task: 'Deploy: API Update v2.3', agent: 'DevOps', reason: 'Production deployment requires approval', created: '12m ago' },
    { id: 3, task: 'Send: Newsletter to 50k subscribers', agent: 'Marketing', reason: 'Bulk email requires verification', created: '25m ago' },
  ]);

  const handleApprove = (id: number) => {
    setApprovals(approvals.filter(a => a.id !== id));
  };

  const handleReject = (id: number) => {
    setApprovals(approvals.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Inbox className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Approval Inbox</h2>
        <span className="ml-auto text-sm font-semibold text-orange-600">{approvals.length} pending</span>
      </div>

      <div className="space-y-3">
        {approvals.map(approval => (
          <div key={approval.id} className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/60 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">{approval.task}</h3>
                <div className="text-xs text-gray-600 mb-1">Agent: {approval.agent}</div>
                <div className="text-sm text-gray-700 mb-2">{approval.reason}</div>
                <div className="text-xs text-gray-500">{approval.created}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApprove(approval.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <Check className="w-4 h-4" />
                Approve
              </button>
              <button
                onClick={() => handleReject(approval.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      {approvals.length === 0 && (
        <div className="text-center py-12">
          <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No pending approvals</p>
        </div>
      )}
    </div>
  );
}
