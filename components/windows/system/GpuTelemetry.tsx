'use client';

import { Cpu, Zap, Database, Layers } from 'lucide-react';
import { useEndpoint } from '@/lib/useEndpoint';

interface Metric {
  label: string;
  value: number;
  max: number;
  unit: string;
  color: string;
  sublabel?: string;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

export function GpuTelemetry() {
  const { data } = useEndpoint<{ metrics: Metric[]; backend: 'live' | 'fallback' }>(
    '/api/gpu/telemetry',
    { intervalMs: 2000 },
  );
  const metrics = data?.metrics ?? [];
  const isLive = data?.backend === 'live';

  const m = (i: number) => metrics[i]?.value ?? 0;

  return (
    <div className="h-full flex flex-col text-gray-800">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">GPU / Model Telemetry</h2>
          <p className="text-xs text-gray-600">Sage rig · vLLM · Ollama · ComfyUI · refreshed every 2s</p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {isLive ? 'LIVE' : 'FALLBACK'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <SummaryTile icon={<Cpu className="w-4 h-4" />} label="GPUs online" value="2 / 2" tone="emerald" />
        <SummaryTile icon={<Zap className="w-4 h-4" />} label="Total VRAM" value={`${(m(1) + m(3)).toFixed(1)} / 48 GB`} tone="sky" />
        <SummaryTile icon={<Layers className="w-4 h-4" />} label="vLLM queue" value={`${(m(4) + m(5)).toFixed(0)} req`} tone="violet" />
        <SummaryTile icon={<Database className="w-4 h-4" />} label="Ollama hit" value={`${m(6).toFixed(0)}%`} tone="amber" />
      </div>

      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 overflow-auto">
        {metrics.map((g) => (
          <Gauge key={`${g.label}-${g.sublabel}`} m={g} />
        ))}
      </div>
    </div>
  );
}

function SummaryTile({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: 'emerald' | 'sky' | 'violet' | 'amber' }) {
  const toneMap = {
    emerald: 'from-emerald-100/80 to-emerald-50/40 text-emerald-800',
    sky: 'from-sky-100/80 to-sky-50/40 text-sky-800',
    violet: 'from-violet-100/80 to-violet-50/40 text-violet-800',
    amber: 'from-amber-100/80 to-amber-50/40 text-amber-800',
  };
  return (
    <div className={`bg-gradient-to-br ${toneMap[tone]} backdrop-blur-xl border border-white/60 rounded-xl p-3`}>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider opacity-80">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-lg font-bold">{value}</div>
    </div>
  );
}

function Gauge({ m }: { m: Metric }) {
  const pct = clamp(m.value / m.max, 0, 1);
  const r = 44;
  const c = 2 * Math.PI * r;
  const dash = c * pct;

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-3 flex flex-col items-center justify-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 120 120" className="w-full h-full">
          <circle cx="60" cy="60" r={r} stroke="rgba(15,23,42,0.08)" strokeWidth="10" fill="none" />
          <circle
            cx="60"
            cy="60"
            r={r}
            stroke={m.color}
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${dash} ${c - dash}`}
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dasharray 1.6s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-lg font-bold text-gray-900 leading-none">
            {m.value.toFixed(m.unit === '' || m.unit === 'jobs' ? 0 : 1)}
            <span className="text-xs font-normal text-gray-600 ml-0.5">{m.unit}</span>
          </div>
          <div className="text-[10px] text-gray-500 mt-0.5">/ {m.max}{m.unit && m.unit !== 'jobs' ? m.unit : ''}</div>
        </div>
      </div>
      <div className="mt-2 text-center">
        <div className="text-xs font-semibold text-gray-900">{m.label}</div>
        {m.sublabel && <div className="text-[10px] text-gray-600">{m.sublabel}</div>}
      </div>
    </div>
  );
}
