/**
 * Thin OpenClaw backend client used by the Next.js API layer.
 *
 * VM 105 services (loopback only):
 *   - OpenClaw Gateway     :18789  (HTTP)
 *   - Redis                :6379   (streams: c-suite.briefs / assignments / kpis / events,
 *                                   os:stream:*, pipeline:dead_letter, kanban:*, tenant:*:*)
 *   - Postgres swarm_ops   :5432
 *   - Sage GPU rig         http://192.168.0.225  (vLLM :8000/:8001  +  Ollama :11434)
 *   - ComfyUI LXC          (image/video gen + LoRA train API)
 *   - DI Gallery           :8888
 *
 * In production the dashboard runs on the same VM and these helpers hit
 * loopback URLs. From any other environment (e.g. this Replit preview), the
 * helpers gracefully fall back to deterministic fixtures so the UI keeps
 * rendering without crashing.
 */

import { TENANT_FIXTURES } from './openclaw-fixtures';

// ─── Configuration ─────────────────────────────────────────────────────────────
export const OPENCLAW_USER = process.env.OPENCLAW_USER || 'apogeeai';
export const TENANTS = [
  'synaptive',
  'digital_influencer',
  'digital_products',
  'localbiz',
  'freelance',
  'apogee_dashboard',
  'internal_founder_os',
] as const;
export type TenantId = (typeof TENANTS)[number];

const GATEWAY_URL = process.env.OPENCLAW_GATEWAY_URL || 'http://127.0.0.1:18789';
const SAGE_URL = process.env.SAGE_RIG_URL || 'http://192.168.0.225';
const VLLM_PRIMARY = process.env.VLLM_PRIMARY_URL || `${SAGE_URL}:8000`;
const VLLM_WORKER = process.env.VLLM_WORKER_URL || `${SAGE_URL}:8001`;
const OLLAMA_URL = process.env.OLLAMA_URL || `${SAGE_URL}:11434`;
const COMFYUI_URL = process.env.COMFYUI_URL || `${SAGE_URL}:8188`;
const DI_GALLERY_URL = process.env.DI_GALLERY_URL || `${SAGE_URL}:8888`;

const REQUEST_TIMEOUT_MS = Number(process.env.OPENCLAW_TIMEOUT_MS || 1500);

// ─── Core fetch wrapper ────────────────────────────────────────────────────────
async function tryFetch<T>(url: string, init: RequestInit = {}): Promise<T | null> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), REQUEST_TIMEOUT_MS);
  try {
    const r = await fetch(url, {
      ...init,
      signal: ctl.signal,
      headers: {
        'Content-Type': 'application/json',
        'X-Openclaw-User': OPENCLAW_USER,
        ...(init.headers || {}),
      },
      cache: 'no-store',
    });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

export type BackendFlag = { backend: 'live' | 'fallback' };

// ─── Gateway: c-suite.briefs (XADD) ────────────────────────────────────────────
export async function xaddBrief(text: string, tenant: TenantId | 'apogee_dashboard' = 'apogee_dashboard') {
  const id = `brief-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const live = await tryFetch<{ id: string; queued: string }>(`${GATEWAY_URL}/streams/c-suite.briefs/xadd`, {
    method: 'POST',
    body: JSON.stringify({ id, tenant, user: OPENCLAW_USER, text }),
  });
  if (live) return { ...live, backend: 'live' as const };
  return { id, queued: 'c-suite.briefs', backend: 'fallback' as const, preview: text.slice(0, 120), tenant };
}

// ─── Gateway: c-suite KPIs / overnight standup ─────────────────────────────────
export type ExecBrief = {
  role: string;
  name: string;
  shipped: string[];
  blockers: string[];
  top3: string[];
  accent: string;
};
const STANDUP_FALLBACK: ExecBrief[] = [
  { role: 'CEO', name: 'Routing & decomposition',
    shipped: ['Routed 47 briefs across 6 empires', 'Decomposed 12 goals into 84 subtasks'],
    blockers: ['LLM tiebreak still rule-based'],
    top3: ['Approve Synaptive Q3 OKR', 'Sign off DI launch checklist', 'Review CRO retention spec'],
    accent: 'from-indigo-100/80 to-indigo-50/40 text-indigo-900' },
  { role: 'CTO', name: 'Self-upgrade & infra',
    shipped: ['Patched vLLM :8001 OOM (max-model-len)', 'Refactored gateway retry loop'],
    blockers: ['Proposer/Reviewer/Applier loop still stub'],
    top3: ['Wire CTO recursive upgrade', 'Migrate Redis to AOF', 'Profile LoRA throughput'],
    accent: 'from-slate-100/80 to-slate-50/40 text-slate-900' },
  { role: 'CMO', name: 'Brand · content · growth',
    shipped: ['Synaptive: 3 Shorts published, avg score 78', 'DI: 11 posts queued, 4 carousels approved'],
    blockers: ['Tastemaker rejecting 22% of audio cuts'],
    top3: ['Ship DI launch reel', 'Refresh LocalBiz cold email', 'Approve Q3 brand voice update'],
    accent: 'from-rose-100/80 to-rose-50/40 text-rose-900' },
  { role: 'CIO', name: 'Intel & research',
    shipped: ['TrendScout flagged 6 rising topics (avg lift +34%)', 'RSS digest: 142 items → 9 briefs'],
    blockers: ['Competitor scan API rate-limited'],
    top3: ['Prioritise top trend → CMO brief', 'Add Reddit source to RSS', 'Score competitor catalog'],
    accent: 'from-sky-100/80 to-sky-50/40 text-sky-900' },
  { role: 'CSO', name: 'Strategy',
    shipped: ['Drafted 30-day cash projection', 'Ranked empires by ROI/hour'],
    blockers: ['Need updated COGS from CRO'],
    top3: ['Lock empire focus order', 'Sign off LocalBiz expansion', 'Kill 1 underperformer'],
    accent: 'from-emerald-100/80 to-emerald-50/40 text-emerald-900' },
  { role: 'CRO', name: 'Revenue ops',
    shipped: ['Freelance: $1,840 invoiced, 2 collected', 'Products: 14 Etsy sales, $312 net'],
    blockers: ['Stripe payout delay 2d on Synaptive'],
    top3: ['Push DI pre-launch list', 'Recover 4 churned LocalBiz', 'Re-price top 3 Gumroad SKUs'],
    accent: 'from-amber-100/80 to-amber-50/40 text-amber-900' },
  { role: 'Creative', name: 'Brand voice gate',
    shipped: ['Approved 18/22 assets', 'Vetoed 4 (off-brand colour, weak hook)'],
    blockers: ['Designer queue 7 deep'],
    top3: ['Tighten Synaptive thumbnail style', 'Ship DI persona LoRA v7', 'Audit DI carousel templates'],
    accent: 'from-fuchsia-100/80 to-fuchsia-50/40 text-fuchsia-900' },
  { role: 'Support', name: 'Customer success',
    shipped: ['Cleared 9 tickets (median 14m)', 'Refunded 2, upsold 1'],
    blockers: ['Knowledge base stale on DI'],
    top3: ['Refresh DI FAQ', 'Auto-tag tickets by empire', 'Wire Slack escalation'],
    accent: 'from-teal-100/80 to-teal-50/40 text-teal-900' },
];

export async function getCSuiteStandup() {
  const live = await tryFetch<{ briefs: ExecBrief[] }>(`${GATEWAY_URL}/c-suite/standup`);
  if (live?.briefs?.length) return { briefs: live.briefs, backend: 'live' as const };
  return { briefs: STANDUP_FALLBACK, backend: 'fallback' as const };
}

// ─── GPU / model telemetry (nvidia-smi + vLLM /metrics + Ollama) ───────────────
export type Metric = { label: string; value: number; max: number; unit: string; color: string; sublabel?: string };

function parsePromMetric(body: string, name: string): number | null {
  for (const line of body.split('\n')) {
    if (line.startsWith('#') || !line.trim()) continue;
    const [k, v] = line.split(/\s+/);
    if (k === name) {
      const n = Number(v);
      if (!Number.isNaN(n)) return n;
    }
  }
  return null;
}

async function fetchVLLMQueue(url: string): Promise<number | null> {
  try {
    const r = await fetch(`${url}/metrics`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS), cache: 'no-store' });
    if (!r.ok) return null;
    const body = await r.text();
    const pending = parsePromMetric(body, 'vllm:num_requests_waiting');
    const running = parsePromMetric(body, 'vllm:num_requests_running');
    return Math.max(0, (pending ?? 0) + (running ?? 0));
  } catch {
    return null;
  }
}

async function fetchNvidiaSmi(): Promise<{ util3090: number; vram3090: number; util4090: number; vram4090: number } | null> {
  // Gateway exposes /telemetry/gpu which wraps `nvidia-smi --query-gpu=...`
  return tryFetch<{ util3090: number; vram3090: number; util4090: number; vram4090: number }>(`${GATEWAY_URL}/telemetry/gpu`);
}

async function fetchOllamaCacheHit(): Promise<number | null> {
  try {
    const r = await fetch(`${OLLAMA_URL}/api/ps`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS), cache: 'no-store' });
    if (!r.ok) return null;
    const data = (await r.json()) as { models?: Array<{ size_vram?: number }> };
    // crude proxy: how many models are warm vs total served
    return data.models && data.models.length > 0 ? Math.min(100, 60 + data.models.length * 8) : 0;
  } catch {
    return null;
  }
}

async function fetchComfyUIThroughput(): Promise<number | null> {
  return tryFetch<{ jobs_per_min: number }>(`${COMFYUI_URL}/system_stats`).then((d) => d?.jobs_per_min ?? null);
}

export async function getGpuTelemetry(): Promise<{ metrics: Metric[]; backend: 'live' | 'fallback' }> {
  const [gpu, vllmA, vllmB, ollama, comfy] = await Promise.all([
    fetchNvidiaSmi(),
    fetchVLLMQueue(VLLM_PRIMARY),
    fetchVLLMQueue(VLLM_WORKER),
    fetchOllamaCacheHit(),
    fetchComfyUIThroughput(),
  ]);

  const live = !!(gpu && vllmA !== null && vllmB !== null);
  // deterministic per-second drift seeded by epoch second so the UI animates
  const t = Math.floor(Date.now() / 2000);
  const drift = (seed: number, base: number, range: number) =>
    base + Math.sin((t + seed) * 0.7) * range + Math.cos((t + seed) * 0.31) * range * 0.4;

  const metrics: Metric[] = [
    { label: 'Sage RTX 3090', sublabel: 'GPU utilisation', value: round1(gpu?.util3090 ?? clamp(drift(1, 64, 18), 5, 99)), max: 100, unit: '%', color: '#10b981' },
    { label: 'Sage RTX 3090', sublabel: 'VRAM 24GB', value: round1(gpu?.vram3090 ?? clamp(drift(2, 18.2, 3), 1, 23.8)), max: 24, unit: 'GB', color: '#0ea5e9' },
    { label: 'Sage RTX 4090', sublabel: 'GPU utilisation', value: round1(gpu?.util4090 ?? clamp(drift(3, 81, 12), 5, 99)), max: 100, unit: '%', color: '#10b981' },
    { label: 'Sage RTX 4090', sublabel: 'VRAM 24GB', value: round1(gpu?.vram4090 ?? clamp(drift(4, 21.4, 2), 1, 23.8)), max: 24, unit: 'GB', color: '#0ea5e9' },
    { label: 'vLLM :8000', sublabel: 'Queue depth', value: vllmA ?? Math.round(clamp(drift(5, 3, 4), 0, 30)), max: 32, unit: '', color: '#8b5cf6' },
    { label: 'vLLM :8001', sublabel: 'Queue depth', value: vllmB ?? Math.round(clamp(drift(6, 7, 6), 0, 30)), max: 32, unit: '', color: '#8b5cf6' },
    { label: 'Ollama', sublabel: 'Cache hit rate', value: round1(ollama ?? clamp(drift(7, 92, 4), 50, 99)), max: 100, unit: '%', color: '#f59e0b' },
    { label: 'ComfyUI', sublabel: 'Throughput / min', value: Math.round(comfy ?? clamp(drift(8, 14, 6), 0, 38)), max: 40, unit: 'jobs', color: '#ec4899' },
  ];
  return { metrics, backend: live ? 'live' : 'fallback' };
}

function clamp(n: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, n)); }
function round1(n: number) { return Math.round(n * 10) / 10; }

// ─── Agent swarm (heartbeat.py) + workspace logs ───────────────────────────────
export type AgentStatus = 'idle' | 'working' | 'errored' | 'offline';
export type Agent = { name: string; tier: 'core' | 'sub'; role: string; status: AgentStatus };

const CORE: Omit<Agent, 'status'>[] = [
  { name: 'DIRECTOR', tier: 'core', role: 'Routes & decomposes' },
  { name: 'MAKER', tier: 'core', role: 'Creative production' },
  { name: 'BUILDER', tier: 'core', role: 'Code & infra' },
  { name: 'SELLER', tier: 'core', role: 'Distribution' },
  { name: 'OPS', tier: 'core', role: 'Daily operations' },
  { name: 'WIGGUM', tier: 'core', role: 'Brand/compliance gate' },
  { name: 'SKILL_REVIEWER', tier: 'core', role: 'Skill bundle review' },
];
const SUB: Omit<Agent, 'status'>[] = [
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
const ALL_AGENTS = [...CORE, ...SUB];
const STATUS_OPTS: AgentStatus[] = ['idle', 'working', 'working', 'idle', 'errored', 'offline', 'working'];

export async function getSwarmStatus(): Promise<{ agents: Agent[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ agents: Record<string, AgentStatus> }>(`${GATEWAY_URL}/heartbeat`);
  const t = Math.floor(Date.now() / 2500);
  const agents = ALL_AGENTS.map((a, i) => ({
    ...a,
    status: live?.agents?.[a.name] ?? STATUS_OPTS[(i + t) % STATUS_OPTS.length],
  }));
  return { agents, backend: live ? 'live' : 'fallback' };
}

export async function getAgentLogs(name: string): Promise<{ lines: string[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ lines: string[] }>(`${GATEWAY_URL}/agents/${encodeURIComponent(name)}/logs?n=50`);
  if (live?.lines) return { lines: live.lines, backend: 'live' };
  // fallback: deterministic recent log lines
  const verbs = ['claimed task', 'emitted KPI', 'scored 78', 'pushed draft', 'requested LLM', 'spawned subtask', 'wrote memory', 'ack brief', 'heartbeat'];
  const out: string[] = [];
  const seed = name.length * 17;
  for (let i = 0; i < 50; i++) {
    const tt = new Date(Date.now() - i * 47_000).toISOString().slice(11, 19);
    const v = verbs[(seed + i) % verbs.length];
    const id = String(((seed + i * 31) % 9999)).padStart(4, '0');
    out.push(`[${tt}] ${name} ${v} task#${id}`);
  }
  return { lines: out, backend: 'fallback' };
}

// ─── ComfyUI / LoRA training proxies ───────────────────────────────────────────
export async function postLoraTrain(payload: { refs: number; base: string; steps: number; name: string }) {
  const live = await tryFetch<{ job_id: string }>(`${COMFYUI_URL}/api/lora/train`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (live) return { ...live, backend: 'live' as const };
  return { job_id: `lora-${Date.now().toString(36)}`, backend: 'fallback' as const };
}

export async function postLoraSave(payload: { name: string; base: string; dataset_hash?: string }) {
  const live = await tryFetch<{ ok: boolean }>(`${GATEWAY_URL}/registry/loras`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (live) return { ...live, backend: 'live' as const };
  return { ok: true, backend: 'fallback' as const, registered: `${payload.name}.safetensors` };
}

// ─── Video motion lab (LTX2) ───────────────────────────────────────────────────
export type VideoJob = {
  id: string;
  title: string;
  tenant: string;
  status: 'pending' | 'running' | 'done';
  progress?: number;
  duration?: string;
  before: string;
  after: string;
  frames: string[];
};

export async function getVideoJobs(): Promise<{ jobs: VideoJob[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ jobs: VideoJob[] }>(`${GATEWAY_URL}/ltx2/jobs`);
  if (live?.jobs) return { jobs: live.jobs, backend: 'live' };
  return { jobs: TENANT_FIXTURES.videoJobs as VideoJob[], backend: 'fallback' };
}

export async function postVideoRegenerate(jobId: string) {
  const live = await tryFetch<{ ok: boolean }>(`${GATEWAY_URL}/ltx2/regenerate`, {
    method: 'POST',
    body: JSON.stringify({ jobId, motion_only: true }),
  });
  if (live) return { ...live, backend: 'live' as const };
  return { ok: true, backend: 'fallback' as const, jobId };
}

// ─── Intelligence: trends, leads, schedule heatmap ─────────────────────────────
export type TrendSignal = {
  id: string; name: string; source: string;
  peakInDays: number; confidence: number; expectedRevenue: number;
};
export type Lead = {
  id: string; business: string; city: string; industry: string;
  convertPct: number; churnPct: number; mrr: number;
};

export async function getTrends(): Promise<{ signals: TrendSignal[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ signals: TrendSignal[] }>(`${GATEWAY_URL}/trendscout/signals`);
  if (live?.signals) return { signals: live.signals, backend: 'live' };
  return { signals: TENANT_FIXTURES.trends as TrendSignal[], backend: 'fallback' };
}
export async function postTrendRide(id: string): Promise<{ ok: boolean; backend: 'live' | 'fallback'; id: string }> {
  const live = await tryFetch<{ ok: boolean }>(`${GATEWAY_URL}/trendscout/ride`, {
    method: 'POST',
    body: JSON.stringify({ id }),
  });
  if (live) return { ok: live.ok, backend: 'live', id };
  return { ok: true, backend: 'fallback', id };
}

export async function getLeads(): Promise<{ leads: Lead[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ leads: Lead[] }>(`${GATEWAY_URL}/leads/scoring`);
  if (live?.leads) return { leads: live.leads, backend: 'live' };
  return { leads: TENANT_FIXTURES.leads as Lead[], backend: 'fallback' };
}

export async function getEngagementHeatmap(tenant: string, platform: string) {
  const live = await tryFetch<{ matrix: number[][] }>(
    `${GATEWAY_URL}/scheduler/engagement_matrix?tenant=${encodeURIComponent(tenant)}&platform=${encodeURIComponent(platform)}`,
  );
  if (live?.matrix) return { matrix: live.matrix, backend: 'live' as const };
  // deterministic engagement curve
  const seed = tenant.length * 17 + platform.length * 31;
  const matrix: number[][] = [];
  let s = seed;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  for (let d = 0; d < 7; d++) {
    const row: number[] = [];
    for (let h = 0; h < 24; h++) {
      const morning = Math.exp(-((h - 8) ** 2) / 16) * 60;
      const evening = Math.exp(-((h - 20) ** 2) / 14) * 90;
      const weekend = d === 0 || d === 6 ? 12 : 0;
      const noise = rnd() * 25;
      row.push(Math.max(0, Math.min(100, Math.round(morning + evening + weekend + noise - 10))));
    }
    matrix.push(row);
  }
  return { matrix, backend: 'fallback' as const };
}

export async function postSchedule(payload: { tenant: TenantId; platform: string; day: number; hour: number }) {
  const slotId = `${payload.tenant}:${payload.platform}:${payload.day}:${payload.hour}`;
  const live = await tryFetch<{ ok: boolean; slot: string }>(`${GATEWAY_URL}/scheduler/queue`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  if (live) return { ok: live.ok, slot: live.slot, backend: 'live' as const };
  return { ok: true, slot: slotId, backend: 'fallback' as const };
}

// ─── Quality: approvals, tastemaker scores, brand drift ────────────────────────
export type ApprovalItem = {
  id: string; tenant: TenantId; title: string; thumb: string;
  tasteScore: number; wiggumVerdict: 'pass' | 'caution' | 'flag'; brief: string;
};
export type Score = { tenant: TenantId; score: number };
export type DriftItem = {
  tenant: TenantId; similarity: number; threshold: number;
  recentDrifted: { title: string; sim: number }[];
};

export async function getApprovals(): Promise<{ items: ApprovalItem[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ items: ApprovalItem[] }>(`${GATEWAY_URL}/streams/approvals/peek?n=50`);
  if (live?.items) return { items: live.items, backend: 'live' };
  return { items: TENANT_FIXTURES.approvals as ApprovalItem[], backend: 'fallback' };
}

export async function postApprovalDecision(id: string, decision: 'approve' | 'kill', tenant: TenantId) {
  const stream = `tenant:${tenant}:approvals`;
  const live = await tryFetch<{ ok: boolean }>(`${GATEWAY_URL}/streams/${stream}/xadd`, {
    method: 'POST',
    body: JSON.stringify({ id, decision, user: OPENCLAW_USER }),
  });
  if (live) return { ok: live.ok, stream, id, decision, backend: 'live' as const };
  return { ok: true, stream, id, decision, backend: 'fallback' as const };
}

export async function getTastemakerScores(): Promise<{ scores: Score[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ scores: Score[] }>(`${GATEWAY_URL}/tastemaker/scores?window=24h`);
  if (live?.scores) return { scores: live.scores, backend: 'live' };
  return { scores: TENANT_FIXTURES.scores24h as Score[], backend: 'fallback' };
}

export async function getBrandDrift(): Promise<{ drift: DriftItem[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ drift: DriftItem[] }>(`${GATEWAY_URL}/brand_drift/embeddings`);
  if (live?.drift) return { drift: live.drift, backend: 'live' };
  return { drift: TENANT_FIXTURES.drift as DriftItem[], backend: 'fallback' };
}

// ─── Production: artifacts, goods, pipeline depth, dead-letter ─────────────────
export type Artifact = {
  id: string; tenant: TenantId; title: string;
  type: 'image' | 'audio' | 'video' | 'text'; thumb: string; score: number; builtAt: string;
};
export type DigitalGood = {
  id: string; tenant: TenantId; title: string;
  marketplace: 'Etsy' | 'Gumroad' | 'Notion' | 'TPT'; price: number; thumb: string; tasteScore: number;
};
export type PipelineStage = { id: string; label: string; inflight: number; bottleneck: boolean };
export type DeadLetterItem = {
  id: string; stream: string; reason: string; tenant: TenantId; payload: string; failedAt: string;
};

export async function getOvernightArtifacts(): Promise<{ artifacts: Artifact[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ artifacts: Artifact[] }>(`${GATEWAY_URL}/artifacts/overnight`);
  if (live?.artifacts) return { artifacts: live.artifacts, backend: 'live' };
  return { artifacts: TENANT_FIXTURES.overnight as Artifact[], backend: 'fallback' };
}

export async function getDigitalGoods(): Promise<{ goods: DigitalGood[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ goods: DigitalGood[] }>(`${GATEWAY_URL}/goods/pending`);
  if (live?.goods) return { goods: live.goods, backend: 'live' };
  return { goods: TENANT_FIXTURES.goods as DigitalGood[], backend: 'fallback' };
}

export async function getPipelineDepth(): Promise<{ stages: PipelineStage[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ stages: PipelineStage[] }>(`${GATEWAY_URL}/streams/xlen?prefix=os:stream:`);
  if (live?.stages) return { stages: live.stages, backend: 'live' };
  return { stages: TENANT_FIXTURES.pipeline as PipelineStage[], backend: 'fallback' };
}

export async function getDeadLetter(): Promise<{ items: DeadLetterItem[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ items: DeadLetterItem[] }>(`${GATEWAY_URL}/streams/dead_letter/peek?n=50`);
  if (live?.items) return { items: live.items, backend: 'live' };
  return { items: TENANT_FIXTURES.deadLetter as DeadLetterItem[], backend: 'fallback' };
}

export async function postDeadLetterAction(id: string, action: 'retry' | 'ignore') {
  const stream = action === 'retry' ? 'pipeline:retry' : 'os:stream:dead';
  const live = await tryFetch<{ ok: boolean }>(`${GATEWAY_URL}/streams/${stream}/xadd`, {
    method: 'POST',
    body: JSON.stringify({ id, action, user: OPENCLAW_USER }),
  });
  if (live) return { ok: live.ok, stream, id, action, backend: 'live' as const };
  return { ok: true, stream, id, action, backend: 'fallback' as const };
}

// ─── Money: revenue, costs, empires, pnl ───────────────────────────────────────
export type RevenueSnapshot = {
  totalMrr: number; todayGross: number; yesterdayGross: number;
  weekGross: number; monthGross: number;
  perTenant: { id: string; name: string; mrr: number }[];
};
export type CostSnapshot = {
  dailyBurn: number;
  models: { model: string; spend: number; color: string; tag: string }[];
  tenants: { id: string; name: string; spent: number; budget: number }[];
};
export type Empire = {
  id: string; name: string; icon: string;
  revenue: number; cost: number; trend: number; color: string; accent: string;
};

export async function getRevenue(): Promise<RevenueSnapshot & { backend: 'live' | 'fallback' }> {
  const live = await tryFetch<RevenueSnapshot>(`${GATEWAY_URL}/ledger/revenue`);
  if (live) return { ...live, backend: 'live' };
  return { ...(TENANT_FIXTURES.revenue as RevenueSnapshot), backend: 'fallback' };
}

export async function getCosts(): Promise<CostSnapshot & { backend: 'live' | 'fallback' }> {
  const live = await tryFetch<CostSnapshot>(`${GATEWAY_URL}/ledger/costs`);
  if (live) return { ...live, backend: 'live' };
  return { ...(TENANT_FIXTURES.costs as CostSnapshot), backend: 'fallback' };
}

export async function getEmpires(): Promise<{ empires: Empire[]; backend: 'live' | 'fallback' }> {
  const live = await tryFetch<{ empires: Empire[] }>(`${GATEWAY_URL}/ledger/empires`);
  if (live?.empires) return { empires: live.empires, backend: 'live' };
  return { empires: TENANT_FIXTURES.empires as Empire[], backend: 'fallback' };
}

// ─── Revenue what-if simulator ─────────────────────────────────────────────────
export type RevenueSimInput = { agents: number; budget: number; threshold: number; tenant?: TenantId };
export type RevenueSimPoint = { day: number; revenue: number };
export type RevenueSimResponse = {
  series: RevenueSimPoint[];
  baseline: { dailyMrr: number; dailyBurn: number };
  inputs: RevenueSimInput;
  backend: 'live' | 'fallback';
};

export async function getRevenueSim(input: RevenueSimInput): Promise<RevenueSimResponse> {
  const live = await tryFetch<{ series: RevenueSimPoint[]; baseline: { dailyMrr: number; dailyBurn: number } }>(
    `${GATEWAY_URL}/analytics/revenue_sim`,
    { method: 'POST', body: JSON.stringify(input) },
  );
  if (live?.series?.length) {
    return { series: live.series, baseline: live.baseline, inputs: input, backend: 'live' };
  }

  // Fallback model: regression-style projection seeded by current ledger.
  // Uses actual MRR + burn so the curve reflects real revenue, then scales by
  // operator inputs (more agents → sub-linear lift, higher threshold → fewer
  // publishes, weekly budget acts as a throughput multiplier).
  const [rev, costs] = await Promise.all([getRevenue(), getCosts()]);
  const dailyMrr = rev.totalMrr / 30;
  const dailyBurn = costs.dailyBurn;
  const agentFactor = Math.pow(input.agents, 0.7);
  const budgetFactor = input.budget / 1000;
  const thresholdFactor = Math.max(0.3, 1.4 - input.threshold / 100);
  const dailyLift = 18 * agentFactor * budgetFactor * thresholdFactor;
  const series: RevenueSimPoint[] = [];
  let cum = 0;
  for (let d = 1; d <= 90; d++) {
    const ramp = 1 - Math.exp(-d / 18);
    const noise = Math.sin(d * 0.4) * 0.05 + 1;
    cum += (dailyMrr + dailyLift * ramp * noise) - dailyBurn;
    series.push({ day: d, revenue: Math.max(0, Math.round(cum)) });
  }
  return { series, baseline: { dailyMrr, dailyBurn }, inputs: input, backend: 'fallback' };
}
