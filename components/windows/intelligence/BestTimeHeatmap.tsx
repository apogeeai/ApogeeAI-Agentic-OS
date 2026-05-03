"use client";

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEndpoint, postJson } from '@/lib/useEndpoint';
import { PLATFORMS, TENANTS, TENANT_LABEL, DAY_LABELS, type Tenant, type Platform } from './mockData';

function cellColor(v: number): string {
  if (v < 25) return 'rgba(225,29,72,0.55)';
  if (v < 45) return 'rgba(245,158,11,0.55)';
  if (v < 65) return 'rgba(234,179,8,0.55)';
  if (v < 80) return 'rgba(132,204,22,0.7)';
  return 'rgba(16,185,129,0.85)';
}

export function BestTimeHeatmap() {
  const { toast } = useToast();
  const [tenant, setTenant] = useState<Tenant>('digital_influencer');
  const [platform, setPlatform] = useState<Platform>('Instagram');
  const [selected, setSelected] = useState<{ d: number; h: number } | null>(null);

  const { data } = useEndpoint<{ matrix: number[][]; backend: 'live' | 'fallback' }>(
    `/api/intelligence/heatmap?tenant=${encodeURIComponent(tenant)}&platform=${encodeURIComponent(platform)}`,
  );
  const matrix = data?.matrix ?? [];

  const schedule = (d: number, h: number) => setSelected({ d, h });

  const confirmSchedule = async () => {
    if (!selected) return;
    try {
      await postJson('/api/intelligence/schedule', { tenant, platform, day: selected.d, hour: selected.h });
      toast({ title: 'Slot reserved', description: `${TENANT_LABEL[tenant]} • ${platform} • ${DAY_LABELS[selected.d]} ${selected.h}:00` });
    } catch {
      toast({ title: 'Schedule failed', description: 'API error' });
    }
    setSelected(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Calendar className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Best-Time-To-Post Predictor</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          {data?.backend === 'live' ? 'LIVE' : 'FALLBACK'}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <select value={tenant}
          onChange={(e) => { setTenant(e.target.value as Tenant); setSelected(null); }}
          className="text-xs bg-white/60 border border-white/70 rounded px-2 py-1 text-gray-800">
          {TENANTS.map((t) => <option key={t} value={t}>{TENANT_LABEL[t]}</option>)}
        </select>
        <select value={platform}
          onChange={(e) => { setPlatform(e.target.value as Platform); setSelected(null); }}
          className="text-xs bg-white/60 border border-white/70 rounded px-2 py-1 text-gray-800">
          {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3 overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex items-center pl-9">
            {Array.from({ length: 24 }).map((_, h) => (
              <div key={h} className="w-5 text-[8px] text-center text-gray-600">{h}</div>
            ))}
          </div>
          {matrix.map((row, d) => (
            <div key={d} className="flex items-center mt-1">
              <div className="w-9 text-[10px] font-semibold text-gray-700">{DAY_LABELS[d]}</div>
              {row.map((v, h) => {
                const isSel = selected?.d === d && selected?.h === h;
                return (
                  <button key={h} onClick={() => schedule(d, h)}
                    title={`${DAY_LABELS[d]} ${h}:00 — ${v} engagement`}
                    className={`w-5 h-5 m-px rounded-sm transition-transform hover:scale-125 hover:z-10 relative ${isSel ? 'ring-2 ring-blue-600 z-20' : ''}`}
                    style={{ background: cellColor(v) }} />
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 text-[10px] text-gray-600">
          <span>Low</span>
          <div className="flex">
            {[15, 35, 55, 70, 90].map((v) => (
              <div key={v} className="w-4 h-3" style={{ background: cellColor(v) }} />
            ))}
          </div>
          <span>High</span>
        </div>
      </div>

      {selected && matrix[selected.d] && (
        <div className="bg-blue-100/70 border border-blue-300 rounded-xl p-3 flex items-center gap-3">
          <div className="text-xs text-gray-800 flex-1">
            <div className="font-bold">{TENANT_LABEL[tenant]} • {platform}</div>
            <div>{DAY_LABELS[selected.d]} at {selected.h}:00 — predicted engagement {matrix[selected.d][selected.h]}</div>
          </div>
          <button onClick={confirmSchedule} className="text-xs font-bold px-3 py-1.5 rounded bg-blue-600 text-white hover:bg-blue-700">
            Schedule a post
          </button>
          <button onClick={() => setSelected(null)} className="text-xs px-2 py-1.5 rounded bg-white/80 text-gray-700 hover:bg-white">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
