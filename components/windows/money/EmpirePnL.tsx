"use client";

import { TrendingUp, TrendingDown, Headphones, Camera, ShoppingBag, MapPin, Briefcase, LayoutDashboard } from 'lucide-react';

// TODO: wire to Redis `tenant:<id>:revenue` and `tenant:<id>:cost` keys via cost-profit-ledger skill
const EMPIRES = [
  { id: 'synaptive', name: 'Synaptive Sounds', icon: Headphones, revenue: 1240, cost: 187, trend: 8.4, color: 'from-purple-400/30 to-purple-600/30', accent: 'text-purple-700' },
  { id: 'digital_influencer', name: 'Digital Influencer', icon: Camera, revenue: 3420, cost: 624, trend: 22.1, color: 'from-pink-400/30 to-pink-600/30', accent: 'text-pink-700' },
  { id: 'digital_products', name: 'Digital Products', icon: ShoppingBag, revenue: 2180, cost: 142, trend: 14.2, color: 'from-orange-400/30 to-orange-600/30', accent: 'text-orange-700' },
  { id: 'localbiz', name: 'LocalBiz Growth', icon: MapPin, revenue: 4850, cost: 318, trend: 31.5, color: 'from-emerald-400/30 to-emerald-600/30', accent: 'text-emerald-700' },
  { id: 'freelance', name: 'Freelance Empire', icon: Briefcase, revenue: 1960, cost: 89, trend: -3.2, color: 'from-blue-400/30 to-blue-600/30', accent: 'text-blue-700' },
  { id: 'apogee_dashboard', name: 'Apogee Dashboard', icon: LayoutDashboard, revenue: 890, cost: 412, trend: 4.7, color: 'from-cyan-400/30 to-cyan-600/30', accent: 'text-cyan-700' },
];

export function EmpirePnL() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <TrendingUp className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Per-Empire P&amp;L</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">Mock data</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {EMPIRES.map((e) => {
          const net = e.revenue - e.cost;
          const margin = (net / e.revenue) * 100;
          const Up = e.trend >= 0 ? TrendingUp : TrendingDown;
          const trendColor = e.trend >= 0 ? 'text-emerald-700' : 'text-rose-700';
          const Icon = e.icon;
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
          ${EMPIRES.reduce((a, e) => a + (e.revenue - e.cost), 0).toLocaleString()}
        </span>
      </div>
    </div>
  );
}
