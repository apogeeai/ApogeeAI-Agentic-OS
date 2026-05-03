"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { CheckSquare, Check, X, Shield, ShieldAlert, ShieldX } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEndpoint, postJson } from '@/lib/useEndpoint';
import { TENANT_FIXTURES } from '@/lib/openclaw-fixtures';
import { TENANT_LABEL, TENANT_COLOR, type PendingItem } from './mockData';

const VERDICT_ICON = { pass: Shield, caution: ShieldAlert, flag: ShieldX };
const VERDICT_COLOR = { pass: 'text-emerald-700', caution: 'text-amber-700', flag: 'text-rose-700' };

function Card({ item, onDecide, isTop }: { item: PendingItem; onDecide: (decision: 'approve' | 'kill') => void; isTop: boolean }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const approveOpacity = useTransform(x, [0, 100], [0, 1]);
  const killOpacity = useTransform(x, [-100, 0], [1, 0]);
  const Verdict = VERDICT_ICON[item.wiggumVerdict];

  return (
    <motion.div
      drag={isTop ? 'x' : false}
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate }}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120) onDecide('approve');
        else if (info.offset.x < -120) onDecide('kill');
      }}
      animate={{ scale: isTop ? 1 : 0.95, y: isTop ? 0 : 12 }}
      className="absolute inset-0 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <div className="relative h-56 bg-gray-200">
        <img src={item.thumb} alt={item.title} className="w-full h-full object-cover" draggable={false} />
        <div className={`absolute top-2 left-2 ${TENANT_COLOR[item.tenant]} text-white text-[10px] font-bold px-2 py-0.5 rounded`}>
          {TENANT_LABEL[item.tenant]}
        </div>
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
          {item.tasteScore}/100
        </div>
        <motion.div style={{ opacity: approveOpacity }}
          className="absolute top-4 left-4 border-4 border-emerald-500 text-emerald-500 px-3 py-1 rounded-lg text-2xl font-black -rotate-12">
          PUBLISH
        </motion.div>
        <motion.div style={{ opacity: killOpacity }}
          className="absolute top-4 right-4 border-4 border-rose-500 text-rose-500 px-3 py-1 rounded-lg text-2xl font-black rotate-12">
          KILL
        </motion.div>
      </div>
      <div className="p-4">
        <div className="text-base font-bold text-gray-900 mb-2">{item.title}</div>
        <div className={`flex items-center gap-1 text-xs font-semibold mb-2 ${VERDICT_COLOR[item.wiggumVerdict]}`}>
          <Verdict className="w-3.5 h-3.5" /> Wiggum: {item.wiggumVerdict}
        </div>
        <div className="text-xs text-gray-600 line-clamp-3">{item.brief}</div>
      </div>
    </motion.div>
  );
}

export function ApprovalQueue() {
  const { toast } = useToast();
  const { data } = useEndpoint<{ items: PendingItem[]; backend: 'live' | 'fallback' }>(
    '/api/quality/approvals',
    { intervalMs: 15_000, initialData: { items: TENANT_FIXTURES.approvals as PendingItem[], backend: 'fallback' } },
  );
  // Track items the operator has acted on locally so polling doesn't reintroduce them.
  const [actedOn, setActedOn] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState({ approved: 0, killed: 0 });

  const queue = useMemo(
    () => (data?.items ?? []).filter((it) => !actedOn.has(it.id)),
    [data, actedOn],
  );

  const decide = useCallback((decision: 'approve' | 'kill') => {
    if (queue.length === 0) return;
    const head = queue[0];
    setActedOn((prev) => {
      const next = new Set(prev);
      next.add(head.id);
      return next;
    });
    setStats((s) => ({
      approved: s.approved + (decision === 'approve' ? 1 : 0),
      killed: s.killed + (decision === 'kill' ? 1 : 0),
    }));
    Promise.resolve().then(async () => {
      try {
        await postJson('/api/quality/approvals', { id: head.id, decision, tenant: head.tenant });
        toast({
          title: decision === 'approve' ? `Approved: ${head.title}` : `Killed: ${head.title}`,
          description: TENANT_LABEL[head.tenant],
        });
      } catch (e) {
        // Roll the optimistic action back if the server rejected it.
        setActedOn((prev) => {
          const next = new Set(prev);
          next.delete(head.id);
          return next;
        });
        setStats((s) => ({
          approved: s.approved - (decision === 'approve' ? 1 : 0),
          killed: s.killed - (decision === 'kill' ? 1 : 0),
        }));
        toast({
          title: 'Decision failed — restored',
          description: e instanceof Error ? e.message : 'Server error',
        });
      }
    });
  }, [queue, toast]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (e.key === 'ArrowRight') decide('approve');
      else if (e.key === 'ArrowLeft') decide('kill');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [decide]);

  const top = queue[0];
  const next = queue[1];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <CheckSquare className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Approval Queue</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">
          {queue.length} pending · ← kill / → publish · {data?.backend === 'live' ? 'LIVE' : 'FALLBACK'}
        </span>
      </div>

      <div className="grid grid-cols-3 @max-xs:grid-cols-1 gap-3">
        <div className="bg-emerald-100/60 rounded-lg p-2 border border-emerald-300/60 text-center">
          <div className="text-[10px] text-emerald-800 uppercase tracking-wider">Approved</div>
          <div className="text-xl font-bold text-gray-900">{stats.approved}</div>
        </div>
        <div className="bg-rose-100/60 rounded-lg p-2 border border-rose-300/60 text-center">
          <div className="text-[10px] text-rose-800 uppercase tracking-wider">Killed</div>
          <div className="text-xl font-bold text-gray-900">{stats.killed}</div>
        </div>
        <div className="bg-white/40 rounded-lg p-2 border border-white/60 text-center">
          <div className="text-[10px] text-gray-700 uppercase tracking-wider">Remaining</div>
          <div className="text-xl font-bold text-gray-900">{queue.length}</div>
        </div>
      </div>

      <div className="relative h-[420px] mx-auto max-w-sm">
        <AnimatePresence>
          {!top && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute inset-0 bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl flex flex-col items-center justify-center text-center p-6">
              <CheckSquare className="w-12 h-12 text-emerald-600 mb-2" />
              <div className="text-base font-bold text-gray-900">Queue empty</div>
              <div className="text-xs text-gray-600 mt-1">All caught up. Nice work.</div>
            </motion.div>
          )}
        </AnimatePresence>
        {next && <Card key={next.id} item={next} onDecide={decide} isTop={false} />}
        {top && <Card key={top.id} item={top} onDecide={decide} isTop={true} />}
      </div>

      {top && (
        <div className="flex items-center justify-center gap-4">
          <button onClick={() => decide('kill')}
            className="w-14 h-14 rounded-full bg-rose-500/90 text-white shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center justify-center" aria-label="Kill">
            <X className="w-7 h-7" />
          </button>
          <button onClick={() => decide('approve')}
            className="w-14 h-14 rounded-full bg-emerald-500/90 text-white shadow-lg hover:scale-110 active:scale-95 transition-transform flex items-center justify-center" aria-label="Approve">
            <Check className="w-7 h-7" />
          </button>
        </div>
      )}
    </div>
  );
}
