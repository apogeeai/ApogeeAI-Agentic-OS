"use client";

import { TrendingUp, TrendingDown, Headphones, Camera, ShoppingBag, MapPin, Briefcase, LayoutDashboard, type LucideIcon } from 'lucide-react';
import { useEndpoint } from '@/lib/useEndpoint';

interface EmpireRow {
  id: string;
  name: string;
  icon: string;
  revenue: number;
  cost: number;
  trend: number;
  color: string;
  accent: string;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Headphones, Camera, ShoppingBag, MapPin, Briefcase, LayoutDashboard,
};

export function EmpirePnL() {
  const { data } = useEndpoint<{ empires: EmpireRow[]; backend: 'live' | 'fallback' }>(
    '/api/money/empires',
    { intervalMs: 30_000 },
  );
  const empires = data?.empires ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Per-Empire P&amp;L</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          {data?.backend === 'live' ? 'LIVE' : 'FALLBACK'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {empires.map((e) => {
          const net = e.revenue - e.cost;
          const margin = e.revenue > 0 ? (net / e.revenue) * 100 : 0;
          const Up = e.trend >= 0 ? TrendingUp : TrendingDown;
          const trendColor = e.trend >= 0 ? 'text-emerald-700' : 'text-rose-700';
          const Icon = ICON_MAP[e.icon] || LayoutDashboard;
          return (
            <div key={e.id} className={`bg-gradient-to-br ${e.color} backdrop-blur-sm rounded-xl p-4 border border-white/60`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${e.accent}`} />
                  <div className={`text-xs font-semibold ${e.accent}`}>{e.name}</div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${trendColor}`}>
                  <Up className="w-3 h-3" />
                  {e.trend >= 0 ? '+' : ''}{e.trend.toFixed(1)}%
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-semibold text-gray-800">${e.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-600">AI Cost</span>
                  <span className="font-semibold text-rose-700">-${e.cost.toLocaleString()}</span>
                </div>
                <div className="border-t border-white/60 pt-1.5 flex justify-between">
                  <span className="text-xs font-bold text-gray-700">Net</span>
                  <div className="text-right">
                    <div className="text-base font-bold text-gray-900">${net.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-600">{margin.toFixed(0)}% margin</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3 border border-white/60 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-700">Total Net (all empires)</span>
        <span className="text-xl font-bold text-emerald-700">
          ${empires.reduce((a, e) => a + (e.revenue - e.cost), 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
