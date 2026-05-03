"use client";

import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from 'recharts';

// TODO: wire to Redis stream `cost-profit-ledger` skill / tenant:*:revenue keys
const TENANTS = [
  { id: 'synaptive', name: 'Synaptive Sounds', mrr: 1240 },
  { id: 'digital_influencer', name: 'Digital Influencer', mrr: 3420 },
  { id: 'digital_products', name: 'Digital Products', mrr: 2180 },
  { id: 'localbiz', name: 'LocalBiz Growth', mrr: 4850 },
  { id: 'freelance', name: 'Freelance Empire', mrr: 1960 },
  { id: 'apogee_dashboard', name: 'Apogee Dashboard', mrr: 890 },
];

function seedSpark(seed: number, points: number = 30) {
  const out: { day: number; value: number }[] = [];
  let v = 100;
  for (let i = 0; i < points; i++) {
    v += Math.sin((i + seed) * 0.6) * 8 + (i * 1.4);
    out.push({ day: i, value: Math.round(v) });
  }
  return out;
}

export function RevenueTicker() {
  const totalMrr = TENANTS.reduce((a, t) => a + t.mrr, 0);
  const todayGross = 487;
  const yesterdayGross = 412;
  const weekGross = 3120;
  const monthGross = 14490;

  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 3000);
    return () => clearInterval(t);
  }, []);

  const spark = seedSpark(tick, 30);
  const dayDelta = ((todayGross - yesterdayGross) / yesterdayGross) * 100;

  const Delta = ({ pct }: { pct: number }) => (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${pct >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
      {pct >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {pct >= 0 ? '+' : ''}{pct.toFixed(1)}%
    </span>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Live Revenue Ticker</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">Mock data</span>
      </div>

      <div className="bg-gradient-to-br from-emerald-400/30 to-emerald-600/30 backdrop-blur-sm rounded-xl p-5 border border-white/60">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-xs text-emerald-800 font-semibold uppercase tracking-wider">Combined MRR</div>
            <div className="text-4xl font-bold text-gray-900 mt-1">${totalMrr.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-700">Today</div>
            <div className="text-2xl font-bold text-gray-900">${todayGross}</div>
            <Delta pct={dayDelta} />
          </div>
        </div>
        <div className="h-20 mt-3 -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={spark}>
              <XAxis dataKey="day" hide />
              <Tooltip
                contentStyle={{ background: 'rgba(255,255,255,0.9)', border: 'none', borderRadius: 8, fontSize: 11 }}
                formatter={(v: any) => [`$${v}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="value" stroke="#047857" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/60">
          <div className="text-[10px] uppercase tracking-wider text-gray-600">vs Yesterday</div>
          <div className="text-xl font-bold text-gray-800 mt-1">${todayGross - yesterdayGross}</div>
          <Delta pct={dayDelta} />
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/60">
          <div className="text-[10px] uppercase tracking-wider text-gray-600">Week-to-Date</div>
          <div className="text-xl font-bold text-gray-800 mt-1">${weekGross.toLocaleString()}</div>
          <Delta pct={12.4} />
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/60">
          <div className="text-[10px] uppercase tracking-wider text-gray-600">Month-to-Date</div>
          <div className="text-xl font-bold text-gray-800 mt-1">${monthGross.toLocaleString()}</div>
          <Delta pct={28.1} />
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/60">
        <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
          <DollarSign className="w-3 h-3" /> Per-Tenant MRR
        </div>
        <div className="space-y-1.5">
          {TENANTS.map((t) => {
            const pct = (t.mrr / totalMrr) * 100;
            return (
              <div key={t.id} className="flex items-center gap-2 text-xs">
                <div className="w-32 text-gray-700 truncate">{t.name}</div>
                <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600" style={{ width: `${pct}%` }} />
                </div>
                <div className="w-16 text-right font-semibold text-gray-800">${t.mrr.toLocaleString()}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
