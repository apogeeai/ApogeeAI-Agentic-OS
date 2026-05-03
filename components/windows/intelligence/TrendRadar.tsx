"use client";

import { useState, useMemo } from 'react';
import { Radar, ArrowUp, ArrowDown, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEndpoint, postJson } from '@/lib/useEndpoint';
import type { TrendSignal } from './mockData';

type SortKey = 'name' | 'source' | 'peakInDays' | 'confidence' | 'expectedRevenue';

const SOURCE_COLOR: Record<string, string> = {
  TikTok: 'bg-rose-500/80',
  Instagram: 'bg-pink-500/80',
  Etsy: 'bg-orange-500/80',
  'X / Twitter': 'bg-slate-700/80',
  YouTube: 'bg-red-600/80',
  Reddit: 'bg-orange-600/80',
};

export function TrendRadar() {
  const { toast } = useToast();
  const { data } = useEndpoint<{ signals: TrendSignal[]; backend: 'live' | 'fallback' }>(
    '/api/intelligence/trends',
    { intervalMs: 30_000 },
  );
  const signals = data?.signals ?? [];
  const [sortKey, setSortKey] = useState<SortKey>('confidence');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [ridden, setRidden] = useState<Set<string>>(new Set());

  const sorted = useMemo(() => {
    const arr = [...signals];
    arr.sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [signals, sortKey, sortDir]);

  const toggleSort = (k: SortKey) => {
    if (k === sortKey) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir(k === 'name' || k === 'source' ? 'asc' : 'desc'); }
  };

  const ride = async (s: TrendSignal) => {
    setRidden((prev) => new Set(prev).add(s.id));
    try {
      await postJson('/api/intelligence/trends', { id: s.id });
      toast({ title: `Riding: ${s.name}`, description: `Spawned ride-task • ETA peak ${s.peakInDays}d` });
    } catch {
      toast({ title: 'Ride failed', description: 'API error' });
    }
  };

  const Th = ({ k, label, align }: { k: SortKey; label: string; align?: 'right' | 'left' }) => (
    <th onClick={() => toggleSort(k)}
      className={`cursor-pointer select-none px-2 py-1.5 text-[10px] uppercase tracking-wider text-gray-600 hover:text-gray-900 ${align === 'right' ? 'text-right' : 'text-left'}`}>
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === k && (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
      </span>
    </th>
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Radar className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Trend Radar</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          TrendScout · {signals.length} signals · {data?.backend === 'live' ? 'LIVE' : 'FALLBACK'}
        </span>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/40 border-b border-white/60">
            <tr>
              <Th k="name" label="Signal" />
              <Th k="source" label="Source" />
              <Th k="peakInDays" label="Peak" align="right" />
              <Th k="confidence" label="Conf" align="right" />
              <Th k="expectedRevenue" label="Est. Rev" align="right" />
              <th className="px-2 py-1.5"></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => {
              const isRidden = ridden.has(s.id);
              return (
                <tr key={s.id} className={`border-b border-white/40 hover:bg-white/40 ${isRidden ? 'opacity-50' : ''}`}>
                  <td className="px-2 py-1.5 text-gray-900 font-medium">{s.name}</td>
                  <td className="px-2 py-1.5">
                    <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded ${SOURCE_COLOR[s.source] ?? 'bg-gray-500/80'}`}>
                      {s.source}
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-right text-gray-800">{s.peakInDays}d</td>
                  <td className="px-2 py-1.5 text-right">
                    <span className={`font-bold ${s.confidence > 75 ? 'text-emerald-700' : s.confidence > 60 ? 'text-amber-700' : 'text-gray-700'}`}>
                      {s.confidence}%
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-right font-mono text-gray-900">${s.expectedRevenue.toLocaleString()}</td>
                  <td className="px-2 py-1.5 text-right">
                    <button disabled={isRidden} onClick={() => ride(s)}
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/90 text-white hover:bg-emerald-600 disabled:bg-gray-400 disabled:cursor-not-allowed">
                      <Zap className="w-3 h-3" /> {isRidden ? 'Riding' : 'Ride it'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
