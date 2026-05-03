// Shared types + label/colour constants for quality-tab windows.
// Live data is fetched from /api/quality/* (proxies to OpenClaw gateway / Redis).
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

export interface DriftItem {
  tenant: Tenant;
  similarity: number;
  threshold: number;
  recentDrifted: { title: string; sim: number }[];
}
