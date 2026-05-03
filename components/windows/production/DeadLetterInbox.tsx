"use client";

import { useMemo, useState } from 'react';
import { AlertTriangle, RotateCw, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEndpoint, postJson } from '@/lib/useEndpoint';
import { TENANT_LABEL, TENANT_COLOR, type DeadLetterItem } from './mockData';

export function DeadLetterInbox() {
  const { toast } = useToast();
  const { data } = useEndpoint<{ items: DeadLetterItem[]; backend: 'live' | 'fallback' }>(
    '/api/production/dead-letter',
    { intervalMs: 15_000 },
  );
  // Track operator actions locally so polled server state doesn't resurrect items
  // that have already been retried/ignored.
  const [actedOn, setActedOn] = useState<Set<string>>(new Set());

  const items = useMemo(
    () => (data?.items ?? []).filter((it) => !actedOn.has(it.id)),
    [data, actedOn],
  );

  const groups = useMemo(() => {
    const map = new Map<string, DeadLetterItem[]>();
    for (const it of items) {
      const arr = map.get(it.reason) ?? [];
      arr.push(it);
      map.set(it.reason, arr);
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [items]);

  const act = async (id: string, decision: 'retry' | 'ignore') => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setActedOn((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
    try {
      await postJson('/api/production/dead-letter', { id, action: decision });
      toast({
        title: decision === 'retry' ? `Retrying: ${item.payload}` : `Ignored: ${item.payload}`,
        description: `${item.stream} — ${item.reason}`,
      });
    } catch (e) {
      // Restore item if the gateway rejected the action.
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
        <AlertTriangle className="w-5 h-5 text-rose-600" />
        <h2 className="text-lg font-bold text-gray-800">Dead-Letter Inbox</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          {items.length} stuck · {data?.backend === 'live' ? 'LIVE' : 'FALLBACK'}
        </span>
      </div>

      {items.length === 0 ? (
        <div className="bg-emerald-100/60 backdrop-blur-sm rounded-xl border border-emerald-300/60 p-6 text-center text-sm text-emerald-800">
          All clear. No dead-letter items.
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(([reason, list]) => (
            <div key={reason} className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 overflow-hidden">
              <div className="px-3 py-2 bg-rose-100/60 border-b border-white/60 flex items-center justify-between">
                <div className="text-xs font-bold text-rose-800">{reason}</div>
                <div className="text-[10px] text-rose-700 font-semibold">{list.length} items</div>
              </div>
              <div className="divide-y divide-white/60">
                {list.map((it) => (
                  <div key={it.id} className="px-3 py-2 flex items-center gap-2 text-xs">
                    <span className={`${TENANT_COLOR[it.tenant]} text-white text-[9px] font-bold px-1.5 py-0.5 rounded`}>
                      {TENANT_LABEL[it.tenant]}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="font-mono text-[11px] text-gray-800 truncate">{it.payload}</div>
                      <div className="text-[10px] text-gray-500">{it.stream} • {it.failedAt}</div>
                    </div>
                    <button onClick={() => act(it.id, 'retry')}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-emerald-500/90 text-white text-[10px] font-bold hover:bg-emerald-600">
                      <RotateCw className="w-3 h-3" /> Retry
                    </button>
                    <button onClick={() => act(it.id, 'ignore')}
                      className="flex items-center gap-1 px-2 py-1 rounded bg-gray-400/90 text-white text-[10px] font-bold hover:bg-gray-500">
                      <EyeOff className="w-3 h-3" /> Ignore
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
