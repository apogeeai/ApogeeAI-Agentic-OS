"use client";

import { Cpu, Activity } from 'lucide-react';

export function GPUMonitorWindow() {
  const gpus = [
    { id: 0, name: 'RTX 3090', vram: 18.2, total: 24, temp: 72, usage: 89 },
    { id: 1, name: 'RTX 3090', vram: 21.5, total: 24, temp: 78, usage: 95 },
    { id: 2, name: 'RTX 3090', vram: 14.8, total: 24, temp: 68, usage: 76 },
    { id: 3, name: 'RTX 3090', vram: 22.1, total: 24, temp: 82, usage: 98 },
    { id: 4, name: 'RTX 4090', vram: 16.3, total: 24, temp: 65, usage: 71 },
  ];

  const getTempColor = (temp: number) => {
    if (temp >= 80) return 'text-red-600';
    if (temp >= 70) return 'text-orange-600';
    return 'text-green-600';
  };

  const getUsageColor = (usage: number) => {
    if (usage >= 90) return 'bg-red-500';
    if (usage >= 70) return 'bg-orange-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Cpu className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">GPU Monitor</h2>
        <span className="ml-auto text-xs text-gray-600">192.168.0.200</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/60">
          <div className="text-xs text-gray-600">Total VRAM</div>
          <div className="text-xl font-bold text-gray-800">120 GB</div>
        </div>
        <div className="bg-white/40 backdrop-blur-sm rounded-lg p-3 border border-white/60">
          <div className="text-xs text-gray-600">In Use</div>
          <div className="text-xl font-bold text-gray-800">92.9 GB</div>
        </div>
      </div>

      <div className="space-y-3">
        {gpus.map(gpu => (
          <div key={gpu.id} className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-white/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-gray-800">GPU {gpu.id}: {gpu.name}</div>
                <div className="text-xs text-gray-600">VRAM: {gpu.vram.toFixed(1)} / {gpu.total} GB</div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-semibold ${getTempColor(gpu.temp)}`}>{gpu.temp}°C</div>
                <div className="text-xs text-gray-600">{gpu.usage}% usage</div>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>VRAM Usage</span>
                  <span>{((gpu.vram / gpu.total) * 100).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${(gpu.vram / gpu.total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>GPU Usage</span>
                  <span>{gpu.usage}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getUsageColor(gpu.usage)} transition-all`}
                    style={{ width: `${gpu.usage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
