"use client";

import { TrendingUp, ArrowRight } from 'lucide-react';

export function PipelineFlowWindow() {
  const stages = [
    { name: 'Briefs', count: 3, color: 'bg-blue-500', backpressure: 'low' },
    { name: 'Assembled', count: 1, color: 'bg-purple-500', backpressure: 'normal' },
    { name: 'Delivered', count: 0, color: 'bg-green-500', backpressure: 'none' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Pipeline Flow</h2>
      </div>

      <div className="flex items-center justify-between gap-4">
        {stages.map((stage, index) => (
          <div key={stage.name} className="flex items-center gap-4 flex-1">
            <div className="flex-1">
              <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 border border-white/60 text-center relative overflow-hidden">
                <div className={`absolute inset-0 ${stage.color} opacity-10`} />
                <div className="relative z-10">
                  <div className={`w-12 h-12 ${stage.color} rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold text-xl`}>
                    {stage.count}
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">{stage.name}</h3>
                  <div className="text-xs text-gray-600">
                    {stage.backpressure === 'low' && 'Low backpressure'}
                    {stage.backpressure === 'normal' && 'Normal flow'}
                    {stage.backpressure === 'none' && 'No backpressure'}
                  </div>
                </div>
              </div>
            </div>
            {index < stages.length - 1 && (
              <ArrowRight className="w-8 h-8 text-gray-400 flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/60">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Flow Metrics</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Throughput (24h)</span>
            <span className="text-sm font-semibold text-gray-800">247 tasks</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Avg Processing Time</span>
            <span className="text-sm font-semibold text-gray-800">8.3 min</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">Success Rate</span>
            <span className="text-sm font-semibold text-green-600">96.8%</span>
          </div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl p-4 border border-white/60">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Active Flows</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <div className="flex-1">
              <div className="text-sm text-gray-700">Brief #1847 → Assembled</div>
              <div className="text-xs text-gray-500">Writer Agent processing</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <div className="flex-1">
              <div className="text-sm text-gray-700">Assembled #1843 → Delivered</div>
              <div className="text-xs text-gray-500">Awaiting approval</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
