// TODO: wire to Redis approvals stream + tastemaker:scores + brand_drift:embeddings
export type Tenant = 'synaptive' | 'digital_influencer' | 'digital_products' | 'localbiz' | 'freelance' | 'apogee_dashboard';

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

export interface PendingItem {
  id: string;
  tenant: Tenant;
  title: string;
  thumb: string;
  tasteScore: number;
  wiggumVerdict: 'pass' | 'caution' | 'flag';
  brief: string;
}

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

const TENANTS: Tenant[] = ['synaptive', 'digital_influencer', 'digital_products', 'localbiz', 'freelance', 'apogee_dashboard'];
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

export const PENDING_ITEMS: PendingItem[] = TITLES.map((title, i) => {
  const score = Math.round(45 + ((i * 37) % 55));
  const verdict: PendingItem['wiggumVerdict'] = score < 60 ? 'flag' : score < 75 ? 'caution' : 'pass';
  return {
    id: `p${i + 1}`,
    tenant: TENANTS[i % TENANTS.length],
    title,
    thumb: THUMBS[i % THUMBS.length],
    tasteScore: score,
    wiggumVerdict: verdict,
    brief: `Brief: produce ${title.toLowerCase()} for tenant ${TENANTS[i % TENANTS.length]} — target voice = brand corpus v3, audience = primary persona, length ≈ 220 chars.`,
  };
});

// Tastemaker score histogram — 24h scores by empire (10 buckets, 0-100)
export const SCORES_24H: { tenant: Tenant; score: number }[] = (() => {
  const arr: { tenant: Tenant; score: number }[] = [];
  TENANTS.forEach((t, ti) => {
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

export interface DriftItem {
  tenant: Tenant;
  similarity: number;
  threshold: number;
  recentDrifted: { title: string; sim: number }[];
}

export const DRIFT: DriftItem[] = [
  { tenant: 'synaptive', similarity: 0.91, threshold: 0.78, recentDrifted: [
    { title: 'Lyric draft #441', sim: 0.74 }, { title: 'Album blurb v2', sim: 0.79 }, { title: 'Tour caption', sim: 0.81 },
  ]},
  { tenant: 'digital_influencer', similarity: 0.83, threshold: 0.78, recentDrifted: [
    { title: 'IG caption batch #88', sim: 0.69 }, { title: 'Tweet thread on AI', sim: 0.71 }, { title: 'Hook A/B set', sim: 0.74 },
  ]},
  { tenant: 'digital_products', similarity: 0.88, threshold: 0.78, recentDrifted: [
    { title: 'Etsy listing #220', sim: 0.81 }, { title: 'Product description set', sim: 0.83 }, { title: 'Bundle title v3', sim: 0.85 },
  ]},
  { tenant: 'localbiz', similarity: 0.72, threshold: 0.78, recentDrifted: [
    { title: 'Plumber outreach v4', sim: 0.61 }, { title: 'GBP post — roofer', sim: 0.65 }, { title: 'Cold email — HVAC', sim: 0.68 },
  ]},
  { tenant: 'freelance', similarity: 0.86, threshold: 0.78, recentDrifted: [
    { title: 'Gig pitch — logo', sim: 0.79 }, { title: 'DM to recruiter', sim: 0.80 }, { title: 'Portfolio caption', sim: 0.82 },
  ]},
  { tenant: 'apogee_dashboard', similarity: 0.94, threshold: 0.78, recentDrifted: [
    { title: 'Changelog summary', sim: 0.88 }, { title: 'Launch tweet', sim: 0.90 }, { title: 'Dashboard tour script', sim: 0.91 },
  ]},
];
