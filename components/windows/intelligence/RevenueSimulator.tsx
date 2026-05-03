"use client";

import { useState, useMemo } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface Inputs {
  agents: number;
  budget: number;
  threshold: number;
}

function project(inputs: Inputs): { day: number; revenue: number }[] {
  // Mock formula: revenue scales sub-linearly with agents, linearly with budget,
  // and is dampened by a higher publish threshold (more selective = fewer publishes).
  const { agents, budget, threshold } = inputs;
  const agentFactor = Math.pow(agents, 0.7);
  const budgetFactor = budget / 1000;
  const thresholdFactor = Math.max(0.3, 1.4 - threshold / 100);
  const dailyBase = 18 * agentFactor * budgetFactor * thresholdFactor;
  const data: { day: number; revenue: number }[] = [];
  let cum = 0;
  for (let d = 1; d <= 90; d++) {
    const ramp = 1 - Math.exp(-d / 18);
    const noise = Math.sin(d * 0.4) * 0.05 + 1;
    cum += dailyBase * ramp * noise;
    data.push({ day: d, revenue: Math.round(cum) });
  }
  return data;
}

function SliderRow({ label, value, min, max, step, onChange, suffix }: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (n: number) => void; suffix?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs font-semibold text-gray-700">{label}</div>
        <div className="text-sm font-bold text-gray-900">{value.toLocaleString()}{suffix}</div>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Track className="bg-white/60 relative grow rounded-full h-1.5">
          <Slider.Range className="absolute bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-blue-600 rounded-full shadow hover:scale-110 transition-transform" />
      </Slider.Root>
    </div>
  );
}

export function RevenueSimulator() {
  const [inputs, setInputs] = useState<Inputs>({ agents: 12, budget: 5000, threshold: 70 });

  const data = useMemo(() => project(inputs), [inputs]);
  const r7 = data[6].revenue;
  const r30 = data[29].revenue;
  const r90 = data[89].revenue;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">What-If Revenue Simulator</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">Mock model</span>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3 space-y-3">
        <SliderRow label="Agents spawned" value={inputs.agents} min={1} max={60} step={1}
          onChange={(n) => setInputs({ ...inputs, agents: n })} />
        <SliderRow label="Weekly budget ($)" value={inputs.budget} min={500} max={25000} step={250}
          onChange={(n) => setInputs({ ...inputs, budget: n })} />
        <SliderRow label="Publish threshold" value={inputs.threshold} min={40} max={95} step={1}
          onChange={(n) => setInputs({ ...inputs, threshold: n })} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: '7-day', value: r7, color: 'from-blue-500 to-blue-600' },
          { label: '30-day', value: r30, color: 'from-emerald-500 to-emerald-600' },
          { label: '90-day', value: r90, color: 'from-violet-500 to-violet-600' },
        ].map((tile) => (
          <div key={tile.label} className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3">
            <div className="text-[10px] uppercase tracking-wider text-gray-600">{tile.label}</div>
            <div className={`text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r ${tile.color}`}>
              ${tile.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#374151' }} tickFormatter={(v: number) => `d${v}`} />
            <YAxis tick={{ fontSize: 10, fill: '#374151' }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(0,0,0,0.1)', borderRadius: 8, fontSize: 11 }}
              formatter={(v: number | string) => [`$${Number(v).toLocaleString()}`, 'Cumulative']}
              labelFormatter={(v: number | string) => `Day ${v}`}
            />
            <Area type="monotone" dataKey="revenue" stroke="#059669" strokeWidth={2} fill="url(#revFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-[10px] text-gray-600 italic">
        TODO: replace mock formula with regression on analytics:revenue:* + agent-count history.
      </div>
    </div>
  );
}
