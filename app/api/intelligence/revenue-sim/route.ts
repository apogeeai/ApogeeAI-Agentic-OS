import { NextResponse } from 'next/server';
import { getRevenueSim, type TenantId } from '@/lib/openclaw';
import { requireAuth, requireTenant } from '@/lib/api-auth';

function clampNum(n: unknown, lo: number, hi: number, fallback: number): number {
  const v = Number(n);
  if (!Number.isFinite(v)) return fallback;
  return Math.min(hi, Math.max(lo, v));
}

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;

  const body: unknown = await req.json().catch(() => ({}));
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;

  const agents = clampNum(b.agents, 1, 60, 12);
  const budget = clampNum(b.budget, 100, 100_000, 5000);
  const threshold = clampNum(b.threshold, 0, 100, 70);

  // Tenant is optional; when supplied, it must be on the allowlist.
  let tenant: TenantId | undefined;
  if (typeof b.tenant === 'string' && b.tenant.length > 0) {
    const t = requireTenant(auth.ctx, b.tenant);
    if (!t.ok) return t.res;
    tenant = t.tenant;
  }

  const result = await getRevenueSim({ agents, budget, threshold, tenant });
  return NextResponse.json(result);
}
