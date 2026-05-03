import { NextResponse } from 'next/server';
import { postLoraSave } from '@/lib/openclaw';
import { requireAuth } from '@/lib/api-auth';

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;

  const body: unknown = await req.json().catch(() => ({}));
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const name = (typeof b.name === 'string' ? b.name : '').trim();
  const base = typeof b.base === 'string' ? b.base : 'flux-dev';
  const dataset_hash = typeof b.dataset_hash === 'string' ? b.dataset_hash : undefined;

  if (!name) return NextResponse.json({ ok: false, error: 'no_name' }, { status: 400 });
  return NextResponse.json(await postLoraSave({ name, base, dataset_hash }));
}
