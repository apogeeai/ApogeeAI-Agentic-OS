"use client";

import { useState, useMemo } from 'react';
import { TrendingDown, ArrowUp, ArrowDown } from 'lucide-react';
import { LEADS, type Lead } from './mockData';

type SortKey = 'business' | 'industry' | 'convertPct' | 'churnPct' | 'mrr';

function light(pct: number, kind: 'good' | 'bad') {
  // good = high convert good, bad = high churn bad
  const high = kind === 'good' ? pct >= 60 : pct <= 15;
  const mid = kind === 'good' ? pct >= 35 : pct <= 35;
  if (high) return { bg: 'bg-emerald-500', text: 'text-emerald-50' };
  if (mid) return { bg: 'bg-amber-500', text: 'text-amber-50' };
  return { bg: 'bg-rose-500', text: 'text-rose-50' };
}

export function ChurnForecast() {
  const [sortKey, setSortKey] = useState<SortKey>('convertPct');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    const arr = [...LEADS];
    arr.sort((a, b) => {
      const av = a[sortKey] as number | string;
      const bv = b[sortKey] as number | string;
      if (typeof av === 'number' && typeof bv === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return arr;
  }, [sortKey, sortDir]);

  const toggle = (k: SortKey) => {
    if (k === sortKey) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else { setSortKey(k); setSortDir(k === 'business' || k === 'industry' ? 'asc' : 'desc'); }
  };

  const Th = ({ k, label, align }: { k: SortKey; label: string; align?: 'right' }) => (
    <th
      onClick={() => toggle(k)}
      className={`cursor-pointer select-none px-2 py-1.5 text-[10px] uppercase tracking-wider text-gray-600 hover:text-gray-900 ${align === 'right' ? 'text-right' : 'text-left'}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === k && (sortDir === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
      </span>
    </th>
  );

  const totalPipeline = sorted.reduce((sum, l) => sum + (l.convertPct / 100) * l.mrr, 0);
  const atRisk = sorted.filter((l) => l.churnPct > 30).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <TrendingDown className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Churn / Lead-Quality Forecast</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          LocalBiz • next 14d • Mock
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3">
          <div className="text-[10px] uppercase tracking-wider text-gray-600">Pipeline (expected MRR)</div>
          <div className="text-lg font-bold text-emerald-700">${totalPipeline.toFixed(0)}</div>
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3">
          <div className="text-[10px] uppercase tracking-wider text-gray-600">Leads tracked</div>
          <div className="text-lg font-bold text-gray-900">{sorted.length}</div>
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3">
          <div className="text-[10px] uppercase tracking-wider text-gray-600">At-risk (churn &gt; 30%)</div>
          <div className="text-lg font-bold text-rose-700">{atRisk}</div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/40 border-b border-white/60">
            <tr>
              <Th k="business" label="Business" />
              <Th k="industry" label="Industry" />
              <Th k="convertPct" label="Convert 14d" align="right" />
              <Th k="churnPct" label="Churn 14d" align="right" />
              <Th k="mrr" label="MRR ($)" align="right" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((l: Lead) => {
              const c = light(l.convertPct, 'good');
              const k = light(l.churnPct, 'bad');
              return (
                <tr key={l.id} className="border-b border-white/40 hover:bg-white/40">
                  <td className="px-2 py-1.5 text-gray-900 font-medium">
                    {l.business} <span className="text-[10px] text-gray-500">• {l.city}</span>
                  </td>
                  <td className="px-2 py-1.5 text-gray-700">{l.industry}</td>
                  <td className="px-2 py-1.5 text-right">
                    <span className={`inline-block min-w-[44px] text-center font-bold text-[10px] px-1.5 py-0.5 rounded ${c.bg} ${c.text}`}>
                      {l.convertPct}%
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-right">
                    <span className={`inline-block min-w-[44px] text-center font-bold text-[10px] px-1.5 py-0.5 rounded ${k.bg} ${k.text}`}>
                      {l.churnPct}%
                    </span>
                  </td>
                  <td className="px-2 py-1.5 text-right font-mono text-gray-900">${l.mrr}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="text-[10px] text-gray-600 italic">
        TODO: replace mock with leads:scoring:* (xgboost) + 14d cohort decay model.
      </div>
    </div>
  );
}
