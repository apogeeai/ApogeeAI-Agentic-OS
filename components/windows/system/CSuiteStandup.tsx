'use client';

import { useState } from 'react';
import { Send, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useEndpoint } from '@/lib/useEndpoint';

interface ExecBrief {
  role: string;
  name: string;
  shipped: string[];
  blockers: string[];
  top3: string[];
  accent: string;
}

export function CSuiteStandup() {
  const [message, setMessage] = useState('');
  const { toast } = useToast();
  const { data } = useEndpoint<{ briefs: ExecBrief[]; backend: 'live' | 'fallback' }>(
    '/api/c-suite/standup',
    { intervalMs: 30_000 },
  );
  const briefs = data?.briefs ?? [];
  const isLive = data?.backend === 'live';

  const send = () => {
    const text = message.trim();
    if (!text) return;
    setMessage('');
    fetch('/api/c-suite-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
      .then((r) => r.json().catch(() => ({ ok: r.ok })))
      .then((d) => {
        if (d?.ok) {
          toast({ title: 'Brief sent to CEO', description: text.length > 80 ? `${text.slice(0, 80)}…` : text });
        } else {
          toast({ title: 'Brief failed', description: d?.error || 'Unknown error' });
        }
      })
      .catch(() => toast({ title: 'Brief failed', description: 'Network error' }));
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className="h-full flex flex-col text-gray-800">
      <div className="mb-4 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-gray-700" />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">Founder OS · C-Suite Standup</h2>
          <p className="text-xs text-gray-600">{today} · auto-generated overnight briefing</p>
        </div>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {isLive ? 'LIVE' : 'FALLBACK'}
        </span>
      </div>

      <div className="flex-1 overflow-auto pr-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {briefs.map((b) => (
          <div key={b.role} className={`bg-gradient-to-br ${b.accent} backdrop-blur-xl border border-white/60 rounded-xl p-3`}>
            <div className="flex items-baseline justify-between mb-2">
              <div className="text-sm font-bold">{b.role}</div>
              <div className="text-[10px] uppercase tracking-wider opacity-70">{b.name}</div>
            </div>
            <Section title="Shipped overnight" items={b.shipped} />
            <Section title="Blockers" items={b.blockers} />
            <Section title="Today's top 3" items={b.top3} ordered />
          </div>
        ))}
      </div>

      <div className="mt-3 sticky bottom-0">
        <div className="bg-white/60 backdrop-blur-xl border border-white/70 rounded-xl p-2 flex gap-2 items-center">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Send a brief to the C-Suite (e.g. 'Pivot DI to weekly carousels')"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500 px-2"
          />
          <button
            onClick={send}
            disabled={!message.trim()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-900 text-white text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-800"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, items, ordered }: { title: string; items: string[]; ordered?: boolean }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-2">
      <div className="text-[10px] uppercase tracking-wider opacity-60 mb-0.5">{title}</div>
      {ordered ? (
        <ol className="list-decimal list-inside text-xs space-y-0.5 marker:opacity-60">
          {items.map((it, i) => <li key={i}>{it}</li>)}
        </ol>
      ) : (
        <ul className="text-xs space-y-0.5">
          {items.map((it, i) => <li key={i} className="flex gap-1.5"><span className="opacity-50">·</span><span>{it}</span></li>)}
        </ul>
      )}
    </div>
  );
}
