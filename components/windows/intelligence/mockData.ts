// Shared types + label/colour constants for intelligence-tab windows.
// Live data is fetched from /api/intelligence/* (proxies to OpenClaw gateway).
export type Tenant = 'synaptive' | 'digital_influencer' | 'digital_products' | 'localbiz' | 'freelance' | 'apogee_dashboard';

export const TENANT_LABEL: Record<Tenant, string> = {
  synaptive: 'Synaptive Sounds',
  digital_influencer: 'Digital Influencer',
  digital_products: 'Digital Products',
  localbiz: 'LocalBiz',
  freelance: 'Freelance',
  apogee_dashboard: 'Apogee',
};

export type TrendSource = 'TikTok' | 'Instagram' | 'Etsy' | 'X / Twitter' | 'YouTube' | 'Reddit';

export interface TrendSignal {
  id: string;
  name: string;
  source: TrendSource;
  peakInDays: number;
  confidence: number;
  expectedRevenue: number;
}

export const PLATFORMS = ['TikTok', 'Instagram', 'YouTube', 'X / Twitter'] as const;
export type Platform = (typeof PLATFORMS)[number];
export const TENANTS: Tenant[] = ['synaptive', 'digital_influencer', 'digital_products', 'localbiz', 'freelance', 'apogee_dashboard'];
export const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export interface Lead {
  id: string;
  business: string;
  city: string;
  industry: string;
  convertPct: number;
  churnPct: number;
  mrr: number;
}
