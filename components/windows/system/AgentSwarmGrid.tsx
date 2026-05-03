'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, X } from 'lucide-react';

type AgentStatus = 'idle' | 'working' | 'errored' | 'offline';

interface Agent {
  name: string;
  tier: 'core' | 'sub';
  role: string;
  status: AgentStatus;
}

const CORE_AGENTS: Omit<Agent, 'status'>[] = [
  { name: 'DIRECTOR', tier: 'core', role: 'Routes & decomposes' },
  { name: 'MAKER', tier: 'core', role: 'Creative production' },
  { name: 'BUILDER', tier: 'core', role: 'Code & infra' },
  { name: 'SELLER', tier: 'core', role: 'Distribution' },
  { name: 'OPS', tier: 'core', role: 'Daily operations' },
  { name: 'WIGGUM', tier: 'core', role: 'Brand/compliance gate' },
  { name: 'SKILL_REVIEWER', tier: 'core', role: 'Skill bundle review' },
];

const SUB_AGENTS: Omit<Agent, 'status'>[] = [
  { name: 'gsd_runner', tier: 'sub', role: 'CEO.Decomposer' },
  { name: 'claudia', tier: 'sub', role: 'Owner briefing' },
  { name: 'trendscout', tier: 'sub', role: 'Trend research' },
  { name: 'creative', tier: 'sub', role: 'Brief authoring' },
  { name: 'tastemaker', tier: 'sub', role: 'Quality scoring' },
  { name: 'designer', tier: 'sub', role: 'ComfyUI assets' },
  { name: 'audio', tier: 'sub', role: '8D / binaural' },
  { name: 'editor', tier: 'sub', role: 'Video assembly' },
  { name: 'twitter_analyst', tier: 'sub', role: 'X content analysis' },
  { name: 'community', tier: 'sub', role: 'Community ops' },
  { name: 'rss_brief_agent', tier: 'sub', role: 'RSS monitoring' },
  { name: 'prospector', tier: 'sub', role: 'Lead sourcing' },
  { name: 'outreach_writer', tier: 'sub', role: 'Cold outreach' },
  { name: 'retention_agent', tier: 'sub', role: 'Churn save' },
];

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const STATUSES: AgentStatus[] = ['idle', 'working', 'working', 'idle', 'errored', 'offline', 'working'];

function seedAgents(): Agent[] {
  const rnd = mulberry32(42);
  return [...CORE_AGENTS, ...SUB_AGENTS].map((a) => ({
    ...a,
    status: STATUSES[Math.floor(rnd() * STATUSES.length)],
  }));
}

const STATUS_STYLES: Record<AgentStatus, { dot: string; ring: string; label: string; pulse: boolean }> = {
  idle: { dot: 'bg-emerald-400', ring: 'ring-emerald-300/50', label: 'Idle', pulse: false },
  working: { dot: 'bg-amber-400', ring: 'ring-amber-300/60', label: 'Working', pulse: true },
  errored: { dot: 'bg-rose-500', ring: 'ring-rose-400/60', label: 'Errored', pulse: false },
  offline: { dot: 'bg-slate-400', ring: 'ring-slate-300/40', label: 'Offline', pulse: false },
};

function makeLogs(name: string, status: AgentStatus): string[] {
  const rnd = mulberry32(name.length * 17 + status.length);
  const verbs = ['claimed task', 'emitted KPI', 'scored 78', 'pushed draft', 'requested LLM', 'spawned subtask', 'wrote memory', 'ack brief', 'heartbeat'];
  const out: string[] = [];
  for (let i = 0; i < 50; i++) {
    const t = new Date(Date.now() - i * 1000 * 47).toISOString().slice(11, 19);
    const v = verbs[Math.floor(rnd() * verbs.length)];
    const id = Math.floor(rnd() * 9999).toString().padStart(4, '0');
    out.push(`[${t}] ${name} ${v} task#${id}`);
  }
  if (status === 'errored') out.unshift(`[${new Date().toISOString().slice(11, 19)}] ${name} ERROR redis: connection reset`);
  return out;
}

export function AgentSwarmGrid() {
  const [agents, setAgents] = useState<Agent[]>(() => seedAgents());
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setAgents((prev) => {
        const next = [...prev];
        const i = Math.floor(Math.random() * next.length);
        const opts: AgentStatus[] = ['idle', 'working', 'working', 'errored', 'offline'];
        next[i] = { ...next[i], status: opts[Math.floor(Math.random() * opts.length)] };
        return next;
      });
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const selectedAgent = useMemo(() => agents.find((a) => a.name === selected) || null, [agents, selected]);
  const logs = useMemo(() => (selectedAgent ? makeLogs(selectedAgent.name, selectedAgent.status) : []), [selectedAgent]);

  const counts = useMemo(() => {
    const c: Record<AgentStatus, number> = { idle: 0, working: 0, errored: 0, offline: 0 };
    agents.forEach((a) => { c[a.status]++; });
    return c;
  }, [agents]);

  return (
    <div className="h-full flex flex-col text-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Agent Swarm Status</h2>
          <p className="text-xs text-gray-600">7 core agents · 14 sub-agents · live status</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {(Object.keys(counts) as AgentStatus[]).map((k) => (
            <span key={k} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/40 backdrop-blur-xl border border-white/60">
              <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[k].dot}`} />
              <span className="capitalize">{k}</span>
              <span className="font-mono text-gray-900">{counts[k]}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 min-h-0">
        <div className={`${selected ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-4 overflow-auto`}>
          <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Core agents</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 mb-5">
            {agents.filter((a) => a.tier === 'core').map((a) => (
              <AgentNode key={a.name} agent={a} active={selected === a.name} onClick={() => setSelected(a.name)} />
            ))}
          </div>
          <div className="text-[11px] uppercase tracking-wider text-gray-500 mb-2">Sub-agents</div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {agents.filter((a) => a.tier === 'sub').map((a) => (
              <AgentNode key={a.name} agent={a} active={selected === a.name} onClick={() => setSelected(a.name)} />
            ))}
          </div>
        </div>

        {selected && selectedAgent && (
          <div className="bg-white/50 backdrop-blur-xl border border-white/60 rounded-xl p-4 flex flex-col min-h-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="font-mono text-sm font-bold text-gray-900">{selectedAgent.name}</div>
                <div className="text-xs text-gray-600">{selectedAgent.role}</div>
                <div className="mt-1 inline-flex items-center gap-1.5 text-xs">
                  <span className={`w-2 h-2 rounded-full ${STATUS_STYLES[selectedAgent.status].dot}`} />
                  <span>{STATUS_STYLES[selectedAgent.status].label}</span>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1 rounded hover:bg-white/60" aria-label="Close">
                <X className="w-4 h-4 text-gray-700" />
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-gray-500 mb-2">
              <Activity className="w-3 h-3" /> Last 50 log lines
            </div>
            <div className="flex-1 overflow-auto rounded-lg bg-slate-900/90 text-emerald-300 font-mono text-[11px] leading-relaxed p-3">
              {logs.map((line, i) => (
                <div key={i} className={line.includes('ERROR') ? 'text-rose-300' : ''}>{line}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AgentNode({ agent, active, onClick }: { agent: Agent; active: boolean; onClick: () => void }) {
  const s = STATUS_STYLES[agent.status];
  return (
    <button
      onClick={onClick}
      className={`group relative flex flex-col items-center gap-1.5 p-2 rounded-lg border transition ${
        active ? 'bg-white/80 border-white shadow' : 'bg-white/30 border-white/50 hover:bg-white/50'
      }`}
    >
      <div className="relative">
        <motion.div
          className={`w-7 h-7 rounded-full ${s.dot} ring-4 ${s.ring}`}
          animate={s.pulse ? { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] } : { scale: 1, opacity: 1 }}
          transition={s.pulse ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
        />
      </div>
      <div className="text-[10px] font-mono text-gray-800 truncate max-w-full">{agent.name}</div>
    </button>
  );
}
