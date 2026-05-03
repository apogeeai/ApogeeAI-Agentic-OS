"use client";

import { Receipt, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { useEndpoint } from '@/lib/useEndpoint';
import { TENANT_FIXTURES } from '@/lib/openclaw-fixtures';

interface Costs {
  dailyBurn: number;
  models: { model: string; spend: number; color: string; tag: string }[];
  tenants: { id: string; name: string; spent: number; budget: number }[];
  backend: 'live' | 'fallback';
}

const SEED_COSTS: Costs = { ...TENANT_FIXTURES.costs, backend: 'fallback' };

export function CostProfitLedger() {
  const { data } = useEndpoint<Costs>('/api/money/costs', { intervalMs: 30_000, initialData: SEED_COSTS });
  const { data: rev } = useEndpoint<{ todayGross: number }>('/api/money/revenue', { intervalMs: 30_000, initialData: { todayGross: TENANT_FIXTURES.revenue.todayGross } });

  const view = data ?? SEED_COSTS;
  const totalSpend = view.models.reduce((a, m) => a + m.spend, 0);
  const dailyBurn = view.dailyBurn;
  const dailyRevenue = rev?.todayGross ?? 0;
  const dailyNet = dailyRevenue - dailyBurn;
  const runwayDays = dailyNet > 0 ? Infinity : Math.floor(2400 / Math.max(1, Math.abs(dailyNet)));

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Receipt className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Cost &amp; Profit Ledger</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          {view.backend === 'live' ? 'LIVE' : 'FALLBACK'}
        </span>
      </div>

      <div className="grid grid-cols-1 @xs:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-rose-400/30 to-rose-600/30 backdrop-blur-sm rounded-lg p-3 border border-white/60">
          <div className="text-[10px] uppercase tracking-wider text-rose-800">Daily Burn</div>
          <div className="text-xl font-bold text-gray-900">${dailyBurn.toFixed(2)}</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 backdrop-blur-sm rounded-lg p-3 border border-white/60">
          <div className="text-[10px] uppercase tracking-wider text-emerald-800">Daily Net</div>
          <div className="text-xl font-bold text-gray-900">${dailyNet.toFixed(2)}</div>
        </div>
        <div className="bg-gradient-to-br from-amber-400/30 to-amber-600/30 backdrop-blur-sm rounded-lg p-3 border border-white/60">
          <div className="text-[10px] uppercase tracking-wider text-amber-800">Runway</div>
          <div className="text-xl font-bold text-gray-900">{runwayDays === Infinity ? '∞' : `${runwayDays}d`}</div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/60">
        <div className="text-xs font-semibold text-gray-700 mb-2">Token Spend by Model (30d)</div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={view.models} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="model" tick={{ fontSize: 10, fill: '#374151' }} width={130} />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', border: 'none', borderRadius: 8, fontSize: 11 }}
                formatter={(v: number) => [`$${v.toFixed(2)}`, 'Spend']} />
              <Bar dataKey="spend" radius={[0, 4, 4, 0]}>
                {view.models.map((m, i) => <Cell key={i} fill={m.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="text-[10px] text-gray-600 mt-1 text-right">Total: ${totalSpend.toFixed(2)} • Local rig saved ~$2,140</div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/60">
        <div className="text-xs font-semibold text-gray-700 mb-2">Per-Tenant Weekly Burn vs Budget</div>
        <div className="space-y-1.5">
          {view.tenants.map((t) => {
            const pct = t.budget > 0 ? (t.spent / t.budget) * 100 : 0;
            const over = pct > 90;
            return (
              <div key={t.id} className="text-xs">
                <div className="flex justify-between mb-0.5">
                  <span className="text-gray-700 flex items-center gap-1">
                    {over && <AlertCircle className="w-3 h-3 text-rose-600" />}
                    {t.name}
                  </span>
                  <span className="font-semibold text-gray-800">${t.spent.toFixed(2)} / ${t.budget}</span>
                </div>
                <div className="h-1.5 bg-white/50 rounded-full overflow-hidden">
                  <div className={`h-full ${over ? 'bg-gradient-to-r from-rose-400 to-rose-600' : pct > 70 ? 'bg-gradient-to-r from-amber-400 to-amber-600' : 'bg-gradient-to-r from-emerald-400 to-emerald-600'}`}
                    style={{ width: `${Math.min(100, pct)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
