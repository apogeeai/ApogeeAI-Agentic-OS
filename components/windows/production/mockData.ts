// TODO: wire to Redis streams (os:stream:*, pipeline:dead_letter, tenant:*:artifacts)
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

export interface Artifact {
  id: string;
  tenant: Tenant;
  title: string;
  type: 'image' | 'audio' | 'video' | 'text';
  thumb: string;
  score: number;
  builtAt: string;
}

export const OVERNIGHT_ARTIFACTS: Artifact[] = [
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

export interface DigitalGood {
  id: string;
  tenant: Tenant;
  title: string;
  marketplace: 'Etsy' | 'Gumroad' | 'Notion' | 'TPT';
  price: number;
  thumb: string;
  tasteScore: number;
}

export const DIGITAL_GOODS: DigitalGood[] = [
  { id: 'g1', tenant: 'digital_products', title: 'Cosmic Calendar 2026', marketplace: 'Etsy', price: 12, thumb: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.88 },
  { id: 'g2', tenant: 'digital_products', title: 'Stoic Habit Tracker', marketplace: 'Gumroad', price: 9, thumb: 'https://images.pexels.com/photos/733856/pexels-photo-733856.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.82 },
  { id: 'g3', tenant: 'digital_products', title: 'Notion Founder OS', marketplace: 'Notion', price: 29, thumb: 'https://images.pexels.com/photos/4348078/pexels-photo-4348078.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.91 },
  { id: 'g4', tenant: 'digital_products', title: 'Watercolor Wedding Suite', marketplace: 'Etsy', price: 18, thumb: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.76 },
  { id: 'g5', tenant: 'digital_products', title: 'Minimalist Workout Log', marketplace: 'Gumroad', price: 7, thumb: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.71 },
  { id: 'g6', tenant: 'digital_products', title: 'Astrology Birth Chart Kit', marketplace: 'Etsy', price: 15, thumb: 'https://images.pexels.com/photos/1252890/pexels-photo-1252890.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.85 },
  { id: 'g7', tenant: 'digital_products', title: 'Teacher Lesson Plan Pack', marketplace: 'TPT', price: 11, thumb: 'https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.79 },
  { id: 'g8', tenant: 'digital_products', title: 'Dreamcore Phone Wallpapers', marketplace: 'Gumroad', price: 5, thumb: 'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=600', tasteScore: 0.83 },
];

export interface PipelineStage {
  id: string;
  label: string;
  inflight: number;
  bottleneck: boolean;
}

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'briefs', label: 'Briefs', inflight: 42, bottleneck: false },
  { id: 'assembled', label: 'Assembled', inflight: 38, bottleneck: false },
  { id: 'visuals', label: 'Visuals', inflight: 124, bottleneck: true },
  { id: 'audio', label: 'Audio', inflight: 18, bottleneck: false },
  { id: 'scoring', label: 'Tastemaker', inflight: 67, bottleneck: true },
  { id: 'approvals', label: 'Approvals', inflight: 12, bottleneck: false },
  { id: 'delivered', label: 'Delivered', inflight: 89, bottleneck: false },
];

export interface DeadLetterItem {
  id: string;
  stream: string;
  reason: string;
  tenant: Tenant;
  payload: string;
  failedAt: string;
}

export const DEAD_LETTER: DeadLetterItem[] = [
  { id: 'd1', stream: 'pipeline:dead_letter', reason: 'comfyui timeout', tenant: 'digital_influencer', payload: 'V6 portrait gen — workflow_id 3a91', failedAt: '02:17' },
  { id: 'd2', stream: 'pipeline:dead_letter', reason: 'comfyui timeout', tenant: 'digital_influencer', payload: 'V6 portrait gen — workflow_id 3a92', failedAt: '02:23' },
  { id: 'd3', stream: 'os:stream:dead', reason: 'venice 429 rate-limit', tenant: 'synaptive', payload: 'lyric draft — model llama-3.3-70b', failedAt: '03:01' },
  { id: 'd4', stream: 'pipeline:dead_letter', reason: 'tastemaker schema mismatch', tenant: 'digital_products', payload: 'etsy-listing v2 — missing alt_text', failedAt: '04:44' },
  { id: 'd5', stream: 'os:stream:dead', reason: 'gateway 502', tenant: 'localbiz', payload: 'gbp post draft — biz_id 778', failedAt: '05:19' },
  { id: 'd6', stream: 'pipeline:dead_letter', reason: 'comfyui timeout', tenant: 'digital_influencer', payload: 'V6 portrait gen — workflow_id 4001', failedAt: '06:02' },
  { id: 'd7', stream: 'os:stream:dead', reason: 'wiggum reject — brand drift', tenant: 'apogee_dashboard', payload: 'tweet draft — tone score 0.31', failedAt: '06:55' },
];
