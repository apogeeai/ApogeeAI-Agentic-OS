import { NextResponse } from 'next/server';
import { xaddBrief } from '@/lib/openclaw';
import { requireAuth, requireTenant } from '@/lib/api-auth';

export async function POST(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;

  let text = '';
  let rawTenant: string | undefined;
  try {
    const body: unknown = await req.json();
    if (body && typeof body === 'object') {
      const b = body as Record<string, unknown>;
      if (typeof b.text === 'string') text = b.text;
      if (typeof b.tenant === 'string') rawTenant = b.tenant;
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }
  if (!text.trim()) {
    return NextResponse.json({ ok: false, error: 'empty_brief' }, { status: 400 });
  }

  const t = requireTenant(auth.ctx, rawTenant ?? null, { allowMissing: true });
  if (!t.ok) return t.res;

  const result = await xaddBrief(text, t.tenant);
  return NextResponse.json({ ok: true, ...result, preview: text.slice(0, 120) });
}
