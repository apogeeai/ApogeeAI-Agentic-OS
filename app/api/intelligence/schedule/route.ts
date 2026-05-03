import { NextResponse } from 'next/server';
import { postSchedule } from '@/lib/openclaw';
import { requireAuth, requireTenant } from '@/lib/api-auth';

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;

  const body: unknown = await req.json().catch(() => ({}));
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const rawTenant = typeof b.tenant === 'string' ? b.tenant : null;
  const platform = typeof b.platform === 'string' ? b.platform : '';
  const day = Number(b.day);
  const hour = Number(b.hour);

  if (!platform || Number.isNaN(day) || Number.isNaN(hour)) {
    return NextResponse.json({ ok: false, error: 'bad_payload' }, { status: 400 });
  }
  const t = requireTenant(auth.ctx, rawTenant);
  if (!t.ok) return t.res;

  return NextResponse.json(await postSchedule({ tenant: t.tenant, platform, day, hour }));
}
