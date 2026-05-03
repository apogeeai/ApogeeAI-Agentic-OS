"use client";

import { GitBranch, AlertCircle } from 'lucide-react';
import { useEndpoint } from '@/lib/useEndpoint';
import { TENANT_FIXTURES } from '@/lib/openclaw-fixtures';
import type { PipelineStage } from './mockData';

export function PipelineHeatmap() {
  const { data } = useEndpoint<{ stages: PipelineStage[]; backend: 'live' | 'fallback' }>(
    '/api/production/pipeline',
    { intervalMs: 5000, initialData: { stages: TENANT_FIXTURES.pipeline as PipelineStage[], backend: 'fallback' } },
  );
  const stages = data?.stages ?? [];
  const maxInflight = Math.max(1, ...stages.map((s) => s.inflight));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <GitBranch className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Pipeline Flow Heatmap</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          Live queue depth · {data?.backend === 'live' ? 'LIVE' : 'FALLBACK'}
        </span>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-4">
        <div className="text-xs font-semibold text-gray-700 mb-3">Brief → Delivery Flow</div>
        <div className="flex items-stretch gap-1.5 h-48">
          {stages.map((s, i) => {
            const ratio = s.inflight / maxInflight;
            const heightPct = Math.max(20, ratio * 100);
            const barColor = s.bottleneck
              ? 'from-rose-400 to-rose-600'
              : ratio > 0.6 ? 'from-amber-400 to-amber-600' : 'from-emerald-400 to-emerald-600';
            return (
              <div key={s.id} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex-1 w-full flex items-end relative">
                  <div className={`w-full rounded-t-md bg-gradient-to-t ${barColor} relative shadow-md transition-all`}
                    style={{ height: `${heightPct}%` }}>
                    {s.bottleneck && (
                      <AlertCircle className="absolute -top-5 left-1/2 -translate-x-1/2 w-4 h-4 text-rose-600 animate-pulse" />
                    )}
                    <div className="absolute inset-x-0 top-1.5 text-center text-[11px] font-bold text-white drop-shadow">
                      {s.inflight}
                    </div>
                  </div>
                  {i < stages.length - 1 && (
                    <div className="absolute -right-1.5 top-1/2 text-gray-500 text-xs z-10">→</div>
                  )}
                </div>
                <div className="text-[10px] font-semibold text-gray-700 text-center leading-tight">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-100/60 backdrop-blur-sm rounded-lg p-3 border border-emerald-300/60">
          <div className="text-[10px] uppercase tracking-wider text-emerald-800">Total in-flight</div>
          <div className="text-xl font-bold text-gray-900">{stages.reduce((a, s) => a + s.inflight, 0)}</div>
        </div>
        <div className="bg-rose-100/60 backdrop-blur-sm rounded-lg p-3 border border-rose-300/60">
          <div className="text-[10px] uppercase tracking-wider text-rose-800">Bottlenecks</div>
          <div className="text-xl font-bold text-gray-900">
            {stages.filter((s) => s.bottleneck).map((s) => s.label).join(', ') || 'None'}
          </div>
        </div>
        <div className="bg-amber-100/60 backdrop-blur-sm rounded-lg p-3 border border-amber-300/60">
          <div className="text-[10px] uppercase tracking-wider text-amber-800">Throughput / hr</div>
          <div className="text-xl font-bold text-gray-900">~47</div>
        </div>
      </div>
    </div>
  );
}
