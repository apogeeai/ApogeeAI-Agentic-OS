import { NextResponse } from 'next/server';
import { postLoraTrain } from '@/lib/openclaw';
import { requireAuth } from '@/lib/api-auth';

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;

  const body: unknown = await req.json().catch(() => ({}));
  const b = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>;
  const refs = Number(b.refs) || 0;
  const base = typeof b.base === 'string' ? b.base : 'flux-dev';
  const steps = Number(b.steps) || 1500;
  const name = typeof b.name === 'string' ? b.name : 'lora_v1';

  if (!refs) return NextResponse.json({ ok: false, error: 'no_refs' }, { status: 400 });
  const result = await postLoraTrain({ refs, base, steps, name });
  return NextResponse.json({ ok: true, ...result });
}
