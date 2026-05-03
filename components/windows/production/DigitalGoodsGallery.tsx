"use client";

import { useMemo, useState } from 'react';
import { Image as ImageIcon, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEndpoint, postJson } from '@/lib/useEndpoint';
import { TENANT_FIXTURES } from '@/lib/openclaw-fixtures';
import type { DigitalGood } from './mockData';

export function DigitalGoodsGallery() {
  const { toast } = useToast();
  const { data } = useEndpoint<{ goods: DigitalGood[]; backend: 'live' | 'fallback' }>(
    '/api/production/goods',
    { intervalMs: 60_000, initialData: { goods: TENANT_FIXTURES.goods as DigitalGood[], backend: 'fallback' } },
  );
  // Track approved/killed item ids so subsequent server polls don't bring them back.
  const [actedOn, setActedOn] = useState<Set<string>>(new Set());

  const items = useMemo(
    () => (data?.goods ?? []).filter((g) => !actedOn.has(g.id)),
    [data, actedOn],
  );

  const act = async (id: string, decision: 'ship' | 'kill') => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setActedOn((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    try {
      await postJson('/api/quality/approvals', {
        id, decision: decision === 'ship' ? 'approve' : 'kill', tenant: item.tenant,
      });
      toast({
        title: decision === 'ship' ? `Approved & shipping: ${item.title}` : `Killed: ${item.title}`,
        description: `${item.marketplace} • $${item.price}`,
      });
    } catch (e) {
      setActedOn((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      toast({
        title: 'Action failed — restored',
        description: e instanceof Error ? e.message : 'Server error',
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ImageIcon className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Digital Goods Gallery</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          {items.length} awaiting taste-gate · {data?.backend === 'live' ? 'LIVE' : 'FALLBACK'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-8 text-center text-sm text-gray-700">
          Inbox clear — no goods awaiting decision.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((g, i) => (
            <div key={g.id}
              className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 overflow-hidden break-inside-avoid"
              style={{ marginTop: i % 3 === 1 ? 12 : 0 }}>
              <div className="relative">
                <img src={g.thumb} alt={g.title} className="w-full object-cover" style={{ aspectRatio: i % 2 ? '4/5' : '1/1' }} />
                <div className="absolute top-1.5 right-1.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  ${g.price}
                </div>
                <div className="absolute top-1.5 left-1.5 bg-white/85 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded">
                  {g.marketplace}
                </div>
              </div>
              <div className="p-2.5">
                <div className="text-xs font-semibold text-gray-800 truncate">{g.title}</div>
                <div className="flex items-center justify-between mt-1 mb-2">
                  <span className="text-[10px] text-gray-600">Taste</span>
                  <span className={`text-xs font-bold ${g.tasteScore >= 0.85 ? 'text-emerald-700' : g.tasteScore >= 0.75 ? 'text-amber-700' : 'text-rose-700'}`}>
                    {g.tasteScore.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => act(g.id, 'ship')}
                    className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold py-1.5 rounded bg-emerald-500/90 text-white hover:bg-emerald-600">
                    <Check className="w-3 h-3" /> Approve &amp; Ship
                  </button>
                  <button onClick={() => act(g.id, 'kill')}
                    className="flex-1 flex items-center justify-center gap-1 text-[11px] font-bold py-1.5 rounded bg-rose-500/90 text-white hover:bg-rose-600">
                    <X className="w-3 h-3" /> Kill
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
