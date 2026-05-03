"use client";

import { useMemo, useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { BarChart3 } from 'lucide-react';
import { SCORES_24H, TENANT_LABEL, type Tenant } from './mockData';

const TENANT_FILL: Record<Tenant, string> = {
  synaptive: '#a855f7',
  digital_influencer: '#ec4899',
  digital_products: '#f97316',
  localbiz: '#10b981',
  freelance: '#3b82f6',
  apogee_dashboard: '#06b6d4',
};

const BUCKET_COUNT = 10;
const DEFAULT_THRESHOLD = 70;

export function TastemakerHistogram() {
  const [threshold, setThreshold] = useState(DEFAULT_THRESHOLD);

  const buckets = useMemo(() => {
    const arr: Record<Tenant, number>[] = Array.from({ length: BUCKET_COUNT }, () => ({
      synaptive: 0, digital_influencer: 0, digital_products: 0, localbiz: 0, freelance: 0, apogee_dashboard: 0,
    } as Record<Tenant, number>));
    for (const { tenant, score } of SCORES_24H) {
      const idx = Math.min(BUCKET_COUNT - 1, Math.floor(score / (100 / BUCKET_COUNT)));
      arr[idx][tenant] += 1;
    }
    return arr;
  }, []);

  const maxBucketTotal = useMemo(
    () => Math.max(...buckets.map((b) => Object.values(b).reduce((a, n) => a + n, 0))),
    [buckets]
  );

  const wouldPublishDefault = SCORES_24H.filter((s) => s.score >= DEFAULT_THRESHOLD).length;
  const wouldPublishNow = SCORES_24H.filter((s) => s.score >= threshold).length;
  const delta = wouldPublishNow - wouldPublishDefault;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Tastemaker Score Distribution</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          {SCORES_24H.length} scores • last 24h • Mock
        </span>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-4">
        <div className="relative h-56">
          <div className="absolute inset-0 flex items-end gap-1.5">
            {buckets.map((b, i) => {
              const total = Object.values(b).reduce((a, n) => a + n, 0);
              const h = (total / maxBucketTotal) * 100;
              const bucketScore = i * (100 / BUCKET_COUNT);
              const isAboveThreshold = bucketScore + (100 / BUCKET_COUNT) > threshold;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end relative h-full">
                  <div className={`w-full flex flex-col-reverse rounded-t-sm overflow-hidden transition-all ${isAboveThreshold ? '' : 'opacity-40'}`} style={{ height: `${h}%` }}>
                    {(Object.keys(b) as Tenant[]).map((t) => {
                      const segH = total > 0 ? (b[t] / total) * 100 : 0;
                      if (segH === 0) return null;
                      return <div key={t} style={{ height: `${segH}%`, background: TENANT_FILL[t] }} />;
                    })}
                  </div>
                  <div className="text-[9px] text-gray-600 mt-1">{i * 10}</div>
                </div>
              );
            })}
          </div>
          <div
            className="absolute top-0 bottom-5 w-0.5 bg-rose-600 pointer-events-none"
            style={{ left: `${threshold}%` }}
          >
            <div className="absolute -top-1 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
              {threshold}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-semibold text-gray-700">Publish threshold: <span className="text-base text-gray-900">{threshold}</span></div>
          <button onClick={() => setThreshold(DEFAULT_THRESHOLD)} className="text-[10px] text-gray-600 underline hover:text-gray-800">reset</button>
        </div>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-5"
          value={[threshold]}
          onValueChange={(v) => setThreshold(v[0])}
          min={0}
          max={100}
          step={1}
        >
          <Slider.Track className="bg-white/60 relative grow rounded-full h-1.5">
            <Slider.Range className="absolute bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full h-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-4 h-4 bg-white border-2 border-emerald-600 rounded-full shadow hover:scale-110 transition-transform" />
        </Slider.Root>
        <div className="mt-3 text-xs text-gray-700">
          Would publish <strong>{wouldPublishNow}</strong> of {SCORES_24H.length} scores
          {delta !== 0 && (
            <span className={`ml-2 font-bold ${delta > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              ({delta > 0 ? '+' : ''}{delta} vs default)
            </span>
          )}
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-3">
        <div className="text-[10px] uppercase tracking-wider text-gray-600 mb-2">Legend</div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(TENANT_FILL) as Tenant[]).map((t) => (
            <div key={t} className="flex items-center gap-1 text-[10px] text-gray-700">
              <div className="w-3 h-3 rounded" style={{ background: TENANT_FILL[t] }} />
              {TENANT_LABEL[t]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
