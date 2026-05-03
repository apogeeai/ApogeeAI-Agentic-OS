import { NextResponse } from 'next/server';
import { getTrends, postTrendRide } from '@/lib/openclaw';
import { requireAuth } from '@/lib/api-auth';

export async function GET(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;
  return NextResponse.json(await getTrends());
}

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;

  const body: unknown = await req.json().catch(() => ({}));
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const id = typeof b.id === 'string' ? b.id : '';

  if (!id) return NextResponse.json({ ok: false, error: 'no_id' }, { status: 400 });
  return NextResponse.json(await postTrendRide(id));
}
