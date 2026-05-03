// Shared types + label/colour constants for production-tab windows.
// Live data is fetched from /api/production/* (proxies to OpenClaw gateway / Redis streams).
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

export interface DigitalGood {
  id: string;
  tenant: Tenant;
  title: string;
  marketplace: 'Etsy' | 'Gumroad' | 'Notion' | 'TPT';
  price: number;
  thumb: string;
  tasteScore: number;
}

export interface PipelineStage {
  id: string;
  label: string;
  inflight: number;
  bottleneck: boolean;
}

export interface DeadLetterItem {
  id: string;
  stream: string;
  reason: string;
  tenant: Tenant;
  payload: string;
  failedAt: string;
}
