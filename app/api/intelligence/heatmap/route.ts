import { NextResponse } from 'next/server';
import { getEngagementHeatmap } from '@/lib/openclaw';
import { requireAuth, requireTenant } from '@/lib/api-auth';

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;

  const url = new URL(req.url);
  const rawTenant = url.searchParams.get('tenant');
  const platform = url.searchParams.get('platform') || 'Instagram';

  const t = requireTenant(auth.ctx, rawTenant);
  if (!t.ok) return t.res;

  return NextResponse.json(await getEngagementHeatmap(t.tenant, platform));
}
