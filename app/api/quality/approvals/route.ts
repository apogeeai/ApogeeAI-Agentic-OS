import { NextResponse } from 'next/server';
import { getApprovals, postApprovalDecision } from '@/lib/openclaw';
import { requireAuth, requireTenant } from '@/lib/api-auth';

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;
  return NextResponse.json(await getApprovals());
}

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;

  const body: unknown = await req.json().catch(() => ({}));
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const id = typeof b.id === 'string' ? b.id : '';
  const decision = b.decision === 'kill' ? 'kill' : 'approve';
  const rawTenant = typeof b.tenant === 'string' ? b.tenant : null;

  if (!id) return NextResponse.json({ ok: false, error: 'no_id' }, { status: 400 });

  const t = requireTenant(auth.ctx, rawTenant);
  if (!t.ok) return t.res;

  return NextResponse.json(await postApprovalDecision(id, decision, t.tenant));
}
