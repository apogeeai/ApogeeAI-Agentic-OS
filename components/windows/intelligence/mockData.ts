// TODO: wire to TrendScout SSE stream, analytics:revenue:* timeseries, scheduler:engagement_matrix, leads:scoring:* (LocalBiz tenant)
export type Tenant = 'synaptive' | 'digital_influencer' | 'digital_products' | 'localbiz' | 'freelance' | 'apogee_dashboard';

export const TENANT_LABEL: Record<Tenant, string> = {
  synaptive: 'Synaptive Sounds',
  digital_influencer: 'Digital Influencer',
  digital_products: 'Digital Products',
  localbiz: 'LocalBiz',
  freelance: 'Freelance',
  apogee_dashboard: 'Apogee',
};

// Deterministic seed-based PRNG
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type TrendSource = 'TikTok' | 'Instagram' | 'Etsy' | 'X / Twitter' | 'YouTube' | 'Reddit';

export interface TrendSignal {
  id: string;
  name: string;
  source: TrendSource;
  peakInDays: number;
  confidence: number;
  expectedRevenue: number;
}

const TREND_NAMES = [
  'Liminal corridor edits', '8D ambient rain', 'Tarot card flat-lays', 'AI persona thirst-traps',
  'Whisper ASMR routines', 'Cottagecore Etsy planners', 'Shrimp boil TikToks', 'GPT founder threads',
  'Synth-pop nostalgia', 'Gym mirror selfies', 'Lo-fi 432Hz baths', 'Dreamcore wallpapers',
  'Astro birth-chart drops', 'Manifestation journals', '"Day in my life" SaaS', 'NPC stream parodies',
  'AI couture lookbooks', 'Wired-headphone aesthetic', 'Cozy game soundtracks', 'Chrome-orb 3D loops',
];

const SOURCES: TrendSource[] = ['TikTok', 'Instagram', 'Etsy', 'X / Twitter', 'YouTube', 'Reddit'];

export const TREND_SIGNALS: TrendSignal[] = (() => {
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

// Best-time heatmap: 7 days × 24 hours per (tenant, platform)
export const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'X / Twitter'] as const;
export type Platform = (typeof PLATFORMS)[number];
export const TENANTS: Tenant[] = ['synaptive', 'digital_influencer', 'digital_products', 'localbiz', 'freelance', 'apogee_dashboard'];
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getHeatmap(tenant: Tenant, platform: Platform): number[][] {
  const seed = tenant.length * 17 + platform.length * 31;
  const r = mulberry32(seed);
  const matrix: number[][] = [];
  for (let d = 0; d < 7; d++) {
    const row: number[] = [];
    for (let h = 0; h < 24; h++) {
      const morning = Math.exp(-((h - 8) ** 2) / 16) * 60;
      const evening = Math.exp(-((h - 20) ** 2) / 14) * 90;
      const weekend = d === 0 || d === 6 ? 12 : 0;
      const noise = r() * 25;
      row.push(Math.max(0, Math.min(100, Math.round(morning + evening + weekend + noise - 10))));
    }
    matrix.push(row);
  }
  return matrix;
}

// Churn / Lead-Quality (LocalBiz)
export interface Lead {
  id: string;
  business: string;
  city: string;
  industry: string;
  convertPct: number;
  churnPct: number;
  mrr: number;
}

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

export const LEADS: Lead[] = (() => {
  const r = mulberry32(7);
  return BUSINESSES.map(([business, city, industry], i) => {
    const convertPct = Math.round(8 + r() * 80);
    const churnPct = Math.round(3 + r() * 55);
    return {
      id: `l${i + 1}`,
      business,
      city,
      industry,
      convertPct,
      churnPct,
      mrr: Math.round(80 + r() * 720),
    };
  }).sort((a, b) => b.convertPct - a.convertPct);
})();
