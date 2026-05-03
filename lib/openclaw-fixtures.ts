/**
 * Deterministic fixtures used by the OpenClaw API layer when the live
 * VM 105 services aren't reachable. Shapes match what the gateway would
 * return so the UI doesn't care which path served the request.
 */

export type Tenant =
  | 'synaptive'
  | 'digital_influencer'
  | 'digital_products'
  | 'localbiz'
  | 'freelance'
  | 'apogee_dashboard';

export const TENANT_LABEL: Record<Tenant, string> = {
  synaptive: 'Synaptive Sounds',
  digital_influencer: 'Digital Influencer',
  digital_products: 'Digital Products',
  localbiz: 'LocalBiz',
  freelance: 'Freelance',
  apogee_dashboard: 'Apogee',
};

export const TENANT_COLOR: Record<Tenant, string> = {
  synaptive: 'bg-purple-500/80',
  digital_influencer: 'bg-pink-500/80',
  digital_products: 'bg-orange-500/80',
  localbiz: 'bg-emerald-500/80',
  freelance: 'bg-blue-500/80',
  apogee_dashboard: 'bg-cyan-500/80',
};

const TENANTS_LIST: Tenant[] = ['synaptive', 'digital_influencer', 'digital_products', 'localbiz', 'freelance', 'apogee_dashboard'];

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ─── Trends ────────────────────────────────────────────────────────────────────
const TREND_NAMES = [
  'Liminal corridor edits', '8D ambient rain', 'Tarot card flat-lays', 'AI persona thirst-traps',
  'Whisper ASMR routines', 'Cottagecore Etsy planners', 'Shrimp boil TikToks', 'GPT founder threads',
  'Synth-pop nostalgia', 'Gym mirror selfies', 'Lo-fi 432Hz baths', 'Dreamcore wallpapers',
  'Astro birth-chart drops', 'Manifestation journals', '"Day in my life" SaaS', 'NPC stream parodies',
  'AI couture lookbooks', 'Wired-headphone aesthetic', 'Cozy game soundtracks', 'Chrome-orb 3D loops',
];
const SOURCES = ['TikTok', 'Instagram', 'Etsy', 'X / Twitter', 'YouTube', 'Reddit'] as const;
const trends = (() => {
  const r = mulberry32(42);
  return TREND_NAMES.map((name, i) => ({
    id: `t${i + 1}`,
    name,
    source: SOURCES[Math.floor(r() * SOURCES.length)],
    peakInDays: 1 + Math.floor(r() * 21),
    confidence: Math.round(45 + r() * 50),
    expectedRevenue: Math.round(500 + r() * 18000),
  }));
})();

// ─── Leads ─────────────────────────────────────────────────────────────────────
const BUSINESSES = [
  ['Pipeworks Plumbing', 'Tampa', 'Plumbing'],
  ['Skyline Roofing', 'Austin', 'Roofing'],
  ['ChillCo HVAC', 'Phoenix', 'HVAC'],
  ['Bright Smiles Dental', 'Denver', 'Dental'],
  ['Lone Star Locksmith', 'Dallas', 'Locksmith'],
  ['Glow Esthetics', 'Miami', 'Med-spa'],
  ['Iron Paws Gym', 'Nashville', 'Fitness'],
  ['North Pole AC', 'Minneapolis', 'HVAC'],
  ['Riverbend Landscaping', 'Portland', 'Lawn'],
  ['Citrus CPA', 'Orlando', 'Accounting'],
  ['Bayview Movers', 'Seattle', 'Moving'],
  ['Apex Towing', 'Detroit', 'Auto'],
  ['Paws & Claws Vet', 'Charlotte', 'Vet'],
  ['Sunset Solar', 'San Diego', 'Solar'],
  ['Maple Leaf Bakery', 'Boston', 'Bakery'],
];
const leads = (() => {
  const r = mulberry32(7);
  return BUSINESSES.map(([business, city, industry], i) => ({
    id: `l${i + 1}`,
    business, city, industry,
    convertPct: Math.round(8 + r() * 80),
    churnPct: Math.round(3 + r() * 55),
    mrr: Math.round(80 + r() * 720),
  })).sort((a, b) => b.convertPct - a.convertPct);
})();

// ─── Approvals + Tastemaker scores + Drift ─────────────────────────────────────
const TITLES = [
  'Sunset Persona Drop #14', '8D Lo-fi Loop — 432Hz', 'Etsy Calendar — Astro 2026',
  'Plumber Cold Email Pack', 'Reel cutdown 9:16', 'Gig Bid: Logo Redesign',
  'Binaural 528Hz Bath', 'Notion OS Template Pack', 'Founder OS Dashboard Mock',
  'Carousel — 7 hooks', 'GBP review reply set', 'Dreamcore Pad — 396Hz',
  'IG Story: morning routine', 'Etsy Listing: Tarot Deck', 'Outreach: roofers Tampa',
  'Persona V6 face #221', 'Cold DM: SaaS founders', 'Etsy mockup: art prints',
  'TikTok caption pack', 'YouTube thumb A/B', 'Lyric draft — synth-pop',
  'Notion habit OS', 'Local SEO blog #88',
];
const THUMBS = [
  'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/4348078/pexels-photo-4348078.jpeg?auto=compress&cs=tinysrgb&w=600',
];
const approvals = TITLES.map((title, i) => {
  const score = Math.round(45 + ((i * 37) % 55));
  const verdict: 'pass' | 'caution' | 'flag' = score < 60 ? 'flag' : score < 75 ? 'caution' : 'pass';
  return {
    id: `p${i + 1}`,
    tenant: TENANTS_LIST[i % TENANTS_LIST.length],
    title,
    thumb: THUMBS[i % THUMBS.length],
    tasteScore: score,
    wiggumVerdict: verdict,
    brief: `Brief: produce ${title.toLowerCase()} for tenant ${TENANTS_LIST[i % TENANTS_LIST.length]} — target voice = brand corpus v3, audience = primary persona, length ≈ 220 chars.`,
  };
});

const scores24h = (() => {
  const arr: { tenant: Tenant; score: number }[] = [];
  TENANTS_LIST.forEach((t, ti) => {
    const count = 30 + ti * 4;
    for (let i = 0; i < count; i++) {
      const base = 60 + ti * 3;
      const noise = Math.sin(i * 1.3 + ti) * 18 + Math.cos(i * 0.7) * 8;
      const s = Math.max(0, Math.min(100, Math.round(base + noise)));
      arr.push({ tenant: t, score: s });
    }
  });
  return arr;
})();

const drift = [
  { tenant: 'synaptive', similarity: 0.91, threshold: 0.78, recentDrifted: [
    { title: 'Lyric draft #441', sim: 0.74 }, { title: 'Album blurb v2', sim: 0.79 }, { title: 'Tour caption', sim: 0.81 } ] },
  { tenant: 'digital_influencer', similarity: 0.83, threshold: 0.78, recentDrifted: [
    { title: 'IG caption batch #88', sim: 0.69 }, { title: 'Tweet thread on AI', sim: 0.71 }, { title: 'Hook A/B set', sim: 0.74 } ] },
  { tenant: 'digital_products', similarity: 0.88, threshold: 0.78, recentDrifted: [
    { title: 'Etsy listing #220', sim: 0.81 }, { title: 'Product description set', sim: 0.83 }, { title: 'Bundle title v3', sim: 0.85 } ] },
  { tenant: 'localbiz', similarity: 0.72, threshold: 0.78, recentDrifted: [
    { title: 'Plumber outreach v4', sim: 0.61 }, { title: 'GBP post — roofer', sim: 0.65 }, { title: 'Cold email — HVAC', sim: 0.68 } ] },
  { tenant: 'freelance', similarity: 0.86, threshold: 0.78, recentDrifted: [
    { title: 'Gig pitch — logo', sim: 0.79 }, { title: 'DM to recruiter', sim: 0.80 }, { title: 'Portfolio caption', sim: 0.82 } ] },
  { tenant: 'apogee_dashboard', similarity: 0.94, threshold: 0.78, recentDrifted: [
    { title: 'Changelog summary', sim: 0.88 }, { title: 'Launch tweet', sim: 0.90 }, { title: 'Dashboard tour script', sim: 0.91 } ] },
];

// ─── Production: overnight, goods, pipeline, dead-letter ───────────────────────
const overnight = [
  { id: 'a1', tenant: 'digital_influencer', title: 'Sunset Persona Drop #14', type: 'image', thumb: 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.91, builtAt: '00:42' },
  { id: 'a2', tenant: 'synaptive', title: '8D Lo-fi Loop — 432Hz', type: 'audio', thumb: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.87, builtAt: '01:08' },
  { id: 'a3', tenant: 'digital_products', title: 'Etsy Calendar — Astro 2026', type: 'image', thumb: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.78, builtAt: '01:33' },
  { id: 'a4', tenant: 'localbiz', title: 'Plumber Cold Email Pack', type: 'text', thumb: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.83, builtAt: '02:01' },
  { id: 'a5', tenant: 'digital_influencer', title: 'Reel cutdown 9:16', type: 'video', thumb: 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.94, builtAt: '02:45' },
  { id: 'a6', tenant: 'freelance', title: 'Gig Bid: Logo Redesign', type: 'text', thumb: 'https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.69, builtAt: '03:12' },
  { id: 'a7', tenant: 'synaptive', title: 'Binaural 528Hz Bath', type: 'audio', thumb: 'https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.81, builtAt: '03:55' },
  { id: 'a8', tenant: 'digital_products', title: 'Notion OS Template Pack', type: 'image', thumb: 'https://images.pexels.com/photos/4348078/pexels-photo-4348078.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.88, builtAt: '04:20' },
  { id: 'a9', tenant: 'apogee_dashboard', title: 'Founder OS Dashboard Mock', type: 'image', thumb: 'https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.74, builtAt: '05:08' },
  { id: 'a10', tenant: 'digital_influencer', title: 'Carousel — 7 hooks', type: 'image', thumb: 'https://images.pexels.com/photos/2387873/pexels-photo-2387873.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.92, builtAt: '06:14' },
  { id: 'a11', tenant: 'localbiz', title: 'GBP review reply set', type: 'text', thumb: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.86, builtAt: '06:48' },
  { id: 'a12', tenant: 'synaptive', title: 'Dreamcore Pad — 396Hz', type: 'audio', thumb: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=400', score: 0.79, builtAt: '07:22' },
];

const goods = [
  { id: 'g1', tenant: 'digital_products', title: 'Cosmic Calendar 2026', marketplace: 'Etsy', price: 12, thumb: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.88 },
  { id: 'g2', tenant: 'digital_products', title: 'Stoic Habit Tracker', marketplace: 'Gumroad', price: 9, thumb: 'https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.82 },
  { id: 'g3', tenant: 'digital_products', title: 'Notion Founder OS', marketplace: 'Notion', price: 29, thumb: 'https://images.pexels.com/photos/4348078/pexels-photo-4348078.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.91 },
  { id: 'g4', tenant: 'digital_products', title: 'Watercolor Wedding Suite', marketplace: 'Etsy', price: 18, thumb: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.76 },
  { id: 'g5', tenant: 'digital_products', title: 'Minimalist Workout Log', marketplace: 'Gumroad', price: 7, thumb: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.71 },
  { id: 'g6', tenant: 'digital_products', title: 'Astrology Birth Chart Kit', marketplace: 'Etsy', price: 15, thumb: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.85 },
  { id: 'g7', tenant: 'digital_products', title: 'Teacher Lesson Plan Pack', marketplace: 'TPT', price: 11, thumb: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.79 },
  { id: 'g8', tenant: 'digital_products', title: 'Dreamcore Phone Wallpapers', marketplace: 'Gumroad', price: 5, thumb: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.83 },
];

const pipeline = [
  { id: 'briefs', label: 'Briefs', inflight: 42, bottleneck: false },
  { id: 'assembled', label: 'Assembled', inflight: 38, bottleneck: false },
  { id: 'visuals', label: 'Visuals', inflight: 124, bottleneck: true },
  { id: 'audio', label: 'Audio', inflight: 18, bottleneck: false },
  { id: 'scoring', label: 'Tastemaker', inflight: 67, bottleneck: true },
  { id: 'approvals', label: 'Approvals', inflight: 12, bottleneck: false },
  { id: 'delivered', label: 'Delivered', inflight: 89, bottleneck: false },
];

const deadLetter = [
  { id: 'd1', stream: 'pipeline:dead_letter', reason: 'comfyui timeout', tenant: 'digital_influencer', payload: 'V6 portrait gen — workflow_id 3a91', failedAt: '02:17' },
  { id: 'd2', stream: 'pipeline:dead_letter', reason: 'comfyui timeout', tenant: 'digital_influencer', payload: 'V6 portrait gen — workflow_id 3a92', failedAt: '02:23' },
  { id: 'd3', stream: 'os:stream:dead', reason: 'venice 429 rate-limit', tenant: 'synaptive', payload: 'lyric draft — model llama-3.3-70b', failedAt: '03:01' },
  { id: 'd4', stream: 'pipeline:dead_letter', reason: 'tastemaker schema mismatch', tenant: 'digital_products', payload: 'etsy-listing v2 — missing alt_text', failedAt: '04:44' },
  { id: 'd5', stream: 'os:stream:dead', reason: 'gateway 502', tenant: 'localbiz', payload: 'gbp post draft — biz_id 778', failedAt: '05:19' },
  { id: 'd6', stream: 'pipeline:dead_letter', reason: 'comfyui timeout', tenant: 'digital_influencer', payload: 'V6 portrait gen — workflow_id 4001', failedAt: '06:02' },
  { id: 'd7', stream: 'os:stream:dead', reason: 'wiggum reject — brand drift', tenant: 'apogee_dashboard', payload: 'tweet draft — tone score 0.31', failedAt: '06:55' },
];

// ─── Money: revenue / costs / empires ──────────────────────────────────────────
const revenue = {
  totalMrr: 14540,
  todayGross: 487,
  yesterdayGross: 412,
  weekGross: 3120,
  monthGross: 14490,
  perTenant: [
    { id: 'synaptive', name: 'Synaptive Sounds', mrr: 1240 },
    { id: 'digital_influencer', name: 'Digital Influencer', mrr: 3420 },
    { id: 'digital_products', name: 'Digital Products', mrr: 2180 },
    { id: 'localbiz', name: 'LocalBiz Growth', mrr: 4850 },
    { id: 'freelance', name: 'Freelance Empire', mrr: 1960 },
    { id: 'apogee_dashboard', name: 'Apogee Dashboard', mrr: 890 },
  ],
};

const costs = {
  dailyBurn: 14.96,
  models: [
    { model: 'Local Rig (Qwen)', spend: 0, color: '#10b981', tag: 'FREE' },
    { model: 'Ollama Abliterated', spend: 0, color: '#10b981', tag: 'FREE' },
    { model: 'Venice (12 models)', spend: 0, color: '#10b981', tag: 'FREE' },
    { model: 'OpenAI GPT-4o', spend: 287.4, color: '#f59e0b', tag: 'PAID' },
    { model: 'OpenAI gpt-image-1', spend: 142.8, color: '#f59e0b', tag: 'PAID' },
    { model: 'OpenAI GPT-4o Mini', spend: 18.6, color: '#f59e0b', tag: 'PAID' },
  ],
  tenants: [
    { id: 'synaptive', name: 'Synaptive Sounds', spent: 6.8, budget: 10 },
    { id: 'digital_influencer', name: 'Digital Influencer', spent: 14.2, budget: 15 },
    { id: 'digital_products', name: 'Digital Products', spent: 2.1, budget: 5 },
    { id: 'localbiz', name: 'LocalBiz Growth', spent: 7.4, budget: 10 },
    { id: 'freelance', name: 'Freelance Empire', spent: 1.9, budget: 5 },
    { id: 'apogee_dashboard', name: 'Apogee Dashboard', spent: 16.8, budget: 20 },
  ],
};

const empires = [
  { id: 'synaptive', name: 'Synaptive Sounds', icon: 'Headphones', revenue: 1240, cost: 187, trend: 8.4, color: 'from-purple-400/30 to-purple-600/30', accent: 'text-purple-700' },
  { id: 'digital_influencer', name: 'Digital Influencer', icon: 'Camera', revenue: 3420, cost: 624, trend: 22.1, color: 'from-pink-400/30 to-pink-600/30', accent: 'text-pink-700' },
  { id: 'digital_products', name: 'Digital Products', icon: 'ShoppingBag', revenue: 2180, cost: 142, trend: 14.2, color: 'from-orange-400/30 to-orange-600/30', accent: 'text-orange-700' },
  { id: 'localbiz', name: 'LocalBiz Growth', icon: 'MapPin', revenue: 4850, cost: 318, trend: 31.5, color: 'from-emerald-400/30 to-emerald-600/30', accent: 'text-emerald-700' },
  { id: 'freelance', name: 'Freelance Empire', icon: 'Briefcase', revenue: 1960, cost: 89, trend: -3.2, color: 'from-blue-400/30 to-blue-600/30', accent: 'text-blue-700' },
  { id: 'apogee_dashboard', name: 'Apogee Dashboard', icon: 'LayoutDashboard', revenue: 890, cost: 412, trend: 4.7, color: 'from-cyan-400/30 to-cyan-600/30', accent: 'text-cyan-700' },
];

// ─── Video jobs ───────────────────────────────────────────────────────────────
const FRAME_BASES = [
  'https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=400',
];

const videoJobs = [
  { id: 'j1', title: 'Persona V6 — neon walk', tenant: 'Digital Influencer', status: 'done', duration: '4.8s',
    before: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/2787341/pexels-photo-2787341.jpeg?auto=compress&cs=tinysrgb&w=800',
    frames: Array.from({ length: 8 }).map((_, i) => `${FRAME_BASES[i % FRAME_BASES.length]}&v=${i}`) },
  { id: 'j2', title: 'Album cover — slow zoom', tenant: 'Synaptive Sounds', status: 'done', duration: '6.1s',
    before: 'https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg?auto=compress&cs=tinysrgb&w=800',
    frames: Array.from({ length: 8 }).map((_, i) => `${FRAME_BASES[(i + 1) % FRAME_BASES.length]}&v=a${i}`) },
  { id: 'j3', title: 'Etsy listing — orbit cam', tenant: 'Digital Products', status: 'running', progress: 62,
    before: 'https://images.pexels.com/photos/1983032/pexels-photo-1983032.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/4348078/pexels-photo-4348078.jpeg?auto=compress&cs=tinysrgb&w=800',
    frames: [] },
  { id: 'j4', title: 'Ad cutdown — push-in', tenant: 'LocalBiz', status: 'pending',
    before: 'https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800',
    frames: [] },
  { id: 'j5', title: 'Reel — handheld parallax', tenant: 'Digital Influencer', status: 'pending',
    before: 'https://images.pexels.com/photos/1499327/pexels-photo-1499327.jpeg?auto=compress&cs=tinysrgb&w=800',
    after: 'https://images.pexels.com/photos/2613260/pexels-photo-2613260.jpeg?auto=compress&cs=tinysrgb&w=800',
    frames: [] },
];

export const TENANT_FIXTURES = {
  trends, leads, approvals, scores24h, drift,
  overnight, goods, pipeline, deadLetter,
  revenue, costs, empires, videoJobs,
};
