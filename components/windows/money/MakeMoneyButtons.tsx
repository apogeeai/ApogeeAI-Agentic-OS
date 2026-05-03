"use client";

import { useToast } from '@/hooks/use-toast';
import { Zap, ShoppingBag, Mail, Video, Headphones, Briefcase, Sparkles } from 'lucide-react';

// TODO: wire to OpenClaw Gateway POST /briefs (port 18789 loopback) → c-suite.briefs Redis stream
const ACTIONS = [
  { label: 'Drop 10 Etsy Calendars', sub: 'Tastemaker → marketplace-product-factory', tenant: 'digital_products', icon: ShoppingBag, color: 'from-orange-400 to-orange-600' },
  { label: '5 Cold-Outreach Campaigns', sub: 'localbiz-growth-engine → email nurture', tenant: 'localbiz', icon: Mail, color: 'from-emerald-400 to-emerald-600' },
  { label: 'Spin Up 3 Shorts', sub: 'Synaptive 8D audio + LTX2 video', tenant: 'synaptive', icon: Video, color: 'from-purple-400 to-purple-600' },
  { label: 'Generate 8D Audio Pack', sub: 'audio-spatial-engine → 432Hz/528Hz', tenant: 'synaptive', icon: Headphones, color: 'from-indigo-400 to-indigo-600' },
  { label: 'Find & Apply 5 Fiverr Gigs', sub: 'freelance-delivery-engine → gsd_runner', tenant: 'freelance', icon: Briefcase, color: 'from-blue-400 to-blue-600' },
  { label: 'Create 10 IG Influencer Posts', sub: 'di-image-pipeline V6 + ComfyUI', tenant: 'digital_influencer', icon: Sparkles, color: 'from-pink-400 to-pink-600' },
];

export function MakeMoneyButtons() {
  const { toast } = useToast();

  const fire = (label: string, tenant: string) => {
    // TODO: POST { action: label, tenant } to OpenClaw Gateway → c-suite.briefs
    toast({
      title: `Brief queued: ${label}`,
      description: `tenant:${tenant}:briefs`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-5 h-5 text-gray-700" />
        <h2 className="text-lg font-bold text-gray-800">Make Me Money</h2>
        <span className="ml-auto text-[10px] uppercase tracking-wider text-gray-500">One-click briefs</span>
      </div>

      <div className="text-xs text-gray-700 bg-amber-100/60 border border-amber-300/60 rounded-lg p-2.5">
        Tap any button to dispatch a brief to the OpenClaw Gateway. The full agent swarm picks it up, vets it through Wiggum, scores via Tastemaker, and ships when it clears the gate.
      </div>

      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <button
              key={a.label}
              onClick={() => fire(a.label, a.tenant)}
              className={`group relative overflow-hidden rounded-xl border border-white/60 p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98]`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${a.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <Icon className="w-6 h-6 text-white mb-2 drop-shadow" />
                <div className="text-sm font-bold text-white drop-shadow">{a.label}</div>
                <div className="text-[10px] text-white/85 mt-0.5">{a.sub}</div>
                <div className="text-[10px] text-white/70 mt-1 font-mono">tenant:{a.tenant}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
