"use client";

import { Gauge, AlertTriangle } from 'lucide-react';
import { useEndpoint } from '@/lib/useEndpoint';
import { TENANT_LABEL, type Tenant } from './mockData';

interface DriftItem {
  tenant: Tenant;
  similarity: number;
  threshold: number;
  recentDrifted: { title: string; sim: number }[];
}

function ArcGauge({ value, threshold }: { value: number; threshold: number }) {
  const pct = Math.max(0, Math.min(1, value));
  const startAngle = -120;
  const endAngle = 120;
  const sweep = endAngle - startAngle;
  const angle = startAngle + sweep * pct;
  const r = 36;
  const cx = 50;
  const cy = 50;
  const polar = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [sx, sy] = polar(startAngle);
  const [ex, ey] = polar(endAngle);
  const [vx, vy] = polar(angle);
  const largeArc = sweep > 180 ? 1 : 0;
  const color = value < threshold ? '#e11d48' : value < threshold + 0.08 ? '#f59e0b' : '#10b981';

  return (
    <svg viewBox="0 0 100 70" className="w-full h-20">
      <path d={`M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`} stroke="rgba(0,0,0,0.1)" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d={`M ${sx} ${sy} A ${r} ${r} 0 0 1 ${vx} ${vy}`} stroke={color} strokeWidth="6" fill="none" strokeLinecap="round" />
      {(() => {
        const ta = startAngle + sweep * threshold;
        const [tx1, ty1] = polar(ta);
        const r2 = r + 5;
        const tx2 = cx + r2 * Math.cos((ta * Math.PI) / 180);
        const ty2 = cy + r2 * Math.sin((ta * Math.PI) / 180);
        return <line x1={tx1} y1={ty1} x2={tx2} y2={ty2} stroke="#1f2937" strokeWidth="1.5" />;
      })()}
      <text x={cx} y={cy + 4} textAnchor="middle" className="font-bold" fontSize="14" fill="#111827">
        {(value * 100).toFixed(0)}
      </text>
    </svg>
  );
}

export function BrandDriftMonitor() {
  const { data } = useEndpoint<{ drift: DriftItem[]; backend: 'live' | 'fallback' }>(
    '/api/quality/drift',
    { intervalMs: 60_000 },
  );
  const drift = data?.drift ?? [];
  const drifted = drift.filter((d) => d.similarity < d.threshold);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Gauge className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Brand Voice Drift Monitor</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          last 50 outputs · {data?.backend === 'live' ? 'LIVE' : 'FALLBACK'}
        </span>
      </div>

      {drifted.length > 0 && (
        <div className="bg-rose-100/60 border border-rose-300/60 rounded-lg p-2.5 flex items-center gap-2 text-xs text-rose-800">
          <AlertTriangle className="w-4 h-4" />
          <strong>{drifted.length}</strong> tenant{drifted.length > 1 ? 's' : ''} drifting below threshold:&nbsp;
          {drifted.map((d) => TENANT_LABEL[d.tenant]).join(', ')}
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        {drift.map((d) => {
          const isDrifting = d.similarity < d.threshold;
          return (
            <div key={d.tenant} className={`bg-white/40 backdrop-blur-sm rounded-xl border p-3 ${isDrifting ? 'border-rose-400' : 'border-white/60'}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="text-[11px] font-semibold text-gray-800 truncate">{TENANT_LABEL[d.tenant]}</div>
                {isDrifting && (
                  <span className="bg-rose-500/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">DRIFT</span>
                )}
              </div>
              <ArcGauge value={d.similarity} threshold={d.threshold} />
              <div className="text-[10px] text-gray-600 text-center mt-1">
                threshold {(d.threshold * 100).toFixed(0)}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3">
        <div className="text-xs font-semibold text-gray-700 mb-2">Most-Drifted Recent Outputs</div>
        <div className="space-y-2">
          {drift.flatMap((d) => d.recentDrifted.map((r) => ({ ...r, tenant: d.tenant })))
            .sort((a, b) => a.sim - b.sim)
            .slice(0, 3)
            .map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs bg-white/40 rounded p-2">
                <div className="min-w-0">
                  <div className="font-semibold text-gray-800 truncate">{r.title}</div>
                  <div className="text-[10px] text-gray-600">{TENANT_LABEL[r.tenant]}</div>
                </div>
                <div className={`font-bold ${r.sim < 0.7 ? 'text-rose-700' : 'text-amber-700'}`}>
                  {(r.sim * 100).toFixed(0)}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
