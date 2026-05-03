'use client';

import { useEffect, useState } from 'react';
import { Cpu, Zap, Database, Layers } from 'lucide-react';

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

function drift(prev: number, max: number, volatility = 0.08) {
  const delta = (Math.random() - 0.5) * max * volatility;
  return clamp(prev + delta, max * 0.05, max * 0.98);
}

export function GpuTelemetry() {
  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Sage RTX 3090', sublabel: 'GPU utilisation', value: 64, max: 100, unit: '%', color: '#10b981' },
    { label: 'Sage RTX 3090', sublabel: 'VRAM 24GB', value: 18.2, max: 24, unit: 'GB', color: '#0ea5e9' },
    { label: 'Sage RTX 4090', sublabel: 'GPU utilisation', value: 81, max: 100, unit: '%', color: '#10b981' },
    { label: 'Sage RTX 4090', sublabel: 'VRAM 24GB', value: 21.4, max: 24, unit: 'GB', color: '#0ea5e9' },
    { label: 'vLLM :8000', sublabel: 'Queue depth', value: 3, max: 32, unit: '', color: '#8b5cf6' },
    { label: 'vLLM :8001', sublabel: 'Queue depth', value: 7, max: 32, unit: '', color: '#8b5cf6' },
    { label: 'Ollama', sublabel: 'Cache hit rate', value: 92, max: 100, unit: '%', color: '#f59e0b' },
    { label: 'ComfyUI', sublabel: 'Throughput / min', value: 14, max: 40, unit: 'jobs', color: '#ec4899' },
  ]);

  useEffect(() => {
    const id = setInterval(() => {
      setMetrics((prev) => prev.map((m) => ({ ...m, value: Number(drift(m.value, m.max).toFixed(1)) })));
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="h-full flex flex-col text-gray-800">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900">GPU / Model Telemetry</h2>
        <p className="text-xs text-gray-600">Sage rig · vLLM · Ollama · ComfyUI · refreshed every 2s</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <SummaryTile icon={<Cpu className="w-4 h-4" />} label="GPUs online" value="2 / 2" tone="emerald" />
        <SummaryTile icon={<Zap className="w-4 h-4" />} label="Total VRAM" value={`${(metrics[1].value + metrics[3].value).toFixed(1)} / 48 GB`} tone="sky" />
        <SummaryTile icon={<Layers className="w-4 h-4" />} label="vLLM queue" value={`${(metrics[4].value + metrics[5].value).toFixed(0)} req`} tone="violet" />
        <SummaryTile icon={<Database className="w-4 h-4" />} label="Ollama hit" value={`${metrics[6].value.toFixed(0)}%`} tone="amber" />
      </div>

      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-3 overflow-auto">
        {metrics.map((m) => (
          <Gauge key={`${m.label}-${m.sublabel}`} m={m} />
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
  const angle = -90;

  return (
    <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-3 flex flex-col items-center justify-center">
      <div className="relative w-28 h-28">
        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-0">
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
            transform={`rotate(${angle} 60 60)`}
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
